import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import { useAuth0 } from "@auth0/auth0-react";

import { BACKEND_URL } from "../constants";

function CreateInsight() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
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
      } catch (error) {}
    }
    fetchData();
  }, []);

  async function handleSubmit() {
    if (description == "" || source == "") {
      (document.getElementById("error") as HTMLDialogElement).showModal();
    } else {
      (document.getElementById("my_modal_1") as HTMLDialogElement).showModal();
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: "mantraminder-backend-api",
          },
        });
        let data = {
          id: user.sub.substring(6),
          description: description,
          source: source,
          categoryId: category,
        };

        await axios
          .post(BACKEND_URL + "/insights/create", data, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {});
        setTimeout(() => {
          (document.getElementById("my_modal_1") as HTMLDialogElement).close();
          navigate("/insights");
        }, 2000);
      } catch (error) {}
    }
  }

  return (
    <>
      <div className="bg-base-200 px-5 sm:h-full grow flex flex-col justify-center items-center">
        <p className="text-3xl my-5">Create insight</p>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">What was the insight?</span>
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
            <span className="label-text">Help us categorise the insight:</span>
          </div>
          <select
            className="select select-bordered"
            onChange={(e) => setCategory(parseInt(e.target.value))}
          >
            <option disabled selected>
              Insight category
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
            <span className="label-text">
              What was the source of this insight?
            </span>
          </div>
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            type="text"
            placeholder="Insight Source"
            className="input input-bordered w-full max-w-xs"
          />
        </label>

        <button onClick={() => handleSubmit()} className="btn btn-primary mt-5">
          Create
        </button>

        <Link to="/insights">
          <button className="btn btn-secondary mt-5 mb-20">
            Back to insights
          </button>
        </Link>
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box flex flex-col justify-center items-center">
          <p>Creating your insight</p>
          <span className="mt-3 loading loading-bars loading-lg"></span>
        </div>
      </dialog>
      <dialog id="error" className="modal">
        <div className="modal-box flex flex-col justify-center items-center">
          <p>Insight description and source cannot be empty!</p>
          <button
            onClick={() =>
              (document.getElementById("error") as HTMLDialogElement).close()
            }
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
