import { tokenizer, theme } from './syntax'
import { languageConfiguration, keybindingRules } from './editing'
import { completionProvider } from './completion'
import { hoverDoc } from './hoverDocs'
import { quickFixProvider } from './quickFixes'

export const LANGUAGE_ID = 'lifescript'
export const THEME_ID = 'lifescript-theme'

// Monaco keeps providers globally; without disposing, each remount or hot reload would add duplicates.
let registered = []

export function registerLifeScript(monaco) {
  registered.forEach(disposable => disposable.dispose())

  monaco.languages.register({ id: LANGUAGE_ID })
  monaco.editor.defineTheme(THEME_ID, theme)

  registered = [
    monaco.languages.setMonarchTokensProvider(LANGUAGE_ID, tokenizer),
    monaco.languages.setLanguageConfiguration(LANGUAGE_ID, languageConfiguration(monaco)),
    monaco.editor.addKeybindingRules(keybindingRules(monaco)),
    monaco.languages.registerCompletionItemProvider(LANGUAGE_ID, completionProvider(monaco)),
    monaco.languages.registerCodeActionProvider(LANGUAGE_ID, quickFixProvider(monaco), {
      providedCodeActionKinds: ['quickfix']
    }),
    monaco.languages.registerHoverProvider(LANGUAGE_ID, {
      provideHover: (model, position) => {
        const word = model.getWordAtPosition(position)
        const doc = word && hoverDoc(word.word)
        return doc ? { contents: [{ value: doc }] } : null
      }
    })
  ]
}
