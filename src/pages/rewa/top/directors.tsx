import { TopCategory } from '~/components/top-category';
import { defaultQps } from '~/data/query-params';
import { trpcVanilla } from '~/trpc/client';
import { type StaticProps } from '~/utils/general-types';

const field = 'director';
const movieMode = 'rewa';

export const getStaticProps = async () => {
  const response = await trpcVanilla.getLeaderboard.query({
    field,
    params: { ...defaultQps, movieMode },
  });
  return { props: response };
};

export default function TopActors({ people }: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={people} field={field} movieMode={movieMode} />;
}
