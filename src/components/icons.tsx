import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  CircleEqual,
  Clapperboard,
  Clock,
  ExternalLink,
  Frown,
  Meh,
  Mic,
  Popcorn,
  RectangleVertical,
  Star,
  Table,
  Tv,
  User2,
  Video,
  XCircle,
} from 'lucide-react';
import { ComponentPropsWithoutRef } from 'react';

type IconProps = ComponentPropsWithoutRef<typeof ArrowDown>;
export type IconKey = keyof typeof Icon;

export const ConditionalCaret = ({ showing, ...rest }: IconProps & { showing: boolean }) =>
  showing ? <ChevronUp {...rest} /> : <ChevronDown {...rest} />;

export const Icon = {
  Actor: User2,
  ArrowDown: ArrowDown,
  ArrowUp: ArrowUp,
  Calendar: CalendarDays,
  Card: RectangleVertical,
  CaretDown: ChevronDown,
  CaretUp: ChevronUp,
  Clock: Clock,
  Close: XCircle,
  Dollar: CircleDollarSign,
  FaceFrown: Frown,
  FaceMeh: Meh,
  Filter: CircleEqual,
  Link: ExternalLink,
  Mic: Mic,
  Movie: Clapperboard,
  Popcorn: Popcorn,
  Star: Star,
  Table: Table,
  Tv: Tv,
  Video: Video,
};
