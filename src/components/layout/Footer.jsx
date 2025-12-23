export default function Footer() {
  return (
    <footer className="border-t dark:border-gray-800 bg-white dark:bg-gray-950 py-4 px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} College Utility Hub. All rights reserved.</p>
        <p>Made with care for students</p>
      </div>
    </footer>
  )
}

