import { PropsWithChildren } from 'react';

export const ImdbLink = ({
  children,
  className,
  id,
}: PropsWithChildren<{ className?: string; id: string }>) => (
  <a
    href={`https://www.imdb.com/title/${id}/`}
    target="_blank"
    rel="noopener noreferrer"
    className={className}
  >
    {children}
  </a>
);

export const SpotifyLink = ({
  children,
  className,
  url,
}: PropsWithChildren<{ className?: string; url: string }>) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
    {children}
  </a>
);

import React from 'react';

export const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);
