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
