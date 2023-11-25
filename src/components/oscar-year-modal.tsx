import { useRef, useState } from 'react';
import { groupBy } from 'remeda';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icons';
import { Modal, type ModalProps } from '~/components/ui/modal';
import { smartSort } from '~/utils/sorting';
import { useAPI } from '~/utils/use-api';

type OscarYearModalProps = { year: number } & ModalProps;

export const OscarYearModal = ({ year, ...modalProps }: OscarYearModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [limitAwards, setLimitAwards] = useState(true);
  const [selectedYear, setYear] = useState(year);
  const { data = [] } = useAPI(`/api/oscars/year/${selectedYear}`);
  return (
    <Modal {...modalProps} className="bg-yellow-50">
      <div className="flex justify-between align-baseline" ref={containerRef}>
        <Button
          className="bg-yellow-200"
          disabled={selectedYear <= 1950}
          onClick={() => setYear(selectedYear - 1)}
          variant="icon"
        >
          <Icon.ArrowLeft />
        </Button>
        <h2 className="text-xl font-semibold">{selectedYear}</h2>
        <Button
          className="bg-yellow-200"
          disabled={selectedYear >= 2023}
          onClick={() => setYear(selectedYear + 1)}
          variant="icon"
        >
          <Icon.ArrowRight />
        </Button>
      </div>
      <div>
        {Object.values(groupBy(data, item => item.award.id))
          .filter(group =>
            limitAwards ? group.every(e => e.award.oscars_categories.relevance === 'high') : true
          )
          .map(group => (
            <div key={group[0].id} className="my-4">
              <h3 className="text-xl font-bold underline">{group[0].award.name}</h3>
              {smartSort(group, i => i.movie.title).map(oscar => (
                <div key={oscar.id} className="my-1 flex items-center justify-between space-x-2">
                  <span>
                    <p className="font-bold italic">{oscar.movie.title}</p>
                    {showRecipient(oscar.award.oscars_categories.name) && <p>{oscar.recipient}</p>}
                  </span>
                  {oscar.won && <Icon.Trophy />}
                </div>
              ))}
            </div>
          ))}
        <Button
          variant="card"
          onClick={() => {
            setLimitAwards(l => !l);
            containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="border-yellow-400 bg-yellow-200 hover:bg-yellow-100"
        >
          Show {limitAwards ? 'more' : 'fewer'}
        </Button>
      </div>
    </Modal>
  );
};

const showRecipient = (name: string) =>
  [
    'actor',
    'actress',
    'supporting_actress',
    'supporting_actor',
    'directing',
    'writing',
    'writing_adapted',
    'cinematography',
  ].includes(name);
