import { useEffect, useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useAuth0 } from "@auth0/auth0-react";

import { IoMdAdd } from "react-icons/io";

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
      <div className="bg-base-200 grow flex flex-col justify-center items-center">
        <p className="mb-5 text-3xl">Days</p>
        <div
          className=" carousel carousel-center bg-base-100 rounded-box w-10/12 sm:w-1/2 px-10
min-h-96
"
        >
          {data.days.map((day, i) => {
            return (
              <div
                className="bg-blue-100 w-full carousel-item flex flex-col justify-evenly items-center m-5 px-5  rounded-xl shadow-md
"
              >
                <p className="text-xl">
                  {day.date
                    .toString()
                    .replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")}
                </p>
                <div className="mx-auto w-4/5 divider " />
                <p>
                  <b>Entry:</b> {day.entry}
                </p>
                <p>
                  <b>Mood:</b> {day.score}
                </p>
                <p>
                  <b>Practiced:</b>{" "}
                </p>
                <ul className="list-disc">
                  {day.applications.map((application, i) => {
                    return (
                      <>
                        <li className="italic">
                          {application.insight.description}
                        </li>
                      </>
                    );
                  })}
                </ul>
                <div className="mx-auto w-4/5 divider " />
                <div className=" w-full sm:w-4/5 flex flex-row justify-evenly">
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
            );
          })}
        </div>
        <Link to="/days/create">
          <button className="mt-5 btn btn-primary">
            <IoMdAdd />
            Add day
          </button>
        </Link>
      </div>
    </>
  );
}

export default Days;
