import Image, { type ImageProps } from 'next/image';
import { cn } from '~/utils/style';

// predefined tmdb image cache sizes for movie posters
const tmdbMoviePosterPath = (path: string, w: 92 | 154 | 185 | 342 | 500 | 780): string =>
  `https://image.tmdb.org/t/p/w${w}${path}`;

// predefined tmdb image cache sizes for person posters
const tmdbPersonPosterPath = (path: string, w: 45 | 185 | 632): string =>
  `https://image.tmdb.org/t/p/w${w}${path}`;

const movieImage = ({ name, path, size }: { name: string; path: string; size: number }) => {
  const props = {
    width: size,
    height: size * 1.66,
    alt: `Movie poster for ${name}`,
    unoptimized: true,
    src: '',
  } satisfies ImageProps;
  if (size <= 70) {
    props.src = tmdbMoviePosterPath(path, 92);
  } else if (size <= 185) {
    props.src = tmdbMoviePosterPath(path, 185);
  } else if (size <= 342) {
    props.src = tmdbMoviePosterPath(path, 342);
  } else {
    props.src = tmdbMoviePosterPath(path, 500);
  }
  return props;
};

const personImage = ({ name, path, size }: { name: string; path?: string; size: number }) => {
  const props = {
    width: size,
    height: size * 1.66,
    alt: `Headshot for ${name}`,
    unoptimized: true,
    src: '',
  } satisfies ImageProps;
  if (!path) {
    props.src = '/profile-pic-empty.jpg';
  } else if (size < 200) {
    props.src = tmdbPersonPosterPath(path, 185);
  } else {
    props.src = tmdbPersonPosterPath(path, 632);
  }
  return props;
};

const MOVIE_POSTER_VARIANT_SIZES = {
  table: 62,
  card: 154,
  leaderboard: 92,
};

export const MoviePoster = ({
  className,
  onClick,
  poster_path,
  title,
  variant,
}: {
  className?: string;
  onClick?: () => void;
  poster_path: string;
  title: string;
  variant: keyof typeof MOVIE_POSTER_VARIANT_SIZES;
}) => {
  const imageProps = movieImage({
    name: title,
    path: poster_path,
    size: MOVIE_POSTER_VARIANT_SIZES[variant],
  });
  return (
    <Image
      className={cn('shrink-0 grow-0 border-2 border-solid border-slate-700', className)}
      onClick={onClick}
      {...imageProps}
      alt={imageProps.alt}
    />
  );
};

const PERSON_POSTER_VARIANT_SIZES = {
  table: 62,
  card: 150,
  leaderboard: 185,
  tooltip: 185,
};

export const PersonPoster = ({
  className,
  name,
  onClick,
  poster_path,
  variant,
}: {
  className?: string;
  name: string;
  onClick?: () => void;
  poster_path: string | null | undefined;
  variant: keyof typeof PERSON_POSTER_VARIANT_SIZES;
}) => {
  const imageProps = personImage({
    name,
    path: poster_path ?? undefined,
    size: PERSON_POSTER_VARIANT_SIZES[variant],
  });
  return (
    <Image
      className={cn('border-2 border-solid border-slate-700', className)}
      onClick={onClick}
      {...imageProps}
      alt={imageProps.alt}
    />
  );
};
