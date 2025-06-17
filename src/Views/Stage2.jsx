import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import '../assets/css/effects.css';
//IMAGENES
import BG1 from '../assets/img/map/background1_stage2.png';
import BG2 from '../assets/img/map/background2_stage2.png';
import BG3 from '../assets/img/map/background3_stage2.png';
import BG4 from '../assets/img/map/background4_stage2.png';
import FLOOR from '../assets/img/map/floor_stage2.png';
import PIPEOUT from '../assets/img/map/pipe.png';
import coinSprite from '../assets/img/map/decorations/coins.png';
import heartSprite from '../assets/img/map/decorations/heart.png';
import CONTROLL from '../assets/img/controlL.png';
import CONTROLR from '../assets/img/controlR.png';
import CONTROLUP from '../assets/img/controlUp.png';
import CONTROLDOWN from '../assets/img/controlDown.png';
import BUTTONBOX from '../assets/img/map/decorations/Button.png';
import SCREEN from '../assets/img/map/decorations/Screen.png';
import SCREEN2 from '../assets/img/map/decorations/Screen2.png';
import SCREEN3 from '../assets/img/map/decorations/Screen3.png';
import SCREEN4 from '../assets/img/map/decorations/Screen4.png';
import CRANEBASE1 from '../assets/img/map/decorations/Crane/Base1.png';
import CRANEBASE2 from '../assets/img/map/decorations/Crane/Base2.png';
import CRANEBASE3 from '../assets/img/map/decorations/Crane/Base3.png';
import CRANEARM1 from '../assets/img/map/decorations/Crane/Crane1.png';
import CRANEARM2 from '../assets/img/map/decorations/Crane/Crane2.png';
import CRANEARM3 from '../assets/img/map/decorations/Crane/Crane3.png';
import CRANEARM4 from '../assets/img/map/decorations/Crane/Crane4.png';
//LENGUAJES
import JAVASCRIPTICON from '../assets/img/map/decorations/Lenguajes/javascript.png';
import REACTICON from '../assets/img/map/decorations/Lenguajes/react.png';
import JQUERY from '../assets/img/map/decorations/Lenguajes/jquery.png';
import MUI from '../assets/img/map/decorations/Lenguajes/mui.png';
import PHPICON from '../assets/img/map/decorations/Lenguajes/php.png';
import LARAVEL from '../assets/img/map/decorations/Lenguajes/laravel.png';
import NGINX from '../assets/img/map/decorations/Lenguajes/nginx.png';
//BOXES
import JAVASCRIPT from '../assets/img/map/decorations/JavaScriptBox.png';
import JAVASCRIPT_OFF from '../assets/img/map/decorations/JavaScriptBox_off.png';
import PHP from '../assets/img/map/decorations/php.png';
import PHP_OFF from '../assets/img/map/decorations/php_off.png';
import PYTHON from '../assets/img/map/decorations/python.png';
import PYTHON_OFF from '../assets/img/map/decorations/python_off.png';
import MYSQL from '../assets/img/map/decorations/mysql.png';
import MYSQL_OFF from '../assets/img/map/decorations/mysql_off.png';
//PLATAFORMAS
import platform_una from '../assets/img/map/plataforma_una_stage2.png';
import platform_double from '../assets/img/map/plataforma_doble_stage2.png';
import platform_triple from '../assets/img/map/plataforma_triple_stage2.png';
import platform_cuadruple from '../assets/img/map/plataforma_cuadruple_stage2.png';
import platform_quintuple from '../assets/img/map/plataforma_quintuple_stage2.png';
import platform_sixtuple from '../assets/img/map/plataforma_sixtuple_stage2.png';
import platform_septuple from '../assets/img/map/plataforma_septuple_stage2.png';
import platform_octuple from '../assets/img/map/plataforma_octuple_stage2.png';
import platform_nonuple from '../assets/img/map/plataforma_nonuple_stage2.png';
//OBSTACULOS
import obst1 from '../assets/img/map/obst1_stage2.png';
import obst2 from '../assets/img/map/obst2_stage2.png';
import obst3 from '../assets/img/map/obst3_stage2.png';
import obst4 from '../assets/img/map/obst4_stage2.png';
import obst5 from '../assets/img/map/obst5_stage2.png';
import obst6 from '../assets/img/map/obst6_stage2.png';
import obst7 from '../assets/img/map/obst7_stage2.png';
import obst8 from '../assets/img/map/obst8_stage2.png';
import obst9 from '../assets/img/map/obst9_stage2.png';
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
const groundWidth = 10000;

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

