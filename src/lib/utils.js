import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatTime(time) {
  return time
}

export function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + ' years ago'
  
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' months ago'
  
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' days ago'
  
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' hours ago'
  
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + ' minutes ago'
  
  return 'Just now'
}

export function getCategoryColor(category) {
  const colors = {
    // Notice categories
    'Academic': 'bg-blue-100 text-blue-800',
    'Events': 'bg-purple-100 text-purple-800',
    'General': 'bg-gray-100 text-gray-800',
    'Urgent': 'bg-red-100 text-red-800',
    'Exam': 'bg-orange-100 text-orange-800',
    // Event categories
    'Cultural': 'bg-pink-100 text-pink-800',
    'Technical': 'bg-indigo-100 text-indigo-800',
    'Sports': 'bg-green-100 text-green-800',
    'Workshop': 'bg-yellow-100 text-yellow-800',
    'Seminar': 'bg-teal-100 text-teal-800',
    // Lost & Found categories
    'Electronics': 'bg-cyan-100 text-cyan-800',
    'Documents': 'bg-amber-100 text-amber-800',
    'Accessories': 'bg-rose-100 text-rose-800',
    'Books': 'bg-lime-100 text-lime-800',
    'Other': 'bg-slate-100 text-slate-800',
    // Feedback categories
    'Facilities': 'bg-violet-100 text-violet-800',
    'Services': 'bg-emerald-100 text-emerald-800',
    'Infrastructure': 'bg-fuchsia-100 text-fuchsia-800',
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

export function getStatusColor(status) {
  const colors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'claimed': 'bg-blue-100 text-blue-800',
    'resolved': 'bg-green-100 text-green-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

