import { omit } from 'remeda';

export const crewJobs = {
  director: ['Director'],
  producer: ['Producer'],
  cinematographer: ['Cinematography', 'Director of Photography'],
  writer: ['Screenplay', 'Writer'],
};

export const allCrewJobs = Object.values(crewJobs).flat();

export const allNonDirectorCrewJobs = Object.values(omit(crewJobs, ['director'])).flat();
