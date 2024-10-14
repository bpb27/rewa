import { isDate, isNumber, isString } from 'remeda';
import { isYear } from './validate';

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

export const newFormatDate = (d: number | string | Date, f: 'year' | 'slash' | 'dash'): string => {
  const components = {
    year: '',
    month: '',
    day: '',
  };
  if (isDate(d)) {
    components.year = d.getFullYear().toString();
    components.month =
      d.getMonth() < 10 ? `${0}${d.getMonth() + 1}` : (d.getMonth() + 1).toString();
    components.day = d.getDate() < 10 ? `${0}${d.getDate() || 1}` : d.getDate().toString();
  } else if (isNumber(d) && isYear(d.toString())) {
    components.year = d.toString();
    components.month = '01';
    components.day = '01';
  } else if (isString(d) && isYear(d)) {
    components.year = d;
    components.month = '01';
    components.day = '01';
  } else if (isString(d) && [9, 9, 10].includes(d.length) && d.includes('-')) {
    [components.year, components.month, components.day] = d.split('-');
  } else {
    console.error(`Unsupported date input ${d}`);
    return d.toString();
  }

  if (f === 'year') {
    return components.year;
  } else if (f === 'slash') {
    return `${components.month}/${components.day}/${components.year}`;
  } else if (f === 'dash') {
    return `${components.year}-${components.month}-${components.day}`;
  } else {
    const _exhaustive: never = f;
    throw new Error(`Unknown date format ${f}`);
  }
};

export const capitalize = (s: string) => {
  if (s[0] === '(') {
    return '(' + s[1].toUpperCase() + s.toLowerCase().slice(2);
  } else {
    return s[0].toUpperCase() + s.toLowerCase().slice(1);
  }
};

export const titleCase = (s: string) => s.replaceAll('_', ' ').split(' ').map(capitalize).join(' ');

export const formatRuntime = (mins: number) => `${mins} mins`;
