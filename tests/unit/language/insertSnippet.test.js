import { describe, it, expect, vi } from 'vitest'
import { insertSnippet } from '../../../src/language/insertSnippet'
import { snippets } from '../../../src/language/snippets'

function fakeEditor(lines, position) {
  const insert = vi.fn()
  const editor = {
    lines: [...lines],
    position,
    getModel: () => ({ getLineContent: n => editor.lines[n - 1] }),
    getPosition: () => editor.position,
    setPosition: (p) => { editor.position = p },
    executeEdits: vi.fn((source, [edit]) => {
      const n = edit.range.startLineNumber
      const [first, ...rest] = (editor.lines[n - 1] + edit.text).split('\n')
      editor.lines.splice(n - 1, 1, first, ...rest)
    }),
    focus: vi.fn(),
    getContribution: (id) => (id === 'snippetController2' ? { insert } : null),
    insert
  }
  return editor
}

const body = (label) => snippets().find(s => s.label === label).body

describe('insertSnippet', () => {
  it('inserts on an empty line, after its indentation', () => {
    const editor = fakeEditor(['tasks:', '    '], { lineNumber: 2, column: 1 })

    insertSnippet(editor, 'task')

    expect(editor.position).toEqual({ lineNumber: 2, column: 5 })
    expect(editor.insert).toHaveBeenCalledWith(body('task'))
    expect(editor.executeEdits).not.toHaveBeenCalled()
    expect(editor.focus).toHaveBeenCalled()
  })

  it('opens a new line with the same indentation below a line with text', () => {
    const editor = fakeEditor(['tasks:', '    task: a', '        duration: 1h'], { lineNumber: 2, column: 3 })

    insertSnippet(editor, 'task')

    expect(editor.lines).toEqual(['tasks:', '    task: a', '    ', '        duration: 1h'])
    expect(editor.position).toEqual({ lineNumber: 3, column: 5 })
    expect(editor.insert).toHaveBeenCalledWith(body('task'))
  })

  it('does nothing for an unknown snippet or without a cursor', () => {
    const unknown = fakeEditor(['plan: x'], { lineNumber: 1, column: 1 })
    insertSnippet(unknown, 'nope')

    const noCursor = fakeEditor(['plan: x'], null)
    insertSnippet(noCursor, 'task')

    expect(unknown.insert).not.toHaveBeenCalled()
    expect(noCursor.insert).not.toHaveBeenCalled()
  })
})
