import { TokenType } from './query-params';

export const crewJobs = {
  director: [8],
  producer: [16],
  cinematographer: [467, 18],
  writer: [13, 77],
};

export const relevantCrewIds = Object.values(crewJobs).flat();

export const crewIdToJob = Object.entries(crewJobs).reduce((hash, [key, ids]) => {
  return ids.reduce((acc, id) => ({ ...acc, [id]: key as TokenType }), hash);
}, {} as Record<number, TokenType>);

export const crewToOscarCategory = {
  director: [8],
  producer: [0],
  cinematographer: [6],
  writer: [22, 23],
};
