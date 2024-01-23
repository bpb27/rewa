import { Modal, type ModalProps } from '~/components/ui/modal';
import { MoviePoster, TheaterBackground } from '../images';

type MovieSpotlightModal = {
  overview: string;
  poster_path: string;
  tagline?: string;
  title: string;
} & ModalProps;

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
        <MoviePoster poster_path={poster_path} title={title} variant="card" />
      </TheaterBackground>
      {tagline && <p className="mt-2 text-center text-sm text-slate-500">{tagline}</p>}
      <p className="my-4">{overview}</p>
    </Modal>
  );
};
