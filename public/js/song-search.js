const searchForm = document.querySelector('#song-search-form');

const runSearch = async (event) => {
  event.preventDefault();

  const trackName = document.querySelector('input[name=track-title]').value;

  const response = await fetch('/api/songs/search', {
    method: 'POST',
    body: JSON.stringify({
      track: trackName,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = JSON.parse(response);

  console.log(data);
};

searchForm.addEventListener('submit', runSearch);
