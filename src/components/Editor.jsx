import MonacoEditor from '@monaco-editor/react'
import { useRef, useEffect } from 'react'
import { toMarkers } from '../diagnostics'
import { registerLifeScript, LANGUAGE_ID, THEME_ID } from '../language'
import { setFixableDiagnostics } from '../language/quickFixes'

function Editor({ content, onContentChange, output, editorRef }) {

  const monacoRef = useRef(null)

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco
  }

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return

    const monaco = monacoRef.current
    const editor = editorRef.current
    const model = editor.getModel()

    if (!model) return

    const markers = toMarkers(output?.diagnostics, monaco.MarkerSeverity.Error)
    monaco.editor.setModelMarkers(model, LANGUAGE_ID, markers)
    setFixableDiagnostics(output?.diagnostics ?? [], model.getVersionId())

    // Monaco only dims the "View Problem" box once its error is gone; close it when nothing is left.
    if (markers.length === 0) editor.getContribution('editor.contrib.markerController')?.close(false)
  }, [output, editorRef])

  return (
    <div className='w-full h-full'>
      <MonacoEditor
        height="100%"
        defaultLanguage={LANGUAGE_ID}
        theme={THEME_ID}
        value={content}
        onChange={onContentChange}
        beforeMount={registerLifeScript}
        onMount={handleEditorMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          tabSize: 4,
          insertSpaces: true,
          detectIndentation: false,
        }}
      />
    </div>
  )
}

export default Editor
