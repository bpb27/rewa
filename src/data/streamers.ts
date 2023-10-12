export const relevantStreamers = [
  'Netflix',
  'Amazon Prime Video',
  'Disney Plus',
  'Apple TV',
  'Hulu',
  'HBO Max',
  'Paramount Plus',
  'Starz',
  'Showtime',
];

const streamersShortNames = {
  Netflix: 'Netflix',
  'Amazon Prime Video': 'Amazon',
  'Disney Plus': 'Disney+',
  'Apple TV': 'Apple',
  Hulu: 'Hulu',
  'HBO Max': 'HBO',
  'Paramount Plus': 'Paramount',
  Starz: 'Starz',
  Showtime: 'Showtime',
} satisfies Record<(typeof relevantStreamers)[number], string>;

export const streamerShortName = (name: string) => {
  const nameIndex = name as keyof typeof streamerShortName;
  return streamersShortNames[nameIndex] || name;
};
