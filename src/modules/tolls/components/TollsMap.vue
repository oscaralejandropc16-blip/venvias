<script lang="ts">
import { defineComponent, markRaw, type PropType } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { TOLLS_MAP, TOLLS_TEXT, tollsClusterLabel } from '../constants/tolls'
import { TOLL_CLUSTER_SIZE, TOLL_PIN_SIZE, iconSvg, tollClusterHtml, tollPinSvg } from '../utils/tollPin'
import { clusterByDistance } from '../utils/clusterTolls'
import type { Toll } from '../types/Toll'

interface MapHandles {
  map: L.Map | null
  layer: L.LayerGroup | null
  /** Pines individuales visibles a este zoom; los agrupados no tienen pin propio. */
  markers: Map<string, L.Marker>
  /** Peaje que el propio mapa acaba de emitir: no se vuela hacia él, solo se abre su ficha. */
  emittedId: string | null
  /** Mientras se redibujan los pines, cerrar su ficha no es una deselección. */
  rerendering: boolean
}

const reducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Mapa OpenStreetMap con un pin VenVías por peaje. Los pines que se taparían
 * entre sí se agrupan en un disco numerado. Solo presenta: recibe los peajes y
 * el seleccionado, y emite `select` con el id (o null al cerrar la ficha).
 */
