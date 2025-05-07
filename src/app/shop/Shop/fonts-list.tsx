"use client";

import { useEffect, useState, useContext } from "react";
import { FontCard } from "@/app/shop/Shop/font-card";
import supabase from "../../../../config/supabaseClient";
import { UserContext } from "../userContext";

export function FontsList() {
  const { userID } = useContext(UserContext); // Assuming this provides the user's ID
  const [fonts, setFonts] = useState<any[]>([]); // List of fonts from the database
  const [userCredits, setUserCredits] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch fonts and user credits
  useEffect(() => {
    const fetchData = async () => {
      // Fetch fonts from the database
      const { data: fontsData, error: fontsError } = await supabase
        .from("fonts")
        .select("*");

      // Fetch user's credits
      const { data: userData, error: userError } = await supabase
        .from("User")
        .select("userCredits")
        .eq("uuid", userID)
        .single();

      if (fontsError) {
        console.error("Error fetching fonts:", fontsError);
      } else {
        setFonts(fontsData); // Set fonts data
      }

      if (userError) {
        console.error("Error fetching user data:", userError);
      } else {
        setUserCredits(userData?.userCredits || 0); // Set user credits
      }

      setLoading(false); // Set loading to false after fetching data
    };

    if (userID) {
      fetchData();
    }
  }, [userID]);

  if (loading) {
    return <div>Loading fonts...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fonts.map((font) => (
        <FontCard key={font.id} font={font} />
      ))}
    </div>
  );
}
