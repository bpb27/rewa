import { getTopOscarDirectors } from '~/api/get-top-oscar-directors';
import { TopCategory } from '~/components/top-category';
import { type StaticProps } from '~/utils/general-types';

export const getStaticProps = async () => {
  const people = await getTopOscarDirectors();
  return { props: { people } };
};

export default function TopActors({ people }: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={people} category="directorNoms" mode="oscars" />;
}
