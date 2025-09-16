export interface Media {
  url: string;
  alt?: string;
}
export interface VenueMeta {
  wifi?: boolean;
  parking?: boolean;
  breakfast?: boolean;
  pets?: boolean;
}
export interface VenueLocation {
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  continent?: string;
  lat?: number;
  lng?: number;
}

export interface Profile {
  name: string;
  email: string;
  bio?: string;
  banner?: Media;
  avatar?: Media;
  venueManager: boolean;
  _count?: { venues?: number; bookings?: number } | undefined;
  _bookings?: Booking[];
  _venues?: Venue[];
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  media: Media[];
  price: number;
  maxGuests: number;
  rating?: number;
  created?: string;
  updated?: string;
  meta?: VenueMeta;
  location?: VenueLocation;
  _owner?: Profile;
  _bookings?: Booking[];
}

export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created?: string;
  updated?: string;
}

export interface PageMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}

export interface Envelope<T> {
  data: T;
  meta?: unknown;
}
