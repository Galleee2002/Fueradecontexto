import { cn } from '@/lib/utils/cn'

interface LoadingSkeletonProps {
  className?: string
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface rounded-none',
        className
      )}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <LoadingSkeleton className="aspect-[3/4] w-full" />
      <LoadingSkeleton className="h-3 w-1/3" />
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/4" />
    </div>
  )
}
