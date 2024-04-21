import { AppEnums } from '~/utils/enums';
import { keys } from '~/utils/object';

export const crewJobs = {
  director: [8],
  producer: [16],
  cinematographer: [467, 18],
  writer: [13, 77],
  composer: [4],
};

export const crewJobIdToTokenType = (jobId: number) =>
  keys(crewJobs).find(job => crewJobs[job].includes(jobId));

export const relevantCrewIds = Object.values(crewJobs).flat();

export const jobIdToJobStr = Object.entries(crewJobs).reduce((hash, [key, ids]) => {
  return ids.reduce((acc, id) => ({ ...acc, [id]: key as AppEnums['tokenCrew'] }), hash);
}, {} as Record<number, AppEnums['tokenCrew']>);

export const crewToOscarCategory = {
  director: [8],
  producer: [0],
  cinematographer: [6],
  writer: [22, 23],
  composer: [14],
};
