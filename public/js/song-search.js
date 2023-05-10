const searchForm = document.querySelector('#song-search-form');
const songListArea = document.querySelector('#song-list-area');

const runSearch = async (event) => {
  event.preventDefault();

  const trackName = document.querySelector('input[name=title]').value;
  const artistName = document.querySelector('input[name=artist]').value;

  console.log(trackName, artistName);

  let testArray = [
    {
      spotify_id: 'spotify:track:0obBFrPYkSoBJbvHfUIhkv',
      title: trackName,
      artist: artistName,
    },
  ];

  presentSongList(testArray);

  // const response = await fetch('/api/songs/search', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     track: trackName,
  //     artist: artistName,
  //   }),
  //   headers: { 'Content-Type': 'application/json' },
  // });

  // console.log(response);
};

const presentSongList = (arr) => {
  songListArea.innerHTML = '';
  for (let i = 0; arr.length < i; i++) {
    const songDiv = document.createElement('div');
    songDiv.classList.add('bg-white', 'p-3', 'mt-3');
    songDiv.setAttribute('data-spotify_id', `${arr[i].spotify_id}`);
    songDiv.innerHTML = `<span>${arr[i].title}</span>
    <span>${arr[i].artist}</span><button data-spotify_id=${arr[i].spotify_id} class='add-song-button'>Add to Playlist</button>`;
    songListArea.appendChild(songDiv);
  }
};

searchForm.addEventListener('submit', runSearch);
