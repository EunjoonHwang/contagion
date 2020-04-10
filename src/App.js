import React from "react";
import "./App.css";
import contagion from "./contagion";
import { select } from "d3-selection";

class App extends React.Component {
  state = {
    speed: 250,
  };

  componentDidMount() {
    this.createAnimation();
  }

  createAnimation = () => {
    const { speed } = this.state;
    const node = select(this.node);
    contagion({ node, speed });
  };

  refreshPage = () => {
    window.location.reload(false);
  };

  //revisit this pause function
  pausePage = () => {
    window.location.reload(false);
  };

  render() {
    return (
      <div className="App">
        <h2>
          Number of Corona Virus Confirmed Cases by Date
          <br /> Let's think how to decrease the exponential growth
        </h2>
        <div className="about">
          <ul>
            <li className="sources">
              Data Source:
              <a
                href="https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/CSSEGISandData/COVID-19/csse_covid_19_data/csse_covid_19_time_series
              </a>
            </li>
            <li className="sources">
              Number on the bar represents log of actual number of confirmed
              cases: 3 = 10^3 in order to flatten exponential growth
            </li>
          </ul>
        </div>
        <div>
          <button
            className="button"
            onClick={() => {
              this.refreshPage(true);
            }}
          >
            Play
          </button>
          <span> </span>
          <button
            className="button"
            onClick={() => {
              this.pausePage();
            }}
          >
            Pause
          </button>
          <span> </span>
          <button
            className="button"
            onClick={() => {
              this.refreshPage();
            }}
          >
            Replay
          </button>
        </div>
        <div className="App">
          <svg
            ref={(node) => (this.node = node)}
            width={1000}
            height={598}
          ></svg>
        </div>
      </div>
    );
  }
}

export default App;
