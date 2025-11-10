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

const ProfileBase = z.object({
  name: z.string(),
  email: z.email(),
  bio: z.string().nullable().optional(),
  avatar: Media.optional(),
  banner: Media.optional(),
});

export const Profile = ProfileBase.extend({
  venueManager: z.boolean(),
  _count: z
    .object({ venues: z.number().optional(), bookings: z.number().optional() })
    .optional(),
  venues: z.array(z.lazy(() => Venue)).optional(),
  bookings: z.array(Booking).optional(),
});

export const OwnerProfile = ProfileBase.extend({
  venueManager: z.boolean().optional(),
});

export const BookingWithCustomer = z.object({
  id: z.string(),
  dateFrom: z.string(),
  dateTo: z.string(),
  guests: z.number(),
  created: z.string().optional(),
  updated: z.string().optional(),
  customer: z
    .object({
      name: z.string(),
      email: z.string().email(),
      bio: z.string().nullable().optional(),
      avatar: z
        .object({ url: z.string().url(), alt: z.string().optional() })
        .optional(),
      banner: z
        .object({ url: z.string().url(), alt: z.string().optional() })
        .optional(),
    })
    .optional(),
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
  owner: OwnerProfile.optional(),
  bookings: z.array(BookingWithCustomer).optional(),
});

export const BookingWithVenue = Booking.extend({
  venue: Venue.optional(),
});

export const VenueCreate = z.object({
  name: z.string().min(2, "Please enter a name"),
  description: z.string().min(10, "Please add a longer description"),
  media: z.array(Media).default([]),
  price: z.number().min(0, "Price must be ≥ 0"),
  maxGuests: z.number().int().min(1).max(100),
  rating: z.number().int().min(0).max(5).optional().default(0),
  meta: VenueMeta.optional(),
  location: VenueLocation.optional(),
});

export const VenueUpdate = VenueCreate.partial();

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
export type TOwnerProfile = z.infer<typeof OwnerProfile>;
export type TBookingWithVenue = z.infer<typeof BookingWithVenue>;
export type TBookingWithCustomer = z.infer<typeof BookingWithCustomer>;
export type TVenueCreate = z.infer<typeof VenueCreate>;
export type TVenueUpdate = z.infer<typeof VenueUpdate>;
export type TPageMeta = z.infer<typeof PageMeta>;
