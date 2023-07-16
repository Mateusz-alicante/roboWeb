import { useD3 } from "../../utils/hooks/useD3";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import { useAtom } from "jotai";
import { distanceAtom, lastMessageAtom } from "../../utils/atoms.js";

function BarChart({}) {
  const [distance, setDistance] = useAtom(distanceAtom);
  const [lastMessage, setLastMessage] = useAtom(lastMessageAtom);
  const graphRef = useRef(null);
  const [data, setData] = useState([
    {
      Country: "Area 1",
      Value: 5000,
    },
    {
      Country: "Area 2",
      Value: 4000,
    },
    {
      Country: "dummy 1",
      Value: 0,
    },
    {
      Country: "dummy 2",
      Value: 0,
    },
    {
      Country: "dummy 3",
      Value: 0,
    },
    {
      Country: "dummy 4",
      Value: 0,
    },
    {
      Country: "Area 3",
      Value: 3000,
    },
    {
      Country: "Area 4",
      Value: 2000,
    },
  ]);

  useEffect(() => {
    console.log(distance);
    setData([
      {
        Country: "Area 1",
        Value: distance[1] * 60,
      },
      {
        Country: "Area 2",
        Value: distance[0] * 60,
      },
      {
        Country: "dummy 1",
        Value: 0,
      },
      {
        Country: "dummy 2",
        Value: 0,
      },
      {
        Country: "dummy 3",
        Value: 0,
      },
      {
        Country: "dummy 4",
        Value: 0,
      },
      {
        Country: "Area 3",
        Value: distance[3] * 60,
      },
      {
        Country: "Area 4",
        Value: distance[2] * 60,
      },
    ]);
  }, [lastMessage]);

  useEffect(() => {
    if (!graphRef) return;

    graphRef.current.innerHTML = "";

    // set the dimensions and margins of the graph
    const margin = { top: 0, right: 0, bottom: 0, left: 0 },
      width = 300 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom,
      innerRadius = 80,
      outerRadius = Math.min(width, height) / 2; // the outerRadius goes from the middle of the SVG area to the border

    // append the svg object to the body of the page
    const svg = d3
      .select(graphRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2 + 100})`); // Add 100 on Y translation, cause upper bars are longer

    // X scale
    const x = d3
      .scaleBand()
      .range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0) // This does nothing ?
      .domain(data.map((d) => d.Country)); // The domain of the X axis is the list of states.

    // Y scale
    const y = d3
      .scaleRadial()
      .range([innerRadius, outerRadius]) // Domain will be define later.
      .domain([0, 10000]); // Domain of Y is from 0 to the max seen in the data

    // Add bars
    svg
      .append("g")
      .selectAll("path")
      .data(data)
      .join("path")
      .attr("fill", "#69b3a2")
      .attr(
        "d",
        d3
          .arc() // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius((d) => y(d["Value"]))
          .startAngle((d) => x(d.Country))
          .endAngle((d) => x(d.Country) + x.bandwidth())
          .padAngle(0.01)
          .padRadius(innerRadius)
      );
  }, [data]);

  return (
    <div>
      <h1>Environment</h1>
      <p>{JSON.stringify(distance)}</p>
      <div ref={graphRef}></div>
    </div>
  );
}

export default BarChart;
