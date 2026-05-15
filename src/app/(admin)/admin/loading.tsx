export default function Loading() {
  return (
    <div className="p-8 max-w-6xl mx-auto animate-pulse">
      <div className="h-7 w-40 bg-slate-200 dark:bg-slate-800 rounded mb-6" />
      <div className="space-y-3">
        <div className="h-12 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800" />
        <div className="h-12 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800" />
        <div className="h-12 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800" />
      </div>
    </div>
  );
}
