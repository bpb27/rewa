import { omit } from 'remeda';

export const crewJobs = {
  director: ['Director'],
  producer: ['Producer'],
  cinematographer: ['Cinematography', 'Director of Photography'],
  writer: ['Screenplay', 'Writer'],
};

export const crewToOscarCategory = {
  director: [8],
  producer: [0],
  cinematographer: [6],
  writer: [22, 23],
};

export const allCrewJobs = Object.values(crewJobs).flat();

export const allNonDirectorCrewJobs = Object.values(omit(crewJobs, ['director'])).flat();
