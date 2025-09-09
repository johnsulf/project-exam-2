export const routes = {
  home: "/",
  venues: "/venues",
  venue: (id = ":id") => `/venues/${id}`,
  profile: "/profile",
};
