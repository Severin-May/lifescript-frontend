import { describe, it, expect } from 'vitest'
import { tokenizer } from '../../../src/language/syntax'

// Resolves a name the way Monarch does: the first matching case wins, compared in lower case (ignoreCase).
function tokenOf(word) {
  const [, { cases }] = tokenizer.tokenizer.root.find(([, action]) => action.cases)
  const match = Object.entries(cases).find(([list]) => list === '@default' || tokenizer[list.slice(1)].includes(word.toLowerCase()))
  return match[1]
}

describe('tokenizer', () => {
  it.each(['break', 'Break', 'BREAK'])('colors %s as a keyword', (word) => {
    expect(tokenOf(word)).toBe('keyword')
  })

  it('colors other names as identifiers', () => {
    expect(tokenOf('breakfast')).toBe('identifier')
  })
})
