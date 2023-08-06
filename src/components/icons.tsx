import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Clapperboard,
  Clock,
  ExternalLink,
  Mic,
  RectangleVertical,
  Star,
  Table,
  Tv,
  User2,
  Video,
  XCircle,
} from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

type IconProps = ComponentPropsWithoutRef<typeof ArrowDown>;

const ConditionalCaret = ({ showing, ...rest }: IconProps & { showing: boolean }) =>
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
  ConditionalCaret,
  Dollar: CircleDollarSign,
  Link: ExternalLink,
  Mic: Mic,
  Movie: Clapperboard,
  Star: Star,
  Table: Table,
  Tv: Tv,
  Video: Video,
};
