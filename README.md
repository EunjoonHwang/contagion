## contagion: https://racingbar.herokuapp.com/

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)
& Bar Chart Race (https://observablehq.com/@d3/bar-chart-race).

The Chart animates the number of confirmed corona virus cases by country name
The data for the race is a CSV with columns date (in MM-DD-YY format), name of country, number and optionally category (which if present determines color). Data Source:https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv

To run the app, go to the project directory

### `npm install`

### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The animation will reload if you press 'Replay' Button

To replace data, go to data directory
`node csvToJson.js`
---> this will create a data file to src/covid_data.json from corona_confirmed.csv
