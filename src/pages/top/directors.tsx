import { getTopCrew } from '~/api/get-top-crew';
import { TopCategory } from '~/components/top-category';
import { StaticProps } from '~/types';

export const getStaticProps = async () => {
  const people = await getTopCrew('director');
  return { props: { people } };
};

export default function TopDirectors({ people }: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={people} title="Top Directors" />;
}
