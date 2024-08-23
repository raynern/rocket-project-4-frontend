import "../App.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import { terminal } from "virtual:terminal";

import { useAuth0 } from "@auth0/auth0-react";

import { BACKEND_URL } from "../constants";

function CreateInsight() {
  const [categories, setCategories] = useState();
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState(0);

  const navigate = useNavigate();

  const { getAccessTokenSilently } = useAuth0();

  let { insightId } = useParams();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: "mantraminder-backend-api",
          },
        });
        await axios
          .get(BACKEND_URL + "/categories", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            setCategories(res.data);
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
          .get(BACKEND_URL + "/insights/" + insightId, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            setDescription(res.data.description);
            setSource(res.data.source);
            setCategory(res.data.categoryId);
          });
      } catch (error) {
        terminal.log(error);
      }
    }
    fetchCategories();
    fetchData();
  }, []);

  async function handleSubmit() {
    if (description == "" || source == "") {
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
          insightId: parseInt(insightId),
          description: description,
          source: source,
          categoryId: category,
        };
        terminal.log(data);
        await axios
          .put(BACKEND_URL + "/insights/update", data, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            terminal.log(res);
            setTimeout(() => {
              document.getElementById("my_modal_1").close();
              navigate("/insights");
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
        <p className="text-3xl">View or edit insight</p>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Insight</span>
          </div>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            placeholder="Insight"
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Insight category</span>
          </div>
          <select
            className="select select-bordered"
            onChange={(e) => setCategory(parseInt(e.target.value))}
            value={category}
          >
            <option disabled selected>
              Category
            </option>
            {categories != null
              ? categories.map((category, i) => {
                  return (
                    <option value={category.id}>{category.description}</option>
                  );
                })
              : null}
          </select>
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Insight Source</span>
          </div>
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            type="text"
            placeholder="Source"
            className="input input-bordered w-full max-w-xs"
          />
        </label>

        <button onClick={() => handleSubmit()} className="btn btn-primary mt-5">
          Submit
        </button>

        <Link to="/insights">
          <button className="btn btn-secondary mt-5">Back to insights</button>
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
          <p>Insight description and source cannot be empty!</p>
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

export default CreateInsight;