export default defineComponent({
  name: 'TollsMap',
  props: {
    tolls: { type: Array as PropType<Toll[]>, required: true },
    selectedId: { type: String as PropType<string | null>, default: null },
  },
  emits: {
    select: (id: string | null) => id === null || typeof id === 'string',
  },
  setup() {
    const handles: MapHandles = markRaw({ map: null, layer: null, markers: new Map(), emittedId: null, rerendering: false })
    return { handles }
  },
  data() {
    return { text: TOLLS_TEXT, twoFingerHint: false }
  },
  watch: {
    tolls() {
      this.fitAll()
      this.renderMarkers()
    },
    selectedId(id: string | null, previous: string | null) {
      if (previous) this.styleMarker(previous, false)
      if (id) this.focusToll(id)
      else this.handles.map?.closePopup()
    },
  },
  mounted() {
    // En móvil un dedo desplaza la página, no el mapa; dos dedos lo mueven y acercan.
    const touchOnly = L.Browser.mobile
    const map = L.map(this.$refs.canvas as HTMLElement, {
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: !touchOnly,
      zoomAnimation: !reducedMotion(),
      attributionControl: false,
    })
    L.control
      .zoom({
        position: 'topright',
        zoomInText: iconSvg('plus'),
        zoomOutText: iconSvg('minus'),
        zoomInTitle: TOLLS_TEXT.zoomIn,
        zoomOutTitle: TOLLS_TEXT.zoomOut,
      })
      .addTo(map)
    L.tileLayer(TOLLS_MAP.tileUrl, {
      attribution: TOLLS_MAP.attribution,
      maxZoom: TOLLS_MAP.maxZoom,
      subdomains: TOLLS_MAP.subdomains,
    }).addTo(map)
    // La rueda solo hace zoom después de que la persona elige el mapa: así no secuestra el scroll de la página.
    map.on('click focus', () => map.scrollWheelZoom.enable())
    map.on('mouseout blur', () => map.scrollWheelZoom.disable())
    map.on('zoomend', () => this.renderMarkers())
    map.on('popupclose', (e: L.PopupEvent) => {
      if (this.handles.rerendering) return
      const id = (e.popup.options as { tollId?: string }).tollId
      if (id && id === this.selectedId) this.$emit('select', null)
    })
    this.handles.map = map
    this.handles.layer = L.layerGroup().addTo(map)
    this.twoFingerHint = touchOnly
    map.setView([8.6, -66.6], 6)
    this.fitAll()
    this.renderMarkers()
  },
  beforeUnmount() {
    this.handles.map?.remove()
    this.handles.map = null
    this.handles.layer = null
    this.handles.markers.clear()
  },
  methods: {
    renderMarkers(): void {
      const { map, layer, markers } = this.handles
      if (!map || !layer) return
      const reopen = this.selectedId && markers.get(this.selectedId)?.isPopupOpen() ? this.selectedId : null
      this.handles.rerendering = true
      layer.clearLayers()
      markers.clear()
      const byId = new Map(this.tolls.map((t) => [t.id, t]))
      const points = this.tolls.map((t) => {
        const p = map.latLngToLayerPoint([t.lat, t.lng])
        return { id: t.id, x: p.x, y: p.y }
      })
      for (const group of clusterByDistance(points, TOLLS_MAP.clusterRadius)) {
        const members = group.map((id) => byId.get(id)).filter((t): t is Toll => Boolean(t))
        if (members.length === 1) this.addTollMarker(members[0], layer)
        else this.addClusterMarker(members, layer)
      }
      if (this.selectedId) this.styleMarker(this.selectedId, true)
      this.handles.rerendering = false
      if (reopen) markers.get(reopen)?.openPopup()
    },
    addTollMarker(toll: Toll, layer: L.LayerGroup): void {
      const marker = L.marker([toll.lat, toll.lng], {
        icon: L.divIcon({
          className: 'toll-pin',
          html: tollPinSvg(),
          iconSize: [TOLL_PIN_SIZE.width, TOLL_PIN_SIZE.height],
          iconAnchor: [TOLL_PIN_SIZE.width / 2, TOLL_PIN_SIZE.height - 2],
          popupAnchor: [0, -TOLL_PIN_SIZE.height + 6],
        }),
        keyboard: true,
        riseOnHover: true,
      })
      marker.bindPopup(this.popupContent(toll), {
        tollId: toll.id,
        closeButton: false,
        maxWidth: 260,
        // A la derecha se deja libre la columna de zoom para que la ficha nunca la toque.
        autoPanPaddingTopLeft: [24, 24],
        autoPanPaddingBottomRight: [72, 24],
      } as L.PopupOptions)
      marker.on('click', () => {
        this.handles.emittedId = toll.id
        this.$emit('select', toll.id)
      })
      marker.addTo(layer)
      const el = marker.getElement()
      el?.setAttribute('role', 'button')
      el?.setAttribute('aria-label', `${toll.name}, ${toll.state}`)
      el?.setAttribute('aria-pressed', 'false')
      this.handles.markers.set(toll.id, marker)
    },
    addClusterMarker(members: Toll[], layer: L.LayerGroup): void {
      const lat = members.reduce((sum, t) => sum + t.lat, 0) / members.length
      const lng = members.reduce((sum, t) => sum + t.lng, 0) / members.length
      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'toll-cluster',
          html: tollClusterHtml(members.length),
          iconSize: [TOLL_CLUSTER_SIZE.width, TOLL_CLUSTER_SIZE.height],
          iconAnchor: [20, TOLL_CLUSTER_SIZE.height - 2],
        }),
        keyboard: true,
        riseOnHover: true,
      })
      marker.on('click', () => {
        const map = this.handles.map
        if (!map) return
        const bounds = L.latLngBounds(members.map((t) => [t.lat, t.lng] as L.LatLngTuple))
        const options = { padding: [64, 64] as L.PointTuple, maxZoom: TOLLS_MAP.focusZoom }
        if (reducedMotion()) map.fitBounds(bounds, { ...options, animate: false })
        else map.flyToBounds(bounds, { ...options, duration: 0.8 })
      })
      marker.addTo(layer)
      const el = marker.getElement()
      el?.setAttribute('role', 'button')
      el?.setAttribute('aria-label', tollsClusterLabel(members.map((t) => t.name)))
    },
    popupContent(toll: Toll): HTMLElement {
      const box = document.createElement('div')
      box.className = 'toll-popup'
      const name = document.createElement('p')
      name.className = 'toll-popup__name'
      name.textContent = toll.name
      const road = document.createElement('p')
      road.className = 'toll-popup__road'
      road.textContent = toll.road || TOLLS_TEXT.roadPending
      const close = document.createElement('button')
      close.type = 'button'
      close.className = 'toll-popup__close'
      close.setAttribute('aria-label', TOLLS_TEXT.closePopup)
      close.innerHTML = iconSvg('close', 18)
      close.addEventListener('click', () => this.handles.map?.closePopup())
      box.append(name, road, close)
      return box
    },
    fitAll(animate = false): void {
      const { map } = this.handles
      if (!map || this.tolls.length === 0) return
      const bounds = L.latLngBounds(this.tolls.map((t) => [t.lat, t.lng] as L.LatLngTuple))
      const paddingOptions = {
        paddingTopLeft: [TOLLS_MAP.fitPadding, TOLLS_MAP.fitPadding + TOLL_PIN_SIZE.height] as [number, number],
        paddingBottomRight: [TOLLS_MAP.fitPadding, TOLLS_MAP.fitPadding] as [number, number],
      }
      if (animate && !reducedMotion()) {
        map.flyToBounds(bounds, { ...paddingOptions, duration: 0.85 })
      } else {
        map.fitBounds(bounds, { ...paddingOptions, animate: false })
      }
    },
    styleMarker(id: string, selected: boolean): void {
      const marker = this.handles.markers.get(id)
      const el = marker?.getElement()
      if (!marker || !el) return
      el.classList.toggle('toll-pin--selected', selected)
      el.setAttribute('aria-pressed', String(selected))
      marker.setZIndexOffset(selected ? 1000 : 0)
    },
    focusToll(id: string): void {
      const map = this.handles.map
      const toll = this.tolls.find((t) => t.id === id)
      if (!map || !toll) return
      const open = (): void => {
        this.styleMarker(id, true)
        this.handles.markers.get(id)?.openPopup()
      }
      if (this.handles.emittedId === id) {
        this.handles.emittedId = null
        open()
        return
      }
      // Al acercar, los grupos se deshacen (zoomend redibuja) y el pin ya existe al terminar el vuelo.
      const zoom = Math.max(map.getZoom(), TOLLS_MAP.focusZoom)
      map.once('moveend', open)
      if (reducedMotion()) map.setView([toll.lat, toll.lng], zoom, { animate: false })
      else map.flyTo([toll.lat, toll.lng], zoom, { duration: 0.8 })
    },
  },
})
</script>

