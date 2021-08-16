import React, { Component } from "react";
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  HexbinSeries,
  Hint,
  Borders,
} from "react-vis";

import styles from "../styles/Home.module.css";
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 1,
      hoveredNode: null,
      xDomain: [128.4871, 146.2473],
      yDomain: [30.9049, 45.88],
      mapHeight: 6000,
      mapWidth: 6000,
      radius: 16,
      offset: 0,
    };
    this.onClickZoomIn = this.onClickZoomIn.bind(this);
    this.onClickZoomOut = this.onClickZoomOut.bind(this);
    this.getStationName = this.getStationName.bind(this);
  }

  static async getInitialProps() {
    const res = await fetch("http://localhost:5000/api/v1/station/");
    const stations = await res.json();
    if (stations) {
      return {
        data: stations.map((station) => {
          return {
            eruptions: station.lat,
            waiting: station.lon,
            name: station.station_name,
          };
        }),
      };
    }

    return {
      data: [],
    };
  }

  componentDidMount() {
    this.setState({
      mapWidth: window.innerWidth,
      mapHeight: (window.innerWidth / 4648) * 5000,
    });
  }

  onClickZoomIn = () => {
    this.setState({
      zoom: this.state.zoom + 0.5,
      radius: this.state.radius - 3,
    });
  };
  onClickZoomOut = () => {
    this.setState({
      zoom: this.state.zoom - 0.5,
      radius: this.state.radius + 3,
    });
  };
  getStationName = (node) => {
    return node[0].name;
  };

  render() {
    const {
      zoom,
      hoveredNode,
      xDomain,
      yDomain,
      mapHeight,
      mapWidth,
      radius,
      offset,
    } = this.state;

    return (
      <div>
        <h1 className={styles.header}>Station Heat Map </h1>
        <div className={styles.buttons}>
          <button
            className={styles.button}
            disabled={this.state.radius <= 1}
            onClick={this.onClickZoomIn}
          >
            +
          </button>
          <button
            className={styles.button}
            disabled={this.state.radius >= 16}
            onClick={this.onClickZoomOut}
          >
            -
          </button>
        </div>
        <XYPlot
          xDomain={xDomain}
          yDomain={yDomain}
          height={mapHeight}
          width={mapWidth}
          getX={(d) => d.waiting}
          getY={(d) => d.eruptions}
          style={{ zoom: zoom }}
        >
          <HorizontalGridLines tickTotal={500} style={{ stroke: "#B7E9ED" }} />
          <VerticalGridLines tickTotal={500} style={{ stroke: "#B7E9ED" }} />
          <HexbinSeries
            animation
            className="hexbin-example"
            style={{
              stroke: "#125C77",
              strokeLinejoin: "round",
            }}
            xOffset={offset}
            yOffset={offset}
            onValueMouseOver={(node) => this.setState({ hoveredNode: node })}
            colorRange={["#f7e5cf", "#bf1d1d"]}
            radius={radius}
            data={this.props.data}
          />
          {hoveredNode && (
            <Hint
              value={{
                value: hoveredNode,
              }}
            >
              <p className={styles.hint}>{this.getStationName(hoveredNode)}</p>
            </Hint>
          )}
          <Borders style={{ all: { fill: "#fff" } }} />
        </XYPlot>
      </div>
    );
  }
}
