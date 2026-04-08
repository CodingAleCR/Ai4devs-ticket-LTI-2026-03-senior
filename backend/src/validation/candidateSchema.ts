import { z } from 'zod'

const educationEntrySchema = z.object({
  institution: z.string().trim().min(1, 'Institución requerida'),
  degree: z.string().trim().min(1, 'Título o carrera requerido'),
  yearEnd: z.string().trim().optional(),
})

const workExperienceEntrySchema = z.object({
  company: z.string().trim().min(1, 'Empresa requerida'),
  role: z.string().trim().min(1, 'Puesto requerido'),
  description: z.string().trim().optional(),
})

export const createCandidateBodySchema = z.object({
  firstName: z.string().trim().min(1, 'Nombre requerido'),
  lastName: z.string().trim().min(1, 'Apellido requerido'),
  email: z.string().trim().email('Correo electrónico no válido'),
  phone: z.string().trim().min(1, 'Teléfono requerido'),
  address: z.string().trim().min(1, 'Dirección requerida'),
  educationEntries: z
    .array(educationEntrySchema)
    .min(1, 'Añade al menos una entrada de educación'),
  workExperienceEntries: z
    .array(workExperienceEntrySchema)
    .min(1, 'Añade al menos una entrada de experiencia laboral'),
})

export type CreateCandidateBody = z.infer<typeof createCandidateBodySchema>
