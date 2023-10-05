import { useState } from 'react';
import { Modal, type ModalProps } from '~/components/ui/modal';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icons';
import { useAPI } from '~/utils/use-api';
import { groupBy } from 'remeda';

type OscarYearModalProps = { year: number } & ModalProps;

export const OscarYearModal = ({ year, ...modalProps }: OscarYearModalProps) => {
  const [selectedYear, setYear] = useState(year);
  const { data = [] } = useAPI(`/api/oscars/year/${selectedYear}`);
  return (
    <Modal {...modalProps}>
      <div className="flex justify-between align-baseline">
        <Button variant="icon" onClick={() => setYear(selectedYear - 1)}>
          <Icon.ArrowLeft />
        </Button>
        <h2 className="text-xl font-semibold">{selectedYear}</h2>
        <Button variant="icon" onClick={() => setYear(selectedYear + 1)}>
          <Icon.ArrowRight />
        </Button>
      </div>
      <div>
        {Object.values(groupBy(data, item => item.award.id)).map(group => (
          <div key={group[0].id} className="my-4">
            <h3 className="bg-slate-300 p-2 text-lg font-semibold">{group[0].award.name}</h3>
            {group.map(oscar => (
              <div key={oscar.id} className="my-2 bg-slate-100 p-2">
                <p>
                  <b>{oscar.movie.title}</b>
                </p>
                <p>{oscar.recipient}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
};
