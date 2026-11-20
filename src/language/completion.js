import { snippets } from './snippets'
import { contextAt, taskNames } from './context'
import { DAYS, PRIORITIES, ENERGY_LEVELS, PERIODS, DAY_GROUPS, ENTRY_PROPERTIES } from './keywords'

// What may follow `key:` in a block. `more`: what may follow a comma; without it, a single value.
const VALUE_RULES = [
  { blocks: ['task'], keys: ['priority'], values: PRIORITIES },
  { blocks: ['task'], keys: ['effort'], values: ENERGY_LEVELS },
  { blocks: ['task', 'routine'], keys: ['repeats'], values: [...DAY_GROUPS, ...DAYS], more: DAYS },
  { blocks: ['event'], keys: ['time'], values: PERIODS },
  { section: 'availability', blocks: ['availability'], keys: DAYS, values: ['flexible', ...PERIODS], more: PERIODS },
  { section: 'energy profile', blocks: ['default', ...DAYS], keys: PERIODS, values: ENERGY_LEVELS }
]

const entryKeys = (kind, section) => {
  const { required, optional = [] } = ENTRY_PROPERTIES[kind]
  return { section, blocks: [kind], keys: [...required, ...optional], required }
}

// The keys a block may contain. `nested`: keys that open a block of their own.
const KEY_RULES = [
  entryKeys('task', 'tasks'),
  { ...entryKeys('routine', 'routines'), nested: ['activities'] },
  entryKeys('event', 'events'),
  { section: 'availability', blocks: ['availability'], keys: DAYS },
  { section: 'settings', blocks: ['settings'], keys: [...PERIODS, 'break'] },
  { section: 'energy profile', blocks: ['energy profile'], keys: ['default', ...DAYS], nested: ['default', ...DAYS] },
  { section: 'energy profile', blocks: ['default', ...DAYS], keys: PERIODS }
]

const appliesTo = (rule, { section, parent }) =>
  !!parent && rule.blocks.includes(parent.key) && (!rule.section || rule.section === section)

function valueItems(context, lines) {
  const { parent, key, listed } = context
  if (key === 'dependencies' && parent?.key === 'task') {
    return taskNames(lines)
      .filter(name => name !== parent.name && !listed.includes(name))
      .map(name => ({ label: name, kind: 'Reference' }))
  }

  const rule = VALUE_RULES.find(r => r.keys.includes(key) && appliesTo(r, context))
  if (!rule) return []
  const done = listed.map(value => value.toLowerCase())
  const values = done.length === 0 ? rule.values
    : done.every(value => rule.more?.includes(value)) ? rule.more : []
  return values.filter(value => !done.includes(value)).map(value => ({ label: value, kind: 'Value' }))
}

function keyItems(context, lines) {
  const rule = KEY_RULES.find(r => appliesTo(r, context))
  if (!rule) return []
  return rule.keys.filter(key => !context.parent.keys.includes(key)).map(key => {
    const nested = rule.nested?.includes(key)
    const hasFollowUp = nested
      ? KEY_RULES.some(r => appliesTo(r, { section: context.section, parent: { key } }))
      : valueItems({ ...context, key, listed: [] }, lines).length > 0
    return {
      label: key,
      kind: 'Property',
      detail: rule.required?.includes(key) ? 'required' : undefined,
      insertText: nested ? `${key}:\n    $0` : `${key}: $0`,
      snippet: true,
      retrigger: hasFollowUp
    }
  })
}

function snippetItems(context, indented) {
  return snippets()
    .filter(snippet => (indented ? snippet.in === context.parent?.key : snippet.section))
    .map(({ label, detail, body }) => ({ label, detail, kind: 'Snippet', insertText: body, snippet: true }))
}

// Values after `key:`; otherwise, at the start of a line, keys and snippets that fit the block. A trigger
// character (space, comma) never opens snippets on a line that is only indentation.
export function suggestionsAt(lines, lineNumber, column, { byCharacter = false } = {}) {
  const beforeCursor = lines[lineNumber - 1].slice(0, column - 1)
  const context = contextAt(lines, lineNumber, column)

  if (context.key) {
    const typed = beforeCursor.match(/[\p{L}\p{N}_]*$/u)[0]
    const space = /[:,]$/.test(beforeCursor.slice(0, beforeCursor.length - typed.length)) ? ' ' : ''
    const items = valueItems(context, lines).map(item => ({ ...item, insertText: space + item.label }))
    return { startColumn: column - typed.length, items }
  }

  const lineStart = beforeCursor.match(/^(\s*)[\p{L}_ ]*$/u)
  if (!lineStart || (byCharacter && beforeCursor.trim() === '')) return { startColumn: column, items: [] }

  const indent = lineStart[1].length
  const items = indent > 0
    ? [...keyItems(context, lines), ...snippetItems(context, true)]
    : snippetItems(context, false)
  return { startColumn: indent + 1, items }
}

export function completionProvider(monaco) {
  const { CompletionItemKind, CompletionItemInsertTextRule, CompletionTriggerKind } = monaco.languages
  return {
    triggerCharacters: [' ', ','],
    provideCompletionItems: (model, position, context) => {
      const { lineNumber, column } = position
      const byCharacter = context?.triggerKind === CompletionTriggerKind.TriggerCharacter
      const { startColumn, items } = suggestionsAt(model.getLinesContent(), lineNumber, column, { byCharacter })
      const range = { startLineNumber: lineNumber, endLineNumber: lineNumber, startColumn, endColumn: column }

      return {
        suggestions: items.map((item, i) => ({
          label: item.label,
          detail: item.detail,
          kind: CompletionItemKind[item.kind],
          insertText: item.insertText ?? item.label,
          insertTextRules: item.snippet ? CompletionItemInsertTextRule.InsertAsSnippet : undefined,
          // Keeps the order given here (required properties first) instead of alphabetical.
          sortText: String(i).padStart(3, '0'),
          command: item.retrigger ? { id: 'editor.action.triggerSuggest', title: 'Suggest' } : undefined,
          range
        }))
      }
    }
  }
}
