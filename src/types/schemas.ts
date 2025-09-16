import { z } from "zod";

export const Media = z.object({
  url: z.url(),
  alt: z.string().optional(),
});

export const VenueMeta = z.object({
  wifi: z.boolean().optional(),
  parking: z.boolean().optional(),
  breakfast: z.boolean().optional(),
  pets: z.boolean().optional(),
});

export const VenueLocation = z.object({
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  zip: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  continent: z.string().nullable().optional(),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
});

export const Booking = z.object({
  id: z.string(),
  dateFrom: z.string(),
  dateTo: z.string(),
  guests: z.number(),
  created: z.string().optional(),
  updated: z.string().optional(),
});

export const Venue = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  media: z.array(Media).default([]),
  price: z.number(),
  maxGuests: z.number(),
  rating: z.number().optional().default(0),
  created: z.string().optional(),
  updated: z.string().optional(),
  meta: VenueMeta.optional(),
  location: VenueLocation.optional(),
  _owner: z.lazy(() => Profile).optional(),
  _bookings: z.array(Booking).optional(),
});

type TProfileCount = { venues?: number; bookings?: number };

export const Profile: z.ZodType<{
  name: string;
  email: string;
  bio?: string;
  avatar?: z.infer<typeof Media>;
  banner?: z.infer<typeof Media>;
  venueManager: boolean;
  _count?: TProfileCount;
  _bookings?: z.infer<typeof Booking>[];
  _venues?: z.infer<typeof Venue>[];
}> = z.object({
  name: z.string(),
  email: z.email(),
  bio: z.string().optional(),
  avatar: Media.optional(),
  banner: Media.optional(),
  venueManager: z.boolean(),
  _count: z
    .object({ venues: z.number().optional(), bookings: z.number().optional() })
    .optional(),
  _bookings: z.array(Booking).optional(),
  _venues: z.array(Venue).optional(),
});

export const PageMeta = z.object({
  isFirstPage: z.boolean(),
  isLastPage: z.boolean(),
  currentPage: z.number(),
  previousPage: z.number().nullable(),
  nextPage: z.number().nullable(),
  pageCount: z.number(),
  totalCount: z.number(),
});

export const Envelope = <T extends z.ZodTypeAny>(data: T) =>
  z.object({ data, meta: z.unknown().optional() });

export type TVenue = z.infer<typeof Venue>;
export type TBooking = z.infer<typeof Booking>;
export type TProfile = z.infer<typeof Profile>;
export type TPageMeta = z.infer<typeof PageMeta>;
