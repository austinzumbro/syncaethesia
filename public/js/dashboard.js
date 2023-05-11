const importPlaylistButton = document.querySelector('#import-playlist-button');
const importAudioAnalysisButton = document.querySelector(
  '#import-audio-analysis'
);

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

  if (response.ok) {
    document.location.reload();
  } else {
    alert('Playlist Import Failed!');
  }
  const data = await response.json();
  const dataReadable = JSON.parse(data);
  console.log(dataReadable);
};

const importAudioAnalysis = async () => {
  console.log('import started');

  const response = await fetch('/api/songs/import-features', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
};

importPlaylistButton.addEventListener('click', importPlaylists);
importAudioAnalysisButton.addEventListener('click', importAudioAnalysis);
