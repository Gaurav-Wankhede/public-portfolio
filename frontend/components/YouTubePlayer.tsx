'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

interface YouTubePlayerProps {
  url: string;
  className?: string;
}

const YouTubePlayer = ({ url, className = '' }: YouTubePlayerProps) => {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(url);
  if (!videoId || !isClient) return null;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{
        width: '100%',
        paddingTop: '56.25%' // 16:9 aspect ratio
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
        title="YouTube Video Player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full border-0"
        loading="lazy"
      />
    </div>
  );
};

export default dynamic(() => Promise.resolve(YouTubePlayer), {
  ssr: false
});
