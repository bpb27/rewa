import { TopCategory } from '~/components/top-category';
import { StaticProps } from '~/types';
import { getActors } from '~/data/top-people';

export const getStaticProps = async () => {
  const people = await getActors();
  return { props: { people } };
};

export default function TopActors({ people }: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={people} title="Top Actors" />;
}
