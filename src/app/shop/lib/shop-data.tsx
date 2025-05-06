import type { ReactNode } from "react"
import { BookOpen, Paintbrush, Star, Type, Zap, CreditCard } from "lucide-react"

export interface Article {
  id: number
  title: string
  author: string
  description: string
  image: string
  credits: number
  readTime: number
  featured: boolean
}

export interface Font {
  id: number
  name: string
  style: string
  previewFontFamily: string
  weights: number
  ligatures: boolean
  credits: number
}

export interface CustomizationFeature {
  id: number
  name: string
  category: string
  description: string
  credits: number
  popular: boolean
  icon: ReactNode
}


export const fonts: Font[] = [
  {
    id: 1,
    name: "Scriptor Pro",
    style: "Serif",
    previewFontFamily: "Georgia, serif",
    weights: 6,
    ligatures: true,
    credits: 120,
  },
  {
    id: 2,
    name: "Novelist Sans",
    style: "Sans-Serif",
    previewFontFamily: "Arial, sans-serif",
    weights: 9,
    ligatures: true,
    credits: 150,
  },
  {
    id: 3,
    name: "Manuscript Mono",
    style: "Monospace",
    previewFontFamily: "monospace",
    weights: 4,
    ligatures: false,
    credits: 100,
  },
  {
    id: 4,
    name: "Quill Script",
    style: "Script",
    previewFontFamily: "cursive",
    weights: 3,
    ligatures: true,
    credits: 180,
  },
  {
    id: 5,
    name: "Author Display",
    style: "Display",
    previewFontFamily: "Impact, sans-serif",
    weights: 2,
    ligatures: false,
    credits: 90,
  },
  {
    id: 6,
    name: "Narrative Slab",
    style: "Slab Serif",
    previewFontFamily: "Courier, monospace",
    weights: 5,
    ligatures: true,
    credits: 130,
  },
]

export const customizationFeatures: CustomizationFeature[] = [
  {
    id: 1,
    name: "Advanced Theme Builder",
    category: "Interface",
    description: "Create and save custom themes with precise control over colors, spacing, and typography.",
    credits: 200,
    popular: true,
    icon: <Paintbrush className="h-5 w-5 text-primary" />,
  },
  {
    id: 2,
    name: "Custom Keyboard Shortcuts",
    category: "Productivity",
    description: "Design your own keyboard shortcut system to match your writing workflow.",
    credits: 150,
    popular: false,
    icon: <Zap className="h-5 w-5 text-primary" />,
  },
  {
    id: 3,
    name: "AI Writing Assistant Pro",
    category: "Tools",
    description: "Unlock advanced AI features including style analysis, readability suggestions, and more.",
    credits: 350,
    popular: true,
    icon: <Star className="h-5 w-5 text-primary" />,
  },
  {
    id: 4,
    name: "Export Format Pack",
    category: "Publishing",
    description:
      "Access to all premium export formats including ePub, MOBI, LaTeX, and industry-standard manuscript formats.",
    credits: 180,
    popular: false,
    icon: <BookOpen className="h-5 w-5 text-primary" />,
  },
  {
    id: 5,
    name: "Distraction-Free Mode Plus",
    category: "Interface",
    description: "Enhanced focus mode with customizable ambient sounds, typewriter effects, and focus timers.",
    credits: 120,
    popular: true,
    icon: <Type className="h-5 w-5 text-primary" />,
  },
  {
    id: 6,
    name: "Advanced Statistics Dashboard",
    category: "Analytics",
    description:
      "Detailed writing analytics including pace tracking, vocabulary diversity, and style consistency metrics.",
    credits: 220,
    popular: false,
    icon: <CreditCard className="h-5 w-5 text-primary" />,
  },
]
