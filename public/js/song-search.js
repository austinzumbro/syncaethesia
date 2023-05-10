const searchForm = document.querySelector('#song-search-form');

const runSearch = async (event) => {
  event.preventDefault();

  const trackName = document.querySelector('input[name=title]').value;
  const artistName = document.querySelector('input[name=artist]').value;

  console.log(trackName, artistName);

  // const response = await fetch('/api/songs/search', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     track: trackName,
  //   }),
  //   headers: { 'Content-Type': 'application/json' },
  // });

  // console.log(response);
};

searchForm.addEventListener('submit', runSearch);
