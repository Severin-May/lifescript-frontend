const svgProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true
}

export function FilesIcon() {
  return (
    <svg {...svgProps}>
      <path d='M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z' />
      <path d='M14 3v5h5' />
    </svg>
  )
}

export function BookIcon() {
  return (
    <svg {...svgProps}>
      <path d='M4 19.5V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2' />
      <path d='M4 19.5A2 2 0 0 0 6 21h14' />
      <path d='M9 7h7M9 11h5' />
    </svg>
  )
}
