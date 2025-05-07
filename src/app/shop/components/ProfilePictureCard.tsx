'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardFooter, CardTitle } from '@/app/shop/ui/card';
import { Button } from '@/app/shop/ui/button';
import { PurchaseDialog } from '@/app/shop/components/purchase-dialog';
import supabase from '../../../../config/supabaseClient';

interface ProfilePicture {
  id: string;
  title: string;
  imageUrl: string;
  credits: number;
}

// Reusable Card Component with styling enhancements
export function ProfilePictureCard({ picture }: { picture: ProfilePicture }) {
  return (
    <Card
      key={picture.id}
      className="overflow-hidden shadow-lg rounded-lg transition-transform transform hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative h-48 w-full">
        <Image
          src={picture.imageUrl}
          alt={picture.title}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL="/placeholder.png" // fallback placeholder
        />
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2">
          <CardTitle className="text-white text-sm font-medium">{picture.title}</CardTitle>
        </div>
      </div>

      <CardFooter className="flex justify-between items-center px-4 py-3 bg-muted">
        <span className="font-semibold text-primary">{picture.credits} credits</span>
        <PurchaseDialog
          title={`Buy ${picture.title}`}
          description="Use this image as your profile picture."
          credits={picture.credits}
          itemType="profile-picture"
        >
          <Button size="sm" variant="secondary">Buy</Button>
        </PurchaseDialog>
      </CardFooter>
    </Card>
  );
}

// Main component
export default function ProfilePicturecomponents() {
  const [pictures, setPictures] = useState<ProfilePicture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPictures = async () => {
      setLoading(true);

      const { data: metadata, error } = await supabase
        .from('ProfilePictures')
        .select('id, picFilename, title, picPrice');

      if (error) {
        console.error('Error fetching picture metadata:', error);
        setLoading(false);
        return;
      }

      const enrichedPictures = metadata.map((pic) => {
        const { data: urlData } = supabase
          .storage
          .from('profile-pictures')
          .getPublicUrl(pic.picFilename);

        return {
          id: pic.id,
          title: pic.title,
          imageUrl: urlData?.publicUrl || '',
          credits: pic.picPrice,
        };
      });

      setPictures(enrichedPictures);
      setLoading(false);
    };

    fetchPictures();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading profile pictures...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {pictures.map((pic) => (
        <ProfilePictureCard key={pic.id} picture={pic} />
      ))}
    </div>
  );
}
