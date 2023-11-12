import { type MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <h1 className="font-bold text-2xl">Welcome to Remix</h1>
    </div>
  )
}
