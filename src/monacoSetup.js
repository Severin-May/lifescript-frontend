import { loader } from '@monaco-editor/react'
// Core editor only: LifeScript is the only language, so Monaco's bundled languages are left out.
import * as monaco from 'monaco-editor/esm/vs/editor/edcore.main'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

self.MonacoEnvironment = {
  getWorker: () => new EditorWorker(),
}

loader.config({ monaco })
