import React, { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import SCROLLDOWN from '../assets/img/stage3_objects/scroll_down_logo.png';

const generateStars = (count, maxHeightPx) => {
  return Array.from({ length: count }).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * maxHeightPx,
    size: 1 + Math.random() * 2,
    id: Math.random().toString(36).substr(2, 9),
  }));
};

const Stage3 = () => {
  const [opacity, setOpacity] = useState(0);
  const isFadingIn = useRef(true);
  const [scrollY, setScrollY] = useState(0);

  const PANEL_HEIGHT = 4000; // px
  const TOTAL_STARS = 400;

  const starsBg = useRef(generateStars(Math.floor(TOTAL_STARS * 0.6), PANEL_HEIGHT));
  const starsMid = useRef(generateStars(Math.floor(TOTAL_STARS * 0.25), PANEL_HEIGHT));
  const starsFront = useRef(generateStars(Math.floor(TOTAL_STARS * 0.15), PANEL_HEIGHT));

  useEffect(() => {
    const originalOverflowX = document.body.style.overflowX;
    const originalOverflowY = document.body.style.overflowY;

    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "auto";

    const fadeInTimeout = setTimeout(() => {
      setOpacity(1);
      setTimeout(() => {
        isFadingIn.current = false;
      }, 3000);
    }, 100);

    const handleScroll = () => {
      const currentScroll = window.scrollY || window.pageYOffset;
      setScrollY(currentScroll);

      if (isFadingIn.current) return;

      const fadeDistance = 300;
      let newOpacity = 1 - currentScroll / fadeDistance;
      setOpacity(Math.max(0, Math.min(newOpacity, 1)));
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      document.body.style.overflowX = originalOverflowX;
      document.body.style.overflowY = originalOverflowY;
      clearTimeout(fadeInTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const parallaxFactors = {
    bg: 0.2,
    mid: 0.5,
    front: 0.8,
  };

  // 🎯 Calculamos opacidad general de estrellas según el scroll
  const fadeInDistance = 1000; // Cuánto scroll necesita para estar al 100%
  const starsOpacityFactor = Math.min(scrollY / fadeInDistance, 1);

  return (
    <Box
      style={{
        width: "100vw",
        height: `${PANEL_HEIGHT}px`,
        marginTop: "-60px",
        backgroundColor: "black",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Capa fondo */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: `${PANEL_HEIGHT}px`,
          transform: `translateY(-${scrollY * parallaxFactors.bg}px)`,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        {starsBg.current.map((star) => (
          <Box
            key={star.id}
            sx={{
              position: "absolute",
              left: `${star.x}vw`,
              top: `${star.y}px`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: "white",
              borderRadius: "50%",
              opacity: 0.6 * starsOpacityFactor,
            }}
          />
        ))}
      </Box>

      {/* Capa media */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: `${PANEL_HEIGHT}px`,
          transform: `translateY(-${scrollY * parallaxFactors.mid}px)`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        {starsMid.current.map((star) => (
          <Box
            key={star.id}
            sx={{
              position: "absolute",
              left: `${star.x}vw`,
              top: `${star.y}px`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: "white",
              borderRadius: "50%",
              opacity: 0.85 * starsOpacityFactor,
            }}
          />
        ))}
      </Box>

      {/* Capa frente */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: `${PANEL_HEIGHT}px`,
          transform: `translateY(-${scrollY * parallaxFactors.front}px)`,
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        {starsFront.current.map((star) => (
          <Box
            key={star.id}
            sx={{
              position: "absolute",
              left: `${star.x}vw`,
              top: `${star.y}px`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: "white",
              borderRadius: "50%",
              opacity: 1 * starsOpacityFactor,
            }}
          />
        ))}
      </Box>

      {/* Imagen Scroll Down */}
      <img
        src={SCROLLDOWN}
        alt="Scroll Down"
        style={{
          position: "absolute",
          top: "80vh",
          left: "50%",
          transform: "translateX(-50%)",
          width: "150px",
          opacity: opacity,
          transition: isFadingIn.current ? "opacity 3s ease-in-out" : "none",
          zIndex: 4,
        }}
      />
    </Box>
  );
};

export default Stage3;