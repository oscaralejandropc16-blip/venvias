# VenVías web — instrucciones para Claude

Sitio público de pago por placa. La arquitectura sigue a `toll-management-ui`
(`~/WebstormProjects/toll-management-ui/ARCHITECTURE_RULES.md`); el diseño sigue a la marca
(`../PRODUCT.md`, `../DESIGN.md`, `../sistema-diseno/`). Si chocan, el diseño de marca manda en lo visual
y la arquitectura en el código.

## Stack

Vue 3 + TypeScript + Vite + Pinia + Vue Router + Axios + Tailwind 3 (sin preflight) + Vitest.

## Estructura

```
src/
├── app/        router, layouts (PublicLayout, AppHeader, AppFooter, AppToasts), navigation, stores
├── core/       api/httpClient, constants (routing, system), types, utils
├── shared/     ui/ (presentación pura), icons/ (AppIcon + iconPaths)
├── modules/    home, plates, recharge, debt, tolls, account, not-found
│   └── <feature>/ components, composables, constants, mappers, routes, services, types, utils, views
└── styles/     tokens.css (fuente: sistema-diseno/tokens.json), base.css, main.css
```

## Reglas que no se negocian

- Options API con `defineComponent`, `name` en PascalCase y `<script lang="ts">`; nunca `<script setup>`.
  Los composables se exponen con `setup() { return { ...useX() } }`.
- Flujo `View → Composable → Service → API`. Ninguna vista ni componente llama a `httpClient` o `axios`.
- Los services son la única capa que conoce paths y DTOs. Sin `VITE_API_BASE_URL` sirven el mock JSON
  adyacente (`<feature>.mock.json`); al conectar el backend solo cambia el service.
- DTO, modelo de vista y mapper separados. La UI nunca recibe un DTO.
- Textos, listas y opciones van en `constants/`; nunca inline en componentes.
- `shared/ui` solo presenta: sin stores, sin services, sin reglas de negocio.
- Los componentes emiten eventos; la vista decide la navegación. Nombres de ruta desde `ROUTE_NAMES`.
- Pinia solo para estado transversal (`toast`, `hero`). El estado de formulario vive en su composable.
- Todas las rutas son públicas (`meta.public: true`) y declaran `meta.title`. El pago por placa nunca
  exige cuenta.

## Diseño

- Colores, tipografía, radios y sombras solo desde los tokens (`var(--…)` o las utilidades de Tailwind
  que los envuelven en `tailwind.config.js`). Tailwind no define valores propios.
- Los componentes de marca ya afinados (placa, carrusel, nav, pie) conservan su CSS scoped.
- Nada de datos inventados: montos, peajes y tarifas quedan «por definir» hasta tener fuente real.

## Verificación

- `npm run build` (incluye `vue-tsc`), `npm test`, `npx eslint <archivos>` (no `npm run lint`: aplica `--fix`).
- Pruebas en `tests/` con `tests/setup.ts`. Lógica nueva de composables, services y mappers lleva prueba.
