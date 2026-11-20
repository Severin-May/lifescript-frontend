import { describe, it, expect } from 'vitest'
import { tokenType as tokenOf, tokenColors } from '../../../src/language/syntax'

describe('tokenizer', () => {
  it.each(['break', 'Break', 'BREAK'])('colors %s as a keyword', (word) => {
    expect(tokenOf(word)).toBe('keyword')
  })

  it('colors other names as identifiers', () => {
    expect(tokenOf('breakfast')).toBe('identifier')
  })
})

describe('tokenType', () => {
  it.each([
    ['tasks', 'keyword'], ['priority', 'property'], ['High', 'value'], ['monday … sunday', 'day'],
    ['2026-11-10 17:00', 'date'], ['09:00-12:00', 'time'], ['1h30m', 'duration'], ['"a note"', 'string'],
    ['name', 'identifier'], ['…', null]
  ])('gives %s the token %s', (text, token) => {
    expect(tokenOf(text)).toBe(token)
  })

  it('has a color for each themed token', () => {
    expect(tokenColors.keyword).toBe('#569cd6')
    expect(tokenColors.identifier).toBeUndefined()
  })
})
