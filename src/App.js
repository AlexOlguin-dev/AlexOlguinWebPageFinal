import React from "react";
import Play from "./Views/Play";
import Stage1 from "./Views/Stage1";
import Stage2 from "./Views/Stage2";
import Stage3 from "./Views/Stage3";
import { AppBar, Toolbar, Box } from "@mui/material";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import ICON from '../src/assets/img/Icon.png';

function App() {
  return (
    <React.Fragment>
      {/* Navbar negro con gradiente */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))",
          height: 64,
          justifyContent: "center",
        }}
      >
        <Toolbar sx={{ minHeight: "64px", display: 'flex', alignItems: 'center' }}>
          {/* Icono a la izquierda */}
          <Box
            component="img"
            src={ICON}
            alt="Icon"
            sx={{ height: 30, width: 40, mr: 2, userSelect: "none" }}
          />
          
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <Box sx={{ pt: "64px" }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Play />} />
            <Route path="/stage1" element={<Stage1 />} />
            <Route path="/stage2" element={<Stage2 />} />
            <Route path="/stage3" element={<Stage3 />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </React.Fragment>
  );
}

export default App;