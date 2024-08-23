import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { terminal } from "virtual:terminal";
import * as d3 from "d3";
import { Tooltip } from "react-tooltip";
import { useAuth0 } from "@auth0/auth0-react";
import Guidance from "./guidance";

import { BACKEND_URL } from "../constants";

export default function Chart2() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState();
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth * 0.8,
    height: 200,
  });
  const [guide, setGuide] = useState(false);

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
          .get(BACKEND_URL + "/insights/summary/" + user.sub.substring(6), {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            terminal.log(res.data);
            setData(res.data);
          });
      } catch (error) {
        terminal.log(error);
      }
    }
    fetchData();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { width, height } = dimensions;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 50;
  const marginLeft = 40;

  const x = d3
    .scaleLinear()
    .domain(data != null ? [0, d3.max(data, (d) => d.daysCount)] : [0, 10])
    .range([marginLeft, width - marginRight]);

  const y = d3
    .scaleLinear()
    .domain([-1, 5])
    .range([height - marginBottom, marginTop]);

  const gx = useRef();
  const gy = useRef();

  useEffect(
    () =>
      void d3
        .select(gx.current)
        .call(
          d3
            .axisBottom(x)
            .ticks(data != null ? d3.max(data, (d) => d.daysCount) + 1 : 5)
        )[(gx, x)]
  );
  useEffect(
    () =>
      void d3.select(gy.current).call(
        d3
          .axisLeft(y)
          .tickValues([...Array(6).keys()])
          .tickFormat(d3.format(""))
      )[(gy, y)]
  );

  const GuidanceWrapper = ({ bx, by, text, col }) => {
    const commonProps = {
      marginBottom: marginBottom,
      marginLeft: marginLeft,
      marginTop: marginTop,
      marginRight: marginRight,
      width: width,
      height: height,
    };

    return <Guidance {...commonProps} bx={bx} by={by} text={text} col={col} />;
  };

  return (
    <>
      <div className="form-control">
        <label className="label cursor-pointer space-x-3">
          <span className="label-text">
            {!guide ? "Show guide" : "Hide guide"}
          </span>
          <input
            onChange={() => setGuide(!guide)}
            type="checkbox"
            className="toggle"
          />
        </label>
      </div>
      <div className="bg-base-100 rounded-2xl shadow p-3">
        {data != null ? (
          <svg width={width} height={height}>
            <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
            <g ref={gy} transform={`translate(${marginLeft},0)`} />

            {guide && (
              <>
                <GuidanceWrapper bx={1} by={0} text="Sustain" col="#e4ffde" />
                <GuidanceWrapper
                  bx={0}
                  by={1}
                  text="Re-evaluate"
                  col="#fff1fe"
                />
                <GuidanceWrapper bx={1} by={1} text="Do less!" col="#ffeee0" />
                <GuidanceWrapper bx={0} by={0} text="Do more!" col="#fffddb" />
              </>
            )}

            <g>
              {data.map(
                (d, i) =>
                  d.daysCount > 0 && (
                    <>
                      <path
                        className="fill-primary"
                        // d={d3.symbol().type(d3.symbolDiamond2).size(75)()}
                        d="M20 11c0-4.9-3.499-9.1-8.32-9.983l-.18-.034-.18.033c-4.821.884-8.32 5.084-8.32 9.984 0 4.617 3.108 8.61 7.5 9.795v1.205c0 .553.448 1 1 1s1-.447 1-1v-1.205c4.392-1.185 7.5-5.178 7.5-9.795zm-7.5 7.7v-2.993l4.354-4.354c.195-.195.195-.512 0-.707s-.512-.195-.707 0l-3.647 3.647v-3.586l2.354-2.354c.195-.195.195-.512 0-.707s-.512-.195-.707 0l-1.647 1.647v-3.293c0-.553-.448-1-1-1s-1 .447-1 1v3.293l-1.646-1.647c-.195-.195-.512-.195-.707 0s-.195.512 0 .707l2.354 2.354v3.586l-3.646-3.646c-.195-.195-.512-.195-.707 0s-.195.512 0 .707l4.354 4.354v2.992c-3.249-1.116-5.502-4.179-5.502-7.7 0-3.874 2.723-7.201 6.5-7.981 3.777.78 6.5 4.107 6.5 7.981 0 3.521-2.253 6.584-5.5 7.7z"
                        key={i}
                        transform={`translate(${x(d.daysCount) - 10},${
                          y(d.scoreAverage) - 10
                        })`}
                      />
                      {/* <TiLeaf
                    style={{
                      transform: `translate(${x(d.daysCount)}px,${y(
                        d.scoreAverage
                      )}px)`,
                    }}
                  /> */}
                      <circle
                        data-tooltip-id="my-tooltip2"
                        data-tooltip-html={`<b>${d.insightDescription}</b> <br /><br />
                        Days applied: <b>${d.daysCount}</b>
                        <br />
                        Average mood score: <b>${d.scoreAverage}</b>
                        `}
                        key={i}
                        cx={x(d.daysCount)}
                        cy={y(d.scoreAverage)}
                        r="10"
                        fill="transparent"
                      />
                    </>
                  )
              )}
            </g>
            <text
              y={marginLeft - 25}
              x={marginTop - 0.8 * height}
              transform="rotate(-90)"
            >
              Average mood
            </text>
            <text y={marginTop + 0.85 * height} x={marginLeft + 0.3 * width}>
              Days applied
            </text>
          </svg>
        ) : null}
        <Tooltip className="text-center" id="my-tooltip2" />
      </div>
    </>
  );
}
