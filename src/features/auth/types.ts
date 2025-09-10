export type Avatar = { url: string; alt?: string };
export type Banner = { url: string; alt?: string };

export type Profile = {
  name: string;
  email: string;
  bio?: string;
  avatar?: Avatar;
  banner?: Banner;
  venueManager: boolean;
  _count?: { venues?: number; bookings?: number };
};

export type AuthLoginResponse = {
  accessToken: string;
  name?: string;
  email?: string;
};

export type AuthRegisterBody = {
  name: string;
  email: string;
  password: string;
  venueManager?: boolean;
};
