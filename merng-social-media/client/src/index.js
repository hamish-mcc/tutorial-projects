import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "apollo-link-context";

import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SinglePost from './pages/SinglePost'
import Register from "./pages/Register";
import AuthRoute from "./util/AuthRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "login",
        element: <AuthRoute component={<Login />} />,
      },
      {
        path: "register",
        element: <AuthRoute component={<Register />} />,
      },
      {
        path: "posts/:postId",
        element: <SinglePost />
      }
    ],
  },
]);

const httpLink = createHttpLink({
  uri: "http://localhost:5000",
});

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
