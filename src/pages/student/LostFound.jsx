import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, getCategoryColor, getStatusColor } from '@/lib/utils'
import { Search, Plus, Phone, Mail, MapPin, Calendar, Loader2, Trash2, Edit, Package } from 'lucide-react'

const categories = ['All', 'Electronics', 'Documents', 'Accessories', 'Books', 'Other']
const itemCategories = ['Electronics', 'Documents', 'Accessories', 'Books', 'Other']

// PostForm component - defined outside to prevent re-creation on every render
const PostForm = ({ formData, setFormData, onSubmit, submitText, submitting }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Type</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lost">Lost</SelectItem>
            <SelectItem value="found">Found</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {itemCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
    <div className="space-y-2">
      <Label>Item Name *</Label>
      <Input
        value={formData.itemName}
        onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
        placeholder="e.g., Blue Wallet, Student ID Card"
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Description *</Label>
      <Textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Describe the item in detail..."
        rows={3}
        required
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Where it was lost/found"
        />
      </div>
      <div className="space-y-2">
        <Label>Date</Label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label>Contact Information *</Label>
      <Input
        value={formData.contactInfo}
        onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
        placeholder="Phone number or email"
        required
      />
    </div>
    <DialogFooter>
      <Button type="submit" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : submitText}
      </Button>
    </DialogFooter>
  </form>
)

export default function StudentLostFound() {
  const [posts, setPosts] = useState([])
  const [myPosts, setMyPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('All')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: 'lost',
    itemName: '',
    description: '',
    category: 'Other',
    location: '',
    date: '',
    contactInfo: ''
  })

  useEffect(() => {
    fetchPosts()
    fetchMyPosts()
  }, [type, category])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (type !== 'all') params.append('type', type)
      if (category !== 'All') params.append('category', category)
      if (search) params.append('search', search)

      const response = await api.get(`/lostfound?${params}`)
      setPosts(response.data.data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyPosts = async () => {
    try {
      const response = await api.get('/lostfound/my-posts')
      setMyPosts(response.data.data || [])
    } catch (error) {
      console.error('Error fetching my posts:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchPosts()
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/lostfound', formData)
      toast.success('Post created successfully! It will be visible after admin approval.')
      setIsCreateOpen(false)
      setFormData({
        type: 'lost',
        itemName: '',
        description: '',
        category: 'Other',
        location: '',
        date: '',
        contactInfo: ''
      })
      fetchMyPosts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.put(`/lostfound/${editingPost._id}`, formData)
      toast.success('Post updated successfully!')
      setIsEditOpen(false)
      setEditingPost(null)
      fetchPosts()
      fetchMyPosts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update post')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/lostfound/${id}`)
      toast.success('Post deleted successfully!')
      fetchPosts()
      fetchMyPosts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete post')
    }
  }

  const handleMarkClaimed = async (id) => {
    try {
      await api.patch(`/lostfound/${id}/claim`)
      toast.success('Post marked as claimed!')
      fetchPosts()
      fetchMyPosts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark as claimed')
    }
  }

  const openEditDialog = (post) => {
    setEditingPost(post)
    setFormData({
      type: post.type,
      itemName: post.itemName,
      description: post.description,
      category: post.category,
      location: post.location || '',
      date: post.date ? post.date.split('T')[0] : '',
      contactInfo: post.contactInfo
    })
    setIsEditOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lost & Found</h1>
          <p className="text-muted-foreground mt-1">
            Report lost items or help others find theirs
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Report Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Report Lost or Found Item</DialogTitle>
              <DialogDescription>
                Your post will be reviewed before being published.
              </DialogDescription>
            </DialogHeader>
            <PostForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreate}
              submitText="Submit Report"
              submitting={submitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="browse">
        <TabsList>
          <TabsTrigger value="browse">Browse Posts</TabsTrigger>
          <TabsTrigger value="my-posts">My Posts ({myPosts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
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

          {/* Posts Grid */}
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card key={post._id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {post.type === 'lost' ? 'Lost' : 'Found'}
                      </Badge>
                      <Badge variant="secondary" className={getCategoryColor(post.category)}>
                        {post.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{post.itemName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {post.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      {post.location && (
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          {post.location}
                        </div>
                      )}
                      {post.date && (
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(post.date)}
                        </div>
                      )}
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        {post.contactInfo}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No posts found</h3>
                <p className="text-muted-foreground">
                  No lost or found items match your search criteria
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="my-posts" className="space-y-6">
          {myPosts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myPosts.map((post) => (
                <Card key={post._id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {post.type === 'lost' ? 'Lost' : 'Found'}
                      </Badge>
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{post.itemName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {post.description}
                    </p>
                    <div className="flex gap-2">
                      {post.status === 'approved' && (
                        <Button size="sm" variant="outline" onClick={() => handleMarkClaimed(post._id)}>
                          Mark Claimed
                        </Button>
                      )}
                      {post.status !== 'claimed' && (
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(post)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No posts yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't reported any lost or found items
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Report Item
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Update your lost/found item details.
            </DialogDescription>
          </DialogHeader>
          <PostForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdate}
            submitText="Update Post"
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

