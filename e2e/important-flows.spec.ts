import { expect, test, type Page } from "@playwright/test";

type VenueFixture = {
  id: string;
  name: string;
  description: string;
  media: { url: string; alt?: string }[];
  price: number;
  maxGuests: number;
  rating?: number;
  location?: { city?: string; country?: string };
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    pets?: boolean;
    breakfast?: boolean;
  };
  owner?: {
    name: string;
    avatar?: { url: string; alt?: string } | null;
  } | null;
  bookings?: Array<{
    id: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
  }>;
};

const venues: VenueFixture[] = [
  {
    id: "aurora-cabin",
    name: "Aurora Cabin",
    description:
      "Watch the northern lights from a glass-roof cabin outside Reykjavik.",
    media: [
      {
        url: "https://images.example.com/aurora.jpg",
        alt: "Glass cabin under the northern lights",
      },
    ],
    price: 320,
    maxGuests: 4,
    rating: 4.9,
    location: { city: "Reykjavik", country: "Iceland" },
    meta: { wifi: true, parking: true, breakfast: true },
    owner: {
      name: "Ingrid Solberg",
      avatar: {
        url: "https://images.example.com/hosts/ingrid.jpg",
        alt: "Ingrid smiling",
      },
    },
    bookings: [
      {
        id: "b1",
        dateFrom: "2025-06-10",
        dateTo: "2025-06-15",
        guests: 2,
      },
    ],
  },
  {
    id: "fjordview-retreat",
    name: "Fjordview Retreat",
    description: "Modern lodge overlooking the fjords with private sauna.",
    media: [
      {
        url: "https://images.example.com/fjord.jpg",
        alt: "Lodge with fjord backdrop",
      },
    ],
    price: 280,
    maxGuests: 6,
    rating: 4.7,
    location: { city: "Bergen", country: "Norway" },
    meta: { wifi: true, parking: true, pets: true },
    owner: {
      name: "Sindre Nygaard",
      avatar: null,
    },
  },
  {
    id: "oslo-city-loft",
    name: "Oslo City Loft",
    description: "Stylish loft in the heart of Oslo with skyline views.",
    media: [
      {
        url: "https://images.example.com/oslo.jpg",
        alt: "Loft apartment interior",
      },
    ],
    price: 210,
    maxGuests: 2,
    rating: 4.4,
    location: { city: "Oslo", country: "Norway" },
    meta: { wifi: true },
    owner: {
      name: "Marit Johansen",
      avatar: null,
    },
  },
  {
    id: "bergen-harbor-flat",
    name: "Bergen Harbor Flat",
    description: "Walk to Bryggen from this cosy harbor apartment.",
    media: [
      {
        url: "https://images.example.com/bergen.jpg",
        alt: "Colorful houses on the harbor",
      },
    ],
    price: 190,
    maxGuests: 3,
    rating: 4.5,
    location: { city: "Bergen", country: "Norway" },
    meta: { wifi: true, breakfast: false },
    owner: {
      name: "Thomas Fiske",
      avatar: null,
    },
  },
  {
    id: "reykjavik-haven",
    name: "Reykjavik Haven",
    description: "Central apartment close to cafes and museums.",
    media: [
      {
        url: "https://images.example.com/reykjavik.jpg",
        alt: "Living room with city view",
      },
    ],
    price: 170,
    maxGuests: 2,
    rating: 4.2,
    location: { city: "Reykjavik", country: "Iceland" },
    meta: { wifi: true, parking: false },
    owner: {
      name: "Elin Sverrisdottir",
      avatar: null,
    },
  },
  {
    id: "mountain-hideaway",
    name: "Mountain Hideaway",
    description: "Secluded mountain hut perfect for stargazing.",
    media: [
      {
        url: "https://images.example.com/mountain.jpg",
        alt: "Mountain hut in the snow",
      },
    ],
    price: 150,
    maxGuests: 5,
    rating: 4.6,
    location: { city: "Trondheim", country: "Norway" },
    meta: { parking: true, pets: true },
    owner: {
      name: "Henrik Larsen",
      avatar: null,
    },
  },
];

async function mockVenuesList(page: Page) {
  await page.route("**/holidaze/venues", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === "/holidaze/venues") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: venues }),
      });
      return;
    }

    await route.continue();
  });
}

async function mockVenueDetail(page: Page, venue: VenueFixture) {
  await page.route(
    new RegExp(`/holidaze/venues/${venue.id}($|\\?)`),
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: venue }),
      });
    },
  );
}

test.describe("Critical customer journeys", () => {
  test("home page surfaces featured venues and top city sections", async ({
    page,
  }) => {
    await mockVenuesList(page);

    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Find your next stay" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { level: 2, name: "Featured Venues" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { level: 3, name: "Aurora Cabin" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { level: 3, name: "Fjordview Retreat" }),
    ).toBeVisible();

    await expect(page.getByText("Reykjavik, Iceland")).toBeVisible();
    await expect(page.getByText("Bergen, Norway")).toBeVisible();

    await expect(
      page.getByRole("heading", { level: 2, name: "Top stays in Reykjavik" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Top stays in Bergen" }),
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: "See all Venues" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "See all in Reykjavik" }),
    ).toHaveAttribute("href", "/venues?city=reykjavik");
  });

  test("unauthenticated visitor is redirected to login when trying to book", async ({
    page,
  }) => {
    await mockVenuesList(page);
    const aurora = venues[0];
    await mockVenueDetail(page, aurora);

    await page.goto("/");

    const auroraCard = page
      .getByRole("heading", { level: 3, name: aurora.name })
      .locator("xpath=ancestor::div[contains(@class, 'rounded-md')]");

    await auroraCard.getByRole("link", { name: "More details" }).click();

    await expect(page).toHaveURL(/\/venues\/aurora-cabin$/);
    await expect(
      page.getByRole("heading", { level: 1, name: aurora.name }),
    ).toBeVisible();
    await expect(page.getByText("Book this venue")).toBeVisible();

    const signInButton = page.getByRole("button", { name: "Sign in to book" });
    await expect(signInButton).toBeVisible();

    await signInButton.click();

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(
      page.getByRole("heading", { name: "Welcome back" }),
    ).toBeVisible();
  });
});