<template>
  <div class="tolls-map">
    <div ref="canvas" class="tolls-map__canvas" role="region" :aria-label="text.mapLabel" />
    <p v-if="twoFingerHint" class="tolls-map__hint">{{ text.mapHintTouch }}</p>
  </div>
</template>

<style scoped>
.tolls-map { position: relative; height: 100%; display: flex; flex-direction: column; }
.tolls-map__canvas {
  flex: 1; min-height: 280px;
  /* Contexto de apilamiento propio: los paneles de Leaflet (z-index 400–1000) no tapan la nav fija. */
  position: relative; z-index: 0; isolation: isolate;
  border-radius: var(--radius-md); overflow: hidden;
  border: 1px solid var(--borde);
  background: var(--fondo-frio);
  font-family: var(--font-body);
}
.tolls-map__hint { margin-top: var(--space-2); font-size: 14px; line-height: 20px; color: var(--texto-suave); }

/* Leaflet dibuja fuera de la plantilla: sus piezas se alcanzan con :deep. */
/* Leaflet suma teselas con plus-lighter: a 3x, dos bordes sobre la misma fila de píxeles dan una
   línea sobreexpuesta. En modo normal no aparece. */
.tolls-map__canvas :deep(.leaflet-tile) {
  mix-blend-mode: normal;
  filter: contrast(1.03) saturate(0.9);
}

.tolls-map__canvas :deep(.toll-pin) { background: none; border: 0; cursor: pointer; }
.tolls-map__canvas :deep(.toll-pin__svg) {
  overflow: visible;
  transform-origin: 50% 96%;
  transition: transform 0.3s var(--ease-out);
  filter: drop-shadow(0 6px 8px rgba(18, 33, 66, 0.28));
}
.tolls-map__canvas :deep(.toll-pin:hover .toll-pin__svg) { transform: scale(1.08); }
/* Seleccionado: crece y gana el halo azul-100 del sistema (con filo azul-700 para leerse sobre el mapa). */
.tolls-map__canvas :deep(.toll-pin--selected .toll-pin__svg) { transform: scale(1.18); }
.tolls-map__canvas :deep(.toll-pin--selected .toll-pin__halo-edge) { stroke: var(--azul-700); stroke-width: 11; stroke-linejoin: round; }
.tolls-map__canvas :deep(.toll-pin--selected .toll-pin__halo) { stroke: var(--azul-100); stroke-width: 8; stroke-linejoin: round; }
/* Foco de teclado: el anillo del sistema, distinto del halo de selección */
.tolls-map__canvas :deep(.toll-pin:focus-visible), .tolls-map__canvas :deep(.toll-cluster:focus-visible) {
  outline: 3px solid var(--accion); outline-offset: 3px; border-radius: var(--radius-sm);
}

