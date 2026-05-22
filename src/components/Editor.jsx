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

    // hover documentation
    monaco.languages.registerHoverProvider('lifescript', {
      provideHover: (model, position) => {
        const word = model.getWordAtPosition(position)
        if (!word) return null

        const docs = {
          'plan': '**plan**\n\nTop-level block that defines your weekly schedule.\n\n**Required:** `period`, `tasks`',
          'period': '**period**\n\nDefines the date range of the plan.\n\n**Format:** `period: YYYY-MM-DD to YYYY-MM-DD`',
          'settings': '**settings**\n\nCustomize default time ranges for named periods.\n\n**Example:** `morning: 06:00-12:00`',
          'availability': '**availability**\n\nDefines when you are available for scheduling.\n\n**Options:** `off`, `flexible`, time ranges, named periods',
          'task': '**task**\n\nDefines a schedulable activity.\n\n**Required:** `duration`, `priority`, `effort`\n\n**Optional:** `deadline`, `start`, `repeats`, `dependencies`, `note`',
          'routine': '**routine**\n\nDefines a fixed block of activities.\n\n**Required:** `time`, `activities`\n\n**Optional:** `repeats`',
          'duration': '**duration**\n\nHow long the task takes.\n\n**Format:** `2h`, `30m`, `1h30m`',
          'priority': '**priority**\n\nHow important the task is.\n\n**Values:** `critical`, `high`, `medium`, `low`',
          'effort': '**effort**\n\nHow much mental energy the task requires.\n\n**Values:** `high`, `moderate`, `low`',
          'deadline': '**deadline**\n\nWhen the task must be completed by.\n\n**Format:** `YYYY-MM-DD` or day name',
          'start': '**start**\n\nPins the task to a specific start time.\n\n**Format:** `HH:MM`',
          'repeats': '**repeats**\n\nHow often the task or routine recurs.\n\n**Values:** `daily`, `weekdays`, `weekends`, or day names',
          'dependencies': '**dependencies**\n\nTasks that must be completed before this one.\n\n**Format:** `"Task A", "Task B"`',
          'note': '**note**\n\nFree text annotation for the task.\n\n**Format:** `"your note here"`',
          'energy': '**energy profile**\n\nDefines your energy levels throughout the day.',
          'daily': '**daily**\n\nRepeats every day of the period.',
          'weekdays': '**weekdays**\n\nRepeats Monday through Friday.',
          'weekends': '**weekends**\n\nRepeats Saturday and Sunday.',
          'off': '**off**\n\nMarks the entire day as unavailable.',
          'flexible': '**flexible**\n\nAvailable any time during the day (default: 08:00-18:00).',
          'morning': '**morning**\n\nNamed time period (default: 08:00-12:00). Customizable in `settings`.',
          'afternoon': '**afternoon**\n\nNamed time period (default: 12:00-17:00). Customizable in `settings`.',
          'evening': '**evening**\n\nNamed time period (default: 17:00-21:00). Customizable in `settings`.',
        }

        const doc = docs[word.word]
        if (!doc) return null

        return {
          contents: [{ value: doc }]
        }
      }
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