import { Modal, type ModalProps } from '~/components/ui/modal';
import { Token } from '~/data/tokens';
import { capitalize } from '~/utils/format';
import { smartSort } from '~/utils/sorting';
import { MovieCardPoster, TheaterBackground } from './images';
import { MoviesPageMovie } from './movies-page';

type MovieSpotlightModal = MoviesPageMovie & ModalProps & { onTokenClick: (token: Token) => void };

export const MovieSpotlightModal = ({
  title,
  poster_path,
  tagline,
  overview,
  isOpen,
  crew,
  onClose,
  onTokenClick,
}: MovieSpotlightModal) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className='leading-none" mb-2 text-center text-2xl font-semibold'>{title}</h2>
      <TheaterBackground>
        <MovieCardPoster poster_path={poster_path} title={title} />
      </TheaterBackground>
      <p className="mt-2 text-center text-sm text-slate-500">{tagline}</p>
      <p className="my-4">{overview}</p>
      {smartSort(crew, person => person.type).map(item => (
        <p key={item.type + item.id}>
          <b>{capitalize(item.type)}:</b>{' '}
          <span className="cursor-pointer hover:underline" onClick={() => onTokenClick(item)}>
            {item.name}
          </span>
        </p>
      ))}
    </Modal>
  );
};
