const playlistContainer = document.querySelector('#playlist-container');
const songAttr = document.querySelectorAll('a');

const tempoArr = [];
const danceabilityArr = [];
const valenceArr = [];
const speechinessArr = [];
const sentimentArr = [];

for (let i=1; i< songAttr.length; i++) {
    const tempo = songAttr[i].getAttribute('data-tempo');
    const dance = songAttr[i].getAttribute('data-danceability');
    const valence = songAttr[i].getAttribute('data-valence');
    const speech = songAttr[i].getAttribute('data-speechiness');

    tempoArr.push(tempo);
    danceabilityArr.push(dance);
    valenceArr.push(valence);
    speechinessArr.push(speech);
};

const avgTempo = tempoArr.reduce((x, y) => x + y/tempoArr.length, 0)
const avgDanceability = danceabilityArr.reduce((x, y) => x + y/danceabilityArr.length, 0)
const avgValence = valenceArr.reduce((x, y) => x + y/valenceArr.length, 0)
const avgSpeechiness = speechinessArr.reduce((x, y) => x + y/speechinessArr.length, 0)

console.log(avgTempo);
console.log(avgDanceability);
console.log(avgValence);
console.log(avgSpeechiness);

 const chart = new Chart(document.getElementById('PlaylistAnalysis'), {
   type: 'bar',
   data: {
     labels: ['tempo', 'danceability', 'valence', 'speechiness'],
     datasets: [
       {
         xAxisID: 'xAxis1',
         data: [avgTempo, avgDanceability, avgValence, avgSpeechiness],
       },
     ],
   },
   options: {
     backgroundColor: '#32CD32',
   },
});
