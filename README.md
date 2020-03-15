## contagion

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)
& Bar Chart Race (https://observablehq.com/@d3/bar-chart-race)
The Chart animates the number of confirmed corona virus cases by country name
The data for the race is a CSV with columns date (in MM-DD-YY format), name of country, number and optionally category (which if present determines color).

To replace data, in the directory(assuming python3 is installed)
`python3 convert_cse_to_json.py`
---> this will create a data file to src/covid_data.json from corona_confirmed.csv

## Available Scripts

In the project directory

### `npm install`

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you press 'Replay' Button <br />
