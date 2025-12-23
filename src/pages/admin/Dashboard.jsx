import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, timeAgo, getCategoryColor, getStatusColor } from '@/lib/utils'
import {
  Bell,
  Calendar,
  Search,
  MessageSquare,
  Users,
  ArrowRight,
  Plus,
  TrendingUp,
  Clock
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

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        api.get('/stats'),
        api.get('/stats/activity')
      ])
      setStats(statsRes.data.data)
      setActivity(activityRes.data.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { 
      title: 'Total Notices', 
      value: stats?.totalNotices || 0, 
      icon: Bell, 
      color: 'bg-blue-500',
      href: '/admin/notices'
    },
    { 
      title: 'Total Events', 
      value: stats?.totalEvents || 0, 
      icon: Calendar, 
      color: 'bg-purple-500',
      href: '/admin/events'
    },
    { 
      title: 'Pending L&F', 
      value: stats?.pendingLostFound || 0, 
      icon: Search, 
      color: 'bg-orange-500',
      href: '/admin/lostfound'
    },
    { 
      title: 'Pending Feedback', 
      value: stats?.pendingFeedback || 0, 
      icon: MessageSquare, 
      color: 'bg-green-500',
      href: '/admin/feedback'
    },
    { 
      title: 'Total Students', 
      value: stats?.totalStudents || 0, 
      icon: Users, 
      color: 'bg-indigo-500',
      href: null
    },
    { 
      title: 'Upcoming Events', 
      value: stats?.upcomingEvents || 0, 
      icon: TrendingUp, 
      color: 'bg-pink-500',
      href: '/admin/events'
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
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
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}. Here's your overview.
          </p>
        </div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-2"
        >
          <Link to="/admin/notices">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Create Notice
              </Button>
            </motion.div>
          </Link>
          <Link to="/admin/events">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Create Event
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      >
        {statCards.map((stat, index) => (
          <motion.div key={index} variants={item}>
            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <motion.div 
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center`}
                    >
                      <stat.icon className="h-5 w-5 text-white" />
                    </motion.div>
                  </div>
                  {stat.href && (
                    <Link to={stat.href} className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                      View all <ArrowRight className="h-3 w-3 inline" />
                    </Link>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid gap-6 lg:grid-cols-2"
      >
        {/* Recent Notices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Notices</CardTitle>
              <CardDescription>Latest notices posted</CardDescription>
            </div>
            <Link to="/admin/notices">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activity?.notices?.length > 0 ? (
                  activity.notices.map((notice) => (
                    <TableRow key={notice._id}>
                      <TableCell className="font-medium truncate max-w-[200px]">
                        {notice.title}
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(notice.category)}>
                          {notice.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {timeAgo(notice.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No recent notices
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Latest events created</CardDescription>
            </div>
            <Link to="/admin/events">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activity?.events?.length > 0 ? (
                  activity.events.map((event) => (
                    <TableRow key={event._id}>
                      <TableCell className="font-medium truncate max-w-[200px]">
                        {event.title}
                      </TableCell>
                      <TableCell>{formatDate(event.date)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {timeAgo(event.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No recent events
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pending Lost & Found */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Moderation</CardTitle>
              <CardDescription>Lost & found posts awaiting approval</CardDescription>
            </div>
            <Link to="/admin/lostfound">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activity?.lostFound?.length > 0 ? (
                  activity.lostFound.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="font-medium truncate max-w-[200px]">
                        {item.itemName}
                      </TableCell>
                      <TableCell>
                        <Badge className={item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}>
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No pending items
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>Latest feedback submissions</CardDescription>
            </div>
            <Link to="/admin/feedback">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activity?.feedback?.length > 0 ? (
                  activity.feedback.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="font-medium truncate max-w-[200px]">
                        {item.subject}
                        {item.isAnonymous && (
                          <span className="text-xs text-muted-foreground ml-1">(Anonymous)</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No recent feedback
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
      
    </div>
  )
}

