import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, timeAgo, getCategoryColor, isNew } from '@/lib/utils'
import { Search, Bell, Filter, X } from 'lucide-react'

const categories = ['All', 'Academic', 'Events', 'General', 'Urgent', 'Exam']

export default function StudentNotices() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedNotice, setSelectedNotice] = useState(null)
  const [pagination, setPagination] = useState({ current: 1, total: 1 })

  useEffect(() => {
    fetchNotices()
  }, [category])

  const fetchNotices = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page)
      params.append('limit', 12)
      if (category !== 'All') params.append('category', category)
      if (search) params.append('search', search)

      const response = await api.get(`/notices?${params}`)
      setNotices(response.data.data.notices || [])
      setPagination(response.data.data.pagination || { current: 1, total: 1 })
    } catch (error) {
      console.error('Error fetching notices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchNotices()
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('All')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-200">Notice Board</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with all college announcements
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" variant="outline">Search</Button>
            {(search || category !== 'All') && (
              <Button type="button" variant="ghost" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Notices Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
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
          ))}
        </div>
      ) : notices.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => (
              <Card
                key={notice._id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  notice.category === 'Urgent' ? 'border-red-200 bg-red-50/50' : ''
                }`}
                onClick={() => setSelectedNotice(notice)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {isNew(notice.createdAt) && (
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                      )}
                      <Badge className={getCategoryColor(notice.category)}>
                        {notice.category}
                      </Badge>
                    </div>
                    {notice.category === 'Urgent' && (
                      <Bell className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <CardTitle className="text-base font-medium mt-2 line-clamp-2">{notice.title}</CardTitle>
                  <CardDescription>{timeAgo(notice.createdAt)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {notice.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.total > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={pagination.current === 1}
                onClick={() => fetchNotices(pagination.current - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {pagination.current} of {pagination.total}
              </span>
              <Button
                variant="outline"
                disabled={pagination.current === pagination.total}
                onClick={() => fetchNotices(pagination.current + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No notices found</h3>
            <p className="text-muted-foreground">
              {search || category !== 'All'
                ? 'Try adjusting your filters'
                : 'Check back later for new announcements'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notice Detail Modal */}
      <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
        <DialogContent className="max-w-2xl">
          {selectedNotice && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getCategoryColor(selectedNotice.category)}>
                    {selectedNotice.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(selectedNotice.createdAt)}
                  </span>
                </div>
                <DialogTitle className="text-xl">{selectedNotice.title}</DialogTitle>
                <DialogDescription>
                  Posted by {selectedNotice.postedBy?.name || 'Admin'}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedNotice.description}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

