import { getLeaderboard } from '~/api/get-leaderboard';
import { TopCategory } from '~/components/top-category';
import { defaultQps } from '~/data/query-params';
import { type StaticProps } from '~/utils/general-types';

const field = 'director';
const movieMode = 'rewa';

export const getStaticProps = async () => {
  const people = await getLeaderboard({
    field,
    params: { ...defaultQps, movieMode },
  });
  return { props: { people } };
};

export default function TopActors({ people }: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={people} field={field} movieMode={movieMode} />;
}
