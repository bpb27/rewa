import { getMovies } from '~/api/get-movies';
import { MoviesPage } from '~/components/movie-table-page';
import { defaultQps } from '~/data/query-params';
import { type StaticProps } from '~/utils/general-types';

export const getStaticProps = async () => {
  const initialData = await getMovies(defaultQps);
  const props = { initialData: { ...initialData, tokens: [] } };
  return { props };
};

export default function Movies({ initialData }: StaticProps<typeof getStaticProps>) {
  return <MoviesPage initialData={initialData} />;
}
