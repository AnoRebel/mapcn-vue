import {
  Map,
  BookOpen,
  Code,
  Braces,
  MapPin,
  MessageSquare,
  Route,
  Wrench,
  Settings,
  Layers,
  Grid3X3,
  Sparkles,
  Boxes,
} from 'lucide-vue-next'
import type { Component } from 'vue'

export interface NavItem {
  title: string
  href: string
  icon: Component
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const docsNavigation: NavGroup[] = [
  {
    title: 'Basics',
    items: [
      { title: 'Getting Started', href: '/docs', icon: BookOpen },
      { title: 'Installation', href: '/docs/installation', icon: Code },
      { title: 'API Reference', href: '/docs/api-reference', icon: Braces },
      { title: 'Examples', href: '/docs/examples', icon: Sparkles },
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'Map', href: '/docs/basic-map', icon: Map },
      { title: 'Controls', href: '/docs/controls', icon: Settings },
      { title: 'Markers', href: '/docs/markers', icon: MapPin },
      { title: 'Popups', href: '/docs/popups', icon: MessageSquare },
      { title: 'Routes', href: '/docs/routes', icon: Route },
      { title: 'Clusters', href: '/docs/clusters', icon: Layers },
      { title: 'Layers', href: '/docs/layers', icon: Grid3X3 },
      { title: 'deck.gl', href: '/docs/deckgl', icon: Boxes },
      { title: 'Advanced', href: '/docs/advanced-usage', icon: Wrench },
    ],
  },
]
