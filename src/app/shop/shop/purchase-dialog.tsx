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
import supabase from "../../../../config/supabaseClient"; // Import your Supabase client

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
  const [userCredits, setUserCredits] = useState<number>(currentBalance); // Default to 250 if not fetched
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserCredits = async () => {
      setLoading(true);

      // Get the currently authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        console.error("Error fetching auth user:", authError);
        setLoading(false);
        return;
      }

      console.log("Authenticated UID:", authUser.id);

      // Fetch user credits from User table using auth_user_id
      const { data, error } = await supabase
        .from("User")
        .select("userCredits")
        .eq("id", authUser.id) // Match by UID
        .single();

      if (error) {
        console.error("Error fetching user credits:", error);
        setLoading(false);
        return;
      }

      if (data) {
        setUserCredits(data.userCredits || 250); // Use 250 as fallback if credits are not set
      }

      setLoading(false);
    };

    fetchUserCredits();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center justify-between py-2 border-b">
            <span>Your current balance:</span>
            <span className="font-bold">{userCredits} credits</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span>Cost:</span>
            <span className="font-bold text-primary">-{credits} credits</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>New balance after purchase:</span>
            <span className="font-bold">{userCredits - credits} credits</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm Purchase</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
