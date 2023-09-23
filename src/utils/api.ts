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