/* Grupo de peajes cercanos: gotas apiladas con el conteo (no el pin de paso del recorrido) */
.tolls-map__canvas :deep(.toll-cluster) { background: none; border: 0; cursor: pointer; }
.tolls-map__canvas :deep(.toll-cluster__svg) {
  overflow: visible; transform-origin: 42% 96%;
  transition: transform 0.3s var(--ease-out);
  filter: drop-shadow(0 6px 8px rgba(18, 33, 66, 0.28));
}
.tolls-map__canvas :deep(.toll-cluster:hover .toll-cluster__svg) { transform: scale(1.08); }

/* Ficha del peaje */
.tolls-map__canvas :deep(.leaflet-popup-content-wrapper) {
  border-radius: var(--radius-sm); border: 1px solid var(--borde);
  box-shadow: var(--elev-2); padding: 0;
}
.tolls-map__canvas :deep(.leaflet-popup-tip) { box-shadow: none; border: 1px solid var(--borde); }
.tolls-map__canvas :deep(.leaflet-popup-content) { margin: 14px 44px 14px 16px; min-width: 200px; }
.tolls-map__canvas :deep(.toll-popup__name) { font: 500 18px/26px var(--font-display); color: var(--marino-900); margin: 0; }
.tolls-map__canvas :deep(.toll-popup__road) { font: 400 14px/20px var(--font-body); color: var(--texto-suave); margin: 2px 0 0; }
.tolls-map__canvas :deep(.toll-popup__close) {
  position: absolute; top: 8px; right: 8px; width: 32px; height: 32px; padding: 0;
  display: grid; place-items: center; border: 0; border-radius: var(--radius-pill);
  background: transparent; color: var(--texto-suave); cursor: pointer;
  transition: background-color 0.2s var(--ease-out), color 0.2s var(--ease-out);
}
.tolls-map__canvas :deep(.toll-popup__close:hover) { background: var(--fondo-frio); color: var(--marino-900); }
.tolls-map__canvas :deep(.toll-popup__close:focus-visible) { outline: 3px solid var(--accion); outline-offset: 0; }

/* Zoom: dos píldoras redondas, no la barra cuadrada de Leaflet */
.tolls-map__canvas :deep(.leaflet-bar) { border: 0; box-shadow: none; display: grid; gap: var(--space-2); }
.tolls-map__canvas :deep(.leaflet-bar a) {
  width: 40px; height: 40px; border-radius: var(--radius-pill) !important;
  display: grid; place-items: center;
  background: var(--superficie); border: 1px solid var(--borde); color: var(--marino-900);
  transition: border-color 0.2s var(--ease-out), color 0.2s var(--ease-out);
}
.tolls-map__canvas :deep(.leaflet-bar a:hover) { border-color: var(--azul-700); color: var(--azul-700); background: var(--superficie); }
.tolls-map__canvas :deep(.leaflet-bar a.leaflet-disabled) { opacity: 0.5; }
.tolls-map__canvas :deep(.leaflet-control-zoom) { margin: 12px 12px 0 0; }

.tolls-map__canvas :deep(.leaflet-control-attribution) {
  background: rgba(255, 255, 255, 0.85); color: var(--texto-suave);
  font: 400 11px/16px var(--font-body); padding: 2px 8px; border-top-left-radius: var(--radius-sm);
}
.tolls-map__canvas :deep(.leaflet-control-attribution a) { color: var(--azul-700); }
.tolls-map__canvas :deep(a:focus-visible) { outline: 3px solid var(--accion); outline-offset: 2px; }
</style>
