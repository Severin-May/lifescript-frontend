const NO_ACTIONS = { actions: [], dispose() {} }

let fixable = { diagnostics: [], versionId: null }

export function setFixableDiagnostics(diagnostics, versionId) {
  fixable = { diagnostics, versionId }
}

// Markers can't carry extra data, so the diagnostic is found again by its range and message.
function findDiagnostic(marker) {
  return fixable.diagnostics.find(d =>
    d.message === marker.message &&
    d.startLineNumber === marker.startLineNumber &&
    d.startColumn === marker.startColumn &&
    d.endLineNumber === marker.endLineNumber &&
    d.endColumn === marker.endColumn
  )
}

function toAction(monaco, model, marker, fix, isPreferred) {
  return {
    title: fix.title,
    kind: 'quickfix',
    diagnostics: [marker],
    isPreferred,
    edit: {
      edits: fix.edits.map(e => ({
        resource: model.uri,
        versionId: model.getVersionId(),
        textEdit: {
          range: new monaco.Range(e.startLineNumber, e.startColumn, e.endLineNumber, e.endColumn),
          text: e.text
        }
      }))
    }
  }
}

export function quickFixProvider(monaco) {
  return {
    provideCodeActions(model, range, context) {
      // After an edit the stored fixes point at older text and could change the wrong place.
      if (model.getVersionId() !== fixable.versionId) return NO_ACTIONS

      const actions = context.markers.flatMap(marker => {
        const fixes = findDiagnostic(marker)?.fixes ?? []
        return fixes.map(fix => toAction(monaco, model, marker, fix, fixes.length === 1))
      })

      return { actions, dispose() {} }
    }
  }
}
