/*
    movie or person
    name
    image + theater
    tagline
    description
    character
    award?
*/

import { MoviePoster, PersonPoster } from '../images';
import { Crate } from './box';
import { Text } from './text';

type SpotlightProps = {
  name: string;
  image: string;
  description?: string;
  tagline?: string;
  variant?: 'movie' | 'person';
};

export const Spotlight = ({
  description,
  image,
  name,
  tagline,
  variant = 'movie',
}: SpotlightProps) => (
  <Crate column gap={2} alignCenter className="w-full">
    <Text size="xl" bold textAlign="center">
      {name}
    </Text>
    <div className="flex w-full justify-center rounded-xl border-2 border-solid border-slate-900 bg-gradient-to-r from-slate-500 via-slate-900 to-slate-500">
      {variant === 'movie' && <MoviePoster image={image} title={name} variant="card" />}
      {variant === 'person' && <PersonPoster image={image} name={name} variant="card" />}
    </div>
    {tagline && (
      <Text secondary textAlign="center">
        {tagline}
      </Text>
    )}
    {description && <Text>{description}</Text>}
  </Crate>
);
