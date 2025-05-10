"use client"

import { FileTypeIcon as FontStyle, ImageIcon, TrendingUpIcon } from "lucide-react"


interface SidebarProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export default function Sidebar({ selectedCategory, onSelectCategory }: SidebarProps) {
  // BACKEND INTEGRATION POINT:
  // Fetch categories from backend
  // const [categories, setCategories] = useState([])
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     const response = await fetch('/api/shop/categories')
  //     const data = await response.json()
  //     setCategories(data)
  //   }
  //   fetchCategories()
  // }, [])

  // For now, using hardcoded categories
  const categories = [
    { id: "fonts", name: "Custom Fonts", icon: <FontStyle /> },
    { id: "upgrades", name: "Upgrades", icon: <TrendingUpIcon /> },

    // { id: "profile-pictures", name: "Profile Pictures", icon: <ImageIcon /> },
    // { id: "background-images", name: "Background Images", icon: <ImageIcon /> },
  ]

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4 hidden md:block">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <nav>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => onSelectCategory(category.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-gray-500">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
