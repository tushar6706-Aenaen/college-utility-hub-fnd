import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, timeAgo, getCategoryColor } from '@/lib/utils'
import {
  Bell,
  Calendar,
  Search,
  MessageSquare,
  ArrowRight,
  Clock,
  MapPin
} from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [notices, setNotices] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, noticesRes, eventsRes] = await Promise.all([
        api.get('/stats'),
        api.get('/notices?limit=5'),
        api.get('/events/upcoming?limit=3')
      ])

      setStats(statsRes.data.data)
      setNotices(noticesRes.data.data.notices || [])
      setEvents(eventsRes.data.data || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { title: 'View Notices', href: '/student/notices', icon: Bell, color: 'bg-gray-500' },
    { title: 'Browse Events', href: '/student/events', icon: Calendar, color: 'bg-gray-500' },
    { title: 'Lost & Found', href: '/student/lostfound', icon: Search, color: 'bg-gray-500' },
    { title: 'Submit Feedback', href: '/student/feedback', icon: MessageSquare, color: 'bg-gray-500' },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening at your college today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Notices</p>
                    <p className="text-3xl font-bold">{stats?.totalNotices || 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Bell className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={item}>
          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                    <p className="text-3xl font-bold">{stats?.upcomingEvents || 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={item}>
          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">My L&F Posts</p>
                    <p className="text-3xl font-bold">{stats?.myLostFound || 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Search className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={item}>
          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Quick Actions</p>
                    <p className="text-3xl font-bold">4</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {quickActions.map((action) => (
          <motion.div key={action.href} variants={item}>
            <Link to={action.href}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 flex items-center space-x-4">
                    <div className={`h-10 w-10 rounded-md ${action.color} flex items-center justify-center`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{action.title}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Notices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Notices</CardTitle>
              <CardDescription>Latest announcements from administration</CardDescription>
            </div>
            <Link to="/student/notices">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notices.length > 0 ? (
                notices.map((notice) => (
                  <div
                    key={notice._id}
                    className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className={`h-2 w-2 rounded-full mt-2 ${notice.category === 'Urgent' ? 'bg-red-500' : 'bg-gray-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{notice.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className={getCategoryColor(notice.category)}>
                          {notice.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {timeAgo(notice.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No notices available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Don't miss these events</CardDescription>
            </div>
            <Link to="/student/events">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.length > 0 ? (
                events.map((event) => (
                  <div
                    key={event._id}
                    className="p-3 rounded-md border hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                  >
                    <p className="font-medium">{event.title}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.venue}
                      </div>
                    </div>
                    <Badge variant="secondary" className={`mt-2 ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No upcoming events</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

