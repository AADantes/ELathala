'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Card, CardHeader, CardFooter, CardTitle } from '@/app/shop/ui/card';
import { Button } from '@/app/shop/ui/button';
import { PurchaseDialog } from '@/app/shop/Shop/purchase-dialog';

interface ProfilePicture {
  id: string;
  picFilename:string;
  title: string;
  picUrl: string;
  credits: number;
}

// Reusable Card Component
export function ProfilePictureCard({ picture }: { picture: ProfilePicture }) {
  return (
    <Card key={picture.id} className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={picture.picUrl}
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

