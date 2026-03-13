import { Box, Container, CssBaseline } from "@mui/material";
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router";
import "./styles.css";
import HomePage from "../features/home/HomePage";
function App() {
  const location = useLocation();
  return (
    <Box sx={{ bgcolor: "#eeeeee", minHeight: "100vh" }}>
      <CssBaseline />
      {location.pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          <Navbar />
          <Container maxWidth="xl" sx={{ pt: 14 }}>
            <Outlet></Outlet>
          </Container>
        </>
      )}
    </Box>
  );
}

export default App;
