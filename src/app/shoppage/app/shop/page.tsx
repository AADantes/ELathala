import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditDisplay } from "@/components/shop/credit-display"
import { ArticlesList } from "@/components/shop/articles-list"
import { FontsList } from "@/components/shop/fonts-list"
import { FeaturesList } from "@/components/shop/features-list"
import { Sparkles, FileText, Type, Settings } from "lucide-react" // Optional icons

export default function ShopPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Shop
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Purchase credits and unlock premium features for your writing experience.
          </p>
        </div>
        <CreditDisplay credits={250} />
      </div>

      {/* Tabs Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6">
        <Tabs defaultValue="premium-articles" className="w-full">
          <TabsList className="grid grid-cols-3 gap-2 mb-6 bg-muted p-1 rounded-md">
            <TabsTrigger value="premium-articles" className="flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow">
              <FileText className="w-4 h-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="fonts" className="flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow">
              <Type className="w-4 h-4" />
              Fonts
            </TabsTrigger>
            <TabsTrigger value="customization" className="flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow">
              <Settings className="w-4 h-4" />
              Customization
            </TabsTrigger>
          </TabsList>

          {/* Tab: Premium Articles */}
          <TabsContent value="premium-articles" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Premium Articles</h2>
              <p className="text-muted-foreground text-sm">
                Dive into exclusive, high-quality content curated for you.
              </p>
            </div>
            <ArticlesList />
            <div className="flex justify-center mt-6">
              <Button variant="outline" className="hover:bg-accent/50 transition">
                View More Articles
              </Button>
            </div>
          </TabsContent>

          {/* Tab: Fonts */}
          <TabsContent value="fonts" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Premium Writing Fonts</h2>
              <p className="text-muted-foreground text-sm">
                Enhance your writing with elegant, distraction-free fonts.
              </p>
            </div>
            <FontsList />
          </TabsContent>

          {/* Tab: Customization */}
          <TabsContent value="customization" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Customization Features</h2>
              <p className="text-muted-foreground text-sm">
                Tailor your writing environment with themes, layouts, and more.
              </p>
            </div>
            <FeaturesList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
