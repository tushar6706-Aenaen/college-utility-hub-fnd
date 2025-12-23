import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, getCategoryColor } from '@/lib/utils'
import { Search, Calendar, Clock, MapPin, User, Filter, X } from 'lucide-react'

const categories = ['All', 'Cultural', 'Technical', 'Sports', 'Workshop', 'Seminar']

export default function StudentEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [pagination, setPagination] = useState({ current: 1, total: 1 })

  useEffect(() => {
    fetchEvents()
  }, [category])

  const fetchEvents = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page)
      params.append('limit', 12)
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

  const clearFilters = () => {
    setSearch('')
    setCategory('All')
  }

  const isUpcoming = (date) => new Date(date) >= new Date()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-muted-foreground mt-1">
            Discover upcoming events and activities
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
                placeholder="Search events..."
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
            <Button type="submit">Search</Button>
            {(search || category !== 'All') && (
              <Button type="button" variant="ghost" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Events Grid */}
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
      ) : events.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card
                key={event._id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  !isUpcoming(event.date) ? 'opacity-60' : ''
                }`}
                onClick={() => setSelectedEvent(event)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge className={getCategoryColor(event.category)}>
                      {event.category}
                    </Badge>
                    {isUpcoming(event.date) ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Upcoming
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Past</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-2 line-clamp-2">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.venue}
                    </div>
                  </div>
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
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No events found</h3>
            <p className="text-muted-foreground">
              {search || category !== 'All'
                ? 'Try adjusting your filters'
                : 'Check back later for upcoming events'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Event Detail Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getCategoryColor(selectedEvent.category)}>
                    {selectedEvent.category}
                  </Badge>
                  {isUpcoming(selectedEvent.date) ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Upcoming
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Past Event</Badge>
                  )}
                </div>
                <DialogTitle className="text-xl">{selectedEvent.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Date</p>
                      <p className="text-sm">{formatDate(selectedEvent.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Time</p>
                      <p className="text-sm">{selectedEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Venue</p>
                      <p className="text-sm">{selectedEvent.venue}</p>
                    </div>
                  </div>
                  {selectedEvent.organizer && (
                    <div className="flex items-center text-muted-foreground">
                      <User className="h-5 w-5 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Organizer</p>
                        <p className="text-sm">{selectedEvent.organizer}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Description</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedEvent.description}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

