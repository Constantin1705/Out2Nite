'use client'

import { Header } from '../../components/Header'
import { useAuthStore } from '../../lib/auth'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Music, Users, ExternalLink, Loader } from 'lucide-react'
import { apiClient } from '../../lib/api'
// Update the import path below to the correct location of your Activity type, for example:
import type { Activity } from '../../types/Concert'
// Or, if the type does not exist, define it here:
//
// export type Activity = {
//   id: number
//   name: string
//   event_type_name?: string
//   latitude: number
//   longitude: number
//   address?: string
//   city?: string
//   music?: string
//   live?: boolean
//   website?: string
// }

export default function MapPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const mapContainer = useRef<HTMLDivElement>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [mapLoaded, setMapLoaded] = useState(false)

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

  // Load Leaflet map
  useEffect(() => {
    if (!mapLoaded && mapContainer.current && activities.length > 0) {
      loadMap()
    }
  }, [activities, mapLoaded])

  const loadMap = () => {
    if (typeof window === 'undefined') return

    import('leaflet').then((L) => {
      if (!mapContainer.current) return

      const map = L.map(mapContainer.current).setView([53.2194, 6.5669], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      activities.forEach((activity) => {
        const marker = L.marker([activity.latitude, activity.longitude], {
          title: activity.name,
        }).addTo(map)

        marker.on('click', () => {
          setSelectedActivity(activity)
        })
      })

      setMapLoaded(true)
    })
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredActivities(activities)
      return
    }

    const filtered = activities.filter((a) =>
      a.name?.toLowerCase().includes(query.toLowerCase()) ||
      a.event_type_name?.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredActivities(filtered)
  }

  const selectSuggestion = (type: string) => {
    const filtered = activities.filter((a) =>
      a.event_type_name?.toLowerCase().includes(type.toLowerCase())
    )
    setFilteredActivities(filtered)
    setSearchQuery(type)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Header />
      <div className="h-[calc(100vh-64px)] relative overflow-hidden">
        {/* Map Container */}
        <div ref={mapContainer} className="w-full h-full bg-dark-900" />

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader size={48} className="text-primary" />
            </motion.div>
          </div>
        )}

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 left-4 right-4 z-40 max-w-md"
        >
          <div className="bg-dark-900/95 backdrop-blur rounded-2xl border border-dark-700 overflow-hidden shadow-2xl">
            <div className="relative p-4">
              <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 border-t border-dark-700">
              {[
                { emoji: '🎵', label: 'Concerts', type: 'Concert' },
                { emoji: '🍻', label: 'Bars', type: 'Bar' },
                { emoji: '🎉', label: 'Events', type: 'Event' },
                { emoji: '🤝', label: 'Meetups', type: 'Meetup' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => selectSuggestion(item.type)}
                  className="p-2 text-sm rounded-lg hover:bg-dark-700 transition-colors text-gray-300 hover:text-white"
                >
                  <span className="text-lg">{item.emoji}</span> {item.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom Panel - Selected Activity Details */}
        <AnimatePresence>
          {selectedActivity && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-4 left-4 right-4 z-40 max-w-md mx-auto"
            >
              <div className="bg-dark-800 rounded-2xl border border-dark-700 shadow-2xl p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedActivity.name}</h3>
                    <p className="text-gray-400 mt-1 text-sm">{selectedActivity.event_type_name}</p>
                  </div>
                  <button
                    onClick={() => setSelectedActivity(null)}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 text-gray-300 text-sm">
                  {selectedActivity.address && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-primary" />
                      <span>{selectedActivity.address}, {selectedActivity.city}</span>
                    </div>
                  )}
                  {selectedActivity.music && (
                    <div className="flex items-center gap-2">
                      <Music size={16} className="text-secondary" />
                      <span>{selectedActivity.music}</span>
                    </div>
                  )}
                  {selectedActivity.live && (
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      <span className="text-red-400 font-medium">Live Now</span>
                    </div>
                  )}
                </div>

                {selectedActivity.website && (
                  <a
                    href={selectedActivity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary hover:bg-secondary rounded-lg text-white font-medium transition-colors"
                  >
                    <ExternalLink size={16} />
                    Visit Website
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
