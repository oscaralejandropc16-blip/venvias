/**
 * Setup global de Vitest, cargado por `vitest.config.ts` antes de cada
 * archivo de pruebas. Fija la zona horaria para que las pruebas no dependan
 * de la máquina.
 */
process.env.TZ = 'America/Caracas'
