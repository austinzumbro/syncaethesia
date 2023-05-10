const searchForm = document.querySelector('#song-search-form');
const songListArea = document.querySelector('#song-list-area');

const runSearch = async (event) => {
  event.preventDefault();

  const trackName = document.querySelector('input[name=title]').value;
  const artistName = document.querySelector('input[name=artist]').value;

  console.log(trackName, artistName);

  // let testArray = [
  //   {
  //     spotify_id: 'spotify:track:0obBFrPYkSoBJbvHfUIhkv',
  //     title: trackName,
  //     artist: artistName,
  //   },
  // ];

  // presentSongList(testArray);

  const response = await fetch('/api/songs/search', {
    method: 'POST',
    body: JSON.stringify({
      track: trackName,
      artist: artistName,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  const songList = await response.json();
  const songListArr = JSON.parse(songList);

  presentSongList(songListArr);
};

const presentSongList = (arr) => {
  songListArea.innerHTML = '';
  // arr.forEach(() => {
  for (let i = 0; i < 5; i++) {
    console.log(arr[i]);
    const songDiv = document.createElement('div');
    songDiv.classList.add(
      'flex',
      'flex-row',
      'justify-between',
      'bg-white',
      'p-3',
      'mt-3'
    );
    songDiv.setAttribute('data-spotify_id', `${arr[i].id}`);
    songDiv.innerHTML = `<span>${arr[i].name}</span>
    <span>${arr[i].artists[0].name}</span><button data-spotify_id=${arr[i].id} class='add-song-button bg-pink-500 p-3'>Add to Playlist</button>`;
    songListArea.appendChild(songDiv);
  }
};

searchForm.addEventListener('submit', runSearch);
