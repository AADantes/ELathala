"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import supabase from "../../../../../config/supabaseClient"
import { ShopItem } from "../../types/shop-types"
import { usePurchasedFont } from "../../PurchasedFontContext"
import { useUuid } from "@/app/writingspace/UUIDContext"

interface PurchaseModalProps {
  item: ShopItem;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PurchaseModal({ item, onClose, onConfirm }: PurchaseModalProps) {
  const { addPurchasedFont } = usePurchasedFont();
  const [userUUID, setUserUUID] = useState<string | null>(null);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPurchased, setIsPurchased] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Start loading when fetching user data

      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser) {
          console.error("Error fetching authenticated user:", authError);
          setError("Failed to fetch user data.");
          return;
        }

        // Fetch user details from the database
        const { data, error } = await supabase
          .from("User")
          .select("id, userCredits")
          .eq("id", authUser.id)
          .single();

        if (error || !data) {
          console.error("Error fetching user data:", error);
          setError("Error fetching user details.");
          return;
        }

        // Set user UUID and credits
        setUserUUID(data.id);
        setUserCredits(data.userCredits);

        // Check if the user has already purchased the font
        const { data: existingPurchase, error: existingPurchaseError } = await supabase
          .from("FontPurchases")
          .select("id")
          .eq("userID", authUser.id) // Ensure userID is correct
          .eq("fontID", item.id) // Ensure fontID is correct
          .single(); // This ensures that only one row is returned

        if (existingPurchaseError) {
          console.error("Error checking existing purchases:", existingPurchaseError);
          setIsPurchased(false); // Handle error gracefully
          return;
        }

        if (existingPurchase) {
          setIsPurchased(true); // If purchase exists, set the state to purchased
          console.log("Purchase already exists.");
          return;
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("An error occurred while fetching user data.");
      } finally {
        setLoading(false); // End loading once data is fetched
      }
    };

    fetchUserData();
  }, [item.id]);

  const handlePurchase = async () => {
    if (loading || isPurchased) return; // Prevent purchase if already purchased or loading

    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      if (!userUUID || !userCredits) {
        setError("User data is missing!");
        return;
      }

      if (userCredits < item.price) {
        setError("You don't have enough credits!");
        return;
      }

      const newCredits = userCredits - item.price;
      const purchaseDate = new Date().toLocaleString();

      // Fetch the font name before inserting the purchase
      const { data: fontData, error: fontError } = await supabase
        .from("google_fonts_shop")
        .select("font_name")
        .eq("id", item.id)
        .single();

      if (fontError || !fontData) {
        throw new Error("Failed to fetch font name.");
      }

      const fontName = fontData.font_name;

      // Insert the purchase record into FontPurchases
      const { data: purchaseData, error: purchaseError } = await supabase
        .from("FontPurchases")
        .insert([{
          userID: userUUID,
          fontID: item.id,
          Price: item.price,
          purchaseDate,
          font_name: fontName,
        }]);

      if (purchaseError) {
        throw new Error(purchaseError.message);
      }

      // Update user's credits
      const { error: creditUpdateError } = await supabase
        .from("User")
        .update({ userCredits: newCredits })
        .eq("id", userUUID);

      if (creditUpdateError) {
        throw new Error(creditUpdateError.message);
      }

      // Add the purchased font to the context
      addPurchasedFont(fontName);

      // Mark as purchased and call onConfirm
      setIsPurchased(true);
      onConfirm(); // Notify parent component of successful purchase

      console.log("Purchase successful:", purchaseData);
    } catch (err: any) {
      console.error("Error during purchase:", err.message);
      setError(err.message || "An error occurred during the purchase.");
    } finally {
      setLoading(false); // End loading after purchase attempt
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-blue-100">
        <DialogHeader className="bg-blue-100">
          <DialogTitle>Confirm Purchase</DialogTitle>
          <DialogDescription>
            Please confirm your purchase for {item.name}. The price for this font is {item.price} credits.
            If you have enough credits, the purchase will be completed.
          </DialogDescription>
        </DialogHeader>

        <div className="border rounded-lg p-4 my-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2 text-center">Purchase Receipt</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Item:</span>
              <span>{item.name}</span>
            </div>
            <div className="border-t my-2 pt-2">
              <div className="flex justify-between font-medium">
                <span>Price:</span>
                <span>{item.price} Credits</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm my-2">
            {error}
          </div>
        )}

        <DialogFooter className="bg-blue-100 flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handlePurchase}
            disabled={loading || isPurchased}
          >
            {loading ? "Processing..." : "Confirm Purchase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
