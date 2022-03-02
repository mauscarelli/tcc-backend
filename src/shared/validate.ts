import { BadRequest } from '@curveball/http-errors/dist'

export function checkRequired (value: any, field: string): Promise<void> {
  if (value) {
    return Promise.resolve()
  }
  return Promise.reject(new BadRequest(`Campo ${field} não informado`))
}
