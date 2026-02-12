'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { PlaceHolderImages, ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useLanguage } from '@/context/language-provider';

interface EditAvatarDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAvatarSelect: (url: string) => void;
}

export function EditAvatarDialog({
  isOpen,
  onOpenChange,
  onAvatarSelect,
}: EditAvatarDialogProps) {
  const { t } = useLanguage();
  const avatarImages = PlaceHolderImages.filter(img => img.id.startsWith('avatar-'));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.editAvatarTitle}</DialogTitle>
          <DialogDescription>
            {t.editAvatarDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          {avatarImages.map((avatar: ImagePlaceholder) => (
            <button
              key={avatar.id}
              onClick={() => onAvatarSelect(avatar.imageUrl)}
              className="rounded-full overflow-hidden aspect-square border-2 border-transparent hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Image
                src={avatar.imageUrl}
                alt={avatar.description}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
