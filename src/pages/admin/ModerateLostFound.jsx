import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate, getCategoryColor, getStatusColor } from '@/lib/utils'
import { Search, CheckCircle, XCircle, Eye, Trash2, Package, MapPin, Phone, Calendar } from 'lucide-react'

const categories = ['All', 'Electronics', 'Documents', 'Accessories', 'Books', 'Other']
const statuses = ['All', 'pending', 'approved', 'rejected', 'claimed']

export default function ModerateLostFound() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [selectedPost, setSelectedPost] = useState(null)
  const [pagination, setPagination] = useState({ current: 1, total: 1 })

  useEffect(() => {
    fetchPosts()
  }, [type, category, status])

  const fetchPosts = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page)
      params.append('limit', 10)
      if (type !== 'all') params.append('type', type)
      if (category !== 'All') params.append('category', category)
      if (status !== 'All') params.append('status', status)
      if (search) params.append('search', search)

      const response = await api.get(`/lostfound/all?${params}`)
      setPosts(response.data.data.posts || [])
      setPagination(response.data.data.pagination || { current: 1, total: 1 })
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchPosts()
  }

  const handleApprove = async (id) => {
    try {
      await api.patch(`/lostfound/${id}/approve`)
      toast.success('Post approved successfully!')
      fetchPosts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve post')
    }
  }

  const handleReject = async (id) => {
    try {
      await api.patch(`/lostfound/${id}/reject`)
      toast.success('Post rejected!')
      fetchPosts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject post')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/lostfound/${id}`)
      toast.success('Post deleted successfully!')
      fetchPosts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete post')
    }
  }

  const pendingPosts = posts.filter(p => p.status === 'pending')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Moderate Lost & Found</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve student submissions
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingPosts.length})
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
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                    <SelectItem value="found">Found</SelectItem>
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
                <Button type="submit">Search</Button>
              </form>
            </CardContent>
          </Card>

          {/* Posts Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : posts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Posted By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post._id}>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {post.itemName}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            {post.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(post.category)}>
                            {post.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{post.postedBy?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(post.status)}>
                            {post.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedPost(post)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {post.status === 'pending' && (
                              <>
                                <Button size="sm" variant="default" onClick={() => handleApprove(post._id)}>
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleReject(post._id)}>
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this post? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(post._id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No posts found</h3>
                  <p className="text-muted-foreground">No lost & found posts match your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {/* Pending Posts */}
          {pendingPosts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingPosts.map((post) => (
                <Card key={post._id} className="border-yellow-200 bg-yellow-50/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {post.type}
                      </Badge>
                      <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{post.itemName}</CardTitle>
                    <CardDescription>Posted by {post.postedBy?.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {post.description}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" onClick={() => handleApprove(post._id)}>
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleReject(post._id)}>
                        <XCircle className="h-4 w-4 mr-1" /> Reject
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
                <p className="text-muted-foreground">No pending posts to review</p>
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
            onClick={() => fetchPosts(pagination.current - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {pagination.current} of {pagination.total}
          </span>
          <Button
            variant="outline"
            disabled={pagination.current === pagination.total}
            onClick={() => fetchPosts(pagination.current + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Post Detail Modal */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-lg">
          {selectedPost && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {selectedPost.type}
                  </Badge>
                  <Badge className={getCategoryColor(selectedPost.category)}>
                    {selectedPost.category}
                  </Badge>
                  <Badge className={getStatusColor(selectedPost.status)}>
                    {selectedPost.status}
                  </Badge>
                </div>
                <DialogTitle>{selectedPost.itemName}</DialogTitle>
                <DialogDescription>
                  Posted by {selectedPost.postedBy?.name} ({selectedPost.postedBy?.email})
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <p className="text-sm font-medium mb-1">Description</p>
                  <p className="text-gray-700">{selectedPost.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedPost.location && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {selectedPost.location}
                    </div>
                  )}
                  {selectedPost.date && (
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(selectedPost.date)}
                    </div>
                  )}
                  <div className="flex items-center text-muted-foreground col-span-2">
                    <Phone className="h-4 w-4 mr-2" />
                    {selectedPost.contactInfo}
                  </div>
                </div>
                {selectedPost.status === 'pending' && (
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1" onClick={() => { handleApprove(selectedPost._id); setSelectedPost(null); }}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={() => { handleReject(selectedPost._id); setSelectedPost(null); }}>
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

