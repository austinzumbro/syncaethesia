import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';

const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['tempo', 'danceability', 'valence', 'speechiness', 'sentiment'],
    datasets: [{
        xAxisID: 'xAxis1',
        data: [1, 2, 3, 4, 5]
    }]
  }
});