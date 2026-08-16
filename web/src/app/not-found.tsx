import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center justify-center py-32 text-center">
      <p className="text-6xl font-extrabold text-gradient">404</p>
      <h1 className="mt-4 text-2xl font-bold">页面走丢了</h1>
      <p className="mt-2 text-stone-500 dark:text-stone-400">
        这个页面可能被移到别处了，或者根本不存在。
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-gradient-to-r from-forest-600 to-forest-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-forest-800/20 transition hover:opacity-90"
      >
        回到首页
      </Link>
    </div>
  );
}
