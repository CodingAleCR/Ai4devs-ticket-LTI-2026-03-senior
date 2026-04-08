import request from 'supertest'
import { app } from '../index'

describe('GET /', () => {
  it('responds with greeting', async () => {
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('Hola LTI!')
  })
})

describe('GET /api/suggestions/education', () => {
  it('returns JSON with suggestions array', async () => {
    const response = await request(app).get('/api/suggestions/education')
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body.suggestions)).toBe(true)
  })
})

describe('POST /api/candidates', () => {
  it('returns 400 when email is invalid', async () => {
    const response = await request(app)
      .post('/api/candidates')
      .field('firstName', 'Ana')
      .field('lastName', 'García')
      .field('email', 'not-an-email')
      .field('phone', '600000000')
      .field('address', 'Calle 1')
      .field(
        'educationJson',
        JSON.stringify([
          { institution: 'Universidad', degree: 'Grado', yearEnd: '2020' },
        ]),
      )
      .field(
        'experienceJson',
        JSON.stringify([{ company: 'ACME', role: 'Dev', description: '' }]),
      )

    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBeDefined()
  })

  it('creates a candidate when data is valid', async () => {
    const unique = `test-${Date.now()}@example.com`
    const response = await request(app)
      .post('/api/candidates')
      .field('firstName', 'Luis')
      .field('lastName', 'Pérez')
      .field('email', unique)
      .field('phone', '611222333')
      .field('address', 'Av. Principal 10')
      .field(
        'educationJson',
        JSON.stringify([
          { institution: 'Universidad Test', degree: 'Ingeniería', yearEnd: '2019' },
        ]),
      )
      .field(
        'experienceJson',
        JSON.stringify([
          { company: 'Empresa Test', role: 'Ingeniero', description: 'Backend' },
        ]),
      )

    expect(response.statusCode).toBe(201)
    expect(response.body.id).toBeDefined()
    expect(response.body.message).toContain('Candidato')
  })
})
