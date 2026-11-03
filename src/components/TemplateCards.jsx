import { templates } from '../templates'

function TemplateCards({ onPick, vertical = false }) {
  return (
    <div className={vertical ? 'flex flex-col gap-2' : 'flex flex-wrap justify-center gap-4'}>
      {templates.map(template => (
        <button
          key={template.id}
          onClick={() => onPick(template)}
          className={`pointer-events-auto text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-lg p-4 ${vertical ? 'w-full' : 'w-56'}`}
        >
          <p className='font-semibold'>{template.icon} {template.title}</p>
          <p className='text-sm text-gray-400 mt-1'>{template.description}</p>
        </button>
      ))}
    </div>
  )
}

export default TemplateCards
