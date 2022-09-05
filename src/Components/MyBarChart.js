// Copyright (c) 2016 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from "react";
import { ShowcaseButton } from "react-vis";
// import ShowcaseButton from "../showcase-components/showcase-button";
// import {
//   XYPlot,
//   XAxis,
//   YAxis,
//   VerticalGridLines,
//   HorizontalGridLines,
//   VerticalBarSeries,
//   VerticalBarSeriesCanvas,
//   LabelSeries,
// } from "react-vis";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalBarSeries,
  LineSeries,
  VerticalGridLines,
  LabelSeries,
  ChartLabel,
} from "react-vis";
const greenData = [
  { x: "For", y: 10 },
  { x: "Against", y: 5 },
  { x: "Abstain", y: 15 },
];

const blueData = [
  { x: "For", y: 12 },
  { x: "Against", y: 2 },
  { x: "Abstain", y: 11 },
];

const labelData = greenData.map((d, idx) => ({
  x: d.x,
  y: Math.max(greenData[idx].y, blueData[idx].y),
}));

export default class MyBarChart extends React.Component {
  //   constructor(props) {
  //     super(props);

  //     this.state = {
  //       data: [
  //         { x: "For", y: this.props.votingResults[0] },
  //         { x: "Against", y: this.props.votingResults[1] },
  //         { x: "Abstain", y: this.props.votingResults[2] },
  //       ],
  //     };
  //   }

  render() {
    console.log("voting results are: ", this.props.votingResults);
    const mydata = [
      { x: "Against", y: parseInt(this.props.votingResults[0]) },
      { x: "For", y: parseInt(this.props.votingResults[1]) },
      { x: "Abstain", y: parseInt(this.props.votingResults[2]) },
    ];
    // const { useCanvas } = this.state;
    // const content = useCanvas ? "TOGGLE TO SVG" : "TOGGLE TO CANVAS";
    // const BarSeries = useCanvas ? VerticalBarSeriesCanvas : VerticalBarSeries;
    console.log(this.props.votingResults);
    return (
      <div align="center">
        <XYPlot xType="ordinal" width={400} height={400} xDistance={100}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis
            title="# Votes"
            tickPadding={10}
            tickSize={14}
            style={{
              text: {
                stroke: "none",
                // fill: "#FF0000",
                fontSize: 12,
                fontWeight: 100,
                // transform: "translate(10px, 0)",
              },
            }}
          />
          {/* <VerticalBarSeries
            className="vertical-bar-series-example"
            data={greenData}
          /> */}
          <VerticalBarSeries data={mydata} />
          {/* <ChartLabel style={{
          transform: 'rotate(270)',
          fontSize: '1.2em'}}> */}
          {/* <LabelSeries data={labelData} getLabel={(d) => d.x} /> */}
        </XYPlot>
        {/* <ShowcaseButton
          onClick={() => this.setState({ useCanvas: !useCanvas })}
          buttonContent={content}
        /> */}
        {/* <XYPlot xType="ordinal" width={300} height={300} xDistance={100}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <BarSeries className="vertical-bar-series-example" data={greenData} />
          <BarSeries data={blueData} />
          <LabelSeries data={labelData} getLabel={(d) => d.x} />
        </XYPlot> */}
      </div>
    );
  }
}
