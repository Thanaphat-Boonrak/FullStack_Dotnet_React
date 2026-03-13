export type PagedList<T, TCursor> = {
  items: T[];
  nextCursor?: TCursor;
};

export type Activity = {
  id: string;
  title: string;
  date: Date;
  description: string;
  category: string;
  city: string;
  isCancelled: boolean;
  venue: string;
  latitude: number;
  longitude: number;
  attendees?: Profile[];
  isGoing?: boolean;
  isHost?: boolean;
  hostId?: string;
  hostDisplayName?: string;
  hostImage?: string;
};


export type ResetPassword = {
  email: string;
  resetCode: string;
  newPassword: string;
};

export type User = {
  id: string;
  email: string;
  displayName: string;
  imageUrl?: string;
};

export interface LocationIQSuggestion {
  place_id: string;
  osm_id: string;
  osm_type: string;
  licence: string;
  lat: string;
  lon: string;
  boundingbox: string[];
  class: string;
  type: string;
  display_name: string;
  display_place: string;
  display_address: string;
  address: Address;
}

export interface ChatComment {
  id: string;
  body: string;
  createdAt: Date;
  userId: string;
  displayName: string;
  imageUrl?: string;
}

export interface Profile {
  id: string;
  displayName: string;
  bio?: string;
  imageUrl?: string;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

export interface Photo {
  id: string;
  url: string;
}

export interface Address {
  name: string;
  road: string;
  neighbourhood?: string;
  suburb?: string;
  town?: string;
  village?: string;
  city?: string;
  state: string;
  postcode?: string;
  country: string;
  country_code: string;
}
