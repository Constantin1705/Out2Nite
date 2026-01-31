'use client'

// Update the import path below if your Header component is located elsewhere
import { Header } from '../../components/Header'
// Update the path below to the correct relative path if your auth store is located elsewhere
import { useAuthStore } from '../../lib/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Music, Users, Star, Loader } from 'lucide-react'
import { apiClient } from '../../lib/api'
import type { Activity } from '../../types/Concert'

export default function ListPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [filterType, setFilterType] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const loadActivities = async () => {
      try {
        const response = await apiClient.get('/api/activities/')
        setActivities(response.data)
        setFilteredActivities(response.data)
      } catch (err) {
        console.error('Failed to load activities:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadActivities()
  }, [isAuthenticated, router])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterActivities(query, filterType)
  }

  const handleFilter = (type: string | null) => {
    setFilterType(type)
    filterActivities(searchQuery, type)
  }

  const filterActivities = (query: string, type: string | null) => {
    let filtered = activities

    if (query.trim()) {
      filtered = filtered.filter((a) =>
        a.name?.toLowerCase().includes(query.toLowerCase()) ||
        a.event_type_name?.toLowerCase().includes(query.toLowerCase()) ||
        a.music?.toLowerCase().includes(query.toLowerCase())
      )
    }

    if (type) {
      filtered = filtered.filter((a) =>
        a.event_type_name?.toLowerCase().includes(type.toLowerCase())
      )
    }

    setFilteredActivities(filtered)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-64px)] bg-dark-900 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Tonight&#39;s Events</h1>
            <p className="text-gray-400">Discover what&#39;s happening in Groningen</p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 mb-8"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search events by name, type, or music..."
                className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilter(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === null
                    ? 'bg-primary text-white'
                    : 'bg-dark-800 text-gray-300 hover:text-white'
                }`}
              >
                All
              </button>
              {['Concert', 'Bar', 'Event', 'Meetup'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilter(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === type
                      ? 'bg-primary text-white'
                      : 'bg-dark-800 text-gray-300 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Loader size={48} className="text-primary" />
              </motion.div>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <p className="text-gray-400 mb-6">
                Showing <span className="text-primary font-bold">{filteredActivities.length}</span> event
                {filteredActivities.length !== 1 ? 's' : ''}
              </p>

              {/* Activities Grid */}
              {filteredActivities.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {filteredActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        layout
                      >
                        <div
                          className="bg-dark-800 rounded-xl border border-dark-700 hover:border-primary transition-all duration-300 overflow-hidden cursor-pointer group h-full flex flex-col"
                          onClick={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
                        >
                          {/* Card Header with Gradient */}
                          <div className="bg-gradient-neon p-6 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity duration-300" />
                            <div className="relative z-10">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-xl font-bold text-white flex-1 pr-2 line-clamp-2">
                                  {activity.name}
                                </h3>
                                {activity.live && (
                                  <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full whitespace-nowrap animate-pulse">
                                    LIVE
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-200 text-sm">{activity.event_type_name}</p>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="flex-1 p-6 space-y-3">
                            {activity.address && (
                              <div className="flex items-start gap-2 text-gray-300">
                                <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm line-clamp-2">
                                    {activity.address}, {activity.city}
                                  </p>
                                </div>
                              </div>
                            )}

                            {activity.music && (
                              <div className="flex items-start gap-2 text-gray-300">
                                <Music size={16} className="text-secondary flex-shrink-0 mt-0.5" />
                                <p className="text-sm line-clamp-2">{activity.music}</p>
                              </div>
                            )}

                            {activity.mood && (
                              <div className="flex items-start gap-2 text-gray-300">
                                <Star size={16} className="text-accent flex-shrink-0 mt-0.5" />
                                <p className="text-sm">{activity.mood}</p>
                              </div>
                            )}
                          </div>

                          {/* Expandable Details */}
                          <AnimatePresence>
                            {expandedId === activity.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border-t border-dark-700 bg-dark-700/50 p-6 space-y-3"
                              >
                                {activity.description && (
                                  <p className="text-gray-300 text-sm">{activity.description}</p>
                                )}
                                {activity.phone && (
                                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <span>📞</span>
                                    <a href={`tel:${activity.phone}`} className="hover:text-primary transition-colors">
                                      {activity.phone}
                                    </a>
                                  </div>
                                )}
                                {activity.email && (
                                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <span>📧</span>
                                    <a href={`mailto:${activity.email}`} className="hover:text-primary transition-colors">
                                      {activity.email}
                                    </a>
                                  </div>
                                )}
                                {activity.website && (
                                  <a
                                    href={activity.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block mt-4 py-2 px-4 bg-primary hover:bg-secondary text-white font-medium rounded-lg text-center transition-colors"
                                  >
                                    Visit Website →
                                  </a>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <p className="text-gray-400 text-lg">No events found. Try adjusting your filters.</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
