// ids are the values the backend expects in the compile request's `algorithm` field
export const schedulers = [
  { id: 'greedy', label: 'Greedy', description: 'Places tasks one by one. Answers instantly.' },
  { id: 'csp', label: 'CSP', description: 'Solves all tasks together; usually places more important tasks. Can take a few seconds.' },
  { id: 'hybrid', label: 'Hybrid', description: "Starts from greedy's schedule and improves it with CSP. Never worse than greedy." }
]

export const defaultScheduler = 'greedy'
