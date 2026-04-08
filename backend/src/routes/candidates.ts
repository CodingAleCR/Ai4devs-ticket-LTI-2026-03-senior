import { Router, Request, Response, NextFunction } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { Prisma } from '@prisma/client'
import prisma from '../db'
import { createCandidateBodySchema } from '../validation/candidateSchema'

const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads', 'cvs')

const allowedMime = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
    cb(null, UPLOAD_DIR)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ''
    cb(null, `${crypto.randomUUID()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (allowedMime.has(file.mimetype)) {
      cb(null, true)
      return
    }
    cb(new Error('Solo se permiten archivos PDF o DOCX'))
  },
})

const handleUpload = (req: Request, res: Response, next: NextFunction) => {
  upload.single('cv')(req, res, (err: unknown) => {
    if (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al subir el archivo'
      res.status(400).json({ error: msg })
      return
    }
    next()
  })
}

export const candidatesRouter = Router()

candidatesRouter.post(
  '/',
  handleUpload,
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file
    try {
      let educationParsed: unknown
      let experienceParsed: unknown
      try {
        educationParsed = JSON.parse(req.body.educationJson ?? 'null')
        experienceParsed = JSON.parse(req.body.experienceJson ?? 'null')
      } catch {
        if (file) {
          fs.unlink(file.path, () => undefined)
        }
        res.status(400).json({
          error: 'Formato inválido en educación o experiencia laboral',
        })
        return
      }

      const parsedBody = createCandidateBodySchema.safeParse({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        educationEntries: educationParsed,
        workExperienceEntries: experienceParsed,
      })

      if (!parsedBody.success) {
        if (file) {
          fs.unlink(file.path, () => undefined)
        }
        const flat = parsedBody.error.flatten()
        const msg =
          [
            ...Object.values(flat.fieldErrors).flat(),
            ...flat.formErrors,
          ].find(Boolean) || 'Datos no válidos'
        res.status(400).json({ error: msg })
        return
      }

      const data = parsedBody.data

      try {
        const candidate = await prisma.$transaction(async (tx) => {
          const created = await tx.candidate.create({
            data: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
              address: data.address,
              cvOriginalName: file?.originalname ?? null,
              cvStoredFileName: file?.filename ?? null,
              cvMimeType: file?.mimetype ?? null,
              cvSizeBytes: file?.size ?? null,
              educationEntries: {
                create: data.educationEntries.map((e) => ({
                  institution: e.institution,
                  degree: e.degree,
                  yearEnd: e.yearEnd || null,
                })),
              },
              workExperienceEntries: {
                create: data.workExperienceEntries.map((w) => ({
                  company: w.company,
                  role: w.role,
                  description: w.description || null,
                })),
              },
            },
          })
          return created
        })

        res.status(201).json({
          id: candidate.id,
          message: 'Candidato añadido correctamente al sistema',
        })
      } catch (e) {
        if (file) {
          fs.unlink(file.path, () => undefined)
        }
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2002'
        ) {
          res.status(409).json({
            error: 'Ya existe un candidato con este correo electrónico',
          })
          return
        }
        next(e)
      }
    } catch (e) {
      next(e)
    }
  },
)
