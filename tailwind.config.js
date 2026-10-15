/** @type {import('tailwindcss').Config} */
// Paleta, tipografía y radios salen de src/styles/tokens.css (fuente: sistema-diseno/tokens.json).
// Tailwind solo los expone como utilidades: nunca define valores propios.
// Sin preflight: el reset de la marca vive en src/styles/base.css.
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        azul: {
          100: 'var(--azul-100)',
          300: 'var(--azul-300)',
          500: 'var(--azul-500)',
          700: 'var(--azul-700)',
        },
        marino: {
          900: 'var(--marino-900)',
        },
        'rojo-sistema': 'var(--rojo-sistema)',
        'amarillo-carretera': 'var(--amarillo-carretera)',
        fondo: 'var(--fondo)',
        'fondo-frio': 'var(--fondo-frio)',
        superficie: 'var(--superficie)',
        texto: 'var(--texto)',
        'texto-suave': 'var(--texto-suave)',
        borde: 'var(--borde)',
        accion: 'var(--accion)',
        alerta: 'var(--alerta)',
        exito: 'var(--exito)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      borderRadius: {
        pill: 'var(--radius-pill)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        placa: 'var(--radius-placa)',
      },
      boxShadow: {
        'elev-1': 'var(--elev-1)',
        'elev-2': 'var(--elev-2)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
      },
      maxWidth: {
        page: 'var(--page-max)',
      },
    },
  },
  plugins: [],
}
