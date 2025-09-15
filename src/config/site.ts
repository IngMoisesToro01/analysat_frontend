export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Analysat Challenge',
  description: 'Make beautiful websites regardless of your design experience.',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
  ],
  navMenuItems: [
    {
      label: 'Projects',
      href: '/projects',
    },
  ],
  links: {
    sponsor: 'https://patreon.com/jrgarciadev',
  },
}
