import { ComponentProps, PropsWithChildren } from 'react';
import { Button } from '~/components/ui/button';
import { MovieCardPoster, TheaterBackground } from '../images';
import { Icon } from '../icons';

export const Sidebar = ({ children }: PropsWithChildren<{}>) => (
  <div className="fixed right-0 top-8 z-10 mb-4 h-full w-3/4 overflow-y-scroll border-l-4 bg-slate-100 p-5 pb-8 text-center md:w-1/2 lg:w-1/4">
    {children}
  </div>
);

const CloseButton = ({ onClose }: { onClose: () => void }) => (
  <Button variant="card" onClick={onClose} className="block w-full bg-red-400 hover:bg-red-300">
    Close
  </Button>
);

const Header = ({ children }: PropsWithChildren<{}>) => (
  <h3 className="text-2xl font-semibold leading-none">{children}</h3>
);

const Content = ({ children }: PropsWithChildren<{}>) => (
  <div className="my-2 flex flex-col items-center space-y-1.5 text-left">{children}</div>
);

const Separator = () => <hr className="my-2 border-slate-300" />;

const Poster = (props: ComponentProps<typeof MovieCardPoster>) => (
  <TheaterBackground>
    <MovieCardPoster {...props} size={props.size || 150} />
  </TheaterBackground>
);

const HeaderAndPoster = ({
  header,
  ...imageProps
}: ComponentProps<typeof MovieCardPoster> & { header: string }) => (
  <div className="mt-5 flex flex-col items-center space-y-1.5">
    <Header>{header}</Header>
    <Poster {...imageProps} />
  </div>
);

const StarBar = ({ children }: PropsWithChildren<{}>) => (
  <div className="my-3 flex justify-center">
    <p className="flex items-center space-x-3 text-center text-lg">
      <Icon.Star className="text-yellow-500" />
      {children}
      <Icon.Star className="text-yellow-500" />
    </p>
  </div>
);

Sidebar.CloseButton = CloseButton;
Sidebar.Header = Header;
Sidebar.Content = Content;
Sidebar.Separator = Separator;
Sidebar.Poster = Poster;
Sidebar.HeaderAndPoster = HeaderAndPoster;
Sidebar.StarBar = StarBar;
