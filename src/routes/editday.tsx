import "../App.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import { terminal } from "virtual:terminal";

import Select from "react-select";

import { useAuth0 } from "@auth0/auth0-react";

import Datepicker from "react-tailwindcss-datepicker";

function EditDay() {
  const [description, setDescription] = useState("");
  const [insights, setInsights] = useState();
  const [selectedInsights, setSelectedInsights] = useState();
  const [mood, setMood] = useState(2);
  const [date, setDate] = useState();
  const [dates, setDates] = useState([]);

  const navigate = useNavigate();

  const { user, getAccessTokenSilently } = useAuth0();

  let { dayId } = useParams();

  const insightsPair =
    insights != null
      ? insights.insights.map((insight, i) => ({
          value: insight.id,
          label: insight.description,
        }))
      : [];

  terminal.log(insightsPair);
  useEffect(() => {
    async function fetchInsights() {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: "mantraminder-backend-api",
          },
        });
        await axios
          .get(
            "http://localhost:3000/insights/users/" + user.sub.substring(6),
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then((res) => {
            setInsights(res.data[0]);
          });
      } catch (error) {
        terminal.log(error);
      }
    }

    async function fetchData() {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: "mantraminder-backend-api",
          },
        });
        await axios
          .get("http://localhost:3000/days/" + dayId, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            terminal.log(res.data);
            let existingDate = res.data.date
              .toString()
              .replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
            setDate({
              startDate: existingDate,
              endDate: existingDate,
            });
            setDescription(res.data.entry);
            setMood(res.data.score);
            setDescription(res.data.entry);
            terminal.log(
              res.data.applications.map((application, i) => ({
                value: application.insight.id,
                label: application.insight.description,
              }))
            );
            setSelectedInsights(
              res.data.applications.map((application, i) => ({
                value: application.insight.id,
                label: application.insight.description,
              }))
            );
          });
      } catch (error) {
        terminal.log(error);
      }
    }
    async function fetchDates() {
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
            setDates(
              res.data[0].days.map((day, i) => {
                let newdate = day.date
                  .toString()
                  .replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                return {
                  startDate: newdate,
                  endDate: newdate,
                };
              })
            );

            terminal.log(dates);
          });
      } catch (error) {
        terminal.log(error);
      }
    }
    fetchInsights();
    fetchData();
    fetchDates();
  }, []);

  async function handleSubmit() {
    if (date.startDate == null || date.endDate == null || description == "") {
      document.getElementById("error").showModal();
    } else {
      document.getElementById("my_modal_1").showModal();
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: "mantraminder-backend-api",
          },
        });
        let data = {
          date: date.startDate.replace(/-/g, ""),
          dayId: parseInt(dayId),
          score: mood,
          entry: description,
          insights: selectedInsights.map((insight) => insight.value),
        };
        terminal.log("we are submitting: ", data);
        await axios
          .put("http://localhost:3000/days/update", data, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            terminal.log(res);
            setTimeout(() => {
              document.getElementById("my_modal_1").close();
              navigate("/days");
            }, 2000);
          });
      } catch (error) {
        terminal.log(error);
      }
    }
  }

  return (
    <>
      <div className="bg-base-200 grow flex flex-col justify-center items-center">
        <p className="text-3xl">Edit day</p>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Date</span>
          </div>
          <Datepicker
            primaryColor={"blue"}
            // inputClassName="textarea textarea-bordered  h-24"
            // toggleClassName="textarea textarea-bordered  h-24"
            disabledDates={dates}
            asSingle={true}
            useRange={false}
            startFrom={date != null ? date.startDate : new Date()}
            value={date}
            onChange={(newvalue) => {
              terminal.log(newvalue);
              setDate(newvalue);
            }}
          />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">How was your day today?</span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered  h-24"
            placeholder="Summary"
          ></textarea>
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">
              What insights did you apply today?
            </span>
          </div>
          {selectedInsights != null ? (
            <Select
              onChange={(e) => setSelectedInsights(e)}
              classNames={{
                container: (state) =>
                  "bg-base-100 rounded-btn border-transparent pe-10 pr-0 border-base-content/20",
                control: (state) => "rounded-btn py-2 w-full max-w-xs px-1",
                multiValue: (state) => "rounded",
              }}
              styles={{
                multiValueLabel: (baseStyles, state) => ({
                  ...baseStyles,
                  whiteSpace: "normal",
                }),
              }}
              closeMenuOnSelect={false}
              isMulti
              options={insightsPair}
              defaultValue={selectedInsights}
            ></Select>
          ) : null}
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">
              As a result, how's your mood today?
            </span>
          </div>
          <div className="rating rating-lg">
            <input
              type="radio"
              onChange={() => setMood(0)}
              name="rating-9"
              className="rating-hidden"
              checked={mood === 0}
            />
            <input
              type="radio"
              onChange={() => setMood(1)}
              name="rating-9"
              className="mask mask-star-2"
              checked={mood === 1}
            />
            <input
              type="radio"
              onChange={() => setMood(2)}
              name="rating-9"
              className="mask mask-star-2"
              checked={mood === 2}
            />
            <input
              type="radio"
              onChange={() => setMood(3)}
              name="rating-9"
              className="mask mask-star-2"
              checked={mood === 3}
            />
            <input
              type="radio"
              onChange={() => setMood(4)}
              name="rating-9"
              className="mask mask-star-2"
              checked={mood === 4}
            />
            <input
              type="radio"
              onChange={() => setMood(5)}
              name="rating-9"
              className="mask mask-star-2"
              checked={mood === 5}
            />
          </div>
        </label>

        <button onClick={() => handleSubmit()} className="btn btn-primary mt-5">
          Save day
        </button>

        <Link to="/days">
          <button className="btn btn-secondary mt-5">Back to Days</button>
        </Link>
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box flex flex-col justify-center items-center">
          <p>Saving your edits</p>
          <span className="mt-3 loading loading-bars loading-lg"></span>
        </div>
      </dialog>
      <dialog id="error" className="modal">
        <div className="modal-box flex flex-col justify-center items-center">
          <p>Date or description cannot be empty!</p>
          <button
            onClick={() => document.getElementById("error").close()}
            className="btn btn-error mt-5"
          >
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}

export default EditDay;
