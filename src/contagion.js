import {
  range,
  scaleLinear,
  scaleBand,
  scaleOrdinal,
  schemeTableau10,
  utcFormat,
  axisTop,
  format,
  interpolateNumber,
  pairs,
  descending,
  ascending,
  easeLinear
} from "d3";
import { groups, rollup } from "d3-array";
//import rawData from "./data.json"
import rawData from "./covid_data.json";

export default function({ node, frameSpeedMs }) {
  const data = rawData.map(autoType);
  const width = 1000;

  const n = 12;
  const duration = 250;
  const margin = { top: 16, right: 6, bottom: 6, left: 0 };
  const barSize = 48;

  const y = scaleBand()
    .domain(range(n + 1))
    .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
    .padding(0.1);

  const x = scaleLinear([0, 1], [margin.left, width - margin.right]);

  const scale = scaleOrdinal(schemeTableau10);
  const color = d => scale(d.name);
  const formatDate = utcFormat("%m/%d/%y");
  const formatNumber = format(",.2f");

  function axis(svg) {
    const g = svg.append("g").attr("transform", `translate(0,${margin.top})`);

    const axis = axisTop(x)
      .ticks(width / 160)
      .tickSizeOuter(0)
      .tickSizeInner(-barSize * (n + y.padding()));

    return (_, transition) => {
      g.transition(transition).call(axis);
      g.select(".tick:first-of-type text").remove();
      g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
      g.select(".domain").remove();
    };
  }

  function textTween(a, b) {
    const i = interpolateNumber(a, b);
    return function(t) {
      this.textContent = formatNumber(i(t));
    };
  }

  const datevalues = Array.from(
    rollup(
      data,
      ([d]) => d.value,
      d => +d.date,
      d => d.name
    )
  )
    .map(([date, data]) => [new Date(date), data])
    .sort(([a], [b]) => ascending(a, b));

  const names = new Set(data.map(d => d.name));

  function rank(value) {
    const data = Array.from(names, name => ({
      name,
      value: value(name)
    }));
    data.sort((a, b) => descending(a.value, b.value));
    for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
    return data;
  }

  const k = 10;

  const keyframes = [];
  let ka, a, kb, b;

  for ([[ka, a], [kb, b]] of pairs(datevalues)) {
    for (let i = 0; i < k; ++i) {
      const t = i / k;
      keyframes.push([
        new Date(ka * (1 - t) + kb * t),
        rank(name => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t)
      ]);
    }
  }
  keyframes.push([new Date(kb), rank(name => b.get(name) || 0)]);

  const nameframes = groups(
    keyframes.flatMap(([, data]) => data),
    d => d.name
  );

  const next = new Map(nameframes.flatMap(([, data]) => pairs(data)));

  const prev = new Map(
    nameframes.flatMap(([, data]) => pairs(data, (a, b) => [b, a]))
  );

  async function* generator() {
    const updateBars = bars(node);
    const updateAxis = axis(node);
    const updateLabels = labels(node);
    const updateTicker = ticker(node);

    yield node.node();

    for (const keyframe of keyframes) {
      const transition = node
        .transition()
        .duration(duration)
        .ease(easeLinear);

      // Extract the top bar’s value.
      x.domain([0, keyframe[1][0].value]);

      updateAxis(keyframe, transition);
      updateBars(keyframe, transition);
      updateLabels(keyframe, transition);
      updateTicker(keyframe, transition);

      await transition.end();
    }
  }

  const gen = generator();
  setInterval(() => {
    gen.next();
  }, frameSpeedMs);

  function labels(svg) {
    let label = svg
      .append("g")
      .style("font", "bold 12px var(--sans-serif)")
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
      .selectAll("text");

    return ([date, data], transition) =>
      (label = label
        .data(data.slice(0, n), d => d.name)
        .join(
          enter =>
            enter
              .append("text")
              .attr(
                "transform",
                d =>
                  `translate(${x((prev.get(d) || d).value)},${y(
                    (prev.get(d) || d).rank
                  )})`
              )
              .attr("y", y.bandwidth() / 2)
              .attr("x", -6)
              .attr("dy", "-0.25em")
              .text(d => d.name)
              .call(text =>
                text
                  .append("tspan")
                  .attr("fill-opacity", 0.7)
                  .attr("font-weight", "normal")
                  .attr("x", -6)
                  .attr("dy", "1.15em")
              ),
          update => update,
          exit =>
            exit
              .transition(transition)
              .remove()
              .attr(
                "transform",
                d =>
                  `translate(${x((next.get(d) || d).value)},${y(
                    (next.get(d) || d).rank
                  )})`
              )
              .call(g =>
                g
                  .select("tspan")
                  .tween("text", d =>
                    textTween(d.value, (next.get(d) || d).value)
                  )
              )
        )
        .call(bar =>
          bar
            .transition(transition)
            .attr("transform", d => `translate(${x(d.value)},${y(d.rank)})`)
            .call(g =>
              g
                .select("tspan")
                .tween("text", d =>
                  textTween((prev.get(d) || d).value, d.value)
                )
            )
        ));
  }

  function bars(svg) {
    let bar = svg
      .append("g")
      .attr("fill-opacity", 0.6)
      .selectAll("rect");

    return ([date, data], transition) =>
      (bar = bar
        .data(data.slice(0, n), d => d.name)
        .join(
          enter =>
            enter
              .append("rect")
              .attr("fill", color)
              .attr("height", y.bandwidth())
              .attr("x", x(0))
              .attr("y", d => y((prev.get(d) || d).rank))
              .attr("width", d => x((prev.get(d) || d).value) - x(0)),
          update => update,
          exit =>
            exit
              .transition(transition)
              .remove()
              .attr("y", d => y((next.get(d) || d).rank))
              .attr("width", d => x((next.get(d) || d).value) - x(0))
        )
        .call(bar =>
          bar
            .transition(transition)
            .attr("y", d => y(d.rank))
            .attr("width", d => x(d.value) - x(0))
        ));
  }

  function ticker(svg) {
    const now = svg
      .append("text")
      .style("font", `bold ${barSize}px var(--sans-serif)`)
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
      .attr("x", width - 6)
      .attr("y", margin.top + barSize * (n - 0.45))
      .attr("dy", "0.32em")
      .text(formatDate(keyframes[0][0]));

    return ([date], transition) => {
      transition.end().then(() => now.text(formatDate(date)));
    };
  }
}

function autoType(object) {
  for (var key in object) {
    var value = object[key].toString().trim(),
      number,
      m;
    if (!value) value = null;
    else if (value === "true") value = true;
    else if (value === "false") value = false;
    else if (value === "NaN") value = NaN;
    else if (!isNaN((number = +value))) value = number;
    else if (
      (m = value.match(
        /^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/
      ))
    ) {
      if (fixtz && !!m[4] && !m[7])
        value = value.replace(/-/g, "/").replace(/T/, " ");
      value = new Date(value);
    } else continue;
    object[key] = value;
  }
  return object;
}

// https://github.com/d3/d3-dsv/issues/45
var fixtz =
  new Date("2019-01-01T00:00").getHours() ||
  new Date("2019-07-01T00:00").getHours();
