import { getTopCrew } from '~/api/get-top-crew';
import { TopCategory } from '~/components/top-category';
import { StaticProps } from '~/utils/general-types';

export const getStaticProps = async () => {
  const people = await getTopCrew({ job: 'writer', mode: 'oscars' });
  return { props: { people } };
};

export default function TopWriters({ people }: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={people} category="writer" />;
}
