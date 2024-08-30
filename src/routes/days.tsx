import { useEffect, useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useAuth0 } from "@auth0/auth0-react";

import { IoMdAdd } from "react-icons/io";
import { MdStar } from "react-icons/md";
import { TiLeaf } from "react-icons/ti";

import { BACKEND_URL } from "../constants";

function Days() {
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState({ days: [] });
  const [refresh, setRefresh] = useState(true);

  const { user } = useAuth0();

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
            res.data[0].days = res.data[0].days.sort(function (a, b) {
              return b.date - a.date;
            });
            setData(res.data[0]);
          });
      } catch (error) {}
    }
    fetchData();
    async function createUser() {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: "mantraminder-backend-api",
          },
        });
        let foundUser = await axios.get(
          BACKEND_URL + "/users/" + user.sub.substring(6),
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!foundUser.data) {
          await axios.post(
            BACKEND_URL + "/users/create",
            {
              id: user.sub.substring(6),
              name: user.name,
              email: user.email,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        } else {
        }
      } catch (error) {}
    }
    createUser();
  }, [refresh]);

  async function handleDelete(dayId) {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: "mantraminder-backend-api",
        },
      });
      let data = {
        dayId: parseInt(dayId),
      };

      await axios
        .delete(BACKEND_URL + "/days/delete", {
          data: data,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setRefresh(!refresh);
        });
    } catch (error) {}
  }

  return (
    <>
      <div className="bg-base-200 sm:h-full grow flex flex-col justify-center items-center">
        <p className="my-5 text-3xl">Days</p>
        <div
          className=" carousel carousel-center bg-base-100 rounded-box rounded-3xl w-9/12 sm:w-2/5 lg:w-96 px-10
min-h-96
"
        >
          {data.days.map((day, i) => {
            return (
              <div
                className="bg-blue-200 w-full carousel-item flex flex-col justify-between items-center m-5 px-5 py-4 rounded-3xl shadow-md
"
              >
                <div className="w-full">
                  <div className=" w-full flex flex-row justify-between text-xl">
                    <p>
                      {day.date
                        .toString()
                        .replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")}
                    </p>
                    <div className="flex flex-row items-center space-x-1">
                      <MdStar />
                      <p>{day.score}</p>
                    </div>
                  </div>

                  <div className="my-0 w-full divider " />
                </div>
                <div className="w-4/5 flex flex-col justify-center space-y-6">
                  <p className="my-2  text-center">"{day.entry}"</p>

                  <div className="space-y-2">
                    <p>
                      <b>Applied:</b>{" "}
                    </p>
                    <ul style={{ listStyle: "none" }} className="list-disc">
                      {day.applications.map((application, i) => {
                        return (
                          <>
                            <li className="italic flex flex-row space-x-2">
                              <TiLeaf
                                className="shrink-0"
                                size="20"
                                min-width="20"
                              />
                              <p>{application.insight.description}</p>
                            </li>
                          </>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <div className="w-full">
                  <div className="my-1 w-full divider " />
                  <div className=" w-full flex flex-row justify-evenly">
                    <Link to={"/days/" + day.id}>
                      <button className="btn btn-accent">
                        <AiOutlineEdit />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(day.id)}
                      className="btn btn-error"
                    >
                      {" "}
                      <AiOutlineDelete />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Link to="/days/create">
          <button className="mt-5 mb-20 btn btn-primary">
            <IoMdAdd />
            Add day
          </button>
        </Link>
      </div>
    </>
  );
}

export default Days;
