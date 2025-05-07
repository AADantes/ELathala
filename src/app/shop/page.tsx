'use client';

import { Button } from "../shop/ui/button";
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shop/ui/tabs";
import { CreditDisplay } from "../shop/components/credit-display";
import { ProfilePicturesList } from "../shop/components/ProfilePictureList";
import { FontsList } from "../shop/components/fonts-list";
import { FeaturesList } from "../shop/components/features-list";
import { Header } from "../homepage/components/Header";
import { FaUserCircle, FaFont, FaCogs } from "react-icons/fa"; // Import icons from react-icons
import supabase from "../../../config/supabaseClient";

export default function Shop() {
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCredits = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) {
          console.log('No authenticated user found');
          return;
        }

        const { data, error } = await supabase
          .from('User')
          .select('userCredits')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setUserCredits(data.userCredits);
      } catch (error) {
        console.error('Error fetching user credits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCredits();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome to the ELathala Shop!</h1>
            <p className="text-muted-foreground mt-1"></p>
          </div>
          <CreditDisplay credits={userCredits ?? 0} />
        </div>

        <Tabs defaultValue="premium-articles" className="w-full">
          <TabsList className="flex w-full gap-4 mb-8">
            <TabsTrigger 
              value="fonts" 
              className="flex-1 text-center bg-white text-black border border-gray-300 rounded-lg px-4 py-2 font-semibold shadow-sm hover:bg-gray-200 hover:shadow-sm transition-all duration-200 transform data-[state=active]:scale-100 data-[state=active]:bg-gray-900 data-[state=active]:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FaFont className="inline-block mr-2 w-4 h-4" /> {/* Font icon */}
              Writing Fonts
            </TabsTrigger>
          </TabsList>


          <TabsContent value="fonts" className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Writing Fonts</h2>
            <FontsList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
