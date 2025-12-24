import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  Bell,
  Calendar,
  Search,
  MessageSquare,
  X,
  Shield,
  UserCog
} from 'lucide-react'

const navItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3
    }
  })
}

const studentNavItems = [
  { title: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { title: 'Notices', href: '/student/notices', icon: Bell },
  { title: 'Events', href: '/student/events', icon: Calendar },
  { title: 'Lost & Found', href: '/student/lostfound', icon: Search },
  { title: 'Feedback', href: '/student/feedback', icon: MessageSquare },
]

const adminNavItems = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Manage Notices', href: '/admin/notices', icon: Bell },
  { title: 'Manage Events', href: '/admin/events', icon: Calendar },
  { title: 'Lost & Found', href: '/admin/lostfound', icon: Search },
  { title: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
  { title: 'Manage Admins', href: '/admin/admins', icon: UserCog },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const location = useLocation()
  
  const navItems = user?.role === 'admin' ? adminNavItems : studentNavItems

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#121212] border-r dark:border-gray-900 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 md:hidden">
            <span className="font-semibold dark:text-gray-100">Menu</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <Separator className="md:hidden" />

          {/* Role badge */}
          <div className="p-4">
            <div className="flex items-center space-x-2 px-3 py-2">
              <Shield className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium capitalize text-gray-600 dark:text-gray-400">
                {user?.role} Portal
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
              >
                <NavLink
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all border-l-2",
                      isActive
                        ? "border-l-amber-500 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900"
                        : "border-l-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                    )
                  }
                >
                  <item.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span>{item.title}</span>
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t dark:border-gray-800">
            <p className="text-xs text-muted-foreground text-center">
              College Utility Hub v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

