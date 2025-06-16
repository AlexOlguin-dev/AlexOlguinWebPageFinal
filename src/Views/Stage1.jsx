import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import '../assets/css/effects.css';
//IMAGENES
import BG1 from '../assets/img/map/background1.png';
import BG2 from '../assets/img/map/background2.png';
import BG3 from '../assets/img/map/background3.png';
import BG4 from '../assets/img/map/background4.png';
import FLOOR from '../assets/img/map/floor.png';
import PIPEOUT from '../assets/img/map/pipe.png';
import coinSprite from '../assets/img/map/decorations/coins.png';
import heartSprite from '../assets/img/map/decorations/heart.png';
import CONTROLL from '../assets/img/controlL.png';
import CONTROLR from '../assets/img/controlR.png';
import CONTROLUP from '../assets/img/controlUp.png';
import CONTROLDOWN from '../assets/img/controlDown.png';
import ROCK1 from '../assets/img/map/decorations/rocks/6.png';
import ROCK2 from '../assets/img/map/decorations/rocks/5.png';
import ROCK3 from '../assets/img/map/decorations/rocks/4.png';
import FUENTE from '../assets/img/map/decorations/1.png';
import FUENTEWATER from '../assets/img/map/decorations/2.png';
import BUSH1 from '../assets/img/map/decorations/bushes/17.png';
import BUSH2 from '../assets/img/map/decorations/bushes/19.png';
import BUSH3 from '../assets/img/map/decorations/bushes/20.png';
import BUSH4 from '../assets/img/map/decorations/bushes/16.png';
import TREE1 from '../assets/img/map/decorations/trees/Tree4.png';
import TREE2 from '../assets/img/map/decorations/trees/Tree2.png';
import TREE3 from '../assets/img/map/decorations/trees/Tree1.png';
import TREE4 from '../assets/img/map/decorations/trees/Tree3.png';
import BENCH1 from '../assets/img/map/decorations/6.png';
import BENCH2 from '../assets/img/map/decorations/7.png';
import WOODBOX from '../assets/img/map/decorations/Box.png';
//BOXES
import BOX from '../assets/img/map/decorations/InfoBox.png';
import BOXOFF from '../assets/img/map/decorations/InfoBox_off.png';
//PLATAFORMAS
import platform_una from '../assets/img/map/plataforma_una.png';
import platform_doble from '../assets/img/map/plataforma_doble.png';
import platform_triple from '../assets/img/map/plataforma_triple.png';
import platform_cuadruple from '../assets/img/map/plataforma_cuadruple.png';
//OBSTACULOS
import obst1 from '../assets/img/map/obst1.png';
import obst2 from '../assets/img/map/obst2.png';
import obst3 from '../assets/img/map/obst3.png';
import obst4 from '../assets/img/map/obst4.png';
import obst5 from '../assets/img/map/obst5.png';
//PLAYER
import idle from '../assets/img/player/idle.png';
import right from '../assets/img/player/right.png';
import left from '../assets/img/player/left.png';
import jump from '../assets/img/player/jump.png';
import jumpleft from '../assets/img/player/jumleft.png';
import jumpright from '../assets/img/player/jumright.png';
import dead from '../assets/img/player/dead.png';
//ENEMIES
import scorpionL from '../assets/img/enemies/scorpion/scorpionL.gif';
import scorpionR from '../assets/img/enemies/scorpion/scorpionR.gif';
import scorpionDeadL from '../assets/img/enemies/scorpion/scorpionDeadL.png';
import scorpionDeadR from '../assets/img/enemies/scorpion/scorpionDeadR.png';

const gravity = 1;
const moveSpeed = 6;
const jumpStrength = 16;
const extraJumpStrength = 4; // salto más pequeño al caer sobre enemigo
const groundHeight = 0.3 * window.innerHeight;
const playerWidth = 30;
const playerHeight = 50;
const groundWidth = 5000;

const useTypewriter = (text, speed = 50, delay = 800) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    if (!text) return;

    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText((prev) => prev + text.charAt(index));  // charAt nunca devuelve undefined
          index++;
        } else {
          clearInterval(interval);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [text, speed, delay]);

  return displayedText;
};


