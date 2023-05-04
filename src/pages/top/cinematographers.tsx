import { db } from '~/db/db';
import { pick } from 'remeda';
import { TopCategory } from '~/components/top-category';
import { StaticProps } from '~/types';

export const getStaticProps = () => {
  const cinematographers = db.topCrew(
    35,
    'cinematographer',
    (crew) => pick(crew, ['id', 'name', 'profile_path']),
    (movie) => pick(movie, ['id', 'title', 'poster_path', 'release_date'])
  );
  return { props: { cinematographers } };
};

export default function TopCinematographer({
  cinematographers,
}: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={cinematographers} title="Top Cinematographers" />;
}
