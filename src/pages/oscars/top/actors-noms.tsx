import { getTopOscarActors } from '~/api/get-top-oscar-actors';
import { TopCategory } from '~/components/top-category';
import { type StaticProps } from '~/utils/general-types';

export const getStaticProps = async () => {
  const people = await getTopOscarActors();
  return { props: { people } };
};

export default function TopActors({ people }: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={people} category="actorNoms" mode="oscars" />;
}
