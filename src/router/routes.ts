export const routes = {
  home: "/",
  venues: "/venues",
  about: "/about",
  manage: "/manage",
  kitchen: "/_kitchen",
  venue: (id = ":id") => `/venues/${id}`,
  profile: "/profile",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    registerManager: "/auth/register/manager",
  },
};
