const backoffButton = document.querySelector('#backoff-button');

const importPlaylists = async () => {
  console.log('button is working');

  const response = await fetch('/api/playlists/backoff', {
    method: 'POST',
    body: JSON.stringify({
      spotify_id: 'azumbro',
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  if (response.ok) {
    console.log(data);
  } else {
    console.error(response);
    if (response.status == 401) {
      window.location.href(data);
    } else {
      alert('An unexpected error has occurred.');
    }
  }
};

backoffButton.addEventListener('click', importPlaylists);
