import React, { useEffect, useState, useMemo, useRef } from "react";
import { Box } from "@mui/material";
import SCROLLDOWN from "../assets/img/stage3_objects/scroll_down_logo.png";
import CACTUS from '../assets/img/stage3_objects/cactus.png';
import TREES_BACK from "../assets/img/stage3_objects/tree.png";
import TREES_BACK2 from "../assets/img/stage3_objects/tree2.png";
import CAR from '../assets/img/stage3_objects/car.png';

const generateStars = (count, maxHeight) =>
  Array.from({ length: count }, () => ({
    x: Math.random() * 100,          // en vw
    y: Math.random() * maxHeight,    // en px vertical
    size: 1 + Math.random() * 2,
    id: Math.random().toString(36).substr(2, 9),
  }));

function interpolateColor(color1, color2, factor) {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 0xff;
  const g1 = (c1 >> 8) & 0xff;
  const b1 = c1 & 0xff;

  const r2 = (c2 >> 16) & 0xff;
  const g2 = (c2 >> 8) & 0xff;
  const b2 = c2 & 0xff;

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `rgb(${r},${g},${b})`;
}

// Componente para dibujar las estrellas con parallax y opacidad
const StarLayer = ({ stars, factor, scrollY, baseOpacity, zIndex }) => {
  const PANEL_HEIGHT = 7000;

  // Desplaza toda la capa verticalmente para simular parallax
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: `${PANEL_HEIGHT}px`,    // TODO: altura total para que top star.y px funcione bien
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
            opacity: baseOpacity,
            transition: "opacity 0.3s ease",
          }}
        />
      ))}
    </Box>
  );
};

