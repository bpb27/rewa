import { db } from '~/db/db';
import { pick } from 'remeda';
import { TopCategory } from '~/components/top-category';
import { StaticProps } from '~/types';

export const getStaticProps = () => {
  const actors = db.topActors(
    35,
    (actor) => pick(actor, ['id', 'name', 'profile_path']),
    (movie) => pick(movie, ['id', 'title', 'poster_path', 'release_date'])
  );
  return { props: { actors } };
};

export default function TopActors({
  actors,
}: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={actors} title="Top Actors" />;
}
