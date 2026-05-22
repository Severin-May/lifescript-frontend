import MonacoEditor from '@monaco-editor/react'

function Editor({ content, onContentChange }) {
  const handleBeforeMount = (monaco) => {
    monaco.languages.register({ id: 'lifescript' })

    monaco.languages.setMonarchTokensProvider('lifescript', {
      keywords: [
        'plan', 'period', 'settings', 'availability', 'energy', 'profile',
        'routines', 'routine', 'tasks', 'task', 'activities', 'default'
      ],
      properties: [
        'duration', 'priority', 'effort', 'deadline', 'start',
        'repeats', 'dependencies', 'note', 'time'
      ],
      values: [
        'high', 'moderate', 'low', 'critical', 'medium',
        'morning', 'afternoon', 'evening', 'off', 'flexible',
        'daily', 'weekdays', 'weekends', 'to'
      ],
      days: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday', 'Sunday'
      ],
      tokenizer: {
        root: [
          [/[0-9]{4}-[0-9]{2}-[0-9]{2}/, 'date'],
          [/[0-9]{2}:[0-9]{2}/, 'time'],
          [/[0-9]+[hm]([0-9]+m)?/, 'duration'],
          [/".*?"/, 'string'],
          [/#.*$/, 'comment'],
          [/[a-zA-Z]+/, {
            cases: {
              '@keywords': 'keyword',
              '@properties': 'property',
              '@values': 'value',
              '@days': 'day',
              '@default': 'identifier'
            }
          }]
        ]
      }
    })

    monaco.editor.defineTheme('lifescript-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '569cd6', fontStyle: 'bold' },
        { token: 'property', foreground: '9cdcfe' },
        { token: 'value', foreground: '4ec9b0' },
        { token: 'day', foreground: 'ce9178' },
        { token: 'string', foreground: 'ce9178' },
        { token: 'date', foreground: 'b5cea8' },
        { token: 'time', foreground: 'b5cea8' },
        { token: 'duration', foreground: 'b5cea8' },
        { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
      ],
      colors: {}
    })
  }

  return (
    <div className='flex-1 h-full'>
      <MonacoEditor
        height="100%"
        defaultLanguage="lifescript"
        theme="lifescript-theme"
        value={content}
        onChange={onContentChange}
        beforeMount={handleBeforeMount}
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