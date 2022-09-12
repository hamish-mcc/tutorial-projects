import React, { useEffect, useState } from "react";

interface DeliveryData {
  id: string;
  budget: number;
  notes: string;
  status: "ready" | "active" | "collected" | "completed";
}

type DeliveryEvent =
  | "CREATE_DELIVERY"
  | "START_DELIVERY"
  | "PICKUP_PRODUCTS"
  | "DELIVER_PRODUCTS"
  | "INCREASE_BUDGET";

interface Props {
  id: string;
}

const inProgress =
  "progress-bar bg-success progress-bar-striped progress-bar-animated";

const completed = "progress-bar bg-success";

const Delivery: React.FC<Props> = (props) => {
  const [state, setState] = useState<DeliveryData | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `http://localhost:8000/deliveries/${props.id}/status`
      );
      const data = await response.json();
      setState(data);
    })();
  }, [props.id, refresh]);

  const submit = async (
    e: React.FormEvent<HTMLFormElement>,
    type: DeliveryEvent
  ) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(form.entries());
    console.log({ data });
    const response = await fetch("http://localhost:8000/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        data,
        delivery_id: state && state.id,
      }),
    });
    if (!response.ok) {
      const { detail } = await response.json();
      alert(detail);
      return;
    }

    setRefresh(!refresh);
  };

  return (
    state && (
      <div className="row w-100">
        <div className="col-12 mb-4">
          <h4 className="fw-bold text-white">Delivery {state.id}</h4>
        </div>
        <div className="col-12 mb-5">
          <div className="progress">
            {state.status !== "ready" ? (
              <div
                className={state.status === "active" ? inProgress : completed}
                role="progressbar"
                style={{ width: "50%" }}
              />
            ) : (
              ""
            )}
            {state.status === "collected" || state.status === "completed" ? (
              <div
                className={
                  state.status === "collected" ? inProgress : completed
                }
                role="progressbar"
                style={{ width: "50%" }}
              />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="col-3">
          <div className="card">
            <div className="card-header">Start Delivery</div>
            <form
              className="card-body"
              onSubmit={(e) => submit(e, "START_DELIVERY")}
            >
              <button className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
        <div className="col-3">
          <div className="card">
            <div className="card-header">Increase Budget</div>
            <form
              className="card-body"
              onSubmit={(e) => submit(e, "INCREASE_BUDGET")}
            >
              <div className="mb-3">
                <input
                  type="number"
                  name="budget"
                  className="form-control"
                  placeholder="Budget"
                />
              </div>
              <button className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
        <div className="col-3">
          <div className="card">
            <div className="card-header">Pick Up Products</div>
            <form
              className="card-body"
              onSubmit={(e) => submit(e, "PICKUP_PRODUCTS")}
            >
              <div className="input-group mb-3">
                <input
                  type="number"
                  name="purchase_price"
                  className="form-control"
                  placeholder="Purchase Price"
                />
                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  placeholder="Quantity"
                />
              </div>
              <button className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
        <div className="col-3">
          <div className="card">
            <div className="card-header">Pick Up Products</div>
            <form
              className="card-body"
              onSubmit={(e) => submit(e, "DELIVER_PRODUCTS")}
            >
              <div className="input-group mb-3">
                <input
                  type="number"
                  name="sell_price"
                  className="form-control"
                  placeholder="SellPrice"
                />
                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  placeholder="Quantity"
                />
              </div>
              <button className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
        <code className="col-12 mt-4">{JSON.stringify(state)}</code>
      </div>
    )
  );
};

export default Delivery;
