import "../App.css";
import Chart1 from "../assets/components/Chart1";
import Chart2 from "../assets/components/Chart2";

import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { terminal } from "virtual:terminal";

import axios from "axios";

import { BACKEND_URL } from "../constants";

function Analysis() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState<string[]>([]);
  const [month, setMonth] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: "mantraminder-backend-api",
          },
        });
        await axios
          .get(BACKEND_URL + "/days/users/" + user.sub.substring(6), {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            setData([
              ...(new Set(
                res.data[0].days.map((day: { date: Date }, i: number) =>
                  day.date.toString().substring(0, 6)
                )
              ) as string[]),
            ]);
          });
      } catch (error) {
        terminal.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="bg-base-200 grow flex flex-col justify-center items-center space-y-3">
        <p className="text-2xl font-medium">Monthly time series</p>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">
              Filter by year, month (all by default)
            </span>
          </div>
          <select
            className="select select-bordered w-full max-w-xs"
            onChange={(e) => {
              setMonth(e.target.value);
            }}
          >
            <option value="" selected>
              All
            </option>
            {data &&
              data.map((month, i) => (
                <option value={month}>
                  {month.replace(/(\d{4})(\d{2})/, "$1-$2")}
                </option>
              ))}
          </select>
        </label>
        <Chart1 month={month}></Chart1>
        <div className="divider" />
        <p className="text-2xl font-medium">All time performance of insights</p>
        <Chart2></Chart2>
      </div>
    </>
  );
}

export default Analysis;
