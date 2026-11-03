// Diagnostics with all positions 0 aren't tied to a place; they only appear in the output panel.
export function toMarkers(diagnostics, severity) {
  return (diagnostics ?? [])
    .filter(d => d.startLineNumber > 0)
    .map(d => ({
      startLineNumber: d.startLineNumber,
      startColumn: d.startColumn,
      endLineNumber: d.endLineNumber,
      endColumn: d.endColumn,
      message: d.message,
      severity
    }))
}
