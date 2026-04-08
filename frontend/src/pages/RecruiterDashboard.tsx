import React from 'react'
import { Link } from 'react-router-dom'

const RecruiterDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">LTI · ATS</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Dashboard del reclutador
            </h1>
            <p className="mt-2 max-w-xl text-slate-600">
              Gestiona candidatos y procesos de selección desde un único lugar.
            </p>
          </div>
          <Link
            to="/candidates/new"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-center text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            aria-label="Añadir un nuevo candidato al sistema"
          >
            Añadir candidato
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <section
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          aria-labelledby="quick-actions-heading"
        >
          <h2 id="quick-actions-heading" className="text-lg font-medium text-slate-800">
            Acciones rápidas
          </h2>
          <p className="mt-2 text-slate-600">
            Usa el botón superior para registrar un nuevo perfil con datos de contacto,
            formación, experiencia y curriculum opcional (PDF o DOCX).
          </p>
        </section>
      </main>
    </div>
  )
}

export default RecruiterDashboard
