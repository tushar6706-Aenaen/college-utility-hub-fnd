import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, getCategoryColor } from '@/lib/utils'
import { Plus, Search, Edit, Trash2, Loader2, Bell } from 'lucide-react'

const categories = ['Academic', 'Events', 'General', 'Urgent', 'Exam']

// NoticeForm component - defined outside to prevent re-creation on every render
const NoticeForm = ({ formData, setFormData, onSubmit, submitText, submitting }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <Label>Title *</Label>
      <Input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Notice title"
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Category</Label>
      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label>Description *</Label>
      <Textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Notice content..."
        rows={5}
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Expiry Date (optional)</Label>
      <Input
        type="date"
        value={formData.expiryDate}
        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
      />
    </div>
    <DialogFooter>
      <Button type="submit" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : submitText}
      </Button>
    </DialogFooter>
  </form>
)

export default function ManageNotices() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, total: 1 })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    isActive: true,
    expiryDate: ''
  })

  useEffect(() => {
    fetchNotices()
  }, [category])

  const fetchNotices = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page)
      params.append('limit', 10)
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

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/notices', formData)
      toast.success('Notice created successfully!')
      setIsCreateOpen(false)
      resetForm()
      fetchNotices()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create notice')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.put(`/notices/${editingNotice._id}`, formData)
      toast.success('Notice updated successfully!')
      setIsEditOpen(false)
      setEditingNotice(null)
      resetForm()
      fetchNotices()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update notice')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notices/${id}`)
      toast.success('Notice deleted successfully!')
      fetchNotices()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete notice')
    }
  }

  const openEditDialog = (notice) => {
    setEditingNotice(notice)
    setFormData({
      title: notice.title,
      description: notice.description,
      category: notice.category,
      isActive: notice.isActive,
      expiryDate: notice.expiryDate ? notice.expiryDate.split('T')[0] : ''
    })
    setIsEditOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'General',
      isActive: true,
      expiryDate: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Notices</h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage college notices
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Create Notice
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Notice</DialogTitle>
              <DialogDescription>
                Create a new notice for students
              </DialogDescription>
            </DialogHeader>
            <NoticeForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreate}
              submitText="Create Notice"
              submitting={submitting}
            />
          </DialogContent>
        </Dialog>
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
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      {/* Notices Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : notices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notices.map((notice) => (
                  <TableRow key={notice._id}>
                    <TableCell className="font-medium max-w-[300px] truncate">
                      {notice.title}
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(notice.category)}>
                        {notice.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(notice.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant={notice.isActive ? "default" : "secondary"}>
                        {notice.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(notice)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Notice</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this notice? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(notice._id)}>Delete</AlertDialogAction>
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
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No notices found</h3>
              <p className="text-muted-foreground">Create your first notice to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

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

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) { setEditingNotice(null); resetForm(); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notice</DialogTitle>
            <DialogDescription>
              Update notice details
            </DialogDescription>
          </DialogHeader>
          <NoticeForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdate}
            submitText="Update Notice"
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

