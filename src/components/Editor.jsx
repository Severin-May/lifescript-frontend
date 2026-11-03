import MonacoEditor from '@monaco-editor/react'
import { useRef, useEffect } from 'react'

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

    const markers = (output?.diagnostics ?? [])
      .filter(d => d.startLineNumber > 0)
      .map(d => ({
        startLineNumber: d.startLineNumber,
        startColumn: d.startColumn,
        endLineNumber: d.endLineNumber,
        endColumn: d.endColumn,
        message: d.message,
        severity: monaco.MarkerSeverity.Error
      }))

    monaco.editor.setModelMarkers(model, 'lifescript', markers)
  }, [output, editorRef])

  const handleBeforeMount = (monaco) => {
    monaco.languages.register({ id: 'lifescript' })

    monaco.languages.setMonarchTokensProvider('lifescript', {
      ignoreCase: true,
      unicode: true,
      keywords: [
        'plan', 'period', 'settings', 'availability', 'energy', 'profile', 'default',
        'routines', 'routine', 'activities', 'tasks', 'task', 'events', 'event'
      ],
      properties: [
        'duration', 'priority', 'effort', 'deadline', 'repeats',
        'dependencies', 'note', 'time', 'date'
      ],
      values: [
        'high', 'moderate', 'low', 'critical', 'medium',
        'morning', 'afternoon', 'evening', 'flexible',
        'daily', 'weekdays', 'weekends', 'to'
      ],
      days: [
        'monday', 'tuesday', 'wednesday', 'thursday',
        'friday', 'saturday', 'sunday'
      ],
      tokenizer: {
        root: [
          [/[0-9]{4}-[0-9]{2}-[0-9]{2}/, 'date'],
          [/[0-9]{2}:[0-9]{2}/, 'time'],
          [/[0-9]+h([0-9]+m)?|[0-9]+m/, 'duration'],
          [/"[^"]*"/, 'string'],
          [/#.*$/, 'comment'],
          [/[\p{L}_][\p{L}\p{M}\p{N}_]*/, {
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

        const energyDoc = '**energy profile**\n\nHow much energy you have during the day, so demanding tasks go where your energy is high.\n\n**Example:**\n```\nenergy profile:\n  default:\n    morning: high\n    evening: low\n  friday:\n    afternoon: low\n```'
        const routineDoc = '**routine**\n\nA fixed block of activities that repeats.\n\n**Required:** `time` (start time), `repeats`, `activities`'
        const taskDoc = '**task**\n\nSomething to get done; the scheduler finds a time for it.\n\n**Required:** `duration`, `priority`, `effort`\n\n**Optional:** `deadline`, `repeats`, `dependencies`, `note`'
        const eventDoc = '**event**\n\nA one-off appointment at a fixed date and time.\n\n**Required:** `date`, `time`\n\n**Optional:** `note`'
        const levelDoc = '**high / moderate / low**\n\nAn energy level (in `energy profile`) or how demanding a task is (`effort`). `high` and `low` are also priorities.'

        const docs = {
          'plan': '**plan**\n\nThe start of every plan: `plan: <name>`, followed by `period`.\n\n**Sections (optional):** `settings`, `availability`, `energy profile`, `routines`, `tasks`, `events`',
          'period': '**period**\n\nThe days the plan covers: 1 to 7 days, not in the past.\n\n**Format:** `period: YYYY-MM-DD to YYYY-MM-DD`',
          'settings': '**settings**\n\nChanges the times of the named periods.\n\n**Example:** `morning: 08:00-12:00`',
          'availability': '**availability**\n\nWhen you are free, per day: `flexible`, named periods or time ranges.\n\n**Example:** `tuesday: 09:00-12:00, 14:00-18:00`\n\nDays outside the period are ignored.',
          'energy': energyDoc,
          'profile': energyDoc,
          'default': '**default**\n\nThe energy levels for every day. A day\'s own entries win where they overlap; times nobody covers count as `moderate`.',
          'routines': routineDoc,
          'routine': routineDoc,
          'activities': '**activities**\n\nWhat the routine consists of, one per line: `name: duration`. The routine lasts as long as they add up to.',
          'tasks': taskDoc,
          'task': taskDoc,
          'events': eventDoc,
          'event': eventDoc,
          'duration': '**duration**\n\nHow long the task takes: more than 0, at most 24h.\n\n**Format:** `2h`, `90m`, `1h30m`',
          'priority': '**priority**\n\nHow important the task is.\n\n**Values:** `critical`, `high`, `medium`, `low`',
          'effort': '**effort**\n\nHow much energy the task needs; matched against your `energy profile`.\n\n**Values:** `high`, `moderate`, `low`',
          'deadline': '**deadline**\n\nWhen the task must be done by: date and time.\n\n**Format:** `deadline: 2026-11-10 17:00`',
          'repeats': '**repeats**\n\nWhich days of the period it happens on.\n\n**Values:** `daily`, `weekdays`, `weekends`, or days like `monday, wednesday`',
          'dependencies': '**dependencies**\n\nTasks that must be done before this one.\n\n**Format:** `dependencies: research, write_report`',
          'note': '**note**\n\nYour own remark on a task or event, shown with it in the schedule.\n\n**Format:** `note: "bring insurance card"`',
          'time': '**time**\n\nIn a routine: the start time, `time: 07:00`.\n\nIn an event: a time range or named period, `time: 14:00-15:00` or `time: afternoon`.',
          'date': '**date**\n\nThe day of the event.\n\n**Format:** `date: YYYY-MM-DD`',
          'daily': '**daily**\n\nEvery day of the period.',
          'weekdays': '**weekdays**\n\nMonday to Friday.',
          'weekends': '**weekends**\n\nSaturday and Sunday.',
          'flexible': '**flexible**\n\nAvailable from the start of `morning` to the end of `evening` (default 06:00-22:00).',
          'morning': '**morning**\n\nNamed period, default 06:00-12:00. Change it in `settings`.',
          'afternoon': '**afternoon**\n\nNamed period, default 12:00-18:00. Change it in `settings`.',
          'evening': '**evening**\n\nNamed period, default 18:00-22:00. Change it in `settings`.',
          'high': levelDoc,
          'moderate': levelDoc,
          'low': levelDoc,
          'critical': '**critical**\n\nThe highest priority.',
          'medium': '**medium**\n\nA priority between `high` and `low`.',
        }

        const doc = docs[word.word.toLowerCase()]
        if (!doc) return null

        return {
          contents: [{ value: doc }]
        }
      }
    })
  }

  return (
    <div className='w-full h-full'>
      <MonacoEditor
        height="100%"
        defaultLanguage="lifescript"
        theme="lifescript-theme"
        value={content}
        onChange={onContentChange}
        beforeMount={handleBeforeMount}
        onMount={handleEditorMount}
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