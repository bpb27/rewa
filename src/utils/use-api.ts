import useSWR from 'swr';
import { assembleUrl } from '~/data/query-params';
import { type ApiGetActorParams, type ApiGetActorResponse } from '~/pages/api/actors/[id]';
import { type ApiGetMoviesParams, type ApiGetMoviesResponse } from '~/pages/api/movies';
import { type ApiGetMovieParams, type ApiGetMovieResponse } from '~/pages/api/movies/[id]';
import {
  ApiGetOscarCategoriesParams,
  ApiGetOscarCategoriesResponse,
} from '~/pages/api/oscars/categories';
import {
  type ApiGetOscarsByYearParams,
  type ApiGetOscarsByYearResponse,
} from '~/pages/api/oscars/year/[year]';
import { type ApiSearchParams, type ApiSearchResponse } from '~/pages/api/search';

export const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.cause = await response.json();
    throw error;
  } else {
    const data = await response.json();
    return data;
  }
};

// NB: paths are determined by /pages/api directory structure
type ApiRoutes = [
  {
    path: `/api/actors/${number}`;
    params: ApiGetActorParams;
    response: ApiGetActorResponse;
  },
  {
    path: '/api/movies';
    params: ApiGetMoviesParams;
    response: ApiGetMoviesResponse;
  },
  {
    path: `/api/movies/${number}`;
    params: ApiGetMovieParams;
    response: ApiGetMovieResponse;
  },
  {
    path: `/api/oscars/year/${number}`;
    params: ApiGetOscarsByYearParams;
    response: ApiGetOscarsByYearResponse;
  },
  {
    path: '/api/oscars/categories';
    params: ApiGetOscarCategoriesParams;
    response: ApiGetOscarCategoriesResponse;
  },
  {
    path: '/api/search';
    params: ApiSearchParams;
    response: ApiSearchResponse;
  }
];

type ApiPath = ApiRoutes[number]['path'];
type ApiRoute<TPath extends ApiPath> = Extract<ApiRoutes[number], { path: TPath }>;

export const useAPI = <TPath extends ApiPath>(
  route: TPath,
  params?: ApiRoute<TPath>['params'],
  options?: { skip?: boolean }
) => {
  const withParams = params ? assembleUrl(route, params) : route;
  const response = useSWR<ApiRoute<TPath>['response']>(options?.skip ? null : withParams, fetcher);
  return response;
};
