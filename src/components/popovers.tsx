import { capitalize } from '~/utils/format';
import { Button } from './ui/button';
import { Icon } from './ui/icons';
import { PopoverMenu, type PopoverMenuProps } from './ui/popover';

type MovieOscarsPopoverProps = {
  awards: { awardName: string; recipient: string; won: boolean }[];
  onYearClick: () => void;
  trigger: PopoverMenuProps['trigger'];
};

// TODO: show all nominees for a cateogry - need a new API endpoint
export const MovieOscarsPopover = ({ awards, onYearClick, trigger }: MovieOscarsPopoverProps) => {
  return (
    <PopoverMenu trigger={trigger}>
      <div className="flex flex-col gap-y-2">
        {awards.map(award => (
          <div key={award.recipient} className="flex flex-col whitespace-nowrap">
            <span className="flex gap-x-2 font-semibold">
              {award.won ? (
                <Icon.Trophy className=" text-yellow-500" />
              ) : (
                <Icon.HeartBreak className=" text-red-400" />
              )}
              {award.awardName.split('_').map(capitalize).join(' ')}
            </span>
            <span>{award.recipient}</span>
          </div>
        ))}
        <Button variant="card" onClick={onYearClick} className="mt-2">
          Show year
        </Button>
      </div>
    </PopoverMenu>
  );
};
