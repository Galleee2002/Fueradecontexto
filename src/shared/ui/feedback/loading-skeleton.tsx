import { cn } from '@/shared/lib/cn'

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
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.35rem] border border-border/80 bg-surface shadow-[0_14px_40px_rgba(18,24,32,0.05)]">
      <LoadingSkeleton className="aspect-[3/4] w-full shrink-0" />
      <div className="flex min-h-[10.5rem] flex-1 flex-col gap-3 border-t border-border/70 px-4 pb-4 pt-4 sm:min-h-[11rem] sm:px-5 sm:pb-5 sm:pt-5">
        <LoadingSkeleton className="h-[2.625rem] w-[85%] sm:h-[2.75rem]" />
        <LoadingSkeleton className="h-3 w-full" />
        <LoadingSkeleton className="h-3 w-[92%]" />
        <LoadingSkeleton className="h-5 w-20" />
        <div className="flex justify-center">
          <LoadingSkeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>
    </div>
  )
}
