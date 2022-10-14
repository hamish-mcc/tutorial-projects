import { Outlet } from "react-router-dom";
import { Container } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { AuthProvider } from "./context/auth";
import MenuBar from "./components/MenuBar";

function App() {
  return (
    <AuthProvider>
      <Container>
        <MenuBar />
        <Outlet />
      </Container>
    </AuthProvider>
  );
}

export default App;
