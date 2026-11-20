// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import CheatSheetPanel from '../../../src/components/sidebar/CheatSheetPanel'

const header = (name) => screen.getByRole('button', { name })
const expanded = (name) => header(name).getAttribute('aria-expanded')

describe('CheatSheetPanel', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('opens the outline, values and shortcuts at first', () => {
    render(<CheatSheetPanel />)

    expect(expanded('Plan outline')).toBe('true')
    expect(expanded('Shortcuts')).toBe('true')
    expect(expanded('task')).toBe('false')
    expect(screen.queryByText('energy profile')).not.toBeNull()
    expect(screen.queryByText('dependencies')).toBeNull()
  })

  it('opens and closes a group', () => {
    render(<CheatSheetPanel />)

    fireEvent.click(header('task'))
    expect(screen.queryByText('dependencies')).not.toBeNull()

    fireEvent.click(header('task'))
    expect(screen.queryByText('dependencies')).toBeNull()
  })

  it('remembers open groups between visits', () => {
    render(<CheatSheetPanel />)
    fireEvent.click(header('task'))
    fireEvent.click(header('Shortcuts'))
    cleanup()

    render(<CheatSheetPanel />)

    expect(expanded('task')).toBe('true')
    expect(expanded('Shortcuts')).toBe('false')
  })

  it('ignores broken stored state', () => {
    localStorage.setItem('lifescript.cheatSheet.open', '{oops')
    render(<CheatSheetPanel />)

    expect(expanded('Plan outline')).toBe('true')
  })

  it('colors words like the editor', () => {
    render(<CheatSheetPanel />)

    expect(screen.getByText('critical').style.color).toBe('rgb(78, 201, 176)')
  })

  it('inserts the snippet of an entry or a section', () => {
    const onInsert = vi.fn()
    render(<CheatSheetPanel onInsert={onInsert} />)

    fireEvent.click(screen.getByRole('button', { name: 'Insert task' }))
    fireEvent.click(screen.getByRole('button', { name: 'Insert energy profile' }))

    expect(onInsert.mock.calls).toEqual([['task'], ['energy profile']])
  })

  it('has no insert buttons without an editor to insert into', () => {
    render(<CheatSheetPanel />)

    expect(screen.queryByRole('button', { name: /^Insert/ })).toBeNull()
  })
})
