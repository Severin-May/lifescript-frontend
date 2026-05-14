import MonacoEditor from '@monaco-editor/react'

function Editor({content, onContentChange}) {
  return (
    <div className='flex-1 h-full'>
      <MonacoEditor
        height="100%"
        defaultLanguage="plaintext"
        theme="vs-dark"
        value={content}
        onChange={onContentChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  )
}

export default Editor