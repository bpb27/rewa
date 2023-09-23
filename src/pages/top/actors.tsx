import { getTopActors } from '~/api/get-top-actors';
import { TopCategory } from '~/components/top-category';
import { type StaticProps } from '~/types';

export const getStaticProps = async () => {
  const people = await getTopActors();
  return { props: { people } };
};

export default function TopActors({ people }: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={people} title="Top Actors" fetchPersonOnClick />;
}
