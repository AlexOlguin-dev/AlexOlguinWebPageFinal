import React, { useState, useEffect } from 'react';
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import MainLogo from '../assets/img/Titulo.png';
import StartButton from '../assets/img/start_button.png';
import StartButtonHover from '../assets/img/start_button_hover.png';

const Play = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleStartClick = () => {
    setFadeOut(true);
    setTimeout(() => {
      navigate('/stage1');
    }, 600);
  };

  return (
    <Box
      style={{
        height: "100vh",
        backgroundColor: "#38002C", // Fondo fijo siempre visible
        marginTop: "-60px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        flexDirection: "column",
        padding: isMobile ? "20px" : "0",
      }}
    >
      {/* Contenedor del contenido para hacer fade out */}
      <Box
        sx={{
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 0.6s ease-in-out",
          width: '100%',
          maxWidth: 600,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* TITLE */}
        <Box
          sx={{
            width: isMobile ? "90vw" : 500,
            maxWidth: 500,
            aspectRatio: "16 / 9",
            backgroundImage: `url(${MainLogo})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: isMobile ? 14 : 20,
              color: "#fff",
              textShadow: "2px 2px 0 #000, 4px 4px 0 #555",
              paddingTop: isMobile ? "50px" : "80px",
              textAlign: "center",
              maxWidth: isMobile ? "80vw" : "300px",
              wordWrap: "break-word",
              whiteSpace: "normal",
              marginLeft: isMobile ? "0" : "-15px",
              lineHeight: 1.5,
            }}
          >
            Desarrollador FullStack
          </Box>
        </Box>

        {/* START BUTTON */}
        <Box
          component="img"
          src={isHovered ? StartButtonHover : StartButton}
          alt="Start Button"
          sx={{
            width: isMobile ? "150px" : "200px",
            marginTop: isMobile ? "30px" : "40px",
            cursor: "pointer",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleStartClick}
        />
      </Box>
    </Box>
  );
};

export default Play;