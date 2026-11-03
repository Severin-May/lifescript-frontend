import { describe, it, expect } from 'vitest'
import { compile } from '../../src/api/lifescriptApi'
import { snippets } from '../../src/language/snippets'
import { templates } from '../../src/templates'
import { useBackend } from '../support/backend'

// What the user gets by pressing Tab through every field without typing.
function withDefaults(body) {
  return body
    .replace(/\$\{\d+\|([^,|]+)[^}]*\}/g, '$1')
    .replace(/\$\{\d+:([^}]*)\}/g, '$1')
    .replace('$0', '')
}

const indent = (text) => text.split('\n').map(line => (line ? `    ${line}` : line)).join('\n')

// Monaco indents every snippet line like the line it was typed on; here that's the line under the header.
function insertUnderHeader(plan, header, block) {
  const lines = plan.split('\n')
  const at = lines.findIndex(line => line.startsWith(`${header}:`))
  if (at === -1) return `${plan}\n${header}:\n${indent(block)}`
  lines.splice(at + 1, 0, indent(block))
  return lines.join('\n')
}

const today = new Date()
const all = snippets(today)
const sections = all.filter(s => s.section)
const entries = all.filter(s => !s.section)
const headerOf = (entry) => `${entry.label.split(' ')[0]}s`

const minimal = templates.find(t => t.id === 'minimal').build(today)

describe('snippets contract', () => {
  useBackend()

  it.each(sections.map(s => [s.label, s]))('the %s section is valid in a plan', async (_, snippet) => {
    // Replaces the section if the plan has it, otherwise adds it.
    const header = `${snippet.label}:`
    const plan = minimal.includes(`\n${header}`)
      ? minimal.replace(new RegExp(`\\n${header}[\\s\\S]*?(?=\\n\\S|$)`), `\n${withDefaults(snippet.body)}`)
      : `${minimal}\n${withDefaults(snippet.body)}`

    const result = await compile(plan)

    expect(result.diagnostics).toEqual([])
  })

  describe.each(templates.map(t => [t.title, t]))('added to the %s template', (_, template) => {
    it.each(entries.map(e => [e.label, e]))('the %s entry is valid', async (_, entry) => {
      const plan = insertUnderHeader(template.build(today), headerOf(entry), withDefaults(entry.body).trimEnd())

      const result = await compile(plan)

      expect(result.diagnostics).toEqual([])
    })
  })
})
