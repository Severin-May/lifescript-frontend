import { snippets } from './snippets'

// Snippets are offered only at the start of a line: sections on unindented lines, entries on indented ones.
export function completionProvider(monaco) {
  return {
    provideCompletionItems: (model, position) => {
      const beforeCursor = model.getLineContent(position.lineNumber).slice(0, position.column - 1)
      const match = beforeCursor.match(/^(\s*)[\p{L}_ ]*$/u)
      if (!match) return { suggestions: [] }

      const indented = match[1].length > 0
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: match[1].length + 1,
        endColumn: model.getWordUntilPosition(position).endColumn
      }

      return {
        suggestions: snippets()
          .filter(snippet => !!snippet.section !== indented)
          .map(snippet => ({
            label: snippet.label,
            detail: snippet.detail,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: snippet.body,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
          }))
      }
    }
  }
}
