"use client";

import { useState, useContext, useEffect } from "react";
import { Type, Zap, CreditCard } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/shop/ui/card";
import { Button } from "@/app/shop/ui/button";
import supabase from "../../../../config/supabaseClient";
import { UserContext } from "../userContext";
import type { Font } from "@/app/shop/lib/shop-data"; // Import the Font type

interface FontCardProps {
  font: Font; // Define the 'font' prop type as Font
}

export function FontCard({ font }: FontCardProps) {
  const { userID } = useContext(UserContext); // Assuming this provides the user's ID
  const [userCredits, setUserCredits] = useState<number>(0);
  const [hasFont, setHasFont] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user credits and font ownership
  useEffect(() => {
    const fetchData = async () => {
      if (!userID) return;

      const { data: userData, error: userError } = await supabase
        .from("User")
        .select("userCredits")
        .eq("uuid", userID)
        .single();

      const { data: fontData } = await supabase
        .from("user_fonts")
        .select("font_id")
        .eq("user_id", userID)
        .eq("font_id", font.id);

      if (userData) setUserCredits(userData.userCredits);
      if (fontData && fontData.length > 0) setHasFont(true);

      setLoading(false);
    };

    fetchData();
  }, [userID, font.id]);

  // Handle font purchase
  const handleBuyFont = async () => {
    if (userCredits < font.credits) {
      alert("You don't have enough credits to purchase this font.");
      return;
    }

    const { error: creditError } = await supabase
      .from("User")
      .update({ userCredits: userCredits - font.credits })
      .eq("uuid", userID);

    const { error: fontError } = await supabase
      .from("user_fonts")
      .insert([{ user_id: userID, font_id: font.id }]);

    if (!creditError && !fontError) {
      setUserCredits((prev) => prev - font.credits);
      setHasFont(true);
      alert("Font purchased successfully!");
    } else {
      console.error("Purchase error:", creditError || fontError);
      alert("Failed to purchase font. Please try again.");
    }
  };

  return (
    <Card key={font.id}>
      <CardHeader>
        <CardTitle>{font.name}</CardTitle>
        <CardDescription>{font.style}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="h-24 flex items-center justify-center border rounded-md p-4 mb-4"
          style={{ fontFamily: font.previewFontFamily }}
        >
          <p className="text-xl">The quick brown fox jumps over the lazy dog</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Type className="h-4 w-4 mr-1" />
            <span>{font.weights} weights</span>
          </div>
          {font.ligatures && (
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              <span>Ligatures</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          <CreditCard className="h-4 w-4 mr-1 text-primary" />
          <span className="font-bold">{font.credits} credits</span>
        </div>
        <Button
          size="sm"
          disabled={loading || hasFont || userCredits < font.credits}
          onClick={handleBuyFont}
        >
          <Type className="h-4 w-4 mr-2" />
          {hasFont ? "Owned" : "Buy Font"}
        </Button>
      </CardFooter>
    </Card>
  );
}
