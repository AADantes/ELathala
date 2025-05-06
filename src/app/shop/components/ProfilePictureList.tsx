"use client";

import { useEffect, useState } from "react";
import { ProfilePictureCard } from "@/app/shop/components/ProfilePictureCard";
import supabase from "../../../../config/supabaseClient";

interface ProfilePicture {
  id: string;
  title: string;
  imageUrl: string;
  credits: number;
  name: string; // filename
}

export function ProfilePicturesList() {
  const [pictures, setPictures] = useState<ProfilePicture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);

      const { data: records, error: fetchError } = await supabase
        .from("ProfilePictures")
        .select("id, picFilename, title, picPrice");

      if (fetchError || !records) {
        console.error("Error fetching metadata from table:", fetchError);
        setLoading(false);
        return;
      }

      const imagesWithUrls = await Promise.all(
        records.map(async (record) => {
          const { data: urlData } = supabase
            .storage
            .from("profile-pictures")
            .getPublicUrl(record.picFilename);

          if (!urlData?.publicUrl) {
            console.warn(`Missing public URL for: ${record.picFilename}`);
            return null;
          }

          return {
            id: record.id,
            title: record.title,
            name: record.picFilename,
            imageUrl: urlData.publicUrl,
            credits: record.picPrice,
          };
        })
      );

      const validPictures = imagesWithUrls.filter(
        (pic): pic is ProfilePicture => pic !== null
      );

      setPictures(validPictures);
      setLoading(false);
    };

    fetchImages();
  }, []);

  if (loading) {
    return <div>Loading profile pictures...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pictures.map((picture) => (
        <ProfilePictureCard key={picture.id} picture={picture} />
      ))}
    </div>
  );
}
