import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Bell, 
  Calendar, 
  Search, 
  MessageSquare, 
  GraduationCap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

const features = [
  {
    icon: Bell,
    title: 'Notice Board',
    description: 'Stay updated with all college announcements, academic notices, and urgent updates in one place.'
  },
  {
    icon: Calendar,
    title: 'Event Management',
    description: 'Never miss any college event. Browse upcoming cultural, technical, sports events and workshops.'
  },
  {
    icon: Search,
    title: 'Lost & Found',
    description: 'Lost something? Found something? Our lost and found system helps reunite items with their owners.'
  },
  {
    icon: MessageSquare,
    title: 'Feedback System',
    description: 'Voice your opinions and suggestions. Help improve college facilities and services.'
  }
]

const benefits = [
  'Real-time notifications for important updates',
  'Easy access to all college resources',
  'Secure and role-based access',
  'Mobile-friendly interface',
  'Anonymous feedback option',
  'Quick search and filters'
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background dark:bg-black">
      {/* Navigation */}
      <nav className="border-b dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-gray-700 dark:text-gray-300" />
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                College Utility Hub
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6"
          >
            Your Complete College Companion
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10"
          >
            Access notices, events, lost & found, and feedback systems all in one place. 
            Stay connected with your campus community.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                Register as Student
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A comprehensive suite of tools designed to enhance your college experience
            </p>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="border-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Why Choose College Utility Hub?
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                We've built this platform keeping students and administrators in mind. 
                Every feature is designed to make campus life easier and more connected.
              </motion.p>
              <motion.ul variants={staggerContainer} className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li 
                    key={index} 
                    variants={fadeInUp}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <Card className="rounded-md overflow-hidden">
                <CardContent className="p-8">
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="space-y-4"
                  >
                    <motion.div variants={fadeInUp} className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-950 rounded-md">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-3 w-3 rounded-full bg-red-500"
                      />
                      <span className="font-medium text-red-700 dark:text-red-300">Urgent: Exam Schedule Released</span>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="flex items-center space-x-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                      <div className="h-3 w-3 rounded-full bg-gray-500" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">New Event: Tech Fest 2024</span>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="h-3 w-3 rounded-full bg-gray-500" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">Found: Student ID Card</span>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <div className="h-3 w-3 rounded-full bg-gray-500" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">Feedback Resolved</span>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800 dark:bg-gray-900">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2 variants={scaleIn} className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-gray-100 mb-8">
            Join your fellow students and stay connected with everything happening on campus.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link to="/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Create Your Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 dark:text-gray-500 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            <span className="text-lg font-semibold text-white dark:text-gray-100">College Utility Hub</span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} College Utility Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