function Stage2() {
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
  const [isGoingDownPipe, setIsGoingDownPipe] = useState(false);
  const [coinCount, setCoinCount] = useState(parseInt(localStorage.getItem("coinCount")));
  const [showLifeScreen, setShowLifeScreen] = useState(false);
  const [showedLife, setShowedLife] = useState(false);
  const [lifeCount,setLifeCount] = useState(parseInt(localStorage.getItem("lifeCount")));
  const [lifeScreenOpacity, setLifeScreenOpacity] = useState(0);
  const [JavaScriptDialogue, setJavaScriptDialogue] = useState(false);
  const [PHPDialogue, setPHPDialogue] = useState(false);
  const [PythonDialogye,setPythonDialogue] = useState(false);
  const JSfullText = ` Tengo más de cinco años trabajando en el ecosistema JavaScript, cubriendo de punta a punta la creación de aplicaciones web y móviles.`;
  const JStypedText = useTypewriter(JavaScriptDialogue ? JSfullText : "", 50, 1200);
  const PHPfullText = ` Cuento con sólida experiencia en PHP, enfocada en el diseño y despliegue de Back‑Ends robustos con implementacion de systemas de seguridad y validacion de datos.`;
  const PHPtypedText = useTypewriter(PHPDialogue ? PHPfullText : "", 50, 1200);

  // Plataformas verdes fijas
  const platforms = [
    { x: 280, y: window.innerHeight - groundHeight - 100, width: 120, height: 40, img: platform_triple },
    { x: 100, y: window.innerHeight - groundHeight - 200, width: 120, height: 40, img: platform_triple },
    { x: 1140, y: window.innerHeight - groundHeight - 100, width: 80, height: 40, img: platform_double },
    { x: 1210, y: window.innerHeight - groundHeight - 250, width: 40, height: 40, img: platform_una },
    { x: 1340, y: window.innerHeight - groundHeight - 350, width: 360, height: 40, img: platform_nonuple },
    { x: 2340, y: window.innerHeight - groundHeight - 200, width: 80, height: 40, img: platform_double },
    { x: 2340, y: window.innerHeight - groundHeight - 100, width: 120, height: 40, img: platform_triple },
    { x: 3160, y: window.innerHeight - groundHeight - 100, width: 40, height: 40, img: platform_una },
    { x: 2960, y: window.innerHeight - groundHeight - 200, width: 160, height: 40, img: platform_cuadruple },
    { x: 3900, y: window.innerHeight - groundHeight - 200, width: 80, height: 40, img: platform_double },
    { x: 3700, y: window.innerHeight - groundHeight - 300, width: 40, height: 40, img: platform_una },
    { x: 3960, y: window.innerHeight - groundHeight - 100, width: 280, height: 40, img: platform_septuple },
    { x: 5100, y: window.innerHeight - groundHeight - 240, width: 320, height: 40, img: platform_octuple },
    { x: 5900, y: window.innerHeight - groundHeight - 100, width: 120, height: 40, img: platform_triple },
  ];

  const movingPlatforms = useRef([
    { x: 560, y: window.innerHeight - groundHeight - 200, width: 200, height: 40, img: platform_quintuple, speed: 1, direction: 1, axis: "y", min: window.innerHeight - groundHeight - 200, max: window.innerHeight - groundHeight - 40},
    { x: 2400, y: window.innerHeight - groundHeight - 360, width: 160, height: 40, img: platform_cuadruple, speed: 1.5, direction: 1, axis: "x", min: 2400, max: 2800 },
    { x: 3240, y: window.innerHeight - groundHeight - 200, width: 40, height: 40, img: platform_una, speed: 1, direction: 1, axis: "y", min: window.innerHeight - groundHeight - 200, max: window.innerHeight - groundHeight - 40},
    { x: 3460, y: window.innerHeight - groundHeight - 160, width: 80, height: 40, img: platform_double, speed: 1, direction: 1, axis: "y", min: window.innerHeight - groundHeight - 160, max: window.innerHeight - groundHeight - 40},
    { x: 3800, y: window.innerHeight - groundHeight - 350, width: 120, height: 40, img: platform_triple, speed: 1.5, direction: 1, axis: "x", min: 3800, max: 4700 }
  ]);

  // Obstáculos verdes fijos (no se mueven)
  const obstacles = [
    { x: 400, y: window.innerHeight - groundHeight - 240, width: 160, height: 240, img: obst5, zIndex: 6 },
    { x: 900, y: window.innerHeight - groundHeight - 120, width: 120, height: 120, img: obst2, zIndex: 6 },
    { x: 1020, y: window.innerHeight - groundHeight - 160, width: 120, height: 160, img: obst8, zIndex: 6 },
    { x: 1700, y: window.innerHeight - groundHeight - 80, width: 360, height: 80, img: obst6, zIndex: 6 },
    { x: 2060, y: window.innerHeight - groundHeight - 160, width: 120, height: 160, img: obst8, zIndex: 6 },
    { x: 2180, y: window.innerHeight - groundHeight - 240, width: 160, height: 240, img: obst5, zIndex: 6 },
    { x: 3200, y: window.innerHeight - groundHeight - 240, width: 40, height: 240, img: obst4, zIndex: 6 },
    { x: 3500, y: window.innerHeight - groundHeight - 200, width: 40, height: 200, img: obst3, zIndex: 6 },
    { x: 3540, y: window.innerHeight - groundHeight - 120, width: 360, height: 120, img: obst7, zIndex: 6 },
    { x: 3780, y: window.innerHeight - groundHeight - 200, width: 120, height: 80, img: obst1, zIndex: 6 },
    { x: 4780, y: window.innerHeight - groundHeight - 160, width: 240, height: 160, img: obst9, zIndex: 6 },
    { x: 5420, y: window.innerHeight - groundHeight - 240, width: 160, height: 240, img: obst5, zIndex: 6 },
    { x: 5020, y: window.innerHeight - groundHeight - 80, width: 120, height: 80, img: obst1, zIndex: 6 },
    { x: 5580, y: window.innerHeight - groundHeight - 120, width: 120, height: 120, img: obst2, zIndex: 6 },
    { x: 6060, y: window.innerHeight - groundHeight - 160, width: 120, height: 160, img: obst8, zIndex: 6 },
    { x: 6180, y: window.innerHeight - groundHeight - 240, width: 160, height: 240, img: obst5, zIndex: 6 },
    { x: 6800, y: window.innerHeight - groundHeight - 240, width: 40, height: 240, img: obst4, zIndex: 6 },
    { x: 6840, y: window.innerHeight - groundHeight - 120, width: 360, height: 120, img: obst7, zIndex: 6 },
  ];

  const buttons = useRef([
    { id: "btn1", x: 1050, y: window.innerHeight - groundHeight - 175, width: 60, height: 20, isPressed: false, jumpOffset: 0 },
    /*{ id: "btn2", x: 2200, y: window.innerHeight - groundHeight - 255, width: 60, height: 20, isPressed: false, jumpOffset: 0 },*/
    { id: "btn3", x: 3000, y: window.innerHeight - groundHeight - 15, width: 60, height: 20, isPressed: false, jumpOffset: 0 },
    /*{ id: "btn4", x: 3800, y: window.innerHeight - groundHeight - 215, width: 60, height: 20, isPressed: false, jumpOffset: 0 },
    { id: "btn5", x: 5050, y: window.innerHeight - groundHeight - 95, width: 60, height: 20, isPressed: false, jumpOffset: 0 },*/
  ]);

  const cranes = [
    { x: 1130, y: window.innerHeight - groundHeight - 350, width: 100, height: 350, img: CRANEBASE1, zIndex: 4 },
    /*{ x: 1950, y: window.innerHeight - groundHeight - 430, width: 100, height: 350, img: CRANEBASE1, zIndex: 4 },*/
    { x: 2440, y: window.innerHeight - groundHeight - 540, width: 100, height: 540, img: CRANEBASE3, zIndex: 4 },
    /*{ x: 4140, y: window.innerHeight - groundHeight - 350, width: 100, height: 350, img: CRANEBASE1, zIndex: 4 },
    { x: 4700, y: window.innerHeight - groundHeight - 540, width: 100, height: 540, img: CRANEBASE3, zIndex: 4 },*/
  ]

  const triggeredObjects = useRef([
    { id: "btn1", x: 1160, y: window.innerHeight - groundHeight - 120, targetY: window.innerHeight - groundHeight - 300, width: 230, height: 80, speed: 3.5, direction: "up", isActive: false, img: CRANEARM1, text: "", icon: null, img_width: 0, fontSize: 12},
    { id: "btn1", x: 1220, y: window.innerHeight - groundHeight, targetY: window.innerHeight - groundHeight - 240, width: 400, height: 195, speed: 4, direction: "up", isActive: false, img: SCREEN, text: "-> Construyo interfaces dinámicas con React JS y Node JS para plataformas web altamente interactivas.\n\n-> Manejo de JQuery para integracion de funciones API REST u otras funciones web de utilidad.\n\n-> Diseño de UI accesibles e interactivas 100% responsivas para desktop y mobil con diseño y navegacion horientada a la comodidad del usuario.", icon: REACTICON, img_width: "200px", fontSize: 8, marginTop: "20px" },
    /*{ id: "btn2", x: 1755, y: window.innerHeight - groundHeight - 200, targetY: window.innerHeight - groundHeight - 390, width: 230, height: 120, speed: 3, direction: "up", isActive: false, img: CRANEARM2, text: "", icon: null, img_width: 0, fontSize: 12},
    { id: "btn2", x: 1735, y: window.innerHeight - groundHeight - 80, targetY: window.innerHeight - groundHeight - 340, width: 200, height: 240, speed: 4, direction: "up", isActive: false, img: SCREEN2, text: "Manejo de JQuery para integracion de funciones API REST u otras funciones web de utilidad.", icon: JQUERY, img_width: "60px", fontSize: 10 },*/
    { id: "btn3", x: 2467, y: window.innerHeight - groundHeight - 80, targetY: window.innerHeight - groundHeight - 450, width: 400, height: 95, speed: 3, direction: "up", isActive: false, img: CRANEARM3, text: "", icon: null, img_width: 0, fontSize: 12},
    { id: "btn3", x: 2550, y: window.innerHeight - groundHeight, targetY: window.innerHeight - groundHeight - 350, width: 360, height: 295, speed: 2.7, direction: "up", isActive: false, img: SCREEN3, text: "-> Desarrollo APIs y servicios escalables, aplicando el ecosistema Laravel para autenticación y migraciones o Lumen cuando se requiere máxima ligereza y velocidad.\n\n-> Configuro servidores backend en máquinas virtuales, orquestando Nginx como reverse proxy y servidor web para garantizar rendimiento, seguridad y balanceo eficiente.", icon: LARAVEL, img_width: "150px", fontSize: 10 },
    /*{ id: "btn4", x: 4169, y: window.innerHeight - groundHeight - 120, targetY: window.innerHeight - groundHeight - 315, width: 240, height: 85, speed: 3, direction: "up", isActive: false, img: CRANEARM4, text: "", icon: null, img_width: 0, fontSize: 12},
    { id: "btn4", x: 4200, y: window.innerHeight - groundHeight, targetY: window.innerHeight - groundHeight - 235, width: 230, height: 200, speed: 4, direction: "up", isActive: false, img: SCREEN, text: "Desarrollo APIs y servicios escalables, aplicando el ecosistema Laravel para autenticación y migraciones o Lumen cuando se requiere máxima ligereza y velocidad.", icon: LARAVEL, img_width: "100px", fontSize: 8 },
    { id: "btn5", x: 4517, y: window.innerHeight - groundHeight - 115, targetY: window.innerHeight - groundHeight - 415, width: 215, height: 120, speed: 4, direction: "up", isActive: false, img: CRANEARM2, text: "", icon: null, img_width: 0, fontSize: 12},
    { id: "btn5", x: 4480, y: window.innerHeight - groundHeight, targetY: window.innerHeight - groundHeight - 350, width: 215, height: 300, speed: 3.9, direction: "up", isActive: false, img: SCREEN4, text: "Configuro servidores backend en máquinas virtuales, orquestando Nginx como reverse proxy y servidor web para garantizar rendimiento, seguridad y balanceo eficiente.", icon: NGINX, img_width: "60px", fontSize: 10},*/
  ]);

   // Enemigos amarillos, con estado para color y desaparición
  const enemies = useRef([
    {
      x: 750,
      y: window.innerHeight - groundHeight - playerHeight + 15,
      width: 50,
      height: 37,
      speed: 1,
      minX: 750,
      maxX: 850,
      direction: 1,
      isHit: false, // para saber si está "rojo"
      hitTimeout: null,
    },
    {
      x: 875,
      y: window.innerHeight - groundHeight - playerHeight - 105,
      width: 50,
      height: 37,
      speed: 1,
      minX: 875,
      maxX: 970,
      direction: -1,
      isHit: false, // para saber si está "rojo"
      hitTimeout: null,
    },
    {
      x: 1330,
      y: window.innerHeight - groundHeight - playerHeight - 335,
      width: 50,
      height: 37,
      speed: 1,
      minX: 1330,
      maxX: 1660,
      direction: -1,
      isHit: false, // para saber si está "rojo"
      hitTimeout: null,
    },
    {
      x: 1660,
      y: window.innerHeight - groundHeight - playerHeight - 335,
      width: 50,
      height: 37,
      speed: 1,
      minX: 1330,
      maxX: 1660,
      direction: 1,
      isHit: false, // para saber si está "rojo"
      hitTimeout: null,
    },
    {
      x: 2130,
      y: window.innerHeight - groundHeight - playerHeight - 145,
      width: 50,
      height: 37,
      speed: 1,
      minX: 2070,
      maxX: 2130,
      direction: 1,
      isHit: false, // para saber si está "rojo"
      hitTimeout: null,
    },
  ]);

  const boxes = useRef([
    {
      x: 450,
      y: window.innerHeight - groundHeight - 400,
      width: 40,
      height: 40,
      isHit: false,
      jumpOffset: 0,
      onHit: () => {
        setJavaScriptDialogue(true)
      },
      imgON: JAVASCRIPT,
      imgOFF: JAVASCRIPT_OFF
    },
    {
      x: 2200,
      y: window.innerHeight - groundHeight - 400,
      width: 40,
      height: 40,
      isHit: false,
      jumpOffset: 0,
      onHit: () => {
        setPHPDialogue(true)
      },
      imgON: PHP,
      imgOFF: PHP_OFF
    },
    /*{
      x: 5200,
      y: window.innerHeight - groundHeight - 400,
      width: 40,
      height: 40,
      isHit: false,
      jumpOffset: 0,
      onHit: () => {
        setPythonDialogue(true)
      },
      imgON: PYTHON,
      imgOFF: PYTHON_OFF
    },*/
  ]);

  const [coins, setCoins] = useState([
    { x: 280, y: window.innerHeight - groundHeight - 130, width: 20, height: 24 },
    { x: 310, y: window.innerHeight - groundHeight - 130, width: 20, height: 24 },
    { x: 340, y: window.innerHeight - groundHeight - 130, width: 20, height: 24 },
    { x: 370, y: window.innerHeight - groundHeight - 130, width: 20, height: 24 },
    { x: 100, y: window.innerHeight - groundHeight - 230, width: 20, height: 24 },
    { x: 130, y: window.innerHeight - groundHeight - 230, width: 20, height: 24 },
    { x: 160, y: window.innerHeight - groundHeight - 230, width: 20, height: 24 },
    { x: 190, y: window.innerHeight - groundHeight - 230, width: 20, height: 24 },
    { x: 1700, y: window.innerHeight - groundHeight - 110, width: 20, height: 24 },
    { x: 1730, y: window.innerHeight - groundHeight - 110, width: 20, height: 24 },
    { x: 1760, y: window.innerHeight - groundHeight - 110, width: 20, height: 24 },
    { x: 1790, y: window.innerHeight - groundHeight - 110, width: 20, height: 24 },
    { x: 1820, y: window.innerHeight - groundHeight - 110, width: 20, height: 24 },
    { x: 1850, y: window.innerHeight - groundHeight - 110, width: 20, height: 24 },
    { x: 1880, y: window.innerHeight - groundHeight - 110, width: 20, height: 24 },
    { x: 1910, y: window.innerHeight - groundHeight - 110, width: 20, height: 24 },
    { x: 1940, y: window.innerHeight - groundHeight - 110, width: 20, height: 24 },
    { x: 2965, y: window.innerHeight - groundHeight - 230, width: 20, height: 24 },
    { x: 2995, y: window.innerHeight - groundHeight - 230, width: 20, height: 24 },
    { x: 3025, y: window.innerHeight - groundHeight - 230, width: 20, height: 24 },
    { x: 3055, y: window.innerHeight - groundHeight - 230, width: 20, height: 24 },
    { x: 3085, y: window.innerHeight - groundHeight - 230, width: 20, height: 24 },
    { x: 3285, y: window.innerHeight - groundHeight - 30, width: 20, height: 24 },
    { x: 3315, y: window.innerHeight - groundHeight - 30, width: 20, height: 24 },
    { x: 3345, y: window.innerHeight - groundHeight - 30, width: 20, height: 24 },
    { x: 3375, y: window.innerHeight - groundHeight - 30, width: 20, height: 24 },
    { x: 3405, y: window.innerHeight - groundHeight - 30, width: 20, height: 24 },
    { x: 3435, y: window.innerHeight - groundHeight - 30, width: 20, height: 24 },
    { x: 3435, y: window.innerHeight - groundHeight - 30, width: 20, height: 24 },
    { x: 3970, y: window.innerHeight - groundHeight - 130, width: 20, height: 24 },
    { x: 4000, y: window.innerHeight - groundHeight - 130, width: 20, height: 24 },
    { x: 4030, y: window.innerHeight - groundHeight - 130, width: 20, height: 24 },
    { x: 4060, y: window.innerHeight - groundHeight - 130, width: 20, height: 24 },
    { x: 4090, y: window.innerHeight - groundHeight - 130, width: 20, height: 24 },
    { x: 4120, y: window.innerHeight - groundHeight - 130, width: 20, height: 24 },
    { x: 4150, y: window.innerHeight - groundHeight - 130, width: 20, height: 24 },
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
    localStorage.setItem("coinCount", coinCount);
  },[coinCount])
  
  useEffect(() => {
    localStorage.setItem("lifeCount", lifeCount);
  },[lifeCount])

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
          setLifeCount((prev) => {
            const newLife = prev - 1;
            if (newLife <= 0) {
              // Reinicio de vidas
              setTimeout(() => {
                setLifeCount(5);
              }, 3000); // Espera a que termine la animación de muerte
              return 0;
            }
            return newLife;
          }); // Resta 1 vida
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

      // 1. Mover plataformas móviles
      movingPlatforms.current.forEach((plat) => {
        if (plat.axis === "x") {
          plat.x += plat.speed * plat.direction;
          if (plat.x < plat.min || plat.x > plat.max) {
            plat.direction *= -1;
          }
        } else if (plat.axis === "y") {
          plat.y += plat.speed * plat.direction;
          if (plat.y < plat.min || plat.y > plat.max) {
            plat.direction *= -1;
          }
        }
      });

      // 2. Verificar si el jugador aterriza sobre una plataforma móvil
      let landedOnMovingPlatform = false;

      for (let platform of movingPlatforms.current) {
        const nextBottom = posY.current + playerHeight + velocityY.current;

        const isLanding =
          velocityY.current >= 0 &&
          posY.current + playerHeight <= platform.y + 4 && // Tolerancia de 4px
          nextBottom >= platform.y &&
          posX.current + playerWidth > platform.x &&
          posX.current < platform.x + platform.width;

        if (isLanding) {
          // Ajustar posición exacta sobre la plataforma
          posY.current = platform.y - playerHeight;
          velocityY.current = 0;
          isJumping.current = false;
          jumpDirection.current = "none";
          landedOnMovingPlatform = true;

          // Mover jugador junto con la plataforma
          if (platform.axis === "x") {
            posX.current += platform.speed * platform.direction;
          } else if (platform.axis === "y") {
            posY.current += platform.speed * platform.direction;
          }

          break; // ya aterrizó en una plataforma, no sigue revisando otras
        }
      }

      buttons.current.forEach((button) => {
        const isLandingOnButton =
          velocityY.current >= 0 &&
          posY.current + playerHeight <= button.y + 4 &&
          posY.current + playerHeight + velocityY.current >= button.y &&
          posX.current + playerWidth > button.x &&
          posX.current < button.x + button.width;

        if (isLandingOnButton && !button.isPressed) {
          button.isPressed = true;
          button.y += 5; // Se mantiene abajo

          // Rebote del jugador
          velocityY.current = -extraJumpStrength / 2;
          isJumping.current = true;

          // Activar objeto asociado
          triggeredObjects.current.forEach((obj) => {
            if (obj.id === button.id) {
              obj.isActive = true;
            }
          });

          setTick(t => t + 1); // Forzar re-render inmediato
        }
      });

      triggeredObjects.current.forEach((obj) => {
        if (obj.isActive && obj.y > obj.targetY) {
          obj.y -= obj.speed;
          if (obj.y <= obj.targetY) {
            obj.y = obj.targetY;
            obj.isActive = false; // opcional: detener la animación al llegar
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
                zIndex: 5,
              }}
            />
          ))}

          {/* Plataformas móviles */}
          {movingPlatforms.current.map((plat, i) => (
            <div
              key={"movingplat" + i}
              style={{
                position: "fixed",
                left: plat.x,
                top: plat.y,
                width: plat.width,
                height: plat.height,
                backgroundImage: `url(${plat.img})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                transform: `translateX(${cameraOffsetX.current}px)`,
                zIndex: 5,
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

          {/* Botones */}
          {buttons.current.map((button, i) => (
            <div
              key={"btn" + i}
              style={{
                position: "fixed",
                backgroundImage: `url(${BUTTONBOX})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                left: button.x,
                top: button.y + button.jumpOffset,
                width: button.width,
                height: button.height,
                transform: `translateX(${cameraOffsetX.current}px)`,
                transition: "top 0.15s",
                zIndex: 5,
              }}
            />
          ))}

          {/**BASE CRANES */}
          {cranes.map((crane, i) => (
            <div
              key={`coin-${i}`}
              style={{
                position: "fixed",
                left: crane.x,
                top: crane.y,
                width: crane.width,
                height: crane.height,
                backgroundImage: `url(${crane.img})`, // Asegúrate de tener esta imagen importada
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                transform: `translateX(${cameraOffsetX.current}px)`,
                zIndex: crane.zIndex
              }}
            />
          ))}

          {/* Objetos activados por botones */}
          {triggeredObjects.current.map((obj, i) => (
            <div
              key={"obj" + i}
              style={{
                position: "fixed",
                backgroundImage: `url(${obj.img})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                left: obj.x,
                top: obj.y,
                width: obj.width,
                height: obj.height,
                transform: `translateX(${cameraOffsetX.current}px)`,
                transition: "top 0.15s",
                zIndex: 4,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center", // centra verticalmente si el div tiene espacio
                textAlign: "center"
              }}
            >
              <Typography
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: obj.fontSize,
                  color: "black",
                  whiteSpace: "pre-line",
                  lineHeight: "1.6",
                  marginBottom: "8px"
                }}
              >
                {obj.text}
              </Typography>
              { obj.icon && <img src={obj.icon} alt="JS" style={{ width: obj.img_width }} />}
            </div>

          ))}

          {/**DIALOGO JS */}
          { JavaScriptDialogue && 
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: window.innerHeight - groundHeight - 430,
                left: 600,
                height: "250px",
                backgroundColor: "#38002C",
                border: "4px solid #F4C975",
                borderRadius: "5px",
                zIndex: 3,
                transform: `translateX(${cameraOffsetX.current}px)`,
                padding: "10px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                textAlign: "center",
                position: "relative", // clave para posicionar la imagen internamente
              }}
            >
              <Typography
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 12,
                  color: "white",
                  whiteSpace: "pre-line",
                  lineHeight: "1.6",
                }}
              >
                {JStypedText}
              </Typography>
              <img
                src={JAVASCRIPTICON}
                alt="JS"
                style={{
                  width: "100px",
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            </motion.div>
          }

          {/**DIALOGO PHP */}
          { PHPDialogue && 
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 350, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: window.innerHeight - groundHeight - ( JavaScriptDialogue ? 740 : 450),
                left: 1750,
                height: "250px",
                backgroundColor: "#38002C",
                border: "4px solid #F4C975",
                borderRadius: "5px",
                zIndex: 3,
                transform: `translateX(${cameraOffsetX.current}px)`,
                padding: "10px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                textAlign: "center",
                position: "relative", // clave para posicionar la imagen internamente
              }}
            >
              <Typography
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 12,
                  color: "white",
                  whiteSpace: "pre-line",
                  lineHeight: "1.6",
                }}
              >
                {PHPtypedText}
              </Typography>
              <img
                src={PHPICON}
                alt="PHP"
                style={{
                  width: "100px",
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            </motion.div>
          }

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
              zIndex: 6,
            }}
          />

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
                <span style={{ fontSize: "30px", fontFamily: '"Press Start 2P", monospace', }}>X{lifeCount}</span>
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
            gap: "8px",
          }}>
            {Array.from({ length: lifeCount }).map((_, index) => (
              <img
                key={index}
                src={heartSprite}
                alt="heart"
                style={{ width: "30px", height: "30px" }}
              />
            ))}
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

        </Box>
      </Box>
    </Box>
  );
}

export default Stage2;