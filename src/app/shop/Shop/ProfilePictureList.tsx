'use client';

import { useEffect, useState } from "react";
import { ProfilePictureCard } from "@/app/shop/Shop/ProfilePictureCard";
import supabase from "../../../../config/supabaseClient";

// Define the interface for a profile picture
interface ProfilePicture {
  id: string;
  picFilename: string;
  title: string;
  picUrl: string;
  credits: number;
}

// Define the type for the props, including the logData function
interface ProfilePicturesListProps {
  logData: (data: ProfilePicture[]) => void;
}

export function ProfilePicturesList({ logData }: ProfilePicturesListProps) {
  const [pictures, setPictures] = useState<ProfilePicture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null); // Reset error state before starting the fetch

      const { data: records, error: fetchError } = await supabase
        .from("ProfilePictures")
        .select("id, picFilename, title, picPrice, picUrl");

      if (fetchError || !records) {
        console.error("Error fetching metadata from table:", fetchError);
        setError("Failed to load profile pictures.");
        setLoading(false);
        return;
      }

      // Map directly using picUrl from the database
      const validPictures: ProfilePicture[] = records.map((record) => ({
        id: record.id,
        picFilename: record.picFilename,
        title: record.title,
        picUrl: record.picUrl,
        credits: record.picPrice, // Ensure `picPrice` is available and is a number
      }));

      // Log the data to the console
      logData(validPictures);  // Call the logData function passed from parent

      setPictures(validPictures);
      setLoading(false);
    };

    fetchImages();
  }, [logData]);  // Dependency array includes logData to ensure it's used properly

  if (loading) {
    return <div>Loading profile pictures...</div>;
  }

  if (error) {
    return <div>{error}</div>;  // Show error message if there's an issue with fetching
  }

  if (pictures.length === 0) {
    return <div>No profile pictures available.</div>; // Show empty state if no pictures exist
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pictures.map((picture) => (
        <ProfilePictureCard key={picture.id} picture={picture} />
      ))}
    </div>
  );
}
