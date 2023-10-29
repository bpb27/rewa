import { range } from 'remeda';
import { Icon } from './icons';

export const StarRating = ({ value }: { value?: number }) =>
  value ? (
    <div className="flex">
      {range(0, Math.floor(value)).map(i => (
        <Icon.Star key={i} className="fill-yellow-500 text-yellow-600" size={15} />
      ))}
      {value % 1 === 0.5 && <Icon.StarHalf className="fill-yellow-500 text-yellow-600" size={15} />}
    </div>
  ) : null;