const Stage3 = () => {
  const PANEL_HEIGHT = 7000;
  const TOTAL_STARS = 400;
  const FADE_IN_DURATION = 3000;
  const FADE_START_DELAY = 100;

  const TEXT_START = 400;
  const TEXT_END = 3000;

  const SCROLLDOWN_DISAPPEAR_Y = 300;
  const STARS_FADE_IN_START = SCROLLDOWN_DISAPPEAR_Y; // 300px scrollY
  const STARS_FADE_IN_END = 400;
  const STARS_VISIBLE_START = 400;
  const STARS_VISIBLE_END = 3500;
  const STARS_FADE_OUT_END = 5500;
  const BG_COLOR_CHANGE_START = 3000;
  const BG_COLOR_CHANGE_END = 6000;

  const HORIZONTAL_START = 9500;
  const HORIZONTAL_END = 12000;
  const SKY_COLOR_TRANSITION_END = 16000;

  const TREES_START = 9000;
  const TREES_END = 25000;

  const VERTICAL_LIFT_OFFSET = 1000; // cuánto después del tronco empieza a subir
  const VERTICAL_LIFT_START = HORIZONTAL_END + VERTICAL_LIFT_OFFSET;
  const VERTICAL_LIFT_END = VERTICAL_LIFT_START + 2500;

  const [scrollY, setScrollY] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(0);
  const isFadingIn = useRef(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const starsBg = useMemo(() => generateStars(TOTAL_STARS * 0.6, PANEL_HEIGHT), []);
  const starsMid = useMemo(() => generateStars(TOTAL_STARS * 0.25, PANEL_HEIGHT), []);
  const starsFront = useMemo(() => generateStars(TOTAL_STARS * 0.15, PANEL_HEIGHT), []);

  const parallax = { bg: 0.2, mid: 0.5, front: 0.8 };

  const horizontalProgress = Math.min(
    Math.max((scrollY - HORIZONTAL_START) / (HORIZONTAL_END - HORIZONTAL_START), 0),
    1
  );

  // Calcula opacidad de estrellas según scroll para que aparezcan luego que SCROLLDOWN desaparece
  let starsOpacity;
  if (scrollY < STARS_FADE_IN_START) {
    starsOpacity = 0;
  } else if (scrollY >= STARS_FADE_IN_START && scrollY < STARS_FADE_IN_END) {
    starsOpacity = (scrollY - STARS_FADE_IN_START) / (STARS_FADE_IN_END - STARS_FADE_IN_START);
  } else if (scrollY >= STARS_VISIBLE_START && scrollY < STARS_VISIBLE_END) {
    starsOpacity = 1;
  } else if (scrollY >= STARS_VISIBLE_END && scrollY <= STARS_FADE_OUT_END) {
    starsOpacity = 1 - (scrollY - STARS_VISIBLE_END) / (STARS_FADE_OUT_END - STARS_VISIBLE_END);
  } else {
    starsOpacity = 0;
  }

  const crawlProgress = Math.max(0, Math.min((scrollY - TEXT_START) / (TEXT_END - TEXT_START), 1));
  const textOpacity =
    crawlProgress < 0.1
      ? crawlProgress * 10
      : crawlProgress > 0.9
      ? 1 - (crawlProgress - 0.9) * 10
      : 1;

  let bgColor = "#000000";

  if (scrollY < BG_COLOR_CHANGE_START) {
    bgColor = "#000000";
  } else if (scrollY >= BG_COLOR_CHANGE_START && scrollY <= BG_COLOR_CHANGE_END) {
    const factor = (scrollY - BG_COLOR_CHANGE_START) / (BG_COLOR_CHANGE_END - BG_COLOR_CHANGE_START);
    bgColor = interpolateColor("#000000", "#671416", factor);
  } else if (scrollY > BG_COLOR_CHANGE_END && scrollY <= SKY_COLOR_TRANSITION_END) {
    const factor = (scrollY - BG_COLOR_CHANGE_END) / (SKY_COLOR_TRANSITION_END - BG_COLOR_CHANGE_END);
    bgColor = interpolateColor("#671416", "#25afc2", factor);
  } else if (scrollY > SKY_COLOR_TRANSITION_END) {
    bgColor = "#25afc2";
  }

  const treeScrollProgress = Math.min(
    Math.max((scrollY - TREES_START) / (TREES_END - TREES_START), 0),
    horizontalProgress // los árboles no se moverán más que el tronco
  );

  const treeOffsetBack1 = treeScrollProgress * 290; // más lento
  const treeOffsetBack2 = treeScrollProgress * 400; // más lento
  const treeOffsetBack3 = treeScrollProgress * 550; // más lento

  const treeLayers = [
    { img: TREES_BACK, bottom: 180, left: "100vw", width: 490, height: 500, offset: treeOffsetBack2, z: 9 },
    { img: TREES_BACK2, bottom: 200, left: "calc(100vw + 400px)", width: 370, height: 380, offset: treeOffsetBack1, z: 8 },
    { img: TREES_BACK2, bottom: 200, left: "calc(100vw + 400px)", width: 300, height: 310, offset: treeOffsetBack3, z: 7 },
    { img: TREES_BACK, bottom: 150, left: "calc(100vw + 600px)", width: 470, height: 480, offset: treeOffsetBack1, z: 9 },
  ];

  const verticalLiftProgress = Math.min(
    Math.max((scrollY - VERTICAL_LIFT_START) / (VERTICAL_LIFT_END - VERTICAL_LIFT_START), 0),
    1
  );

  const liftY = verticalLiftProgress * 100; // en vh

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
    <>
      {/* Panel principal con estrellas y texto */}
      <Box
        sx={{
          width: "100vw",
          height: `${PANEL_HEIGHT}px`,
          marginTop: "-60px",
          backgroundColor: bgColor,
          position: "relative",
          overflow: "hidden",
          perspective: "800px",
          transition: "background-color 1s ease-out",
        }}
      >
        {/* Estrellas con parallax */}
        <StarLayer stars={starsBg} scrollY={scrollY} factor={parallax.bg} baseOpacity={0.6 * starsOpacity} zIndex={1} />
        <StarLayer stars={starsMid} scrollY={scrollY} factor={parallax.mid} baseOpacity={0.85 * starsOpacity} zIndex={2} />
        <StarLayer stars={starsFront} scrollY={scrollY} factor={parallax.front} baseOpacity={1 * starsOpacity} zIndex={3} />

        {/* Texto tipo Star Wars */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "70vw",
            transform: `translate(-50%, -50%) rotateX(30deg) translateY(-${crawlProgress * 1200}px) translateZ(${200 - crawlProgress * 600}px) scale(${2.8 - crawlProgress * 1.4})`,
            color: "yellow",
            textAlign: "justify",
            fontSize: isMobile ? "1rem" : "2rem",
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
              fontSize: isMobile ? "1.5rem" : "3rem",
            }}
          >
            Mi experiencia laboral
          </h1>
          <p>
            Esta sección está dedicada a mi experiencia laboral, donde he trabajado en proyectos que abarcan desde el desarrollo de
            aplicaciones web hasta la implementación de sistemas de seguridad y bases de datos.
          </p>
          <p>
            Surcaremos distintos aspectos de mi carrera, incluyendo mis habilidades en JavaScript, PHP, Python y MySQL, además
            de las experiencias que he adquirido a lo largo de los años trabajando para distintos clientes y empresas.
          </p>
          <p>
            Abróchense los cinturones y prepárense para un viaje a través de mi trayectoria profesional, donde exploraremos los desafíos que he enfrentado,
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

      {/* Horizonte oscuro */}
      <Box
        sx={{
          position: "fixed",
          top: "calc(100vh - 30vh)",
          left: 0,
          width: "100vw",
          height: "300vh",
          backgroundColor: "#280507",
          transform: scrollY >= 6000 ? `translateY(-${liftY}vh)` : "translateY(100%)",
          transition: "transform 1s ease-out",
          zIndex: 6,
        }}
      />

      {/* Sol dorado con texto interno */}
      <Box
        sx={{
          position: "fixed",
          bottom: "15vh",
          left: "50%",
          transform: `
            ${scrollY >= 6500 ? "translate(-50%, 0)" : "translate(-50%, 100vh)"}
            translateX(-${horizontalProgress * (isMobile ? 120 : 80)}vw)
          `,
          transition: "transform 2s ease-out",
          width: isMobile ? "300px" : "400px",
          height: isMobile ? "300px" : "400px",
          backgroundColor: "#D6982B",
          borderRadius: "50%",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          flexDirection: "column",
          overflow: "hidden",
          padding: "20px",
        }}
      >
        <Box
          sx={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: isMobile ? "10px" : "12px",
            opacity: Math.min(Math.max((scrollY - 8000) / 800, 0), 1),
            transition: "opacity 0.2s, transform 0.2s ease-out",
            color: "#280507",
          }}
        >
          Akkuarios
        </Box>
        <Box
          sx={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: isMobile ? "8px" : "10px",
            opacity: Math.min(Math.max((scrollY - 8500) / 800, 0), 1),
            transition: "opacity 0.2s, transform 0.2s ease-out",
            color: "#280507",
            marginTop: "10px",
            maxWidth: "90%",
          }}
        >
          Mis primeros proyectos fueron para la empresa independiente Akkuarios, donde desarrollé varios sistema de minado de datos web (Scrapping). 
          El software permitía a los usuarios extraer información de diversas fuentes en línea, facilitando la recopilación de datos para análisis 
          posteriores. Todo desarrollado en Python, con un enfoque en la eficiencia y la facilidad de uso.
        </Box>
      </Box>

      <img
        src={CACTUS}
        alt="Cactus"
        style={{
          position: "fixed",
          bottom: scrollY >= 7000 ? isMobile ? "-40vh": "-10vh" : "-500px", // aparece desde abajo
          left: "calc(20% - 260px)", // posición según dispositivo
          width: "500px",
          height: "auto",
          transition: "bottom 1s ease-out, opacity 1s ease-out",
          zIndex: 7,
          pointerEvents: "none",
          transform: `translateX(-${horizontalProgress * 200}vw)`,
        }}
      />

      {/* Extensión scroll para seguir bajando */}
      <Box
        sx={{
          width: "100vw",
          height: "8000px",
          backgroundColor: bgColor,
          position: "relative",
          zIndex: 0,
        }}
      />

      {/* Árboles - capa trasera */}
      {treeLayers.map((tree, i) => {
        const scale = isMobile ? 0.5 : 1;
        return (
          <Box
            key={i}
            sx={{
              position: "fixed",
              bottom: tree.bottom * scale,
              left: tree.left,
              width: `${tree.width * scale}px`,
              height: `${tree.height * scale}px`,
              backgroundImage: `url(${tree.img})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "cover",
              transform: `
                translateX(-${tree.offset}vw)
                translateY(-${liftY}vh)
              `,
              transition: "transform 0.2s linear",
              zIndex: tree.z,
              pointerEvents: "none",
            }}
          />
        );
      })}

      { !isMobile && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: "135vw",
            width: "400px",
            height: "200vh",
            backgroundColor: "#855f1b",
            transform: `
              translateX(-${horizontalProgress * 100}vw)
              translateY(-${liftY}vh)
            `,
            transition: "transform 2s ease-out",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              marginTop: "-600px",
              width: "180px",
              height: "180px",
              backgroundColor: "#d6a345",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "10px",
              padding: "10px",
              marginBottom: "30px",
            }}
          >
            Universidad UTEM
          </Box>
          <Box
            sx={{
              color: "#fff",
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "10px",
              textAlign: "justify",
              maxWidth: "90%",
              lineHeight: 1.6,
            }}
          >
            Ayudé con la actualización de la plataforma intranet principal de la universidad la cual estaba desarrollada en Django con base de datos PostgreSQL, además de ayudar con las mantenciones de la página y apoyo en soporte técnico reparando errores reportados por el profesorado y alumnado.
          </Box>
        </Box>
      )}

      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#855f1b",
          opacity: verticalLiftProgress,
          transition: "opacity 0.3s ease",
          zIndex: 20,
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          width: "100vw",
          height: "10000px",
          backgroundColor: bgColor,
          position: "relative",
          zIndex: 0,
        }}
      />
    </>
  );
};

export default Stage3;