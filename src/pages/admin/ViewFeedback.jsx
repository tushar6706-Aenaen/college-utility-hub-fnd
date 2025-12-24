import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate, timeAgo, getCategoryColor, getStatusColor } from '@/lib/utils'
import { Search, CheckCircle, MessageSquare, User, Clock, Eye } from 'lucide-react'

const categories = ['All', 'Facilities', 'Services', 'Academic', 'Infrastructure', 'Other']
const statuses = ['All', 'pending', 'resolved']

export default function ViewFeedback() {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [pagination, setPagination] = useState({ current: 1, total: 1 })

  useEffect(() => {
    fetchFeedback()
  }, [category, status])

  const fetchFeedback = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page)
      params.append('limit', 10)
      if (category !== 'All') params.append('category', category)
      if (status !== 'All') params.append('status', status)
      if (search) params.append('search', search)

      const response = await api.get(`/feedback?${params}`)
      setFeedback(response.data.data.feedback || [])
      setPagination(response.data.data.pagination || { current: 1, total: 1 })
    } catch (error) {
      console.error('Error fetching feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchFeedback()
  }

  const handleResolve = async (id) => {
    try {
      await api.patch(`/feedback/${id}/resolve`)
      toast.success('Feedback marked as resolved!')
      fetchFeedback()
      if (selectedFeedback?._id === id) {
        setSelectedFeedback({ ...selectedFeedback, status: 'resolved' })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resolve feedback')
    }
  }

  const pendingFeedback = feedback.filter(f => f.status === 'pending')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
        <p className="text-muted-foreground mt-1">
          View and manage student feedback submissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Feedback</p>
                <p className="text-2xl font-bold">{pagination.count || feedback.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingFeedback.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{feedback.filter(f => f.status === 'resolved').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Feedback</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingFeedback.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search feedback..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>{s === 'All' ? 'All Status' : s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit">Search</Button>
              </form>
            </CardContent>
          </Card>

          {/* Feedback Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : feedback.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedback.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {item.subject}
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.isAnonymous ? (
                            <span className="text-muted-foreground italic">Anonymous</span>
                          ) : (
                            item.submittedBy?.name || 'Unknown'
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {timeAgo(item.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedFeedback(item)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {item.status === 'pending' && (
                              <Button size="sm" onClick={() => handleResolve(item._id)}>
                                <CheckCircle className="h-4 w-4 mr-1" /> Resolve
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No feedback found</h3>
                  <p className="text-muted-foreground">No feedback matches your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {/* Pending Feedback Cards */}
          {pendingFeedback.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingFeedback.map((item) => (
                <Card key={item._id} className="border-yellow-200 bg-yellow-50/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                      <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{item.subject}</CardTitle>
                    <CardDescription>
                      {item.isAnonymous ? (
                        <span className="italic">Anonymous submission</span>
                      ) : (
                        <>Submitted by {item.submittedBy?.name}</>
                      )}
                      {' • '}{timeAgo(item.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {item.message}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedFeedback(item)}>
                        <Eye className="h-4 w-4 mr-1" /> View Details
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => handleResolve(item._id)}>
                        <CheckCircle className="h-4 w-4 mr-1" /> Mark Resolved
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">All caught up!</h3>
                <p className="text-muted-foreground">No pending feedback to review</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {pagination.total > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={pagination.current === 1}
            onClick={() => fetchFeedback(pagination.current - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {pagination.current} of {pagination.total}
          </span>
          <Button
            variant="outline"
            disabled={pagination.current === pagination.total}
            onClick={() => fetchFeedback(pagination.current + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Feedback Detail Modal */}
      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-lg">
          {selectedFeedback && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getCategoryColor(selectedFeedback.category)}>
                    {selectedFeedback.category}
                  </Badge>
                  <Badge className={getStatusColor(selectedFeedback.status)}>
                    {selectedFeedback.status}
                  </Badge>
                  {selectedFeedback.isAnonymous && (
                    <Badge variant="outline">Anonymous</Badge>
                  )}
                </div>
                <DialogTitle>{selectedFeedback.subject}</DialogTitle>
                <DialogDescription>
                  {selectedFeedback.isAnonymous ? (
                    'Anonymous submission'
                  ) : (
                    <>Submitted by {selectedFeedback.submittedBy?.name} ({selectedFeedback.submittedBy?.email})</>
                  )}
                  {' • '}{formatDate(selectedFeedback.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <p className="text-sm font-medium mb-2">Message</p>
                  <div className="bg-gray-50 rounded-md p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedFeedback.message}</p>
                  </div>
                </div>
                {selectedFeedback.status === 'pending' && (
                  <Button className="w-full" onClick={() => handleResolve(selectedFeedback._id)}>
                    <CheckCircle className="h-4 w-4 mr-2" /> Mark as Resolved
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

