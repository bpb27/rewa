import { getTopCrew } from '~/api/get-top-crew';
import { TopCategory } from '~/components/top-category';
import { StaticProps } from '~/types';

export const getStaticProps = async () => {
  const people = await getTopCrew('cinematographer');
  return { props: { people } };
};

export default function TopCinematographer({ people }: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={people} title="Top Cinematographers" />;
}
