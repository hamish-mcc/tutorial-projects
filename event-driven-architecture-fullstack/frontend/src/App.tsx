import "bootstrap/dist/css/bootstrap.css";
import React, { useState } from "react";
import Delivery from "./Delivery";

const App: React.FC = () => {
  const [id, setId] = useState<string>("");
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(form.entries());
    const response = await fetch("http://localhost:8000/deliveries/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "CREATE_DELIVERY",
        data,
      }),
    });
    const { id } = await response.json();
    setId(id);
  };
  return (
    <div className="py-5">
      <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
        {id === "" ? (
          <div className="card">
            <div className="card-header">Create Delivery</div>
            <form className="card-body" onSubmit={submit}>
              <div className="mb-3">
                <input
                  type="number"
                  name="budget"
                  className="form-control"
                  placeholder="Budget"
                />
              </div>
              <div className="mb-3">
                <input
                  name="notes"
                  className="form-control"
                  placeholder="Notes"
                />
              </div>
              <button className="btn btn-primary">Submit</button>
            </form>
          </div>
        ) : (
          <Delivery id={id} />
        )}
      </div>
    </div>
  );
};

export default App;
