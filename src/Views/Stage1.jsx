import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import '../assets/css/effects.css';
//IMAGENES
import BG1 from '../assets/img/map/background1.png';
import BG2 from '../assets/img/map/background2.png';
import BG3 from '../assets/img/map/background3.png';
import BG4 from '../assets/img/map/background4.png';
import FLOOR from '../assets/img/map/floor.png';
import BOX from '../assets/img/map/decorations/InfoBox.png';
import BOXOFF from '../assets/img/map/decorations/InfoBox_off.png';
import TITUTLO from '../assets/img/Titulo.png';
//PLATAFORMAS
import platform_una from '../assets/img/map/plataforma_una.png';
import platform_doble from '../assets/img/map/plataforma_doble.png';
import platform_triple from '../assets/img/map/plataforma_triple.png';
import platform_cuadruple from '../assets/img/map/plataforma_cuadruple.png';
//OBSTACULOS
import obst1 from '../assets/img/map/obst1.png';
import obst2 from '../assets/img/map/obst2.png';
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
const playerWidth = 50;
const playerHeight = 70;
const groundWidth = 5000;

function Stage1() {
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

  // Plataformas verdes fijas
  const platforms = [
    { x: 700, y: window.innerHeight - groundHeight - 200, width: 80, height: 40, img: platform_doble },
    { x: 960, y: window.innerHeight - groundHeight - 300, width: 160, height: 40, img: platform_cuadruple },
    { x: 1780, y: window.innerHeight - groundHeight - 100, width: 120, height: 40, img: platform_triple },
    { x: 1900, y: window.innerHeight - groundHeight - 230, width: 80, height: 40, img: platform_doble },
    { x: 1700, y: window.innerHeight - groundHeight - 330, width: 40, height: 40, img: platform_una }
  ];

  // Obstáculos verdes fijos (no se mueven)
  const obstacles = [
    {
      x: 800,
      y: window.innerHeight - groundHeight - 80,
      width: 482,
      height: 80,
      img: obst1
    },
    {
      x: 1282,
      y: window.innerHeight - groundHeight - 240,
      width: 200,
      height: 240,
      img: obst2
    },
  ];

  // Enemigos amarillos, con estado para color y desaparición
  const enemies = useRef([
    {
      x: 800,
      y: window.innerHeight - groundHeight - playerHeight - 45,
      width: 50,
      height: 37,
      speed: 1,
      minX: 800,
      maxX: 1050,
      direction: 1,
      isHit: false, // para saber si está "rojo"
      hitTimeout: null,
    }
    /*{
      x: 400,
      y: window.innerHeight - groundHeight - playerHeight + 10,
      width: 40,
      height: 40,
      speed: 1,
      minX: 350,
      maxX: 550,
      direction: 1,
      isHit: false, // para saber si está "rojo"
      hitTimeout: null,
    },
    {
      x: 750,
      y: window.innerHeight - groundHeight - playerHeight + 10,
      width: 40,
      height: 40,
      speed: 1.5,
      minX: 700,
      maxX: 900,
      direction: -1,
      isHit: false,
      hitTimeout: null,
    },*/
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
        console.log("Caja 2 golpeada: ¡Soltando recompensa!");
        // Otra acción diferente
      },
    },
  ]);

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

        if ((touchingLeftSide || touchingRightSide) && !enemy.isHit) {
          setPlayerCanMove(false);
          setPlayerColor(dead);
          setPlayerOpacity(1);

          setTimeout(() => {
            setPlayerOpacity(0);
          }, 100);

          setTimeout(() => {
            posX.current = 50;
            posY.current = window.innerHeight - groundHeight - playerHeight;
            velocityX.current = 0;
            velocityY.current = 0;
            isJumping.current = false;
            jumpDirection.current = "none";
            setPlayerOpacity(1);
            setPlayerCanMove(true);
          }, 1100);
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
              top: "-30%",
              left: 0,
              width: "100vw", // más ancho para repetir con margen
              height: "100%",
              backgroundImage: `url(${BG1})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "cover",
              backgroundPositionX: `${cameraOffsetX.current * 0.2}px`, // movimiento más lento
              backgroundPositionY: "top",
              zIndex: 0,
            }}
          />

          {/* BG2 - fondo más cercano (se mueve más) */}
          <div
            style={{
              position: "absolute",
              top: "-30%",
              left: 0,
              width: "100vw",
              height: "100%",
              backgroundImage: `url(${BG2})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "contain",
              backgroundPositionX: `${cameraOffsetX.current * 0.4}px`, // movimiento intermedio
              backgroundPositionY: "top",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* BG3 - fondo más cercano (se mueve más) */}
          <div
            style={{
              position: "absolute",
              top: "-30%",
              left: 0,
              width: "100vw",
              height: "100%",
              backgroundImage: `url(${BG3})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "contain",
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
              top: "-30%",
              left: 0,
              width: "100vw",
              height: "100%",
              backgroundImage: `url(${BG4})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "contain",
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
                zIndex: 4,
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
                backgroundImage: `url(${box.isHit ? BOXOFF : BOX})`,
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
              zIndex: 5,
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
              zIndex: 6,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Stage1;