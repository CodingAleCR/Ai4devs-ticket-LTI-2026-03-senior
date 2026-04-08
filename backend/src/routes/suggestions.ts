import { Router, Request, Response, NextFunction } from 'express'
import prisma from '../db'

export const suggestionsRouter = Router()

suggestionsRouter.get(
  '/education',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
      const where =
        q.length > 0
          ? { institution: { contains: q, mode: 'insensitive' as const } }
          : {}

      const rows = await prisma.educationEntry.findMany({
        where,
        select: { institution: true },
        distinct: ['institution'],
        orderBy: { institution: 'asc' },
        take: 20,
      })

      res.json({ suggestions: rows.map((r) => r.institution) })
    } catch (e) {
      next(e)
    }
  },
)

suggestionsRouter.get(
  '/experience',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
      const where =
        q.length > 0
          ? { company: { contains: q, mode: 'insensitive' as const } }
          : {}

      const rows = await prisma.workExperienceEntry.findMany({
        where,
        select: { company: true },
        distinct: ['company'],
        orderBy: { company: 'asc' },
        take: 20,
      })

      res.json({ suggestions: rows.map((r) => r.company) })
    } catch (e) {
      next(e)
    }
  },
)
