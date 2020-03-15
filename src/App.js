import React from "react";
import "./App.css";
import contagion from "./contagion";
import { select } from "d3-selection";

class App extends React.Component {
  state = {
    speed: 100
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
    window.stop();
  };

  render() {
    return (
      <div className="App">
        <h2>
          Number of Corona Virus Confirmed Cases by Country Using Bar Chart Race
        </h2>
        <div className="about">
          <ul>
            <li className="sources">
              Animation Source: observablehq.com/@d3/bar-chart-race
            </li>
            <li className="sources">
              Data
              Source:github.com/CSSEGISandData/COVID-19/csse_covid_19_data/csse_covid_19_time_series
            </li>
            <li className="sources">
              Number on the bar represents log of actual number of confirmed
              cases: 3 = 10^3 due to explosive growth
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
          <svg ref={node => (this.node = node)} width={1000} height={598}></svg>
        </div>
      </div>
    );
  }
}

export default App;
