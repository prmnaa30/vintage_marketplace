export const useTimeFormat = () => {
  const formatTimeAgo = (timestamp: Date | { seconds?: number, _seconds?: number } | string | number | null | undefined): string => {
    let date: Date

    if (timestamp && typeof timestamp === 'object') {
      if ('seconds' in timestamp && typeof timestamp.seconds === 'number') {
        date = new Date(timestamp.seconds * 1000) // Convert seconds to milliseconds (corrected)
      } else if (timestamp instanceof Date) {
        date = timestamp
      } else if ('_seconds' in timestamp && typeof timestamp._seconds === 'number') {
        date = new Date(timestamp._seconds * 100) // Convert seconds to milliseconds
      } else {
        date = timestamp as Date
      }
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      // Handle string or number timestamps
      date = new Date(timestamp)
    } else {
      // Fallback to current date if timestamp is invalid
      date = new Date()
    }

    // Calculate time difference in milliseconds
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffWeeks = Math.floor(diffDays / 7)
    // const diffMonths = Math.floor(diffDays / 30)

    // Format based on time difference
    if (diffSecs < 60) {
      if (diffSecs === 0) {
        return 'just now'
      } else {
        return `${diffSecs} second${diffSecs === 1 ? '' : 's'} ago`
      }
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
    } else if (diffWeeks < 4) {
      return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`
    } else {
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }
  }

  return {
    formatTimeAgo
  }
}
