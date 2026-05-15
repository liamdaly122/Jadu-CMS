import Link from "next/link";
import { logout } from "@/app/(admin)/login/actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="px-4 py-5 border-b border-slate-200 dark:border-slate-800">
          <Link href="/admin" className="font-semibold">
            Jadu-CMS
          </Link>
        </div>
        <nav className="px-2 py-3 text-sm">
          <ul className="space-y-1">
            <li>
              <Link
                href="/admin"
                className="block rounded px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/docs"
                className="block rounded px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Document Pages
              </Link>
            </li>
            <li>
              <Link
                href="/admin/categories"
                className="block rounded px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                href="/admin/trash"
                className="block rounded px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Trash
              </Link>
            </li>
          </ul>
        </nav>
        <form action={logout} className="mt-auto px-2 py-3">
          <button
            type="submit"
            className="block w-full text-left rounded px-3 py-2 text-sm text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Sign out
          </button>
        </form>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
