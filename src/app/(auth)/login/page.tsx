export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow">
        <h1 className="mb-6 text-center text-2xl font-semibold">
          Sign in to your workspace
        </h1>

        <button className="mb-3 w-full rounded border px-4 py-2 text-sm hover:bg-gray-50">
          Continue with Google
        </button>

        <div className="my-4 flex items-center gap-2 text-xs text-gray-400">
          <div className="h-px flex-1 bg-gray-200" />
          OR
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <form className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded border px-3 py-2 text-sm"
          />

          <button className="w-full rounded bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
