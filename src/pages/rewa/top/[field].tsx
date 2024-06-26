import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getLeaderboard } from '~/apik/get-leaderboard';
import { TopCategory } from '~/components/top-category';
import { QpSchema, assembleUrl, defaultQps } from '~/data/query-params';
import { AppEnums, appEnums } from '~/utils/enums';
import { NAV } from '~/utils/nav-routes';

const movieMode = 'rewa' as const;

export const getStaticPaths = (async () => ({
  paths: appEnums.topCategory.values.map(field => ({ params: { field } })),
  fallback: false,
})) satisfies GetStaticPaths;

export const getStaticProps = (async context => {
  const params: QpSchema = { ...defaultQps, movieMode };
  const field = context.params?.field as AppEnums['topCategory'];
  const subField: AppEnums['topCategorySub'] = 'mostFilms';
  const leaderboard = await getLeaderboard({ field, subField, params });
  return {
    props: {
      field,
      subField,
      preloaded: {
        data: { ...leaderboard, tokens: [] },
        url: assembleUrl(NAV.rewa.top[field], params),
      },
    },
  };
}) satisfies GetStaticProps;

// NB: need to pass a key to trigger component remounting when navigating across pages
export default function Top({
  field,
  preloaded,
  subField,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <TopCategory
      key={field}
      preloaded={preloaded}
      field={field}
      movieMode={movieMode}
      subField={subField}
    />
  );
}
