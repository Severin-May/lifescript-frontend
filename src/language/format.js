import { parse } from './context'
import { SECTIONS, PERIODS, ENTRY_PROPERTIES, SECTION_KEYS } from './keywords'

// Re-indents a plan to 4 spaces per level. A line's depth comes from what it is (section, entry, property),
// so a misplaced property moves under its entry; lines that can't be placed keep their position relative
// to the line above. Only leading and trailing whitespace changes.

const INDENT = '    '
const TOP_LEVEL = ['plan', 'period', ...SECTIONS]
const ENTRIES = Object.keys(ENTRY_PROPERTIES)
const PROPERTIES = [...new Set(Object.values(ENTRY_PROPERTIES).flatMap(p => [...p.required, ...(p.optional ?? [])]))]
const ROUTINE_PROPERTIES = ENTRY_PROPERTIES.routine.required

// The depth of a known key, updating where we are; null for a key whose place isn't known.
function knownDepth(key, state) {
  if (TOP_LEVEL.includes(key)) {
    Object.assign(state, { section: SECTIONS.includes(key) ? key : null, inBlock: false, inActivities: false })
    return 0
  }

  const { section } = state
  if (['tasks', 'routines', 'events'].includes(section)) {
    if (ENTRIES.includes(key)) {
      Object.assign(state, { inBlock: true, inActivities: false })
      return 1
    }
    if (!state.inBlock) return null
    if (state.inActivities && !ROUTINE_PROPERTIES.includes(key)) return 3
    if (!PROPERTIES.includes(key)) return null
    state.inActivities = key === 'activities'
    return 2
  }

  if (SECTION_KEYS[section]?.includes(key)) {
    state.inBlock = true
    return 1
  }
  if (section === 'energy profile' && state.inBlock && PERIODS.includes(key)) return 2
  return null
}

// Stack of earlier lines' { indent, depth }, kept with increasing indent.
function relativeDepth(stack, indent) {
  while (stack.length && stack.at(-1).indent > indent) stack.pop()
  const above = stack.at(-1)
  if (!above) return 0
  return above.indent === indent ? above.depth : above.depth + 1
}

export function formatLines(lines) {
  const state = { section: null, inBlock: false, inActivities: false }
  const stack = []
  const parsed = lines.map(parse)

  const depths = parsed.map(line => {
    if (line.blank) return null
    const depth = (line.key && knownDepth(line.key, state)) ?? relativeDepth(stack, line.indent)
    while (stack.length && stack.at(-1).indent >= line.indent) stack.pop()
    stack.push({ indent: line.indent, depth })
    return depth
  })

  // Full-line comments take the depth of the next line of code.
  let next = 0
  for (let i = lines.length - 1; i >= 0; i--) {
    if (depths[i] === null) depths[i] = next
    else next = depths[i]
  }

  return lines.map((line, i) => {
    const text = line.trim()
    return text ? INDENT.repeat(depths[i]) + text : ''
  })
}

// One edit per changed line, so the cursor stays put and Ctrl+Z undoes the whole format.
export function formattingEdits(lines) {
  const formatted = formatLines(lines)
  return lines.flatMap((line, i) => (line === formatted[i] ? [] : [{
    range: { startLineNumber: i + 1, startColumn: 1, endLineNumber: i + 1, endColumn: line.length + 1 },
    text: formatted[i]
  }]))
}
