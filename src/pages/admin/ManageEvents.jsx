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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, getCategoryColor } from '@/lib/utils'
import { Plus, Search, Edit, Trash2, Loader2, Calendar, MapPin, Clock } from 'lucide-react'

const categories = ['Cultural', 'Technical', 'Sports', 'Workshop', 'Seminar']

// EventForm component - defined outside to prevent re-creation on every render
const EventForm = ({ formData, setFormData, onSubmit, submitText, submitting }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <Label>Title *</Label>
      <Input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Event title"
        required
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Date *</Label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Time *</Label>
        <Input
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Venue *</Label>
        <Input
          value={formData.venue}
          onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
          placeholder="Event venue"
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
    </div>
    <div className="space-y-2">
      <Label>Organizer</Label>
      <Input
        value={formData.organizer}
        onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
        placeholder="Organizing department/club"
      />
    </div>
    <div className="space-y-2">
      <Label>Description *</Label>
      <Textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Event details..."
        rows={4}
        required
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

export default function ManageEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, total: 1 })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    organizer: '',
    category: 'Cultural'
  })

  useEffect(() => {
    fetchEvents()
  }, [category])

  const fetchEvents = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page)
      params.append('limit', 10)
      if (category !== 'All') params.append('category', category)
      if (search) params.append('search', search)

      const response = await api.get(`/events?${params}`)
      setEvents(response.data.data.events || [])
      setPagination(response.data.data.pagination || { current: 1, total: 1 })
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchEvents()
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/events', formData)
      toast.success('Event created successfully!')
      setIsCreateOpen(false)
      resetForm()
      fetchEvents()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.put(`/events/${editingEvent._id}`, formData)
      toast.success('Event updated successfully!')
      setIsEditOpen(false)
      setEditingEvent(null)
      resetForm()
      fetchEvents()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update event')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/events/${id}`)
      toast.success('Event deleted successfully!')
      fetchEvents()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event')
    }
  }

  const openEditDialog = (event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date ? event.date.split('T')[0] : '',
      time: event.time,
      venue: event.venue,
      organizer: event.organizer || '',
      category: event.category
    })
    setIsEditOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      organizer: '',
      category: 'Cultural'
    })
  }

  const isUpcoming = (date) => new Date(date) >= new Date()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage college events
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Create a new event for students
              </DialogDescription>
            </DialogHeader>
            <EventForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreate}
              submitText="Create Event"
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
                placeholder="Search events..."
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

      {/* Events Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : events.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {event.title}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.venue}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(event.category)}>
                        {event.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isUpcoming(event.date) ? (
                        <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">Upcoming</Badge>
                      ) : (
                        <Badge variant="secondary">Past</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(event)}>
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
                              <AlertDialogTitle>Delete Event</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this event? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(event._id)}>Delete</AlertDialogAction>
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
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No events found</h3>
              <p className="text-muted-foreground">Create your first event to get started</p>
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
            onClick={() => fetchEvents(pagination.current - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {pagination.current} of {pagination.total}
          </span>
          <Button
            variant="outline"
            disabled={pagination.current === pagination.total}
            onClick={() => fetchEvents(pagination.current + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) { setEditingEvent(null); resetForm(); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update event details
            </DialogDescription>
          </DialogHeader>
          <EventForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdate}
            submitText="Update Event"
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

