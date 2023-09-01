import { TopCategory } from '~/components/top-category';
import { getCrew } from '~/data/top-people';
import { StaticProps } from '~/types';

export const getStaticProps = async () => {
  const people = await getCrew('writer');
  return { props: { people } };
};

export default function TopWriters({ people }: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={people} title="Top Writers" />;
}
