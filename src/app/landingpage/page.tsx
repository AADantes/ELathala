import Header from '@/app/landingpage/components/Header'
import HeroSection from '@/app/landingpage/components/HeroSection'
import FeaturesSection from '@/app/landingpage/components/FeaturesSection'
import HowItWorksSection from '@/app/landingpage/components/HowItWorksSection'
import CallToActionSection from '@/app/landingpage/components/CallToActionSection'
import Footer from '@/app/landingpage/components/Footer'

export default function Home() {
    return (
      <div className="flex flex-col min-h-screen bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "url('https://writingstudio.com/wp-content/uploads/2021/08/writing-tips.jpg')"
      }}>
        <div className="flex-grow bg-white/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Header />
            <main>
              <HeroSection />
              <FeaturesSection />
              <HowItWorksSection />
              <CallToActionSection />
            </main>
          </div>
        </div>
        <Footer />
      </div>
    )
  }