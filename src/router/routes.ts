export const routes = {
  home: "/",
  venues: "/venues",
  kitchen: "/_kitchen",
  venue: (id = ":id") => `/venues/${id}`,
  profile: "/profile",
};
