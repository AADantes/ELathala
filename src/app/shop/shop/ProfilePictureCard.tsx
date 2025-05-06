'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardFooter, CardTitle } from '@/app/shop/ui/card';
import { Button } from '@/app/shop/ui/button';
import { PurchaseDialog } from '@/app/shop/Shop/purchase-dialog';
import supabase from '../../../../config/supabaseClient';

interface ProfilePicture {
  id: string;
  title: string;
  imageUrl: string;
  credits: number;
}

// Reusable Card Component
export function ProfilePictureCard({ picture }: { picture: ProfilePicture }) {
  return (
    <Card key={picture.id} className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={picture.imageUrl}
          alt={picture.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{picture.title}</CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <span className="font-bold text-primary">{picture.credits} credits</span>
        <PurchaseDialog
          title={`Buy ${picture.title}`}
          description="Use this image as your profile picture."
          credits={picture.credits}
          itemType="profile-picture"
        >
          <Button size="sm">Buy</Button>
        </PurchaseDialog>
      </CardFooter>
    </Card>
  );
}

// Main Shop Component
export default function ProfilePictureShop() {
  const [pictures, setPictures] = useState<ProfilePicture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPictures = async () => {
      setLoading(true);

      // Step 1: Fetch metadata from your Supabase table
      const { data: metadata, error } = await supabase
        .from('ProfilePictures') // Table name
        .select('id, picFilename, title, picPrice');

      if (error) {
        console.error('Error fetching picture metadata:', error);
        setLoading(false);
        return;
      }

      // Step 2: Generate public URLs from filenames
      const enrichedPictures = metadata.map((pic) => {
        const { data: urlData } = supabase
          .storage
          .from('profile-pictures') // Bucket name
          .getPublicUrl(pic.picFilename);

        return {
          id: pic.id,
          title: pic.title,
          imageUrl: urlData?.publicUrl || '', // fallback empty string
          credits: pic.picPrice,
        };
      });

      setPictures(enrichedPictures);
      setLoading(false);


    };

    fetchPictures();
  }, []);

  if (loading) return <p>Loading profile pictures...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {pictures.map((pic) => (
        <ProfilePictureCard key={pic.id} picture={pic} />
      ))}
    </div>
  );
}
