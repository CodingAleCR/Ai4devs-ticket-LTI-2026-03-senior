import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  candidateFormSchema,
  CandidateFormValues,
} from '../schemas/candidateFormSchema'

const defaultValues: CandidateFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  education: [{ institution: '', degree: '', yearEnd: '' }],
  experience: [{ company: '', role: '', description: '' }],
}

const AddCandidatePage = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues,
    mode: 'onBlur',
  })

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({ control, name: 'education' })

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({ control, name: 'experience' })

  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvError, setCvError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [educationSuggestions, setEducationSuggestions] = useState<string[]>(
    [],
  )
  const [experienceSuggestions, setExperienceSuggestions] = useState<string[]>(
    [],
  )

  const eduTimer = useRef<number | null>(null)
  const expTimer = useRef<number | null>(null)

  const loadEducationSuggestions = (q: string) => {
    if (eduTimer.current) {
      window.clearTimeout(eduTimer.current)
    }
    eduTimer.current = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/suggestions/education?q=${encodeURIComponent(q)}`,
        )
        if (!res.ok) {
          return
        }
        const data = (await res.json()) as { suggestions: string[] }
        setEducationSuggestions(data.suggestions)
      } catch {
        setEducationSuggestions([])
      }
    }, 300)
  }

  const loadExperienceSuggestions = (q: string) => {
    if (expTimer.current) {
      window.clearTimeout(expTimer.current)
    }
    expTimer.current = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/suggestions/experience?q=${encodeURIComponent(q)}`,
        )
        if (!res.ok) {
          return
        }
        const data = (await res.json()) as { suggestions: string[] }
        setExperienceSuggestions(data.suggestions)
      } catch {
        setExperienceSuggestions([])
      }
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (eduTimer.current) {
        window.clearTimeout(eduTimer.current)
      }
      if (expTimer.current) {
        window.clearTimeout(expTimer.current)
      }
    }
  }, [])

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setCvFile(null)
      setCvError(null)
      return
    }
    const allowed =
      file.type === 'application/pdf' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    if (!allowed) {
      setCvError('Solo se permiten archivos PDF o DOCX')
      setCvFile(null)
      e.target.value = ''
      return
    }
    setCvError(null)
    setCvFile(file)
  }

  const onSubmit = async (values: CandidateFormValues) => {
    if (cvError) {
      return
    }
    setIsSubmitting(true)
    clearErrors('root')
    setSuccessMessage(null)
    try {
      const formData = new FormData()
      formData.append('firstName', values.firstName)
      formData.append('lastName', values.lastName)
      formData.append('email', values.email)
      formData.append('phone', values.phone)
      formData.append('address', values.address)
      formData.append(
        'educationJson',
        JSON.stringify(
          values.education.map((e) => ({
            institution: e.institution,
            degree: e.degree,
            yearEnd: e.yearEnd?.trim() ? e.yearEnd.trim() : undefined,
          })),
        ),
      )
      formData.append(
        'experienceJson',
        JSON.stringify(
          values.experience.map((x) => ({
            company: x.company,
            role: x.role,
            description: x.description?.trim()
              ? x.description.trim()
              : undefined,
          })),
        ),
      )
      if (cvFile) {
        formData.append('cv', cvFile)
      }

      const res = await fetch('/api/candidates', {
        method: 'POST',
        body: formData,
      })

      let payload: { error?: string; message?: string } = {}
      try {
        payload = (await res.json()) as typeof payload
      } catch {
        payload = {}
      }

      if (!res.ok) {
        setError('root', {
          type: 'server',
          message:
            payload.error ||
            'No se pudo guardar el candidato. Inténtalo de nuevo.',
        })
        return
      }

      setSuccessMessage(
        payload.message || 'Candidato añadido correctamente al sistema',
      )
      reset(defaultValues)
      setCvFile(null)
    } catch {
      setError('root', {
        type: 'server',
        message:
          'Error de conexión con el servidor. Comprueba tu red e inténtalo de nuevo.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6">
          <Link
            to="/"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            ← Volver al dashboard
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Añadir candidato
            </h1>
            <p className="mt-1 text-slate-600">
              Completa los datos del perfil. El CV es opcional (PDF o DOCX).
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {successMessage ? (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900"
          >
            {successMessage}
          </div>
        ) : null}

        {errors.root ? (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-900"
          >
            {errors.root.message as string}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          noValidate
        >
          <fieldset className="space-y-4">
            <legend className="text-lg font-medium text-slate-800">
              Datos personales
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium">
                  Nombre <span className="text-red-600">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  aria-invalid={errors.firstName ? true : undefined}
                  aria-describedby={
                    errors.firstName ? 'firstName-error' : undefined
                  }
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...register('firstName')}
                />
                {errors.firstName ? (
                  <p id="firstName-error" className="mt-1 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium">
                  Apellido <span className="text-red-600">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  aria-invalid={errors.lastName ? true : undefined}
                  aria-describedby={
                    errors.lastName ? 'lastName-error' : undefined
                  }
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...register('lastName')}
                />
                {errors.lastName ? (
                  <p id="lastName-error" className="mt-1 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                ) : null}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Correo electrónico <span className="text-red-600">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register('email')}
              />
              {errors.email ? (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium">
                Teléfono <span className="text-red-600">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register('phone')}
              />
              {errors.phone ? (
                <p id="phone-error" className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium">
                Dirección <span className="text-red-600">*</span>
              </label>
              <textarea
                id="address"
                rows={3}
                autoComplete="street-address"
                aria-invalid={errors.address ? true : undefined}
                aria-describedby={errors.address ? 'address-error' : undefined}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register('address')}
              />
              {errors.address ? (
                <p id="address-error" className="mt-1 text-sm text-red-600">
                  {errors.address.message}
                </p>
              ) : null}
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-lg font-medium text-slate-800">
              Educación
            </legend>
            <datalist id="education-institution-suggestions" className="bg-white">
              {educationSuggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            {educationFields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <p className="text-sm font-medium text-slate-700">
                  Formación {index + 1}
                </p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`education.${index}.institution`}
                      className="block text-sm font-medium"
                    >
                      Institución <span className="text-red-600">*</span>
                    </label>
                    <input
                      id={`education.${index}.institution`}
                      type="text"
                      list="education-institution-suggestions"
                      aria-invalid={
                        errors.education?.[index]?.institution ? true : undefined
                      }
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      {...register(`education.${index}.institution` as const, {
                        onChange: (e) =>
                          loadEducationSuggestions(e.target.value),
                      })}
                      onFocus={() => loadEducationSuggestions('')}
                    />
                    {errors.education?.[index]?.institution ? (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.education[index]?.institution?.message}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor={`education.${index}.degree`}
                      className="block text-sm font-medium"
                    >
                      Título / carrera <span className="text-red-600">*</span>
                    </label>
                    <input
                      id={`education.${index}.degree`}
                      type="text"
                      aria-invalid={
                        errors.education?.[index]?.degree ? true : undefined
                      }
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      {...register(`education.${index}.degree` as const)}
                    />
                    {errors.education?.[index]?.degree ? (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.education[index]?.degree?.message}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor={`education.${index}.yearEnd`}
                      className="block text-sm font-medium"
                    >
                      Año de finalización
                    </label>
                    <input
                      id={`education.${index}.yearEnd`}
                      type="text"
                      inputMode="numeric"
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      {...register(`education.${index}.yearEnd` as const)}
                    />
                  </div>
                </div>
                {educationFields.length > 1 ? (
                  <button
                    type="button"
                    className="mt-3 text-sm font-medium text-red-700 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                    onClick={() => removeEducation(index)}
                  >
                    Eliminar esta formación
                  </button>
                ) : null}
              </div>
            ))}
            <button
              type="button"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
              onClick={() =>
                appendEducation({ institution: '', degree: '', yearEnd: '' })
              }
            >
              Añadir otra formación
            </button>
            {errors.education && !Array.isArray(errors.education) ? (
              <p className="text-sm text-red-600">{errors.education.message}</p>
            ) : null}
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-lg font-medium text-slate-800">
              Experiencia laboral
            </legend>
            <datalist id="experience-company-suggestions">
              {experienceSuggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            {experienceFields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <p className="text-sm font-medium text-slate-700">
                  Experiencia {index + 1}
                </p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`experience.${index}.company`}
                      className="block text-sm font-medium"
                    >
                      Empresa <span className="text-red-600">*</span>
                    </label>
                    <input
                      id={`experience.${index}.company`}
                      type="text"
                      list="experience-company-suggestions"
                      aria-invalid={
                        errors.experience?.[index]?.company ? true : undefined
                      }
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      {...register(`experience.${index}.company` as const, {
                        onChange: (e) =>
                          loadExperienceSuggestions(e.target.value),
                      })}
                      onFocus={() => loadExperienceSuggestions('')}
                    />
                    {errors.experience?.[index]?.company ? (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.experience[index]?.company?.message}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor={`experience.${index}.role`}
                      className="block text-sm font-medium"
                    >
                      Puesto <span className="text-red-600">*</span>
                    </label>
                    <input
                      id={`experience.${index}.role`}
                      type="text"
                      aria-invalid={
                        errors.experience?.[index]?.role ? true : undefined
                      }
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      {...register(`experience.${index}.role` as const)}
                    />
                    {errors.experience?.[index]?.role ? (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.experience[index]?.role?.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`experience.${index}.description`}
                      className="block text-sm font-medium"
                    >
                      Descripción
                    </label>
                    <textarea
                      id={`experience.${index}.description`}
                      rows={3}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      {...register(`experience.${index}.description` as const)}
                    />
                  </div>
                </div>
                {experienceFields.length > 1 ? (
                  <button
                    type="button"
                    className="mt-3 text-sm font-medium text-red-700 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                    onClick={() => removeExperience(index)}
                  >
                    Eliminar esta experiencia
                  </button>
                ) : null}
              </div>
            ))}
            <button
              type="button"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
              onClick={() =>
                appendExperience({
                  company: '',
                  role: '',
                  description: '',
                })
              }
            >
              Añadir otra experiencia
            </button>
            {errors.experience && !Array.isArray(errors.experience) ? (
              <p className="text-sm text-red-600">
                {errors.experience.message}
              </p>
            ) : null}
          </fieldset>

          <fieldset>
            <legend className="text-lg font-medium text-slate-800">
              Curriculum (opcional)
            </legend>
            <label htmlFor="cv" className="block text-sm font-medium">
              Archivo CV
            </label>
            <input
              id="cv"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleCvChange}
              className="mt-2 block w-full text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
              aria-invalid={cvError ? true : undefined}
              aria-describedby={cvError ? 'cv-error' : 'cv-hint'}
            />
            <p id="cv-hint" className="mt-1 text-sm text-slate-500">
              Formatos admitidos: PDF o DOCX. Tamaño máximo según servidor (10
              MB).
            </p>
            {cvError ? (
              <p id="cv-error" className="mt-1 text-sm text-red-600">
                {cvError}
              </p>
            ) : null}
            {cvFile ? (
              <p className="mt-2 text-sm text-slate-700" aria-live="polite">
                Archivo seleccionado: {cvFile.name}
              </p>
            ) : null}
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Enviando…' : 'Guardar candidato'}
            </button>
            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}

export default AddCandidatePage
