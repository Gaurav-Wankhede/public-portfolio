import '@/app/globals.css';
import { siteMetadata } from '../metadata';

// Metadata is now handled in page.tsx to avoid conflicts
// Next.js prioritizes metadata from page.tsx over layout.tsx

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={siteMetadata.language} suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}