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
