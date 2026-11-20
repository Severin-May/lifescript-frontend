import { snippets } from './snippets'

// Inserts the snippet with this label at the cursor, on a line of its own with the current line's
// indentation, through Monaco's snippet controller so Tab moves through its fields.
export function insertSnippet(editor, label) {
  const snippet = snippets().find(s => s.label === label)
  const model = editor.getModel()
  const position = editor.getPosition()
  if (!snippet || !model || !position) return

  const { lineNumber } = position
  const line = model.getLineContent(lineNumber)
  const indent = line.match(/^\s*/)[0]

  if (line.trim() === '') {
    editor.setPosition({ lineNumber, column: line.length + 1 })
  } else {
    const end = { lineNumber, column: line.length + 1 }
    editor.executeEdits('cheat-sheet', [{
      range: { startLineNumber: lineNumber, startColumn: end.column, endLineNumber: lineNumber, endColumn: end.column },
      text: `\n${indent}`
    }])
    editor.setPosition({ lineNumber: lineNumber + 1, column: indent.length + 1 })
  }

  editor.focus()
  editor.getContribution('snippetController2').insert(snippet.body)
}
