// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import OutputButtons from '../../../src/components/OutputButtons'

describe('OutputButtons', () => {
  afterEach(cleanup)

  it('compiles and asks for the schedule when Calendar is clicked', () => {
    const onCompile = vi.fn()
    render(<OutputButtons onCompile={onCompile} />)

    fireEvent.click(screen.getByRole('button', { name: 'Calendar' }))

    expect(onCompile).toHaveBeenCalledWith(true)
  })

  it('disables the views that are not built yet', () => {
    render(<OutputButtons onCompile={() => {}} />)

    for (const name of [/Dashboard/, /Graph/, /Export \.ics/]) {
      const button = screen.getByRole('button', { name })
      expect(button.disabled).toBe(true)
      expect(button.title).toBe('Coming soon')
    }
  })
})
