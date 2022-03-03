import { NextFunction } from 'express'
import { isHttpError } from 'http-errors'

export default function errorHandler (e: any, next: NextFunction) {
  if (isHttpError(e)) {
    next({
      status: e.httpStatus,
      message: e.message,
      stack: e.stack
    })
  }
  next(e)
}
