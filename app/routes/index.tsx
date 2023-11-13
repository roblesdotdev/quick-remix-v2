import { type MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [
    { title: 'Quick Remix' },
    { name: 'description', content: 'Remix.run template.' },
  ]
}

export default function Index() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Welcome to Remix</h1>
      <p className="text-muted-fg mt-3 text-lg">Remix Template</p>
    </div>
  )
}
