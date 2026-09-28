export default function NavbarSkeleton() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />

          <div className="space-y-1.5">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-2 w-14 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Navigation Skeleton */}
        <div className="hidden items-center gap-9 md:flex">
          <div className="h-4 w-14 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-14 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Right Side Skeleton */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200" />

          {/* Profile */}
          <div className="flex h-11 w-32 items-center gap-3 rounded-xl border border-gray-200 px-3">
            <div className="h-7 w-7 animate-pulse rounded-lg bg-gray-200" />

            <div className="h-3 w-14 animate-pulse rounded bg-gray-200" />

            <div className="ml-auto h-3 w-3 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </nav>
  );
}
