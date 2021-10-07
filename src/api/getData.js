export const fetchDate = (url) => {
  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then(({ results }) => {
      return results;
    });
};
