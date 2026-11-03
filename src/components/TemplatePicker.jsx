import TemplateCards from './TemplateCards'

// Lets clicks outside the cards reach the editor underneath, so the user can also just start typing.
function TemplatePicker({ onPick }) {
  return (
    <div className='absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 pointer-events-none'>
      <p className='text-gray-300'>Start from a template</p>
      <TemplateCards onPick={onPick} />
      <p className='text-sm text-gray-500'>or just start typing</p>
    </div>
  )
}

export default TemplatePicker
