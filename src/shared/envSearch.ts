
export function appPort (): number {
  return parseInt(String(process.env.APP_PORT))
}
