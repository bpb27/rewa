import { Fragment, PropsWithChildren } from 'react';
import { cn } from '~/utils/style';

export const Table = ({ children }: PropsWithChildren<{}>) => (
  <div className="overflow-x-auto">
    <table className="w-full">{children}</table>
  </div>
);

const TableHead = ({ children }: PropsWithChildren<{}>) => (
  <thead>
    <tr className="border-b-slate-200 bg-blue-100 text-left shadow-md [&>th]:whitespace-nowrap [&>th]:p-2">
      {children}
    </tr>
  </thead>
);

const TableHeader = ({
  children,
  onClick,
  sticky,
}: PropsWithChildren<{ onClick?: () => void; sticky?: boolean }>) => (
  <th
    className={cn(
      onClick && 'cursor-pointer',
      sticky &&
        'sticky left-0 cursor-pointer bg-gradient-to-r from-blue-100 from-90% to-blue-100/90'
    )}
    onClick={onClick}
  >
    {children}
  </th>
);

const TableBody = ({ children }: PropsWithChildren<{}>) => <tbody>{children}</tbody>;

const TableRow = ({ children }: PropsWithChildren<{}>) => (
  <Fragment>
    {/* NB: can't add padding or margin to trs - need to use an empty row as a spacer */}
    <tr className="h-4"></tr>
    <tr className="rounded-xl border-2 border-slate-300 bg-slate-50 p-2 text-left shadow-md [&>td]:px-2">
      {children}
    </tr>
  </Fragment>
);

const TableData = ({ children, sticky }: PropsWithChildren<{ sticky?: boolean }>) => (
  <td
    className={cn(
      sticky &&
        'sticky left-0 max-w-[250px] bg-gradient-to-r from-slate-50 from-90% to-slate-50/90 pl-3'
    )}
  >
    {children}
  </td>
);

Table.Head = TableHead;
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Data = TableData;
