// lib/fontPurchaseUtils.ts
import supabase from "../../../../config/supabaseClient"

/**
 * Checks if a font has already been purchased by a user.
 * @param userID - UUID of the user
 * @param fontID - ID of the font
 * @returns true if already purchased, false otherwise
 */
export async function hasPurchasedFont(userID: string, fontID: number): Promise<boolean> {
  const { data, error } = await supabase
    .from("FontPurchases")
    .select("id")
    .eq("userID", userID)
    .eq("fontID", fontID)
    .maybeSingle()

  if (error) {
    throw new Error("Error checking existing purchases.")
  }

  return !!data
}
