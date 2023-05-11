const importPlaylistButton = document.querySelector('#import-playlist-button');
const importAudioAnalysisButton = document.querySelector(
  '#import-audio-analysis'
);

const spotify_id = document.location.pathname.split('/').pop();
console.log(spotify_id);

const importPlaylists = async () => {
  console.log('button is working');

  const response = await fetch('/api/playlists', {
    method: 'POST',
    body: JSON.stringify({
      spotify_id: spotify_id,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.reload();
  } else {
    alert('Playlist Import Failed!');
  }
};

const importAudioAnalysis = async () => {
  console.log('import started');

  const response = await fetch('/api/songs/import-features', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    alert('Audio analysis has been imported.');
  } else {
    alert('Import failed.');
  }
};

importPlaylistButton.addEventListener('click', importPlaylists);
importAudioAnalysisButton.addEventListener('click', importAudioAnalysis);
