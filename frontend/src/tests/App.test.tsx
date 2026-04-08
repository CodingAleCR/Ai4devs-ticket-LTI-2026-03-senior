import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

test('renders recruiter dashboard', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
  expect(
    screen.getByRole('heading', { name: /dashboard del reclutador/i }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: /añadir un nuevo candidato al sistema/i }),
  ).toBeInTheDocument()
})
