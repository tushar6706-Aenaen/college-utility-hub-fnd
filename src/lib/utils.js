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
  return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
}

export function getStatusColor(status) {
  const colors = {
    'pending': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    'approved': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    'rejected': 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
    'claimed': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    'resolved': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
}

