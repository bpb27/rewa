import { getTopActors } from '~/api/get-top-actors';
import { TopCategory } from '~/components/top-category';
import { type StaticProps } from '~/utils/general-types';

export const getStaticProps = async () => {
  const people = await getTopActors({ mode: 'oscars' });
  return { props: { people } };
};

export default function TopActors({ people }: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={people} category="actor" mode="oscars" />;
}
