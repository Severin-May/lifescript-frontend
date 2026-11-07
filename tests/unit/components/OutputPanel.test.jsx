// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import OutputPanel from '../../../src/components/OutputPanel'

const diagnostic = (overrides) => ({
  stage: 'VALIDATION', severity: 'ERROR', message: 'Plan is empty',
  startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0,
  ...overrides
})

describe('OutputPanel', () => {
  afterEach(cleanup)

  it('makes an error with a line a button that jumps there', () => {
    const onSelect = vi.fn()
    const placed = diagnostic({ message: "Task 'a' depends on 'ghost'", startLineNumber: 4, startColumn: 5 })
    render(<OutputPanel data={{ valid: false, diagnostics: [placed] }} onSelect={onSelect} />)

    fireEvent.click(screen.getByRole('button', { name: "Line 4: Task 'a' depends on 'ghost'" }))

    expect(onSelect).toHaveBeenCalledWith(placed)
  })

  it('shows an error without a line as plain text', () => {
    render(<OutputPanel data={{ valid: false, diagnostics: [diagnostic()] }} onSelect={() => {}} />)

    expect(screen.getByText('Plan is empty')).toBeTruthy()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it("hides an internal error's technical message", () => {
    render(<OutputPanel data={{ valid: false, diagnostics: [diagnostic({ stage: 'INTERNAL', message: 'NullPointerException' })] }} onSelect={() => {}} />)

    expect(screen.getByText('There was an internal error')).toBeTruthy()
    expect(screen.queryByText(/NullPointerException/)).toBeNull()
  })

  it('points to the Calendar button when there are no errors', () => {
    render(<OutputPanel data={{ valid: true, diagnostics: [] }} onSelect={() => {}} />)

    expect(screen.getByText('Click Calendar on the right to see your schedule.')).toBeTruthy()
  })
})
