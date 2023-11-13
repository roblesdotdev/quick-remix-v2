export default function SignUpRoute() {
  return (
    <div className="container flex flex-col justify-center pb-32 pt-32">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Let's start the adventure!</h1>
        <p className="text-body-md text-muted-foreground mt-3">
          Please enter your email to continue.
        </p>
      </div>
      <div className="mx-auto mt-12 min-w-[368px] max-w-sm">
        <form>
          <input
            className="w-full rounded-lg border border-slate-400 px-3 py-4"
            type="email"
            placeholder="Enter your email..."
          />
        </form>
      </div>
    </div>
  )
}
