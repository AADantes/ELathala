'use client';

import { Button } from "../shop/ui/button"
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shop/ui/tabs"
import { CreditDisplay } from "./Shop/credit-display"
import { ProfilePicturesList } from "./Shop/ProfilePictureList"
import { FontsList } from "./Shop/fonts-list"
import { FeaturesList } from "./Shop/features-list"
import supabase from "../../../config/supabaseClient"

export default function Shop() {

  const [userCredits, setUserCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch user credits based on the authUser.id
    const fetchUserCredits = async () => {
      try {
        // Await the response to get the actual user object
        const {
          data: { user },
          error: authError
        } = await supabase.auth.getUser();
    
        if (authError) throw authError;
        if (!user) {
          console.log('No authenticated user found');
          return;
        }
    
        // Now you can safely use user.id
        const { data, error } = await supabase
          .from('User') // or from('"User"') if the table name is case-sensitive
          .select('username, userLevel, usercurrentExp, userCredits')
          .eq('id', user.id) // Match by the user's UID
          .single();
    
        if (error) {
          throw error;
        }
    
        console.log('Fetched user data:', data);
        // Do something with the fetched data (e.g., set state)
      } catch (error) {
        console.error('Error fetching user credits:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch user credits when the component mounts
    fetchUserCredits();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
          <p className="text-muted-foreground mt-1">
          </p>
        </div>
        <CreditDisplay credits={250} />
      </div>

      <Tabs defaultValue="premium-articles" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="premium-articles">Profile Pictures</TabsTrigger>
          <TabsTrigger value="fonts">Writing Fonts</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
        </TabsList>

        <TabsContent value="premium-articles" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Profile Pictures</h2>
          <ProfilePicturesList />
        </TabsContent>

        <TabsContent value="fonts" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Writing Fonts</h2>
          <FontsList />
        </TabsContent>

        <TabsContent value="customization" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Customization Features</h2>
          <FeaturesList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
