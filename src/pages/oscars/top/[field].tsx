import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getLeaderboard } from '~/api/get-leaderboard';
import { TopCategory } from '~/components/top-category';
import { defaultQps } from '~/data/query-params';
import { appEnums } from '~/utils/enums';

const movieMode = 'oscar' as const;
const topFields = appEnums.topCategory.values;

export const getStaticPaths = (async () => ({
  paths: topFields.map(field => ({ params: { field } })),
  fallback: false,
})) satisfies GetStaticPaths;

export const getStaticProps = (async context => {
  const field = context.params?.field as (typeof topFields)[number];
  const params = { ...defaultQps, movieMode };
  const people = await getLeaderboard({ field, params });
  return { props: { field, people } };
}) satisfies GetStaticProps;

export default function TopActors({
  field,
  people,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <TopCategory people={people} field={field} movieMode={movieMode} />;
}
