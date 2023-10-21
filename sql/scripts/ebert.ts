import { load } from 'cheerio';
import { writeFileSync } from 'fs';
import { getAllMoviesWithEpisodes } from '../select';
import { getYear } from '../../src/utils/format';

const getRatingByTitle = async (title: string) => {
  try {
    const response = await fetch(
      `https://www.rogerebert.com/reviews?&filters[reviewers][]=50cbacd5f3b43b53e9000003&filters[title]=${encodeURI(
        title
      )}`
    );
    const content = await response.text();
    const $ = load(content);
    const firstReview = $('.review-stack').first();
    if (!firstReview) throw new Error('Not found');
    const foundTitle = firstReview.find('.review-stack--title')?.text()?.replaceAll('\n', '');
    const reviewLink = firstReview.find('a').attr('href');
    const full = firstReview.find('.icon-star-full')?.length || 0;
    const half = firstReview.find('.icon-star-half')?.length || 0;
    const rating = half ? full + 0.5 : full;
    return { title: foundTitle, rating, reviewLink };
  } catch (e: any) {
    return { error: e.message };
  }
};

const run = async () => {
  const movies = await getAllMoviesWithEpisodes();
  const stuff: any[] = [];

  const findStuff = async (i: number) => {
    const movie = movies[i];
    if (!movie) {
      console.log('DONE');
      writeFileSync('./ebert.json', JSON.stringify(stuff));
    } else if (Number(getYear(movie.release_date)) > 2013) {
      console.log('Skipping', movie.title);
      findStuff(i + 1);
    } else {
      const response = await getRatingByTitle(movie.title);
      const payload = { ...response, movieId: movie.id, realTitle: movie.title };
      stuff.push(payload);
      console.log(payload);
      setTimeout(() => findStuff(i + 1), 1000);
    }
  };

  findStuff(0);
};

run();
