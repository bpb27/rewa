import { getTopProductionCompanies } from '~/api/get-top-production-companies';
import { TopCategory } from '~/components/top-category';
import { StaticProps } from '~/utils/general-types';

export const getStaticProps = async () => {
  const companies = await getTopProductionCompanies({ mode: 'rewa' });
  const mapped = companies.map(c => ({ ...c, profile_path: c.logo_path }));
  return { props: { people: mapped } };
};

export default function TopCompanies({ people }: StaticProps<typeof getStaticProps>) {
  return <TopCategory people={people} category="director" mode="rewa" hideProfileImage={true} />;
}
