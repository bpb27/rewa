import { groupBy } from 'remeda';
import Layout from '~/components/layout';
import { Prisma } from '~/prisma';
import { capitalize } from '~/utils/format';
import { type StaticProps } from '~/utils/general-types';

const prisma = Prisma.getPrisma();

export const getStaticProps = async () => {
  const oscars = await prisma.oscars_nominations.findMany({
    include: { award: true, movie: true },
    where: { ceremony_year: 2023 },
  });
  const props = { oscars };
  return { props };
};

export default function Movies({ oscars }: StaticProps<typeof getStaticProps>) {
  const categories = groupBy(oscars, oscar => oscar.award.category);
  return (
    <Layout title="All awards">
      <h1>AWARDs</h1>
      {Object.entries(categories).map(([category, nominees]) => (
        <div key={category} className="mt-3">
          <h2>{capitalize(category)}</h2>
          {nominees.map((nominee, i) => (
            <p key={nominee.id}>
              {i + 1}. {nominee.recipient} {nominee.won && '(Won)'}
            </p>
          ))}
        </div>
      ))}
    </Layout>
  );
}
