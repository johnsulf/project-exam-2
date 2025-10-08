export const qk = {
  venues: () => ["venues"] as const,
  venuesPage: (params: Record<string, unknown>) => ["venues", params] as const,
  venue: (id: string) => ["venue", id] as const,
  bookingsByProfile: (name: string) => ["bookings", "profile", name] as const,
  venueBookings: (id: string) => ["venue", id, "bookings"] as const,
  profile: (name: string) => ["profile", name] as const,
  profileVenues: (name: string, params?: Record<string, unknown>) =>
    ["profileVenues", name, params ?? {}] as const,
};
