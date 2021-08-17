import React, { Component } from "react";
import { Graph } from "react-d3-graph";

import styles from "../styles/Node.module.css";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.graphRef = React.createRef();
  }

  static async getInitialProps() {
    const res = await fetch("http://localhost:5000/api/v1/station/pref/13");
    const stations = await res.json();
    if (stations) {
      return {
        data: stations.map((station) => {
          return {
            name: station.station_name,
            stationCode: station.station_cd,
            stationGroupCode: station.station_g_cd,
          };
        }),
      };
    }

    return {
      data: [],
    };
  }

  componentDidMount() {
    this.graphRef.current.state.config.width = window.innerWidth;
    this.graphRef.current.state.config.height = window.innerHeight * 0.75;
    this.graphRef.current.resetNodesPositions();
  }

  render() {
    const nodes = this.props.data.map((station) => {
      return {
        id: station.name,
      };
    });

    const makeLinks = (stations) => {
      const links = [];
      this.props.data.forEach((station, index) => {
        if (index < stations.length - 1) {
          links.push({
            source: station.name,
            target: stations[index + 1].name,
          });
        }
      });
      const linksMap = new Map(
        links.map((link) => [`${link.source}${link.target}`, link])
      ).values();
      return Array.from(linksMap);
    };

    const data = {
      nodes,
      links: makeLinks(this.props.data),
    };

    const config = {
      node: {
        staticGraph: true,
        color: "#f7e5cf",
        size: 400,
        highlightStrokeColor: "blue",
      },
      link: {
        highlightColor: "lightblue",
        color: "#ffffff",
      },
      d3: {
        gravity: -200,
      },
      width: 3000, // TODO: カスタムフック作成
      height: 2000, // TODO: カスタムフック作成
      maxZoom: 8,
      minZoom: 1,
      initialZoom: 1,
    };

    const onClickNode = function (nodeId) {
      // TODO
    };

    const onClickLink = function (source, target) {
      // TODO
    };
    return (
      <div>
        <h1 className={styles.header}>Station Network Graph</h1>
        <div className={styles.graph_container}>
          <Graph
            ref={this.graphRef}
            id="graph-id"
            data={data}
            config={config}
            onClickNode={onClickNode}
            onClickLink={onClickLink}
          />
        </div>
      </div>
    );
  }
}
