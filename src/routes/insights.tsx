import "../App.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";

import { terminal } from "virtual:terminal";

import { useAuth0 } from "@auth0/auth0-react";

import { Tooltip } from "react-tooltip";

import generateIcon from "../../icons";

function Insights() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState();
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: "mantraminder-backend-api",
          },
        });
        await axios
          .get(
            "http://localhost:3000/insights/summary/" + user.sub.substring(6),
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then((res) => {
            terminal.log(res.data);
            setData(res.data);
          });
      } catch (error) {
        terminal.log(error);
      }
    }
    fetchData();
  }, [refresh]);

  async function handleDelete(id) {
    try {
      let data = {
        userId: user.sub.substring(6),
        insightId: parseInt(id),
      };
      terminal.log(data);
      await axios
        .delete("http://localhost:3000/insights/delete", { data: data })
        .then((res) => {
          terminal.log(res);
          setRefresh(!refresh);
        });
    } catch (error) {
      terminal.log(error);
    }
  }

  return (
    <>
      <div className="bg-base-200 grow flex flex-col justify-center items-center">
        <p className="mb-5 text-3xl">Insights</p>
        {data != null
          ? data.map((insight, i) => {
              return (
                <>
                  <div className="card bg-base-100 w-96 shadow-xl py-0 px-2 my-2">
                    <div className="card-body  p-3">
                      <h2 className="card-title ">
                        {insight.insightDescription}
                      </h2>
                      <p className="text-right">{insight.insightSource}</p>
                      <div className="flex flex-row justify-between">
                        {generateIcon(insight.categoryId)}
                        <div className="flex flex-row space-x-2">
                          <Link to={"/insights/" + insight.insightId}>
                            <AiOutlineEdit size="1.25rem" />
                          </Link>
                          <AiOutlineDelete
                            size="1.25rem"
                            data-tooltip-id={
                              insight.daysCount > 0 ? "my-tooltip2" : ""
                            }
                            data-tooltip-html={`You cannot delete this Insight as it is connected to at least one Day`}
                            style={{
                              color: insight.daysCount == 0 ? "red" : "grey",
                              cursor: insight.daysCount == 0 ? "pointer" : "",
                            }}
                            onClick={() =>
                              insight.daysCount == 0
                                ? handleDelete(insight.insightId)
                                : null
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })
          : null}
        <Link to="/insights/create">
          <button className="btn btn-primary mt-5">Create a new insight</button>
        </Link>
        <Tooltip style={{ width: "50%" }} id="my-tooltip2" />
      </div>
    </>
  );
}

export default Insights;
