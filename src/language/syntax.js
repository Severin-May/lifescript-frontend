import { KEYWORDS, PROPERTIES, VALUES, DAYS } from './keywords'

// Monarch tokenizer: decides how each piece of text is colored.
export const tokenizer = {
  ignoreCase: true,
  unicode: true,
  keywords: KEYWORDS,
  properties: PROPERTIES,
  values: VALUES,
  days: DAYS,
  tokenizer: {
    root: [
      [/[0-9]{4}-[0-9]{2}-[0-9]{2}/, 'date'],
      [/[0-9]{2}:[0-9]{2}/, 'time'],
      [/[0-9]+h([0-9]+m)?|[0-9]+m/, 'duration'],
      [/"[^"]*"/, 'string'],
      [/#.*$/, 'comment'],
      // Names: letters of any language, like the backend's IDENTIFIER.
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
}

export const theme = {
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
    { token: 'comment', foreground: '6a9955', fontStyle: 'italic' }
  ],
  colors: {
    'editorLightBulb.foreground': '#FFCC00',
    'editorLightBulbAutoFix.foreground': '#FFCC00'
  }
}
