import { describe, it, expect, beforeEach } from 'vitest'
import { quickFixProvider, setFixableDiagnostics } from '../../../src/language/quickFixes'

const monaco = {
  Range: class {
    constructor(startLineNumber, startColumn, endLineNumber, endColumn) {
      Object.assign(this, { startLineNumber, startColumn, endLineNumber, endColumn })
    }
  }
}

const position = { startLineNumber: 12, startColumn: 11, endLineNumber: 12, endColumn: 14 }

const typo = {
  ...position,
  message: "'hgh' is not a valid priority. Did you mean 'high'?",
  fixes: [{ title: "Change to 'high'", edits: [{ ...position, text: 'high' }] }]
}

const marker = { ...position, message: typo.message }

function fakeModel(versionId) {
  return { uri: 'file:///plan.ls', getVersionId: () => versionId }
}

function actionsFor(model, markers = [marker]) {
  return quickFixProvider(monaco).provideCodeActions(model, null, { markers }).actions
}

describe('quickFixProvider', () => {
  beforeEach(() => setFixableDiagnostics([], null))

  it('turns the fix of a matching marker into a quick fix', () => {
    setFixableDiagnostics([typo], 3)

    expect(actionsFor(fakeModel(3))).toEqual([{
      title: "Change to 'high'",
      kind: 'quickfix',
      diagnostics: [marker],
      isPreferred: true,
      edit: {
        edits: [{
          resource: 'file:///plan.ls',
          versionId: 3,
          textEdit: { range: new monaco.Range(12, 11, 12, 14), text: 'high' }
        }]
      }
    }])
  })

  it('offers nothing once the text has changed', () => {
    setFixableDiagnostics([typo], 3)

    expect(actionsFor(fakeModel(4))).toEqual([])
  })

  it('offers nothing for a diagnostic without fixes', () => {
    setFixableDiagnostics([{ ...typo, fixes: [] }, { ...position, message: 'other' }], 3)

    expect(actionsFor(fakeModel(3), [marker, { ...position, message: 'other' }])).toEqual([])
  })

  it('ignores a marker whose range differs', () => {
    setFixableDiagnostics([typo], 3)

    expect(actionsFor(fakeModel(3), [{ ...marker, endColumn: 15 }])).toEqual([])
  })

  it('prefers none when there are several fixes', () => {
    const second = { title: "Change to 'low'", edits: [{ ...position, text: 'low' }] }
    setFixableDiagnostics([{ ...typo, fixes: [...typo.fixes, second] }], 3)

    expect(actionsFor(fakeModel(3)).map(a => a.isPreferred)).toEqual([false, false])
  })
})
