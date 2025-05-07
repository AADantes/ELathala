"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/app/shop/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/shop/ui/dialog";
import supabase from "../../../../config/supabaseClient";

interface PurchaseDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  credits: number;
  itemType: string;
  currentBalance?: number;
}

export function PurchaseDialog({
  children,
  title,
  description,
  credits,
  itemType,
  currentBalance = 250,
}: PurchaseDialogProps) {
  const [userCredits, setUserCredits] = useState<number>(currentBalance);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);  // To track if purchase is being processed

  useEffect(() => {
    const fetchUserCredits = async () => {
      setLoading(true);
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        console.error("Error fetching auth user:", authError);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("User")
        .select("userCredits")
        .eq("id", authUser.id)
        .single();

      if (error) {
        console.error("Error fetching user credits:", error);
        setLoading(false);
        return;
      }

      if (data) {
        setUserCredits(data.userCredits || 250);
      }

      setLoading(false);
    };

    fetchUserCredits();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  const newBalance = userCredits - credits;
  const isInsufficient = newBalance < 0;

  const handleConfirmPurchase = async () => {
    if (isInsufficient || isProcessing) return;
    
    setIsProcessing(true);  // Set processing to true

    // Here you would make the request to confirm the purchase
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
      console.error("Error fetching auth user:", authError);
      setIsProcessing(false);
      return;
    }

    const { error } = await supabase
      .from("User")
      .update({ userCredits: newBalance })
      .eq("id", authUser.id);

    if (error) {
      console.error("Error updating user credits:", error);
      setIsProcessing(false);
      return;
    }

    setUserCredits(newBalance);  // Update the state to reflect the new balance
    setIsProcessing(false);  // Reset processing
    alert("Purchase successful!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl shadow-xl border border-border bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4 text-sm">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-muted-foreground">Your current balance:</span>
            <span className="font-semibold">{userCredits} credits</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-muted-foreground">Cost of this {itemType}:</span>
            <span className="font-semibold text-destructive">- {credits} credits</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">New balance:</span>
            <span
              className={`font-bold ${isInsufficient ? "text-destructive" : "text-green-600"}`}
            >
              {newBalance} credits
            </span>
          </div>
          {isInsufficient && (
            <p className="text-sm text-destructive mt-2">
              Not enough credits to complete this purchase.
            </p>
          )}
        </div>

        <DialogFooter className="mt-4 flex gap-2">
          <Button
            variant="outline"
            className="w-full bg-white text-black border border-gray-400 rounded-lg py-2 px-4 transition-colors duration-300 hover:bg-black hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black"
            onClick={() => alert("Canceled")}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            disabled={isInsufficient || isProcessing}
            className="w-full bg-black text-white rounded-lg py-2 px-4 transition-colors duration-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            onClick={handleConfirmPurchase}
          >
            {isProcessing ? "Processing..." : "Confirm Purchase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
