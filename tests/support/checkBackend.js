import { BACKEND } from './backend'

// Runs once before the contract tests (Vitest globalSetup).
export default async function checkBackend() {
  try {
    await fetch(`${BACKEND}/api/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: '' })
    })
  } catch {
    throw new Error(`No backend at ${BACKEND}. Start it first: ./mvnw spring-boot:run in ../lifescript-backend`)
  }
}
