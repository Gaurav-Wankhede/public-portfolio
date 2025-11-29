'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

interface CertificateFormData {
  name: string;
  issuer: string;
  link: string;
  issue_date: string;
}

interface CertificateFormProps {
  data: CertificateFormData;
  isEditing: boolean;
  imageFile: File | null;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

export const CertificateForm: React.FC<CertificateFormProps> = ({
  data,
  isEditing,
  imageFile,
  onSubmit,
  onChange,
  onImageChange,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="mb-8 bg-card border rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Certificate' : 'Add New Certificate'}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="name" className="block mb-1">
            Certificate Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={data.name}
            onChange={onChange}
            required
            className="w-full"
            placeholder="e.g., AWS Certified Solutions Architect"
          />
        </div>

        <div>
          <Label htmlFor="issuer" className="block mb-1">
            Issuing Organization
          </Label>
          <Input
            type="text"
            id="issuer"
            name="issuer"
            value={data.issuer}
            onChange={onChange}
            required
            className="w-full"
            placeholder="e.g., Amazon Web Services"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="link" className="block mb-1">
            Credential URL
          </Label>
          <Input
            type="url"
            id="link"
            name="link"
            value={data.link}
            onChange={onChange}
            required
            className="w-full"
            placeholder="https://credentials.example.com/verify"
          />
        </div>

        <div>
          <Label htmlFor="issue_date" className="block mb-1">
            Issue Date
          </Label>
          <Input
            type="date"
            id="issue_date"
            name="issue_date"
            value={data.issue_date}
            onChange={onChange}
            required
            className="w-full"
          />
        </div>
      </div>

      <div className="mb-6">
        <Label htmlFor="image" className="block mb-1">
          Certificate Image
        </Label>
        <Input
          type="file"
          id="image"
          name="image"
          onChange={onImageChange}
          className="w-full"
          accept="image/*"
        />
        {imageFile && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Selected: {imageFile.name}
            </p>
            <div className="relative w-full max-w-md h-48">
              <Image
                src={URL.createObjectURL(imageFile)}
                alt="Certificate preview"
                fill
                className="object-contain rounded-md"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit">{isEditing ? 'Update Certificate' : 'Create Certificate'}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
