const importPlaylistButton = document.querySelector('#import-playlist-button');

const userId = document.location.pathname.split('/').pop();
console.log(userId);

const importPlaylists = async () => {
  console.log('button is working');

  const response = await fetch('/api/playlists', {
    method: 'POST',
    body: JSON.stringify({
      spotify_id: userId,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  const dataReadable = JSON.parse(data);
  console.log(dataReadable);
};

importPlaylistButton.addEventListener('click', importPlaylists);
