import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { terminal } from "virtual:terminal";
import * as d3 from "d3";
import { Tooltip } from "react-tooltip";
import { useAuth0 } from "@auth0/auth0-react";

export default function Chart1({ month }: { month: string }) {
  const { user, getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState();
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth * 0.8,
    height: 200,
  });

  useEffect(() => {
    const handleResize = () => {
      const breakpoint = 768;
      if (window.innerWidth > breakpoint) {
        setDimensions({
          width: 600,
          height: 200,
        });
      } else {
        setDimensions({
          width: window.innerWidth * 0.8,
          height: 200,
        });
      }
    };
    window.addEventListener("resize", handleResize);

    async function fetchData() {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: "mantraminder-backend-api",
          },
        });
        await axios
          .get("http://localhost:3000/days/users/" + user.sub.substring(6), {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            res.data[0].days = res.data[0].days.sort(function (a, b) {
              return a.date - b.date;
            });
            if (month != "") {
              terminal.log("filtering for month: ", month);
              res.data[0].days = res.data[0].days.filter(
                (day) => day.date.toString().substring(0, 6) == month
              );
            }
            setData(
              res.data[0].days.map((day, i) => ({
                date: day.date
                  .toString()
                  .replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"),
                score: day.score,
              }))
            );
          });
      } catch (error) {
        terminal.log(error);
      }
    }
    fetchData();
    return () => window.removeEventListener("resize", handleResize);
  }, [month]);

  const { width, height } = dimensions;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 50;
  const marginLeft = 40;

  const x = d3
    .scaleUtc()
    .domain(
      data != null
        ? [new Date(data[0].date), new Date(data[data.length - 1].date)]
        : [new Date("2023-01-01"), new Date("2024-01-01")]
    )
    .range([marginLeft, width - marginRight]);

  const y = d3
    .scaleLinear()
    .domain([-1, 5])
    .range([height - marginBottom, marginTop]);

  const gx = useRef();
  const gy = useRef();

  const line = d3
    .line()
    .x((d) => x(new Date(d.date)))
    .y((d) => y(d.score))
    .curve(d3.curveCatmullRom.alpha(0.5));
  useEffect(() => {
    void d3
      .select(gx.current)
      // .call(d3.axisBottom(x).ticks(d3.utcMonth.every(1)))
      .call(
        d3
          .axisBottom(x)
          .tickValues(
            data != null ? data.map((d, i) => new Date(d.date)) : null
          )
      )
      .selectAll("text")
      .attr("dx", "-2em")
      .attr("dy", ".6em")
      .attr("transform", "rotate(-65)")[(gx, x)];
  });
  useEffect(
    () =>
      void d3.select(gy.current).call(
        d3
          .axisLeft(y)
          .tickValues([...Array(6).keys()])
          .tickFormat(d3.format(""))
      )[(gy, y)]
  );

  return (
    <>
      <div className="bg-base-100 rounded-2xl shadow p-3">
        {data != null ? (
          <svg width={width} height={height}>
            <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
            <g ref={gy} transform={`translate(${marginLeft},0)`} />
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              d={line(data)}
            />
            <g className="fill-accent" stroke="currentColor" strokeWidth="1.5">
              {data.map((d, i) => (
                <>
                  <circle
                    data-tooltip-id="my-tooltip"
                    data-tooltip-html={`Date: <b>${d.date}</b> <br />
                        Mood score: <b>${d.score}</b>
                        `}
                    key={i}
                    cx={x(new Date(d.date))}
                    cy={y(d.score)}
                    r="5"
                  />
                </>
              ))}
            </g>
            <text
              y={marginLeft - 25}
              x={marginTop - 0.7 * height}
              transform="rotate(-90)"
            >
              Day mood
            </text>
          </svg>
        ) : null}
        <Tooltip className="text-center" id="my-tooltip" />
      </div>
    </>
  );
}
