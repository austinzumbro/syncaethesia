const apiKey = '2dc38013606f5a62721cbad63664af81';
const trackName = 'Revive';
const artistName = 'LIONE';


const apiUrl = `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=json&q_track=${trackName}&q_artist=${artistName}&apikey=${apiKey}`;


async function getData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

getData();


{/* <script type="text/javascript" src="http://tracking.musixmatch.com/t1.0/AMa6hJCIEzn1v8RuOP"></script> */}
