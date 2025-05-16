export interface Genre {
  id: number
  name: string
}

export interface Mood {
  id: number
  name: string
}

export interface User {
  id: number
  username: string
  email: string
  nickname: string
  profile_picture_url: string
  favorite_genres: Genre[]
  mood_for_tonight: Mood | null
}
