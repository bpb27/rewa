export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const moneyShort = (x: number) => {
  const nwc = numberWithCommas(x).split(',');
  if (x >= 1000000000) {
    const decimal = `.${nwc[1].slice(0, 2)}`;
    return `$${nwc[0]}${decimal !== '.00' ? decimal : ''}b`;
  } else if (x >= 1000000) {
    const decimal = `.${nwc[1].slice(0, 1)}`;
    return `$${nwc[0]}${decimal !== '.0' ? decimal : ''}m`;
  } else {
    return `$${nwc[0]}k`;
  }
};

export const formatDate = (d: string) => {
  const split = d.split('-');
  return `${split[1]}/${split[2]}/${split[0]}`;
};

export const capitalize = (s: string) => s[0].toUpperCase() + s.toLowerCase().slice(1);

export const titleCase = (s: string) => s.replaceAll('_', ' ').split(' ').map(capitalize).join(' ');

export const getYear = (d: string) => {
  return d.length === 4 ? d : d.split('-')[0];
};
