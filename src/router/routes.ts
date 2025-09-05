export const routes = {
  home: "/",
  venues: "/venues",
  venue: (id = ":id") => `/venue/${id}`,
  profile: "/profile",
};
