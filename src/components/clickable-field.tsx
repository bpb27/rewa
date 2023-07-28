import { MicIcon, VideoIcon } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { cn } from '~/lib/utils';
import { TokenType, tokenPayload } from '~/utils/token';

type ClickableFieldProps = PropsWithChildren<{
  className?: string;
  data: Parameters<typeof tokenPayload>[0];
  onClick: (data: any) => void;
}>;

export const ClickableField = ({
  children,
  className,
  data,
  onClick,
}: ClickableFieldProps) => {
  const payload = tokenPayload(data);
  return (
    <div className={className} onClick={() => onClick(payload)}>
      {children}
    </div>
  );
};

type HostProps = {
  className?: string;
  id: number;
  name: string;
  onClick: (data: any) => void;
  icon?: boolean;
};

export const Host = ({ className, onClick, id, icon, name }: HostProps) => (
  <div
    className={cn('my-1 flex cursor-pointer hover:underline', className)}
    key={id}
    onClick={() => onClick(tokenPayload({ type: 'host', id, value: name }))}
  >
    {icon && <MicIcon className="mr-2" />}
    <span>{name}</span>
  </div>
);

type DirectorProps = {
  className?: string;
  id: number;
  name: string;
  onClick: (data: any) => void;
  icon?: boolean;
};

export const Director = ({
  className,
  onClick,
  id,
  icon,
  name,
}: DirectorProps) => (
  <div
    className={cn('my-1 flex cursor-pointer hover:underline', className)}
    key={id}
    onClick={() => onClick(tokenPayload({ type: 'director', id, value: name }))}
  >
    {icon && <VideoIcon className="mr-2" />}
    <span>{name}</span>
  </div>
);

export const Clickable = { Director, Host };
