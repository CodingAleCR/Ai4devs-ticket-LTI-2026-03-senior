import { NextFunction, Request, Response } from 'express'

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err)
  const message =
    err instanceof Error ? err.message : 'Error interno del servidor'
  if (!res.headersSent) {
    res.status(500).json({ error: message })
  }
}
