'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Edit, Trash2, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Certificate {
  slug: string;
  name: string;
  issuer: string;
  link: string;
  issue_date: string;
  image_url?: string;
}

interface CertificateCardProps {
  certificate: Certificate;
  onEdit: (certificate: Certificate) => void;
  onDelete: (slug: string) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onEdit,
  onDelete,
}) => {
  return (
    <article
      className={cn(
        'group relative bg-card border rounded-lg overflow-hidden transition-all duration-300',
        'hover:shadow-lg hover:border-primary/50 hover:-translate-y-1',
        'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2'
      )}
      aria-label={`Certificate: ${certificate.name}`}
    >
      {/* Certificate Image */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {certificate.image_url ? (
          <>
            <Image
              src={certificate.image_url}
              alt={`${certificate.name} certificate`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Award className="h-16 w-16 text-muted-foreground/30" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {certificate.name}
          </h3>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="font-medium">{certificate.issuer}</span>
            <time
              dateTime={certificate.issue_date}
              aria-label={`Issued on ${new Date(certificate.issue_date).toLocaleDateString()}`}
            >
              {new Date(certificate.issue_date).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </time>
          </div>
        </div>

        {/* External Link */}
        <div>
          <a
            href={certificate.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md w-full justify-center',
              'bg-secondary text-secondary-foreground hover:bg-secondary/80',
              'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
            aria-label="View certificate credentials"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            View Credentials
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t" role="group" aria-label="Actions">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(certificate)}
            className="flex-1"
            aria-label={`Edit ${certificate.name}`}
          >
            <Edit className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(certificate.slug)}
            className="flex-1"
            aria-label={`Delete ${certificate.name}`}
          >
            <Trash2 className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
};
