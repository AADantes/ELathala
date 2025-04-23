import { FeatureCard } from "@/app/shoppage/shop/feature-card"
import { customizationFeatures } from "@/app/shoppage/lib/shop-data"

export function FeaturesList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {customizationFeatures.map((feature) => (
        <FeatureCard key={feature.id} feature={feature} />
      ))}
    </div>
  )
}
