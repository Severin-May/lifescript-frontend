import { DAYS } from './keywords'

const trailingComment = String.raw`\s*(#.*)?$`
const blockHeader = new RegExp(
  String.raw`^\s*(availability|energy\s+profile|settings|routines|tasks|events|activities|default|${DAYS.join('|')})\s*:`
    + trailingComment, 'i')
const entryHeader = new RegExp(String.raw`^\s*(task|routine|event)\s*:\s*[^\s#]+` + trailingComment, 'i')

// Enter indents one level after a block header; other lines keep their indentation.
export function languageConfiguration(monaco) {
  const indent = { indentAction: monaco.languages.IndentAction.Indent }
  return {
    comments: { lineComment: '#' },
    onEnterRules: [
      { beforeText: blockHeader, action: indent },
      { beforeText: entryHeader, action: indent }
    ]
  }
}

// F-key shortcuts don't reach the browser on many laptops (media keys), so problems are reached with Alt+N.
export function keybindingRules(monaco) {
  const { KeyMod, KeyCode } = monaco
  return [
    { keybinding: KeyMod.Alt | KeyCode.F8, command: null },
    { keybinding: KeyMod.Shift | KeyMod.Alt | KeyCode.F8, command: null },
    { keybinding: KeyMod.Alt | KeyCode.KeyN, command: 'editor.action.marker.next' },
    { keybinding: KeyMod.Shift | KeyMod.Alt | KeyCode.KeyN, command: 'editor.action.marker.prev' }
  ]
}
