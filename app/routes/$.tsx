import { Link, useLocation } from '@remix-run/react'
import { GeneralErrorBoundary } from '~/components/error-boundary'

export async function loader() {
  throw new Response('Not found', { status: 404 })
}

export default function NotFound() {
  // due to the loader, this component will never be rendered, but we'll return
  // the error boundary just in case.
  return <ErrorBoundary />
}

export function ErrorBoundary() {
  const location = useLocation()
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: () => (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="text-2xl font-bold">We can't find this page</h1>
              <pre className="whitespace-pre-wrap break-all text-lg">
                {location.pathname}
              </pre>
            </div>
            <Link to="/" className="text-lg underline">
              Back to home
            </Link>
          </div>
        ),
      }}
    />
  )
}
