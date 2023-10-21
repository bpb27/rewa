import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  CircleEqual,
  Clapperboard,
  Clock,
  ExternalLink,
  Film,
  Frown,
  KeyRound,
  Meh,
  Mic,
  Popcorn,
  RectangleVertical,
  SlidersHorizontal,
  Star,
  Table,
  Tv,
  User2,
  Video,
  WholeWord,
  XCircle,
} from 'lucide-react';
import { type ComponentPropsWithoutRef } from 'react';

type IconProps = ComponentPropsWithoutRef<typeof ArrowDown>;
export type IconKey = keyof typeof Icon;

export const ConditionalCaret = ({ showing, ...rest }: IconProps & { showing: boolean }) =>
  showing ? <ChevronUp {...rest} /> : <ChevronDown {...rest} />;

export const Icon = {
  Actor: User2,
  ArrowDown: ArrowDown,
  ArrowLeft: ArrowLeft,
  ArrowRight: ArrowRight,
  ArrowUp: ArrowUp,
  Calendar: CalendarDays,
  Card: RectangleVertical,
  CaretDown: ChevronDown,
  CaretUp: ChevronUp,
  Check,
  Clock: Clock,
  Close: XCircle,
  Dollar: CircleDollarSign,
  FaceFrown: Frown,
  FaceMeh: Meh,
  Filter: CircleEqual,
  FilterSlider: SlidersHorizontal,
  FilmStrip: Film,
  Key: KeyRound,
  Link: ExternalLink,
  Mic: Mic,
  Movie: Clapperboard,
  Popcorn: Popcorn,
  Star: Star,
  Table: Table,
  Tv: Tv,
  Video: Video,
  Word: WholeWord,
};
