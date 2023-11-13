import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import { cssBundleHref } from '@remix-run/css-bundle'
import {
  type DataFunctionArgs,
  json,
  type LinksFunction,
} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
} from '@remix-run/react'
import { z } from 'zod'
import tailwindStylesHref from '~/styles/tailwind.css'
import { GeneralErrorBoundary } from './components/error-boundary'
import { ErrorList } from './components/forms'
import { invariantResponse } from './utils/misc'
import { type Theme, getTheme, setTheme } from './utils/theme.server'

export async function loader({ request }: DataFunctionArgs) {
  return json({
    theme: getTheme(request),
  })
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindStylesHref },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

const ThemeFormSchema = z.object({
  theme: z.enum(['light', 'dark']),
})

export async function action({ request }: DataFunctionArgs) {
  const formData = await request.formData()
  invariantResponse(formData.get('intent') === 'update-theme', 'Invalid intent')
  const submission = parse(formData, {
    schema: ThemeFormSchema,
  })
  if (submission.intent !== 'submit') {
    return json({ status: 'success', submission } as const)
  }
  if (!submission.value) {
    return json({ status: 'error', submission } as const, { status: 400 })
  }

  const { theme } = submission.value

  const responseInit = {
    headers: {
      'set-cookie': setTheme(theme),
    },
  }

  return json({ success: true, submission }, responseInit)
}

function Document({
  children,
  theme,
}: {
  children: React.ReactNode
  theme?: Theme
}) {
  return (
    <html lang="en" className={`${theme} h-full overflow-x-hidden`}>
      <head>
        <Meta />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Links />
      </head>
      <body className="flex h-full flex-col bg-canvas text-fg">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  const { theme } = useLoaderData<typeof loader>()

  return (
    <Document theme={theme}>
      <div className="flex-1">
        <Outlet />
      </div>
      <div className="container mx-auto flex justify-between">
        <p>Built with ♥️ by robledotdev</p>
        <ThemeSwitch userPreference={theme} />
      </div>
      <div className="h-5" />
    </Document>
  )
}

function ThemeSwitch({ userPreference }: { userPreference?: Theme }) {
  const fetcher = useFetcher<typeof action>()

  const [form] = useForm({
    id: 'theme-switch',
    lastSubmission: fetcher.data?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: ThemeFormSchema })
    },
  })

  const mode = userPreference ?? 'dark'
  const nextMode = mode === 'light' ? 'dark' : 'light'

  return (
    <fetcher.Form {...form.props} method="POST">
      <input type="hidden" name="theme" value={nextMode} />
      <div className="flex gap-2">
        <button
          name="intent"
          value="update-theme"
          type="submit"
          className="flex h-8 w-8 cursor-pointer items-center justify-center"
        >
          {nextMode}
        </button>
      </div>
      <ErrorList errors={form.errors} id={form.errorId} />
    </fetcher.Form>
  )
}

export function ErrorBoundary() {
  return (
    <Document>
      <GeneralErrorBoundary />
    </Document>
  )
}
