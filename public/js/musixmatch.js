const searchForm = document.querySelector('#song-search');
console.log(searchForm);

const searchForSong = async (event) => {
  event.preventDefault();
  const artistName = document
    .querySelector('input[name=artistName]')
    .value.toLowerCase()
    .trim();
  const songName = document
    .querySelector('input[name=songName]')
    .value.toLowerCase()
    .trim();

  console.log(songName, artistName);

  const response = await fetch('/musixmatch', {
    method: 'POST',
    body: JSON.stringify({
      q_artist: artistName,
      q_track: songName,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    console.log(response);
  } else {
    console.log('Fetch not successful.');
  }
};

searchForm.addEventListener('submit', searchForSong);
