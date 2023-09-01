import { TopCategory } from '~/components/top-category';
import { getCrew } from '~/data/top-people';
import { StaticProps } from '~/types';

export const getStaticProps = async () => {
  const people = await getCrew('producer');
  return { props: { people } };
};

export default function TopProducers({ people }: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={people} title="Top Producers" />;
}
