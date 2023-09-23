import { type PropsWithChildren } from 'react';

const newTab = { target: '_blank', rel: 'noopener noreferrer' };

export const ImdbLink = ({
  children,
  className,
  id,
}: PropsWithChildren<{ className?: string; id: string }>) => (
  <a href={`https://www.imdb.com/title/${id}/`} className={className} {...newTab}>
    {children}
  </a>
);

export const SpotifyLink = ({
  children,
  className,
  url,
}: PropsWithChildren<{ className?: string; url: string }>) => (
  <a href={url} className={className} {...newTab}>
    {children}
  </a>
);
