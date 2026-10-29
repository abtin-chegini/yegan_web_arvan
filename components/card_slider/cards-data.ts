export type SliderCard = {
  id: string;
  title: string;
  kicker: string;
  description?: string;
  image: string;
  alt: string;
  href: string;
};

export const sliderCards: SliderCard[] = [
  {
    id: "card-1",
    title: "Bilit4U",
    kicker: "B2B & B2C Tourism / Booking Platform",
    description:
      "I designed and built the front end of a ticket booking platform — from UX/UI and interaction design through to a clear, responsive reservation flow.",
    image: "https://ik.imagekit.io/s7yz964lq/assets/inside_card.png",
    alt: "Bilit4U project",
    href: "/projects/bilit4u",
  },
  {
    id: "card-2",
    title: "Tealnex",
    kicker: "B2C Architecture & Renovation / Company",
    description:
      "Designed the UX/UI, defined the interaction design and micro-interactions, and delivered the front-end implementation.",
    image:
      "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealnex/tealnex.png?updatedAt=1787241819644",
    alt: "Tealnex Homes project",
    href: "/projects/tealnex",
  },
  {
    id: "card-3",
    title: "TealTile",
    kicker: "B2C Tile Retail & Installation / Shop",
    description:
      "My role covered the full digital experience, from website design and UX/UI design to front-end implementation.",
    image:
      "https://ik.imagekit.io/s7yz964lq/assets/casestudy/Tealtile/tealtile.png?updatedAt=1787241902254",
    alt: "TealTile project",
    href: "/projects/tealtile",
  },
];

export const cardYOffset = 5;
export const cardScaleStep = 0.075;
export const stepDuration = 0.9;
