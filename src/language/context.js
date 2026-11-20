import { SECTIONS } from './keywords'

// Where the cursor sits in the plan's indentation tree, for context-aware completion.

const HEADER = /^(\s*)(energy\s+profile|[\p{L}\p{N}_]+)\s*:\s*(.*)$/iu

// Keeps a # inside a quoted note.
const stripComment = (text) => text.replace(/("[^"]*"?)|#.*/g, (match, quoted) => quoted ?? '')

const normalizeKey = (key) => key.toLowerCase().replace(/\s+/g, ' ')

export function parse(line) {
  const text = stripComment(line)
  const match = text.match(HEADER)
  return {
    indent: text.match(/^\s*/)[0].length,
    blank: text.trim() === '',
    key: match ? normalizeKey(match[2]) : null,
    value: match ? match[3].trim() : ''
  }
}

// Nearest first; each one less indented than the one before.
function ancestors(lines, index, indent) {
  const found = []
  for (let i = index - 1; i >= 0 && indent > 0; i--) {
    const line = parse(lines[i])
    if (line.blank || !line.key || line.indent >= indent) continue
    found.push({ ...line, index: i })
    indent = line.indent
  }
  return found
}

function childKeys(lines, index) {
  const { indent } = parse(lines[index])
  const keys = []
  let childIndent = null
  for (let i = index + 1; i < lines.length; i++) {
    const line = parse(lines[i])
    if (line.blank) continue
    if (line.indent <= indent) break
    childIndent ??= line.indent
    if (line.key && line.indent === childIndent) keys.push(line.key)
  }
  return keys
}

export function contextAt(lines, lineNumber, column) {
  const index = lineNumber - 1
  const beforeCursor = stripComment(lines[index].slice(0, column - 1))
  const current = beforeCursor.match(HEADER)
  const chain = ancestors(lines, index, beforeCursor.match(/^\s*/)[0].length)
  const parent = chain[0]
  const top = chain.at(-1)

  return {
    section: top?.indent === 0 && SECTIONS.includes(top.key) ? top.key : null,
    parent: parent ? { key: parent.key, name: parent.value, keys: childKeys(lines, parent.index) } : null,
    key: current ? normalizeKey(current[2]) : null,
    // The finished items of a comma list; the one being typed is left out.
    listed: current ? current[3].split(',').slice(0, -1).map(item => item.trim()).filter(Boolean) : []
  }
}

export function taskNames(lines) {
  const names = lines.map(parse).filter(line => line.key === 'task' && line.value).map(line => line.value)
  return [...new Set(names)]
}
