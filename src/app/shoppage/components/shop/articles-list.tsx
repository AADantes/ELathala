import { ArticleCard } from "@/components/shop/article-card"
import { premiumArticles } from "@/lib/shop-data"

export function ArticlesList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {premiumArticles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
