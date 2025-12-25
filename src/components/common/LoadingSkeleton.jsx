import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export const CardSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
  </Card>
)

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    <Skeleton className="h-10 w-full" />
    {Array(rows).fill(0).map((_, i) => (
      <Skeleton key={i} className="h-16 w-full" />
    ))}
  </div>
)

export const StatCardSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </CardContent>
  </Card>
)

export const PageSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6).fill(0).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
)

const fetchNotices = async (page = 1) => {
  setLoading(true)
  const startTime = Date.now()
  
  try {
    // ... your API call
  } finally {
    const elapsed = Date.now() - startTime
    const minDelay = Math.max(0, 300 - elapsed)
    setTimeout(() => setLoading(false), minDelay)
  }
}

export default { CardSkeleton, TableSkeleton, StatCardSkeleton, PageSkeleton }