function Stage1() {
  const [isMobile, setIsMobile] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const posX = useRef(50);
  const posY = useRef(window.innerHeight - groundHeight - playerHeight);
  const velocityX = useRef(0);
  const velocityY = useRef(0);
  const isJumping = useRef(false);
  const keysPressed = useRef({ left: false, right: false });
  const [, setTick] = useState(0);
  const cameraOffsetX = useRef(0);
  const [playerColor, setPlayerColor] = useState(idle);
  const jumpDirection = useRef("none");
  const [playerCanMove, setPlayerCanMove] = useState(true);
  const [playerOpacity, setPlayerOpacity] = useState(1);
  const [activate_intro,set_activate_into] = useState(false);
  const [activate2,set_activate2] = useState(false);
  const [isGoingDownPipe, setIsGoingDownPipe] = useState(false);
  const [coinCount, setCoinCount] = useState(0);
  const [showLifeScreen, setShowLifeScreen] = useState(false);
  const [showedLife, setShowedLife] = useState(false);
  const [lifeCount,setLifeCount] = useState(99);
  const [lifeScreenOpacity, setLifeScreenOpacity] = useState(0);
  const fullText = ` ¡Hola! Bienvenidos... Soy Alex Olguín, un desarrollador FullStack con sólida trayectoria, capaz de crear desde sitios livianos hasta plataformas complejas.\nCubriendo todo el ciclo de vida: análisis, arquitectura, desarrollo FullStack y despliegue.`;
  const typedText = useTypewriter(activate_intro ? fullText : "", 50, 1200);
  const fullText2 = ` Este breve portafolio es una muestra de mi habilidad para transformar ideas en soluciones digitales de calidad.\nMe adapto rápido, aprendo nuevas tecnologías con entusiasmo y colaboro eficazmente para impulsar los objetivos del negocio.`;
  const typedText2 = useTypewriter(activate2 ? fullText2 : "", 45, 1200);


  // Plataformas verdes fijas
  const platforms = [
    { x: 700, y: window.innerHeight - groundHeight - 200, width: 80, height: 40, img: platform_doble },
    { x: 960, y: window.innerHeight - groundHeight - 300, width: 160, height: 40, img: platform_cuadruple },
    { x: 1780, y: window.innerHeight - groundHeight - 100, width: 120, height: 40, img: platform_triple },
    { x: 1900, y: window.innerHeight - groundHeight - 230, width: 80, height: 40, img: platform_doble },
    { x: 1700, y: window.innerHeight - groundHeight - 330, width: 40, height: 40, img: platform_una },
    { x: 3100, y: window.innerHeight - groundHeight - 200, width: 160, height: 40, img: platform_cuadruple }
  ];

  // Obstáculos verdes fijos (no se mueven)
  const obstacles = [
    { x: 800, y: window.innerHeight - groundHeight - 80, width: 482, height: 80, img: obst1, zIndex: 5 },
    { x: 1282, y: window.innerHeight - groundHeight - 240, width: 200, height: 240, img: obst2, zIndex: 5 },
    { x: 2200, y: window.innerHeight - groundHeight - 120, width: 120, height: 120, img: obst3, zIndex: 5 },
    { x: 2900, y: window.innerHeight - groundHeight - 80, width: 120, height: 80, img: obst4, zIndex: 5 },
    { x: 3400, y: window.innerHeight - groundHeight - 200, width: 80, height: 220, img: PIPEOUT, zIndex: 8 },
    { x: 3480, y: window.innerHeight - groundHeight - 720, width: 900, height: 720, img: obst5, zIndex: 5 },
  ];

  // Enemigos amarillos, con estado para color y desaparición
  const enemies = useRef([
    {
      x: 800,
      y: window.innerHeight - groundHeight - playerHeight - 65,
      width: 50,
      height: 37,
      speed: 1,
      minX: 800,
      maxX: 1050,
      direction: 1,
      isHit: false, // para saber si está "rojo"
      hitTimeout: null,
    },
    {
      x: 1800,
      y: window.innerHeight - groundHeight - playerHeight - 85,
      width: 50,
      height: 37,
      speed: 1,
      minX: 1800,
      maxX: 1850,
      direction: 1,
      isHit: false, // para saber si está "rojo"
      hitTimeout: null,
    },
    {
      x: 2400,
      y: window.innerHeight - groundHeight - playerHeight + 15,
      width: 50,
      height: 37,
      speed: 1,
      minX: 2400,
      maxX: 2600,
      direction: -1,
      isHit: false, // para saber si está "rojo"
      hitTimeout: null,
    },
    {
      x: 2600,
      y: window.innerHeight - groundHeight - playerHeight + 15,
      width: 50,
      height: 37,
      speed: 1.2,
      minX: 2600,
      maxX: 2800,
      direction: 1,
      isHit: false, // para saber si está "rojo"
      hitTimeout: null,
    }
  ]);

  const boxes = useRef([
    {
      x: 300,
      y: window.innerHeight - groundHeight - 200,
      width: 40,
      height: 40,
      isHit: false,
      jumpOffset: 0,
      onHit: () => {
        set_activate_into(true)
      },
      imgON: BOX,
      imgOFF: BOXOFF
    },
    {
      x: 2250,
      y: window.innerHeight - groundHeight - 300,
      width: 40,
      height: 40,
      isHit: false,
      jumpOffset: 0,
      onHit: () => {
        set_activate2(true)
      },
      imgON: BOX,
      imgOFF: BOXOFF
    },
  ]);

  const [coins, setCoins] = useState([
    { x: 480, y: window.innerHeight - groundHeight - 40, width: 20, height: 24 },
    { x: 520, y: window.innerHeight - groundHeight - 40, width: 20, height: 24 },
    { x: 560, y: window.innerHeight - groundHeight - 40, width: 20, height: 24 },
    { x: 600, y: window.innerHeight - groundHeight - 40, width: 20, height: 24 },
    { x: 640, y: window.innerHeight - groundHeight - 40, width: 20, height: 24 },
    { x: 980, y: window.innerHeight - groundHeight - 340, width: 20, height: 24 },
    { x: 1020, y: window.innerHeight - groundHeight - 340, width: 20, height: 24 },
    { x: 1060, y: window.innerHeight - groundHeight - 340, width: 20, height: 24 },
    { x: 1100, y: window.innerHeight - groundHeight - 340, width: 20, height: 24 },
    { x: 1600, y: window.innerHeight - groundHeight - 400, width: 20, height: 24 },
    { x: 1640, y: window.innerHeight - groundHeight - 360, width: 20, height: 24 },
    { x: 1640, y: window.innerHeight - groundHeight - 40, width: 20, height: 24 },
    { x: 1680, y: window.innerHeight - groundHeight - 40, width: 20, height: 24 },
    { x: 1720, y: window.innerHeight - groundHeight - 40, width: 20, height: 24 },
    { x: 1760, y: window.innerHeight - groundHeight - 40, width: 20, height: 24 },
    { x: 3100, y: window.innerHeight - groundHeight - 40, width: 20, height: 24 },
    { x: 3140, y: window.innerHeight - groundHeight - 40, width: 20, height: 24 },
    { x: 3180, y: window.innerHeight - groundHeight - 40, width: 20, height: 24 },
    { x: 3220, y: window.innerHeight - groundHeight - 40, width: 20, height: 24 },
    { x: 3260, y: window.innerHeight - groundHeight - 40, width: 20, height: 24 },
  ]);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768); // define móvil según ancho pantalla
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto'; // Restaurar al salir del componente
    };
  }, []);

  useEffect(() => {
    setFadeIn(true);
    const handleKeyDown = (e) => {
      if (e.code === "ArrowLeft") keysPressed.current.left = true;
      if (e.code === "ArrowRight") keysPressed.current.right = true;
      if (e.key === "ArrowDown") keysPressed.current.down = true;
      if (e.code === "Space") {
        if (!isJumping.current) {
          velocityY.current = -jumpStrength;
          isJumping.current = true;

          if (keysPressed.current.right) {
            jumpDirection.current = "right";
          } else if (keysPressed.current.left) {
            jumpDirection.current = "left";
          } else {
            jumpDirection.current = "none";
          }
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "ArrowLeft") keysPressed.current.left = false;
      if (e.code === "ArrowRight") keysPressed.current.right = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const update = () => {
      if (!playerCanMove) {
        setTick((t) => t + 1);
        return;
      }

      // Movimiento horizontal jugador
      if (keysPressed.current.left) velocityX.current = -moveSpeed;
      else if (keysPressed.current.right) velocityX.current = moveSpeed;
      else velocityX.current = 0;

      let nextPosX = posX.current + velocityX.current;

      const playerLeft = nextPosX;
      const playerRight = nextPosX + playerWidth;
      const playerTop = posY.current;
      const playerBottom = posY.current + playerHeight;

      // Colisión horizontal con obstáculos verdes
      let horizontalCollision = false;
      for (let obs of obstacles) {
        const obsLeft = obs.x;
        const obsRight = obs.x + obs.width;
        const obsTop = obs.y;
        const obsBottom = obs.y + obs.height;

        const collidesHorizontally =
          playerBottom > obsTop &&
          playerTop < obsBottom &&
          ((playerRight > obsLeft && playerRight <= obsRight && velocityX.current > 0) ||
            (playerLeft < obsRight && playerLeft >= obsLeft && velocityX.current < 0));

        if (collidesHorizontally) {
          horizontalCollision = true;
          if (keysPressed.current.right) {
            nextPosX = obsLeft - playerWidth;
          } else if (keysPressed.current.left) {
            nextPosX = obsRight;
          }
          velocityX.current = 0;
          break;
        }
      }

      if (nextPosX < 0) nextPosX = 0;
      if (nextPosX > groundWidth - playerWidth) nextPosX = groundWidth - playerWidth;

      posX.current = nextPosX;

      // Movimiento vertical jugador
      posY.current += velocityY.current;
      velocityY.current += gravity;

      const groundY = window.innerHeight - groundHeight;
      let landed = false;

      for (let platform of platforms) {
        const landing =
          posY.current + playerHeight <= platform.y &&
          posY.current + playerHeight + velocityY.current >= platform.y &&
          posX.current + playerWidth > platform.x &&
          posX.current < platform.x + platform.width &&
          velocityY.current >= 0;

        if (landing) {
          posY.current = platform.y - playerHeight;
          velocityY.current = 0;
          isJumping.current = false;
          jumpDirection.current = "none";
          landed = true;
          break;
        }
      }

      if (!landed) {
        for (let obs of obstacles) {
          const landingObs =
            posY.current + playerHeight <= obs.y &&
            posY.current + playerHeight + velocityY.current >= obs.y &&
            posX.current + playerWidth > obs.x &&
            posX.current < obs.x + obs.width &&
            velocityY.current >= 0;

          if (landingObs) {
            posY.current = obs.y - playerHeight;
            velocityY.current = 0;
            isJumping.current = false;
            jumpDirection.current = "none";
            landed = true;
            break;
          }
        }

        // Detección especial: jugador sobre PIPEOUT
        const pipe = obstacles.find(obs => obs.img === PIPEOUT);

        const isOnPipe =
          pipe &&
          posY.current + playerHeight === pipe.y &&
          posX.current + playerWidth > pipe.x &&
          posX.current < pipe.x + pipe.width;

        if (isOnPipe && keysPressed.current.down && !isGoingDownPipe) {
          setIsGoingDownPipe(true);
          setPlayerCanMove(false);

          const startY = posY.current;
          const endY = startY + playerHeight + 10;
          const duration = 600; // ms
          const startTime = performance.now();

          const animateDown = (time) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            posY.current = startY + (endY - startY) * progress;
            setTick(t => t + 1);

            if (progress < 1) {
              requestAnimationFrame(animateDown);
            } else {
              window.location.href = "/stage2";
            }
          };

          requestAnimationFrame(animateDown);
        }
      }

      if (!landed && posY.current + playerHeight >= groundY) {
        posY.current = groundY - playerHeight;
        velocityY.current = 0;
        isJumping.current = false;
        jumpDirection.current = "none";
        landed = true;
      }

      // Colisiones con enemigos amarillos
      enemies.current.forEach((enemy) => {
        const enemyLeft = enemy.x;
        const enemyRight = enemy.x + enemy.width;
        const enemyTop = enemy.y;
        const enemyBottom = enemy.y + enemy.height;

        const collidesFromAbove =
          playerBottom <= enemyTop &&
          playerBottom + velocityY.current >= enemyTop &&
          playerRight > enemyLeft &&
          playerLeft < enemyRight &&
          velocityY.current >= 0;

        if (collidesFromAbove && !enemy.isHit) {
          velocityY.current = -extraJumpStrength;
          isJumping.current = true;
          enemy.isHit = true;

          if (enemy.hitTimeout) clearTimeout(enemy.hitTimeout);

          enemy.hitTimeout = setTimeout(() => {
            enemies.current = enemies.current.filter((e) => e !== enemy);
            setTick((t) => t + 1);
          }, 500);

          setTick((t) => t + 1);
        }

        const verticalOverlap = playerBottom > enemyTop && playerTop < enemyBottom;
        const touchingLeftSide =
          playerRight >= enemyLeft && playerLeft < enemyLeft && verticalOverlap;
        const touchingRightSide =
          playerLeft <= enemyRight && playerRight > enemyRight && verticalOverlap;

        if ((touchingLeftSide || touchingRightSide) && !enemy.isHit && !showedLife) {
          setPlayerCanMove(false);
          setPlayerColor(dead);
          setPlayerOpacity(1);
          setLifeCount(prev => Math.max(prev - 1, 0)); // Resta 1 vida
          setShowedLife(true); // Evita múltiples activaciones

          // Desaparece el jugador primero
          setTimeout(() => {
            setPlayerOpacity(0);
          }, 100);

          // Mostrar overlay con fade-in
          setTimeout(() => {
            setShowLifeScreen(true);
            setTimeout(() => {
              setLifeScreenOpacity(1); // Fade-in
            }, 10);
          }, 300);

          // Ocultar con fade-out
          setTimeout(() => {
            setLifeScreenOpacity(0); // Fade-out
            setTimeout(() => {
              setShowLifeScreen(false);
              posX.current = 50;
              posY.current = window.innerHeight - groundHeight - playerHeight;
              velocityX.current = 0;
              velocityY.current = 0;
              isJumping.current = false;
              jumpDirection.current = "none";
              setPlayerOpacity(1);
              setPlayerCanMove(true);
              setShowedLife(false);
            }, 400); // Espera a que termine el fade-out
          }, 3000);
        }

        // Movimiento y rotación del sprite enemigo
        if (!enemy.isHit) {
          enemy.x += enemy.speed * enemy.direction * 0.4;

          if (enemy.x < enemy.minX) {
            enemy.x = enemy.minX;
            enemy.direction *= -1;
            enemy.flipX = enemy.direction < 0; // sprite mirando izquierda
          }
          if (enemy.x > enemy.maxX) {
            enemy.x = enemy.maxX;
            enemy.direction *= -1;
            enemy.flipX = enemy.direction < 0; // sprite mirando izquierda
          }
        }
      });

      // Colisión desde abajo con cajas
      boxes.current.forEach((box) => {
        const boxLeft = box.x;
        const boxRight = box.x + box.width;
        const boxTop = box.y;
        const boxBottom = box.y + box.height;

        const hitsFromBelow =
          posY.current >= boxBottom &&
          posY.current + velocityY.current <= boxBottom &&
          posX.current + playerWidth > boxLeft &&
          posX.current < boxRight &&
          velocityY.current < 0;

        if (hitsFromBelow && !box.isHit) {
          box.isHit = true;
          box.jumpOffset = -10;

          velocityY.current = 0;
          isJumping.current = false;

          if (typeof box.onHit === "function") {
            box.onHit(); // Ejecuta la función personalizada
          }

          setTimeout(() => {
            box.jumpOffset = 0;
            setTick((t) => t + 1);
          }, 150);
        }
      });

      // Cambio de color del jugador según movimiento
      if (isJumping.current) {
        if (jumpDirection.current === "right") setPlayerColor(jumpright);
        else if (jumpDirection.current === "left") setPlayerColor(jumpleft);
        else setPlayerColor(jump);
      } else {
        if (velocityX.current > 0) {
          setPlayerColor(right);
          jumpDirection.current = "right";
        } else if (velocityX.current < 0) {
          setPlayerColor(left);
          jumpDirection.current = "left";
        } else {
          setPlayerColor(idle);
          jumpDirection.current = "none";
        }
      }

      // Movimiento de enemigos
      enemies.current.forEach((enemy) => {
        if (!enemy.isHit) {
          enemy.x += enemy.speed * enemy.direction * 0.4;
          if (enemy.x < enemy.minX) {
            enemy.x = enemy.minX;
            enemy.direction *= -1;
          }
          if (enemy.x > enemy.maxX) {
            enemy.x = enemy.maxX;
            enemy.direction *= -1;
          }
        }
      });

      // Seguimiento de cámara (corregido)
      const halfScreen = window.innerWidth / 2;
      cameraOffsetX.current = Math.min(
        0,
        halfScreen - posX.current - playerWidth / 2
      );

      setCoins((prevCoins) =>
        prevCoins.filter((coin) => {
          const coinLeft = coin.x;
          const coinRight = coin.x + coin.width;
          const coinTop = coin.y;
          const coinBottom = coin.y + coin.height;

          const isTouching =
            posX.current + playerWidth > coinLeft &&
            posX.current < coinRight &&
            posY.current + playerHeight > coinTop &&
            posY.current < coinBottom;

          if (isTouching) {
            setCoinCount((prev) => prev + 1);
            return false; // Elimina la moneda
          }
          return true; // Mantenerla
        })
      );

      setTick((t) => t + 1);
    };

    const id = setInterval(update, 16);
    return () => clearInterval(id);
  }, [playerCanMove]);

  return (
    <Box sx={{ height: "100vh", backgroundColor: "#38002C", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", overflow: 'hidden', marginTop: "-60px" }}>
      {/* Contenedor del contenido para fade in */}
      <Box sx={{ opacity: fadeIn ? 1 : 0, transition: "opacity 0.8s ease-in-out", width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: "#fff" }}>
        <Box sx={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", overflow: "hidden" }}>
          {/* BG1 - fondo más lejano (se mueve menos) */}
          <div
            style={{
              position: "absolute",
              top: isMobile ? 0 : "-30%",
              left: 0,
              width: "100vw",
              height: isMobile ? "100vh" : "100%",
              backgroundImage: `url(${BG1})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: isMobile ? "cover" : "cover",
              backgroundPositionX: `${cameraOffsetX.current * 0.2}px`,
              backgroundPositionY: "top",
              zIndex: 0,
            }}
          />

          {/* BG2 - fondo más cercano (se mueve más) */}
          <div
            style={{
              position: "absolute",
              top: isMobile ? -200 : "-30%",
              left: 0,
              width: "100vw",
              height: isMobile ? "100vh" : "100%",
              backgroundImage: `url(${BG2})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: isMobile ? "cover" : "contain",
              backgroundPositionX: `${cameraOffsetX.current * 0.4}px`,
              backgroundPositionY: "top",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* BG3 - fondo más cercano (se mueve más) */}
          <div
            style={{
              position: "absolute",
              top: isMobile ? -200 : "-30%",
              left: 0,
              width: "100vw",
              height: isMobile ? "100vh" : "100%",
              backgroundImage: `url(${BG3})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: isMobile ? "cover" : "contain",
              backgroundPositionX: `${cameraOffsetX.current * 0.6}px`, // movimiento intermedio
              backgroundPositionY: "top",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />

          {/* BG4 - fondo más cercano (se mueve más) */}
          <div
            style={{
              position: "absolute",
              top: isMobile ? -200 : "-30%",
              left: 0,
              width: "100vw",
              height: isMobile ? "100vh" : "100%",
              backgroundImage: `url(${BG4})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: isMobile ? "cover" : "contain",
              backgroundPositionX: `${cameraOffsetX.current * 0.8}px`, // movimiento intermedio
              backgroundPositionY: "top",
              zIndex: 3,
              pointerEvents: "none",
            }}
          />

          {/* Plataformas verdes */}
          {platforms.map((plat, i) => (
            <div
              key={"plat" + i}
              style={{
                position: "fixed",
                left: plat.x,
                top: plat.y,
                width: plat.width,
                height: plat.height,
                backgroundImage: `url(${plat.img})`,
                backgroundSize: "cover", // o "contain" si prefieres que la imagen no se recorte
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                transform: `translateX(${cameraOffsetX.current}px)`,
                zIndex: 4,
              }}
            />
          ))}

          {/* Obstáculos con imagen */}
          {obstacles.map((obs, i) => (
            <div
              key={"obs" + i}
              style={{
                position: "fixed",
                left: obs.x,
                top: obs.y,
                width: obs.width,
                height: obs.height,
                backgroundImage: `url(${obs.img})`,
                backgroundSize: "cover", // o "contain" si lo prefieres
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                transform: `translateX(${cameraOffsetX.current}px)`,
                zIndex: obs.zIndex,
              }}
            />
          ))}

          {/* Enemigos amarillos */}
          {enemies.current.map((enemy, i) => (
            <div
              key={"enemy" + i}
              style={{
                position: "fixed",
                //backgroundColor: enemy.isHit ? "red" : "yellow",
                left: enemy.x,
                top: enemy.y,
                width: enemy.width,
                height: enemy.height,
                backgroundImage: `url(${enemy.direction === 1 ? enemy.isHit ? scorpionDeadR : scorpionL : enemy.isHit ? scorpionDeadL : scorpionR})`,
                backgroundSize: "cover", // o "contain" si lo prefieres
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                transform: `translateX(${cameraOffsetX.current}px)`,
                zIndex: 4,
              }}
            />
          ))}

          {/* Cajas interactuables */}
          {boxes.current.map((box, i) => (
            <div
              key={"box" + i}
              style={{
                position: "fixed",
                backgroundImage: `url(${box.isHit ? box.imgOFF : box.imgON})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                left: box.x,
                top: box.y + box.jumpOffset,
                width: box.width,
                height: box.height,
                transform: `translateX(${cameraOffsetX.current}px)`,
                transition: "top 0.15s, background-image 0.3s",
                zIndex: 3,
              }}
            />
          ))}

          {/**Monedas */}
          {coins.map((coin, i) => (
            <div
              key={`coin-${i}`}
              style={{
                position: "fixed",
                left: coin.x,
                top: coin.y,
                width: coin.width,
                height: coin.height,
                backgroundImage: `url(${coinSprite})`, // Asegúrate de tener esta imagen importada
                backgroundSize: "cover",
                transform: `translateX(${cameraOffsetX.current}px)`,
                zIndex: 6
              }}
            />
          ))}

          {/* Suelo azul */}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              width: groundWidth,
              height: groundHeight,
              backgroundImage: `url(${FLOOR})`,
              backgroundRepeat: "repeat-x", // para repetir la imagen horizontalmente
              backgroundSize: "contain",
              transform: `translateX(${cameraOffsetX.current}px)`,
              zIndex: 10,
            }}
          />

          {/* Jugador rojo */}
          <div
            style={{
              position: "fixed",
              width: playerWidth,
              height: playerHeight,
              left: posX.current + cameraOffsetX.current,
              top: posY.current,
              transform: `translateX(${cameraOffsetX.current}px)`,
              transition: "background-color 0.1s, opacity 1s",
              opacity: playerOpacity,
              backgroundImage: `url(${playerColor})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              animation: "float 2s ease-in-out infinite",
              zIndex: 4,
            }}
          />
          
          {/**Caja presentacion */}
          {activate_intro && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: 80,
                left: 360,
                height: "160px",
                backgroundColor: "#38002C",
                border: "4px solid #F4C975",
                borderRadius: "5px",
                zIndex: 3,
                transform: `translateX(${cameraOffsetX.current}px)`,
                padding: "10px",
                overflow: "hidden",
              }}
            >
              <Typography
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 10,
                  textAlign: "left",
                  color: "white",
                  whiteSpace: "pre-line",
                  lineHeight: "1.6",
                }}
              >
                {typedText}
              </Typography>
            </motion.div>
          )}

          {/**Caja JV 1 */}
          {activate2 && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: 80,
                left: 2400,
                height: "110px",
                backgroundColor: "#38002C",
                border: "4px solid #F4C975",
                borderRadius: "5px",
                zIndex: 3,
                transform: `translateX(${cameraOffsetX.current}px)`,
                padding: "10px",
                overflow: "hidden",
              }}
            >
              <Typography
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 10,
                  textAlign: "left",
                  color: "white",
                  whiteSpace: "pre-line",
                  lineHeight: "1.6",
                }}
              >
                {typedText2}
              </Typography>
            </motion.div>
          )}

          {/**LIFE SCREEN */}
          {showLifeScreen && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "#38002C",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
                color: "white",
                fontSize: "36px",
                fontWeight: "bold",
                opacity: lifeScreenOpacity,
                transition: "opacity 0.5s ease-in-out",
                pointerEvents: "none", // evita bloqueos del juego
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: playerWidth,
                    height: playerHeight,
                    backgroundImage: `url(${playerColor})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                />
                <span style={{ fontSize: "30px", fontFamily: '"Press Start 2P", monospace', }}>X {lifeCount}</span>
              </div>
            </div>
          )}

          {/**contador VIDAS */}
          <div style={{
            position: "absolute",
            top: 60,
            right: 40,
            fontSize: "24px",
            color: "gold",
            fontWeight: "bold",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "8px", // Espacio entre la imagen y el texto
          }}>
            <img src={heartSprite} alt="coin" style={{ width: "30px", height: "30px" }} />
            <Typography style={{ fontWeight: "bold", fontFamily: '"Press Start 2P", monospace' }}>X{lifeCount}</Typography>
          </div>

          {/**contador monedas */}
          <div style={{
            position: "absolute",
            top: 100,
            right: 40,
            fontSize: "24px",
            color: "gold",
            fontWeight: "bold",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "8px", // Espacio entre la imagen y el texto
          }}>
            <img src={coinSprite} alt="coin" style={{ width: "24px", height: "24px" }} />
            <Typography style={{ fontWeight: "bold", fontFamily: '"Press Start 2P", monospace' }}>X{coinCount}</Typography>
          </div>

          {/* CONTROLES TÁCTILES */}
          { isMobile && 
            <Box
              sx={{
                position: "fixed",
                bottom: 20,
                left: 0,
                width: "100vw",
                display: "flex",
                justifyContent: "space-between",
                zIndex: 999,
              }}
            >
              {/* Zona izquierda: mover */}
              <Box sx={{ display: "flex", gap: 2, padding: "10px" }}>
                <div
                  onTouchStart={() => (keysPressed.current.left = true)}
                  onTouchEnd={() => (keysPressed.current.left = false)}
                  style={{
                    width: 60,
                    height: 60,
                    backgroundImage: `url(${CONTROLL})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    touchAction: "none",
                    userSelect: "none",
                  }}
                />
                <div
                  onTouchStart={() => (keysPressed.current.right = true)}
                  onTouchEnd={() => (keysPressed.current.right = false)}
                  style={{
                    width: 60,
                    height: 60,
                    backgroundImage: `url(${CONTROLR})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    touchAction: "none",
                    userSelect: "none",
                  }}
                />
              </Box>

              {/* Zona derecha: saltar y agacharse */}
              <Box sx={{ display: "flex", gap: 2, padding: "10px" }}>
                <div
                  onTouchStart={() => {
                    if (!isJumping.current) {
                      velocityY.current = -jumpStrength;
                      isJumping.current = true;
                    }
                  }}
                  style={{
                    width: 60,
                    height: 60,
                    backgroundImage: `url(${CONTROLUP})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    touchAction: "none",
                    userSelect: "none",
                  }}
                />
                <div
                  onTouchStart={() => (keysPressed.current.down = true)}
                  onTouchEnd={() => (keysPressed.current.down = false)}
                  style={{
                    width: 60,
                    height: 60,
                    backgroundImage: `url(${CONTROLDOWN})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    touchAction: "none",
                    userSelect: "none",
                  }}
                />
              </Box>
            </Box>
          }

          {/**DECORACIONES */}
          <img 
            src={BUSH1} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 24, 
              left: 100, 
              zIndex: 5,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={TREE1} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 190, 
              left: 100, 
              zIndex: 3,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={BUSH2} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 21, 
              left: 300, 
              zIndex: 6,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={BENCH1} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 22, 
              left: 350, 
              zIndex: 3,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={TREE2} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 128, 
              left: 500, 
              zIndex: 3,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={BUSH3} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 18, 
              left: 600, 
              zIndex: 6,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={ROCK2} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 21, 
              left: 700, 
              zIndex: 3,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={TREE3} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 182, 
              left: 1100, 
              zIndex: 6,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={BENCH2} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 102, 
              left: 1070, 
              zIndex: 3,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={WOODBOX} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 224, 
              left: 700, 
              zIndex: 3,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={BUSH4} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 309, 
              left: 1070, 
              zIndex: 6,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={FUENTEWATER} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 311, 
              left: 1370, 
              zIndex: 6,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={BUSH1} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 24, 
              left: 1470, 
              zIndex: 5,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={TREE4} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 190, 
              left: 1500, 
              zIndex: 3,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={ROCK1} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 43, 
              left: 2000, 
              zIndex: 5,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={BENCH1} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 122, 
              left: 1800, 
              zIndex: 3,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={BUSH4} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 338, 
              left: 1702, 
              zIndex: 5,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={WOODBOX} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 254, 
              left: 1902, 
              zIndex: 3,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={TREE2} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 128, 
              left: 1902, 
              zIndex: 3,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={BUSH2} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 21, 
              left: 1900, 
              zIndex: 46,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={TREE1} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 190, 
              left: 2400, 
              zIndex: 3,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={TREE3} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 102, 
              left: 2700, 
              zIndex: 6,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={WOODBOX} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 144, 
              left: 2260, 
              zIndex: 6,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={ROCK2} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 20, 
              left: 2750, 
              zIndex: 3,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={BUSH1} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 24, 
              left: 2350, 
              zIndex: 6,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={TREE2} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 208, 
              left: 2900, 
              zIndex: 3,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={FUENTE} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 71, 
              left: 3100, 
              zIndex: 3,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={BUSH1} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 24, 
              left: 3050, 
              zIndex: 3,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={TREE4} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 190, 
              left: 3210, 
              zIndex: 3,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={BENCH1} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 22, 
              left: 3250, 
              zIndex: 4,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={ROCK3} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 16, 
              left: 3300, 
              zIndex: 4,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />
          <img 
            src={BUSH3} 
            alt="fuente" 
            style={{ 
              position: "absolute", 
              top: window.innerHeight - groundHeight - 18, 
              left: 3210, 
              zIndex: 3,
              transform: `translateX(${cameraOffsetX.current}px)`,
            }}
          />

        </Box>
      </Box>
    </Box>
  );
}

export default Stage1;