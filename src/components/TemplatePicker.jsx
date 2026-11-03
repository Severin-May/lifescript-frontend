import { templates } from '../templates'

// Lets clicks outside the cards reach the editor underneath, so the user can also just start typing.
function TemplatePicker({ onPick }) {
  return (
    <div className='absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 pointer-events-none'>
      <p className='text-gray-300'>Start from a template</p>
      <div className='flex flex-wrap justify-center gap-4'>
        {templates.map(template => (
          <button
            key={template.id}
            onClick={() => onPick(template)}
            className='pointer-events-auto w-56 text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-lg p-4'
          >
            <p className='font-semibold'>{template.icon} {template.title}</p>
            <p className='text-sm text-gray-400 mt-1'>{template.description}</p>
          </button>
        ))}
      </div>
      <p className='text-sm text-gray-500'>or just start typing</p>
    </div>
  )
}

export default TemplatePicker
