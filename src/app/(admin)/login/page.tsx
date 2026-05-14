import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next = "/admin", error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        action={login}
        className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <h1 className="text-xl font-semibold mb-1">Jadu-CMS</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Enter the password to continue.
        </p>

        <input type="hidden" name="next" value={next} />

        <label className="block text-sm font-medium mb-1" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
        />

        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            Wrong password.
          </p>
        )}

        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
