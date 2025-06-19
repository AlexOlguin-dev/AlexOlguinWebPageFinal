import React, { useEffect, useState, useMemo, useRef } from "react";
import { Box } from "@mui/material";
import SCROLLDOWN from "../assets/img/stage3_objects/scroll_down_logo.png";

const generateStars = (count, maxHeight) =>
  Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * maxHeight,
    size: 1 + Math.random() * 2,
    id: Math.random().toString(36).substr(2, 9),
  }));

const StarLayer = ({ stars, factor, scrollY, opacityFactor, zIndex, baseOpacity }) => (
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      transform: `translateY(-${scrollY * factor}px)`,
      zIndex,
      pointerEvents: "none",
    }}
  >
    {stars.map((star) => (
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
          opacity: baseOpacity * opacityFactor,
        }}
      />
    ))}
  </Box>
);

const Stage3 = () => {
  const PANEL_HEIGHT = 5000;
  const TOTAL_STARS = 400;
  const FADE_IN_DURATION = 3000;
  const FADE_START_DELAY = 100;
  const STARS_FADE_DISTANCE = 1000;
  const TEXT_START = 400;
  const TEXT_END = 3000;

  const [scrollY, setScrollY] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(0);
  const isFadingIn = useRef(true);

  // NUEVO: Estado para saber si estamos en pantalla pequeña
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Función para actualizar isMobile según ancho actual
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600); // ajusta 600px como punto móvil deseado
    };

    handleResize(); // detecta al montar
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const starsBg = useMemo(() => generateStars(TOTAL_STARS * 0.6, PANEL_HEIGHT), []);
  const starsMid = useMemo(() => generateStars(TOTAL_STARS * 0.25, PANEL_HEIGHT), []);
  const starsFront = useMemo(() => generateStars(TOTAL_STARS * 0.15, PANEL_HEIGHT), []);

  const parallax = { bg: 0.2, mid: 0.5, front: 0.8 };
  const starsOpacity = Math.min(scrollY / STARS_FADE_DISTANCE, 1);

  const crawlProgress = Math.max(0, Math.min((scrollY - TEXT_START) / (TEXT_END - TEXT_START), 1));
  const textOpacity =
    crawlProgress < 0.1
      ? crawlProgress * 10
      : crawlProgress > 0.9
      ? 1 - (crawlProgress - 0.9) * 10
      : 1;

  useEffect(() => {
    const prevOverflowX = document.body.style.overflowX;
    const prevOverflowY = document.body.style.overflowY;
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "auto";

    const fadeTimeout = setTimeout(() => {
      setImageOpacity(1);
      setTimeout(() => {
        isFadingIn.current = false;
      }, FADE_IN_DURATION);
    }, FADE_START_DELAY);

    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      setScrollY(y);
      if (!isFadingIn.current) {
        const fadeOut = 1 - y / 300;
        setImageOpacity(Math.max(0, Math.min(fadeOut, 1)));
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.style.overflowX = prevOverflowX;
      document.body.style.overflowY = prevOverflowY;
      clearTimeout(fadeTimeout);
    };
  }, []);

  return (
    <Box
      sx={{
        width: "100vw",
        height: `${PANEL_HEIGHT}px`,
        marginTop: "-60px",
        backgroundColor: "black",
        position: "relative",
        overflow: "hidden",
        perspective: "800px",
      }}
    >
      {/* Estrellas */}
      <StarLayer
        stars={starsBg}
        factor={parallax.bg}
        scrollY={scrollY}
        opacityFactor={starsOpacity}
        zIndex={1}
        baseOpacity={0.6}
      />
      <StarLayer
        stars={starsMid}
        factor={parallax.mid}
        scrollY={scrollY}
        opacityFactor={starsOpacity}
        zIndex={2}
        baseOpacity={0.85}
      />
      <StarLayer
        stars={starsFront}
        factor={parallax.front}
        scrollY={scrollY}
        opacityFactor={starsOpacity}
        zIndex={3}
        baseOpacity={1}
      />

      {/* Texto tipo Star Wars */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "70vw",
          transform: `translate(-50%, -50%) rotateX(30deg) translateY(-${crawlProgress * 1200}px) translateZ(${(1 - crawlProgress) * 600}px) scale(${1.5 - crawlProgress * 1.4})`,
          color: "yellow",
          textAlign: "justify",
          fontSize: isMobile ? "1rem" : "2rem", // tamaño adaptado para móvil
          lineHeight: 1.8,
          zIndex: 4,
          opacity: textOpacity,
          transition: "opacity 0.2s",
          transformStyle: "preserve-3d",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontFamily: '"Press Start 2P", monospace',
            fontSize: isMobile ? "1.5rem" : "3rem", // tamaño del título adaptado
          }}
        >
          My experiencia laboral
        </h1>
        <p>
          Esta sección está dedicada a mi experiencia laboral, donde he trabajado en proyectos que abarcan desde el desarrollo de
          aplicaciones web hasta la implementación de sistemas de seguridad y bases de datos.
        </p>
        <p>
          Surcaremos distintos aspectos de mi carrera, incluyendo mis habilidades en JavaScript, PHP, Python y MySQL, ademas
          de las experiencias que he adquirido a lo largo de los años trabajado para distintos clientes y empresas.
        </p>
        <p>
          Abrochence los cinturones y prepárense para un viaje a través de mi trayectoria profesional, donde exploraremos los desafíos que he enfrentado,
          las soluciones que he implementado y las lecciones que he aprendido en el camino.
        </p>
      </Box>

      {/* Logo scroll */}
      <img
        src={SCROLLDOWN}
        alt="Scroll Down"
        style={{
          position: "absolute",
          top: "80vh",
          left: "50%",
          transform: "translateX(-50%)",
          width: "150px",
          opacity: imageOpacity,
          transition: isFadingIn.current ? `opacity ${FADE_IN_DURATION}ms ease-in-out` : "none",
          zIndex: 5,
        }}
      />
    </Box>
  );
};

export default Stage3;