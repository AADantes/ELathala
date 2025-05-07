"use client"

import { useState } from "react";
import Header from '@/app/landingpage/components/Header';
import HeroSection from '@/app/landingpage/components/HeroSection';
import FeaturesSection from '@/app/landingpage/components/FeaturesSection';
import HowItWorksSection from '@/app/landingpage/components/HowItWorksSection';
import About from '@/app/landingpage/components/About';
import Footer from '@/app/landingpage/components/Footer';
import supabase from '../../../config/supabaseClient';

const Home = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  console.log(supabase);

  return (
    <>
      <Header isSignUpOpen={isSignUpOpen} setIsSignUpOpen={setIsSignUpOpen} />
      <HeroSection openSignUpDialog={() => setIsSignUpOpen(true)} />
      <div 
        className="flex flex-col min-h-screen bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: "url('https://writingstudio.com/wp-content/uploads/2021/08/writing-tips.jpg')"
        }}
      >
        {/* White Overlay */}
        <div className="flex-grow bg-white bg-opacity-80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <main>
              <FeaturesSection />
              <HowItWorksSection />
              <About />
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Home;
