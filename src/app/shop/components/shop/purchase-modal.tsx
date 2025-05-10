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
        const { data: existingPurchase, error: existingPurchaseError, status } = await supabase
          .from("FontPurchases")
          .select("id")
          .eq("userID", authUser.id)
          .eq("fontID", item.id)
          .single();

        if (existingPurchaseError && status !== 406) {
          // Only log real errors, not "no rows"
          console.error("Error checking existing purchases:", existingPurchaseError);
          setIsPurchased(false);
          return;
        }

        if (existingPurchase) {
          setIsPurchased(true);
          console.log("Purchase already exists.");
          return;
        }
        setIsPurchased(false); // Not purchased if no data and no real error
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
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="bg-white">
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

        <DialogFooter className="bg-white flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="border border-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg shadow hover:bg-gray-100 hover:text-black transition-all duration-200 flex items-center gap-2"
          >
            <svg className="h-5 w-5 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={loading || isPurchased}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-2 rounded-lg shadow transition-all duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-1 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v.01" />
                </svg>
                Confirm Purchase
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
