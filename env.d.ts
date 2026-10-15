/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly DEV: boolean
  readonly PROD: boolean
  /** URL base del backend. Vacía mientras el prototipo sirve datos mock. */
  readonly VITE_API_BASE_URL?: string
  /** `true` registra cada petición en la consola (con datos sensibles enmascarados). */
  readonly VITE_API_LOG?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
