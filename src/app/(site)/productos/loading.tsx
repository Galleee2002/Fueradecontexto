import { Container } from '@/shared/ui/layout/container'
import { LoadingSkeleton, ProductCardSkeleton } from '@/shared/ui/feedback/loading-skeleton'

const SKELETON_ITEMS = 8

export default function ProductsLoading() {
  return (
    <main className="pb-20 lg:pb-0">
      <Container>
        <section className="space-y-4 pt-10">
          <LoadingSkeleton className="h-3 w-28" />
          <LoadingSkeleton className="h-10 w-56" />
        </section>

        <div className="flex gap-8 py-8">
          <aside className="hidden w-64 shrink-0 space-y-4 lg:block">
            <LoadingSkeleton className="h-8 w-full" />
            <LoadingSkeleton className="h-8 w-full" />
            <LoadingSkeleton className="h-8 w-full" />
            <LoadingSkeleton className="h-8 w-full" />
          </aside>

          <section className="flex-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
                <ProductCardSkeleton key={`product-card-skeleton-${index}`} />
              ))}
            </div>
          </section>
        </div>
      </Container>
    </main>
  )
}
