import { Modal, type ModalProps } from '~/components/ui/modal';
import { MovieCardPoster, TheaterBackground } from './images';
import { MoviesPageMovie } from './movies-page';

type MovieSpotlightModal = MoviesPageMovie & ModalProps;

export const MovieSpotlightModal = ({
  title,
  poster_path,
  tagline,
  overview,
  isOpen,
  onClose,
}: MovieSpotlightModal) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className='leading-none" mb-2 text-center text-2xl font-semibold'>{title}</h2>
      <TheaterBackground>
        <MovieCardPoster poster_path={poster_path} title={title} />
      </TheaterBackground>
      <p className="mt-2 text-center text-sm text-slate-500">{tagline}</p>
      <p className="mt-4">{overview}</p>
    </Modal>
  );
};
