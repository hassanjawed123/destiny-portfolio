import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import "./App.css";

// ── Preload sounds at module level so they're ready before first click ──
const sfxClick = new Howl({ src: ["/sounds/click.mp3"], volume: 0.75, preload: true });
const bgMusic  = new Howl({ src: ["/sounds/background.mp3"], volume: 0, loop: true, preload: true });

// Shared AudioContext for zero-latency click playback
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === "suspended") _audioCtx.resume();
  return _audioCtx;
}

// Warm up AudioContext on first mouse move — before any click
// This ensures it's running by the time the user clicks
if (typeof window !== "undefined") {
  const warmUp = () => {
    getAudioCtx();
    window.removeEventListener("mousemove", warmUp);
    window.removeEventListener("touchstart", warmUp);
  };
  window.addEventListener("mousemove", warmUp, { passive: true });
  window.addEventListener("touchstart", warmUp, { passive: true });
}

// Decode and cache the click buffer — starts loading immediately
let _clickBuffer = null;
async function loadClickBuffer() {
  try {
    const ctx = getAudioCtx();
    const res = await fetch("/sounds/click.mp3");
    const arr = await res.arrayBuffer();
    _clickBuffer = await ctx.decodeAudioData(arr);
  } catch(e) {}
}
// Load as soon as possible
loadClickBuffer();

function playClick() {
  try {
    const ctx = getAudioCtx();
    if (_clickBuffer) {
      // Use decoded buffer — zero latency
      const src = ctx.createBufferSource();
      const gain = ctx.createGain();
      gain.gain.value = 0.75;
      src.buffer = _clickBuffer;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start(0);
    } else {
      // Fallback: Howler
      sfxClick.stop();
      sfxClick.play();
    }
  } catch(e) {
    sfxClick.stop();
    sfxClick.play();
  }
}

// ─── Planet data ──────────────────────────────────────────────────────────────
const planets = [
  {
    id: "venus",
    size: 170,
    top: "22%",
    left: "26%",
    labelSide: "right",
    gradient: "radial-gradient(circle at 35% 30%, #c8b840 0%, #8a8010 25%, #505008 55%, #1a1802 85%)",
    innerShadow: "inset -22px -18px 40px rgba(0,0,0,0.65), inset 10px 8px 22px rgba(240,220,80,0.18)",
    glowColor: "rgba(200,180,40,0.38)",
    ringColor: "rgba(230,215,100,1)",
    bands: [
      { top: "18%", h: "9%", color: "rgba(255,245,120,0.14)" },
      { top: "36%", h: "7%", color: "rgba(220,200,60,0.12)" },
      { top: "54%", h: "8%", color: "rgba(190,170,30,0.10)" },
      { top: "70%", h: "7%", color: "rgba(160,140,20,0.09)" },
    ],
    features: [],
    title: "Skills",
    name: "VENUS",
    sub: "Ishtar Sink",
    data: "CLASS K · CONTESTED",
    slides: [
      "- Programming languages: Java, Python, JavaScript, C++, HTML, CSS\n- Strong foundation in object-oriented design, algorithms, data structures, and software architecture",
      "- Tools and frameworks: React, Vite, Pandas, NumPy, Matplotlib, IntelliJ IDEA, Visual Studio, Git, Raspberry Pi, Microsoft Office\n- Comfortable with modern development workflows and hardware toolchains",
      "- Strengths: debugging, technical documentation, UI design, responsive layouts, collaboration, troubleshooting, and problem solving\n- Languages: English, Urdu, Hindi, Pashto (conversational), Punjabi (conversational)",
      "- Interests: immersive interfaces, game-inspired portfolio systems, procedural art, audio production, and interactive storytelling",
    ],
    floatDuration: "7.2s",
    floatDelay: "0s",
  },
  {
    id: "reef",
    size: 105,
    top: "42%",
    left: "12%",
    labelSide: "right",
    isReef: true,
    gradient: "radial-gradient(circle at 42% 32%, #8a6aaa 0%, #5c3a80 22%, #3a1a58 48%, #1e0a30 72%, #0c0518 100%)",
    innerShadow: "inset -14px -12px 28px rgba(0,0,0,0.80), inset 6px 5px 16px rgba(180,80,255,0.20)",
    glowColor: "rgba(160,80,255,0.50)",
    ringColor: "rgba(200,130,255,1)",
    bands: [],
    features: [],
    title: "Extras / Personal / Fun",
    name: "REEF",
    sub: "The Asteroid Belt",
    data: "DEBRIS FIELD · NEUTRAL",
    slides: [
      "- RetroForge: procedural pixel art collection inspired by classic RPG weapons\n- Layered components generate unique 8-bit assets with a 12–16 color palette and fantasy style",
      "- Podcast Production: original podcast exploring digital media with recording, audio editing, script organization, content planning, and storytelling\n- Focus on creative communication and polished content delivery",
      "- This portfolio: Destiny-inspired interactive UI built with React, JavaScript, CSS animations, and responsive design\n- Designed as an immersive showcase rather than a traditional website",
      "- Creative interests include digital media, storytelling, game-inspired visuals, and blending technical work with artistic expression",
    ],
    floatDuration: "8.5s",
    floatDelay: "-2.1s",
  },
  {
    id: "moon",
    size: 146,
    top: "68%",
    left: "20%",
    labelSide: "right",
    gradient: "radial-gradient(circle at 38% 32%, #787878 0%, #484848 25%, #202020 60%, #080808 90%)",
    innerShadow: "inset -20px -16px 36px rgba(0,0,0,0.78), inset 8px 6px 18px rgba(160,160,160,0.10)",
    glowColor: "rgba(110,110,120,0.25)",
    ringColor: "rgba(185,185,195,1)",
    bands: [],
    features: [
      "radial-gradient(ellipse at 34% 48%, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.25) 22%, transparent 42%)",
      "radial-gradient(ellipse at 65% 28%, rgba(15,15,15,0.50) 0%, transparent 35%)",
      "radial-gradient(ellipse at 55% 62%, rgba(0,0,0,0.38) 0%, transparent 22%)",
      "radial-gradient(ellipse at 22% 68%, rgba(0,0,0,0.32) 0%, transparent 18%)",
    ],
    title: "Experience",
    name: "MOON",
    sub: "Hellmouth",
    data: "NATURAL SAT. · HOSTILE",
    slides: [
      "- Pickering Islamic Centre: volunteer teaching assistant supporting students with lesson plans, classroom management, and one-on-one mentoring\n- Strengthened communication, patience, and educational support skills",
      "- Move Complete Inc.: residential and commercial moving with custom packaging, logistics planning, and team coordination\n- Built problem solving, time management, and workplace safety awareness",
      "- Loblaws: inventory management, customer service, stocking, and teamwork in a fast-paced retail environment\n- Reinforced reliability, organization, and customer communication",
      "- Developed transferable skills in collaboration, leadership, adaptability, and working under deadlines across multiple roles\n- Comfortable handling responsibility, client interactions, and operational execution",
    ],
    floatDuration: "6.4s",
    floatDelay: "-1.3s",
  },
  {
    id: "earth",
    size: 185,
    top: "80%",
    left: "50%",
    labelSide: "right",
    gradient: "radial-gradient(circle at 34% 28%, #6ab0e8 0%, #2060a8 22%, #0a3878 50%, #041028 85%)",
    innerShadow: "inset -28px -22px 50px rgba(0,0,0,0.55), inset 12px 10px 26px rgba(80,160,255,0.22)",
    glowColor: "rgba(40,130,230,0.40)",
    ringColor: "rgba(100,180,255,1)",
    bands: [
      { top: "20%", h: "8%", color: "rgba(255,255,255,0.14)" },
      { top: "38%", h: "6%", color: "rgba(60,140,50,0.22)" },
      { top: "52%", h: "9%", color: "rgba(255,255,255,0.12)" },
      { top: "68%", h: "6%", color: "rgba(50,120,40,0.18)" },
    ],
    features: [
      "radial-gradient(ellipse at 36% 32%, rgba(55,130,45,0.50) 0%, transparent 45%)",
      "radial-gradient(ellipse at 62% 40%, rgba(60,140,50,0.40) 0%, transparent 40%)",
      "radial-gradient(ellipse at 50% 4%, rgba(230,245,255,0.55) 0%, transparent 30%)",
      "radial-gradient(ellipse at 50% 96%, rgba(230,245,255,0.50) 0%, transparent 28%)",
    ],
    title: "About Me",
    name: "EARTH",
    sub: "Last Safe City",
    data: "CLASS M · HABITABLE",
    slides: [
      "- Computer Science student at Ontario Tech University\n- Bachelor of Science (Honours) in Computer Science & Co-op\n- Passion for software that blends functionality, creativity, and immersive user experiences",
      "- Builds both backend architecture and frontend design for technically sound, visually engaging applications\n- Favors clean code, responsive interfaces, accessible layouts, and interactive storytelling",
      "- Projects include multiplayer games, Java applications, Raspberry Pi hardware, procedural pixel art, podcast production, and Destiny-inspired portfolio design\n- Strong problem solving, communication, collaboration, and technical documentation skills\n- Seeking opportunities in software development, AI, full-stack applications, and interactive experiences",
    ],
    floatDuration: "9.1s",
    floatDelay: "-3.7s",
  },
  {
    id: "tower",
    size: 114,
    top: "50%",
    left: "50%",
    labelSide: "right",
    isTower: true,
    gradient: "radial-gradient(circle at 40% 32%, #e8f0f8 0%, #a8c0d0 25%, #5888a0 55%, #1a3040 85%)",
    innerShadow: "inset -16px -12px 30px rgba(0,0,0,0.50), inset 8px 6px 18px rgba(255,255,255,0.55)",
    glowColor: "rgba(160,215,255,0.50)",
    ringColor: "rgba(180,220,255,1)",
    bands: [],
    features: [],
    title: "Home / Landing",
    name: "TOWER",
    sub: "The Traveler",
    data: "SOL · INNER SYSTEM",
    slides: [
      "- Landing page for the portfolio with a Destiny Director-inspired interface\n- Introduces Muhammad Hassan Jawed by name and title\n- Designed to guide visitors through planets as separate portfolio sections",
      "- Includes action buttons for exploring the portfolio, viewing a resume, opening GitHub and LinkedIn, and contacting Muhammad\n- Serves as an immersive homepage and mission briefing for visitors",
      "- Shows clear section navigation, worldbuilding context, and an interface that feels like a futuristic command console",
    ],
    floatDuration: "5.8s",
    floatDelay: "-0.8s",
  },
  {
    id: "mars",
    size: 236,
    top: "72%",
    left: "78%",
    labelSide: "right",
    gradient: "radial-gradient(circle at 36% 30%, #c07030 0%, #883818 28%, #502008 58%, #180800 88%)",
    innerShadow: "inset -22px -18px 40px rgba(0,0,0,0.68), inset 10px 8px 22px rgba(220,140,70,0.18)",
    glowColor: "rgba(190,90,30,0.35)",
    ringColor: "rgba(225,145,80,1)",
    bands: [
      { top: "22%", h: "7%", color: "rgba(210,150,70,0.12)" },
      { top: "40%", h: "6%", color: "rgba(180,120,50,0.10)" },
      { top: "58%", h: "7%", color: "rgba(150,90,35,0.09)" },
    ],
    features: [
      "radial-gradient(ellipse at 50% 3%, rgba(240,225,210,0.50) 0%, transparent 28%)",
      "radial-gradient(ellipse at 50% 97%, rgba(240,225,210,0.45) 0%, transparent 25%)",
      "radial-gradient(ellipse at 60% 65%, rgba(25,8,3,0.45) 0%, transparent 30%)",
    ],
    title: "Projects",
    name: "MARS",
    sub: "Meridian Bay",
    data: "CLASS M · OCCUPIED",
    slides: [
      "Pac-Man Multiplayer\n\n- Java multiplayer arcade recreation with collision detection, enemy AI, score management, and object-oriented architecture\n- Implemented networking support, polished UI flow, and responsive game controls\n- Designed with iterative testing, state management, and reusable game components",
      "Celebrity Catalog\n\n- Reusable Java console application for adding, searching, and managing celebrity data across multiple classes\n- Built input validation, data persistence structure, and maintainable class design\n- Enhanced command-based workflows with search filtering, clear prompts, and robust error handling",
      "Raspberry Pi Projects\n\n- Python hardware integration with GPIO programming, sensors, LEDs, and automation workflows\n- Developed practical physical computing solutions with debugging, prototyping, and circuit design\n- Combined software and hardware skills to create interactive demos, documentation, and operational scripts",
      "Interactive Portfolio UI\n\n- React, JavaScript, CSS animations, responsive layout, and Destiny-style worldbuilding to present projects and experience\n- Designed for user engagement, clear navigation, and polished visual presentation\n- Created immersive section slides, Ghost companion guidance, and animated UI features for a futuristic portfolio experience",
    ],
    floatDuration: "7.8s",
    floatDelay: "-4.5s",
  },
];

const badgeSections = [
  {
    id: "vanguard",
    title: "Education",
    name: "VANGUARD",
    sub: "Guardians of the City",
    data: "FACTION · ALLIED",
    slides: [
      "- Ontario Tech University\n- Bachelor of Science (Honours) in Computer Science & Co-op\n- 2023 – 2027\n- Honor Roll student",
      "- Relevant Coursework:\n- Artificial Intelligence\n- Software Design & Analysis\n- Digital Media\n- Technical Communications",
      "- Academic focus on software development, algorithms, digital systems, and real-world co-op experience",
    ],
  },
  {
    id: "crucible",
    title: "Achievements",
    name: "CRUCIBLE",
    sub: "The Proving Ground",
    data: "PVP · COMPETITIVE",
    slides: [
      "- Honor Roll student\n- Multiple software projects completed\n- Multiplayer game development\n- Raspberry Pi hardware experience",
      "- Creative media production\n- NFT procedural asset design\n- Destiny-inspired interactive portfolio\n- Strong written and verbal communication\n- Fluent in English, Urdu, Hindi, Pashto (conversational), Punjabi (conversational)",
      "- Experience leading and teaching students\n- Comfortable working in teams, mentoring others, and presenting technical ideas clearly\n- Motivated by growth, collaboration, and solving complex problems",
    ],
  },
];

const slideSequence = ["earth", "mars", "moon", "venus", "reef", "tower", "vanguard", "crucible"];
const planetsById = Object.fromEntries([...planets, ...badgeSections].map(planet => [planet.id, planet]));

// ─── StarCanvas ───────────────────────────────────────────────────────────────
function StarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = 300;
    const tints = [
      [255, 255, 255],
      [200, 220, 255],
      [255, 240, 200],
      [180, 200, 255],
      [255, 255, 220],
    ];
    const stars = Array.from({ length: STAR_COUNT }, () => {
      const tint = tints[Math.floor(Math.random() * tints.length)];
      return {
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.4 + 0.3,
        tint,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.8 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.3,
      };
    });

    const MAX_SHOOTERS = 6;
    const shooters = [];
    // Spawn only in safe zones: top strip (y < 0.18) or far left/right edges
    // This keeps them away from the center where planets live
    const spawnShooter = () => {
      const zone = Math.random();
      let x, y;
      if (zone < 0.5) {
        // Top strip — full width, very top
        x = Math.random() * 0.9 + 0.05;
        y = Math.random() * 0.15;
      } else if (zone < 0.75) {
        // Far left edge
        x = Math.random() * 0.12;
        y = Math.random() * 0.55 + 0.05;
      } else {
        // Far right edge
        x = Math.random() * 0.12 + 0.88;
        y = Math.random() * 0.55 + 0.05;
      }
      return {
        x,
        y,
        len: Math.random() * 140 + 80,
        speed: Math.random() * 0.004 + 0.003,
        angle: Math.PI / 5 + (Math.random() - 0.5) * 0.4,
        progress: 0,
        delay: Math.random() * 80 + 20,
      };
    };

    let frame = 0;
    let animId;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = frame * 0.012;

      for (const s of stars) {
        const alpha = s.baseAlpha + Math.sin(t * s.speed + s.phase) * 0.25;
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.tint[0]},${s.tint[1]},${s.tint[2]},${Math.max(0, Math.min(1, alpha))})`;
        ctx.fill();
      }

      if (shooters.length < MAX_SHOOTERS && Math.random() < 0.025) {
        shooters.push(spawnShooter());
      }

      for (let i = shooters.length - 1; i >= 0; i--) {
        const sh = shooters[i];
        if (sh.delay > 0) { sh.delay--; continue; }
        sh.progress += sh.speed;
        if (sh.progress > 1.4) { shooters.splice(i, 1); continue; }

        const sx = sh.x * canvas.width + Math.cos(sh.angle) * sh.progress * canvas.width * 0.3;
        const sy = sh.y * canvas.height + Math.sin(sh.angle) * sh.progress * canvas.width * 0.3;
        const ex = sx - Math.cos(sh.angle) * sh.len;
        const ey = sy - Math.sin(sh.angle) * sh.len;

        const fade = sh.progress < 0.2
          ? sh.progress / 0.2
          : sh.progress > 1.0
          ? 1 - (sh.progress - 1.0) / 0.4
          : 1;

        const grad = ctx.createLinearGradient(ex, ey, sx, sy);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, `rgba(255,255,255,${0.85 * fade})`);

        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="star-canvas" />;
}

// ─── PlanetRings ──────────────────────────────────────────────────────────────
function PlanetRings({ planet, hovered }) {
  const { size, ringColor, isTower } = planet;
  const pad = 80;
  const svgSize = size + pad * 2;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const rInner = size / 2 + 8;
  const rOuter = size / 2 + 20;
  const rExtra = size / 2 + 32;

  const opacity = hovered ? 0.85 : 0.4;

  // 16 tick marks on outer ring
  const ticks = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const isMajor = i % 2 === 0;
    const r1 = rOuter + 2;
    const r2 = r1 + (isMajor ? 9 : 5);
    return {
      x1: cx + Math.cos(angle) * r1,
      y1: cy + Math.sin(angle) * r1,
      x2: cx + Math.cos(angle) * r2,
      y2: cy + Math.sin(angle) * r2,
      isMajor,
    };
  });

  // 4 diamond shapes at N/S/E/W on inner ring
  const diamonds = [0, 1, 2, 3].map((i) => {
    const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
    const r = rInner;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    const s = 4;
    return `M${px},${py - s} L${px + s},${py} L${px},${py + s} L${px - s},${py} Z`;
  });

  return (
    <svg
      className="planet-rings-svg"
      width={svgSize}
      height={svgSize}
      style={{ opacity, transition: "opacity 0.4s ease", pointerEvents: "none" }}
    >
      {/* Inner ring */}
      <circle
        cx={cx} cy={cy} r={rInner}
        fill="none"
        stroke={ringColor}
        strokeWidth="1"
        strokeOpacity="0.6"
      />
      {/* Outer ring */}
      <circle
        cx={cx} cy={cy} r={rOuter}
        fill="none"
        stroke={ringColor}
        strokeWidth="1.5"
        strokeOpacity="0.9"
      />
      {/* Extra dashed ring for Tower */}
      {isTower && (
        <circle
          cx={cx} cy={cy} r={rExtra}
          fill="none"
          stroke={ringColor}
          strokeWidth="1"
          strokeOpacity="0.5"
          strokeDasharray="4 6"
        />
      )}
      {/* Tick marks */}
      {ticks.map((tk, i) => (
        <line
          key={i}
          x1={tk.x1} y1={tk.y1}
          x2={tk.x2} y2={tk.y2}
          stroke={ringColor}
          strokeWidth={tk.isMajor ? 1.5 : 0.8}
          strokeOpacity={tk.isMajor ? 0.9 : 0.55}
        />
      ))}
      {/* Diamond markers */}
      {diamonds.map((d, i) => (
        <path key={i} d={d} fill={ringColor} opacity="0.9" />
      ))}
    </svg>
  );
}

// ─── ReefAsteroid — dark rocky body with purple nebula glow ──────────────────
function ReefAsteroid({ planet, hovered }) {
  const { size, ringColor } = planet;
  const R = size / 2;
  const cx = R, cy = R;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}
        style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
        <defs>
          {/* Purple nebula glow */}
          <radialGradient id="reef-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#1a0a2e" stopOpacity="1"/>
            <stop offset="60%"  stopColor="#0e0618" stopOpacity="1"/>
            <stop offset="100%" stopColor="#060310" stopOpacity="1"/>
          </radialGradient>
          <radialGradient id="reef-glow-r" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#6b21a8" stopOpacity="0"/>
            <stop offset="50%"  stopColor="#7c3aed" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0.65"/>
          </radialGradient>
          <filter id="reef-blur-r" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5"/>
          </filter>
          <clipPath id="reef-circle">
            <circle cx={cx} cy={cy} r={R - 1}/>
          </clipPath>
        </defs>

        {/* Outer purple nebula halo */}
        <circle cx={cx} cy={cy} r={R + 18}
          fill="none" stroke="#7c3aed"
          strokeWidth="22" strokeOpacity={hovered ? "0.30" : "0.18"}
          filter="url(#reef-blur-r)"/>

        {/* Dark circle base */}
        <circle cx={cx} cy={cy} r={R - 1} fill="url(#reef-bg)"/>

        {/* Purple atmospheric glow inside */}
        <circle cx={cx} cy={cy} r={R - 1} fill="url(#reef-glow-r)"/>

        {/* Rocky asteroid body — irregular dark shape, left-center */}
        <g clipPath="url(#reef-circle)">
          {/* Main rock mass */}
          <path d={`
            M ${cx - R*0.38},${cy - R*0.28}
            C ${cx - R*0.18},${cy - R*0.52} ${cx + R*0.08},${cy - R*0.45} ${cx + R*0.12},${cy - R*0.22}
            C ${cx + R*0.18},${cy - R*0.05} ${cx + R*0.08},${cy + R*0.15} ${cx - R*0.05},${cy + R*0.28}
            C ${cx - R*0.22},${cy + R*0.42} ${cx - R*0.45},${cy + R*0.35} ${cx - R*0.52},${cy + R*0.12}
            C ${cx - R*0.58},${cy - R*0.08} ${cx - R*0.52},${cy - R*0.18} ${cx - R*0.38},${cy - R*0.28}
            Z
          `} fill="#2a1a3e" stroke="rgba(120,80,180,0.45)" strokeWidth="1.2"/>

          {/* Lighter highlight on rock */}
          <path d={`
            M ${cx - R*0.30},${cy - R*0.22}
            C ${cx - R*0.15},${cy - R*0.40} ${cx + R*0.02},${cy - R*0.35} ${cx + R*0.05},${cy - R*0.18}
            C ${cx + R*0.08},${cy - R*0.05} ${cx - R*0.02},${cy + R*0.05} ${cx - R*0.15},${cy + R*0.08}
            C ${cx - R*0.28},${cy + R*0.12} ${cx - R*0.38},${cy + R*0.05} ${cx - R*0.38},${cy - R*0.08}
            Z
          `} fill="#3d2255" opacity="0.8"/>

          {/* Small companion rock */}
          <ellipse cx={cx + R*0.28} cy={cy - R*0.18} rx={R*0.10} ry={R*0.08}
            fill="#1e1030" stroke="rgba(100,60,160,0.40)" strokeWidth="0.8"
            transform={`rotate(-20,${cx + R*0.28},${cy - R*0.18})`}/>

          {/* Purple atmospheric haze over rock */}
          <ellipse cx={cx - R*0.18} cy={cy + R*0.05} rx={R*0.45} ry={R*0.38}
            fill="rgba(120,50,200,0.18)"/>
        </g>

        {/* Ring system */}
        <circle cx={cx} cy={cy} r={R + 8}
          fill="none" stroke={ringColor}
          strokeWidth={hovered ? "1.0" : "0.65"}
          strokeOpacity={hovered ? 0.70 : 0.35}/>
        <circle cx={cx} cy={cy} r={R + 20}
          fill="none" stroke={ringColor}
          strokeWidth={hovered ? "1.4" : "0.90"}
          strokeOpacity={hovered ? 0.88 : 0.42}/>
        {Array.from({ length: 16 }, (_, i) => {
          const angle = (i/16)*Math.PI*2 - Math.PI/2;
          const isMajor = i % 2 === 0;
          const len = isMajor ? 9 : 4;
          return <line key={i}
            x1={cx + Math.cos(angle)*(R+20)} y1={cy + Math.sin(angle)*(R+20)}
            x2={cx + Math.cos(angle)*(R+20+len)} y2={cy + Math.sin(angle)*(R+20+len)}
            stroke={ringColor}
            strokeWidth={isMajor ? (hovered?1.4:0.9) : (hovered?0.8:0.5)}
            strokeOpacity={isMajor ? (hovered?0.88:0.42) : (hovered?0.55:0.28)}/>;
        })}
        {[0,1,2,3].map(i => {
          const angle = (i/4)*Math.PI*2 - Math.PI/2;
          const nx = cx + Math.cos(angle)*(R+8);
          const ny = cy + Math.sin(angle)*(R+8);
          const d = 4.5;
          return <polygon key={i}
            points={`${nx},${ny-d} ${nx+d},${ny} ${nx},${ny+d} ${nx-d},${ny}`}
            fill={ringColor} opacity={hovered ? 0.90 : 0.42}/>;
        })}
      </svg>
    </div>
  );
}

// ─── Planet texture URLs (CC BY 4.0 — Solar System Scope / solarsystemscope.com) ──
// Attribution: Solar System Scope, https://solarsystemscope.com/textures
const PLANET_TEXTURES = {
  earth:  "https://upload.wikimedia.org/wikipedia/commons/0/04/Solarsystemscope_texture_8k_earth_daymap.jpg",
  mars:   "https://upload.wikimedia.org/wikipedia/commons/7/70/Solarsystemscope_texture_8k_mars.jpg",
  moon:   "https://upload.wikimedia.org/wikipedia/commons/d/d1/Solarsystemscope_texture_8k_moon.jpg",
  venus:  "https://upload.wikimedia.org/wikipedia/commons/1/1c/Solarsystemscope_texture_8k_venus_surface.jpg",
};

// Preload all textures immediately so they're cached before the user enters
Object.values(PLANET_TEXTURES).forEach(url => {
  const img = new Image();
  img.src = url;
});

// ─── PlanetSphere — real photo textures ──────────────────────────────────────
function PlanetSphere({ planet, hovered }) {
  const { size, glowColor, id, isTower,
          highlightColor = "#888", shadowColor = "#111" } = planet;
  const R = size / 2;

  const textureUrl = PLANET_TEXTURES[id];

  // Unique IDs per planet to avoid SVG filter collisions
  const glowId = `glow-${id}`;
  const clipId = `clip-${id}`;

  return (
    <div
      className={`planet-sphere${hovered ? " planet-sphere-hover" : ""}`}
      style={{ width: size, height: size, position: "relative", flexShrink: 0 }}
    >
      {/* ── Texture image — scrolls horizontally to simulate rotation ── */}
      {textureUrl && (
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%", overflow: "hidden",
        }}>
          <img
            src={textureUrl}
            alt={id}
            style={{
              // Image is 2:1 ratio (equirectangular). We show it at 200% width
              // so it wraps around. Animate translateX to spin only on hover.
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "200%",
              objectFit: "cover",
              animation: hovered
                ? "textureSpin 12s linear infinite"
                : "none",
              imageRendering: "auto",
            }}
            loading="eager"
          />
        </div>
      )}

      {/* ── Tower: The Traveler — cream sphere with orbital rings and scar ── */}
      {isTower && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
          // Cream/off-white base with subtle shading
          background: `radial-gradient(circle at 40% 35%,
            #f5f2e8 0%,
            #eae6d4 25%,
            #d8d4c0 50%,
            #b8b4a0 72%,
            #888070 88%,
            #504840 100%)`,
        }}>
          <svg width={size} height={size} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <clipPath id={`tc-${id}`}><circle cx={R} cy={R} r={R-0.5}/></clipPath>
            </defs>
            <g clipPath={`url(#tc-${id})`} fill="none">

              {/* ── Large overlapping elliptical rings on surface ── */}
              {/* Ring 1 — tilted upper-left to lower-right */}
              <ellipse cx={R*0.85} cy={R*0.75} rx={R*0.82} ry={R*0.55}
                stroke="rgba(40,35,28,0.55)" strokeWidth="1.8"
                transform={`rotate(-25,${R*0.85},${R*0.75})`}/>
              {/* Ring 2 — tilted opposite direction */}
              <ellipse cx={R*1.10} cy={R*0.90} rx={R*0.78} ry={R*0.52}
                stroke="rgba(40,35,28,0.50)" strokeWidth="1.6"
                transform={`rotate(20,${R*1.10},${R*0.90})`}/>
              {/* Ring 3 — more vertical */}
              <ellipse cx={R*0.95} cy={R*1.05} rx={R*0.60} ry={R*0.88}
                stroke="rgba(40,35,28,0.45)" strokeWidth="1.5"
                transform={`rotate(-10,${R*0.95},${R*1.05})`}/>
              {/* Ring 4 — wide horizontal */}
              <ellipse cx={R} cy={R*1.15} rx={R*0.90} ry={R*0.42}
                stroke="rgba(40,35,28,0.40)" strokeWidth="1.4"
                transform={`rotate(8,${R},${R*1.15})`}/>
              {/* Ring 5 — small upper */}
              <ellipse cx={R*0.75} cy={R*0.60} rx={R*0.48} ry={R*0.32}
                stroke="rgba(40,35,28,0.35)" strokeWidth="1.2"
                transform={`rotate(-35,${R*0.75},${R*0.60})`}/>

              {/* ── Dark scar region — bottom center, jagged ── */}
              {/* Main dark mass */}
              <path d={`
                M ${R*0.55},${R*1.55}
                C ${R*0.60},${R*1.42} ${R*0.68},${R*1.38} ${R*0.72},${R*1.30}
                L ${R*0.78},${R*1.22} L ${R*0.82},${R*1.28}
                L ${R*0.88},${R*1.18} L ${R*0.92},${R*1.25}
                L ${R*0.98},${R*1.15} L ${R*1.02},${R*1.22}
                L ${R*1.08},${R*1.12} L ${R*1.12},${R*1.20}
                L ${R*1.18},${R*1.14} L ${R*1.22},${R*1.28}
                L ${R*1.28},${R*1.22} L ${R*1.32},${R*1.35}
                C ${R*1.38},${R*1.42} ${R*1.42},${R*1.52} ${R*1.45},${R*1.62}
                C ${R*1.35},${R*1.72} ${R*1.15},${R*1.80} ${R},${R*1.82}
                C ${R*0.85},${R*1.80} ${R*0.65},${R*1.72} ${R*0.55},${R*1.62}
                Z
              `} fill="rgba(45,40,32,0.82)"/>

              {/* Jagged spires rising from scar */}
              <path d={`M ${R*0.92},${R*1.22} L ${R*0.90},${R*1.05} L ${R*0.94},${R*1.18} L ${R*0.96},${R*1.02} L ${R*1.00},${R*1.15} Z`}
                fill="rgba(45,40,32,0.75)"/>
              <path d={`M ${R*1.05},${R*1.18} L ${R*1.04},${R*1.04} L ${R*1.08},${R*1.14} L ${R*1.10},${R*1.00} L ${R*1.14},${R*1.12} Z`}
                fill="rgba(45,40,32,0.70)"/>
              <path d={`M ${R*1.18},${R*1.20} L ${R*1.17},${R*1.08} L ${R*1.20},${R*1.16} L ${R*1.22},${R*1.06} L ${R*1.25},${R*1.18} Z`}
                fill="rgba(45,40,32,0.65)"/>

              {/* Left side damage */}
              <path d={`M ${R*0.62},${R*1.45} L ${R*0.58},${R*1.32} L ${R*0.62},${R*1.40} L ${R*0.64},${R*1.28} L ${R*0.68},${R*1.38} Z`}
                fill="rgba(45,40,32,0.60)"/>

              {/* ── Scattered dark fragments/dots across surface ── */}
              {[
                [0.38,0.42,3.5,2.5,-15], [0.32,0.55,5,2,-8],
                [0.28,0.62,4,1.8,10],    [0.35,0.70,3,2,5],
                [1.45,0.48,4,2.5,20],    [1.50,0.55,3,1.8,-12],
                [1.42,0.62,5,2,8],       [0.55,0.35,3,1.5,-20],
                [0.72,0.28,2.5,1.5,15],  [1.20,0.32,3,1.8,-10],
                [1.30,0.42,2.5,1.5,5],   [0.80,0.38,2,1.2,0],
                [1.05,0.30,2,1.2,12],    [0.65,0.48,1.8,1,0],
                [1.35,0.58,2,1.2,-8],
              ].map(([x,y,rx2,ry2,rot],i) => (
                <ellipse key={i}
                  cx={R*x} cy={R*y} rx={rx2} ry={ry2}
                  fill="rgba(40,35,28,0.55)"
                  transform={`rotate(${rot},${R*x},${R*y})`}/>
              ))}

              {/* ── Subtle shading — right and bottom darker ── */}
              <ellipse cx={R*1.35} cy={R*1.20} rx={R*0.75} ry={R*0.65}
                fill="rgba(60,55,45,0.18)"/>
            </g>
          </svg>
        </div>
      )}

      {/* ── SVG overlays: terminator, specular, glow, outline ── */}
      <svg
        width={size} height={size}
        style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx={R} cy={R} r={R - 0.5}/>
          </clipPath>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={hovered ? "10" : "6"} result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* Day/night terminator — linear sweep, dark side blends into bg #080a0f */}
          <linearGradient id={`term-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(8,10,15,0)"/>
            <stop offset="30%"  stopColor="rgba(8,10,15,0)"/>
            <stop offset="55%"  stopColor="rgba(8,10,15,0.45)"/>
            <stop offset="72%"  stopColor="rgba(8,10,15,0.82)"/>
            <stop offset="85%"  stopColor="rgba(8,10,15,0.96)"/>
            <stop offset="100%" stopColor="rgba(8,10,15,1.0)"/>
          </linearGradient>

          {/* Day-side warm light — subtle brightening on the lit half */}
          <radialGradient id={`day-${id}`} cx="28%" cy="35%" r="55%">
            <stop offset="0%"   stopColor="rgba(255,245,220,0.18)"/>
            <stop offset="50%"  stopColor="rgba(255,240,200,0.06)"/>
            <stop offset="100%" stopColor="rgba(255,240,200,0)"/>
          </radialGradient>

          {/* Specular highlight */}
          <radialGradient id={`spec-${id}`} cx="28%" cy="26%" r="32%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.45)"/>
            <stop offset="55%"  stopColor="rgba(255,255,255,0.10)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </radialGradient>

          {/* Atmosphere rim */}
          <radialGradient id={`atmo-${id}`} cx="50%" cy="50%" r="50%">
            <stop offset="78%"  stopColor="rgba(0,0,0,0)"/>
            <stop offset="92%"  stopColor={glowColor.replace(/[\d.]+\)$/, "0.12)")}/>
            <stop offset="100%" stopColor={glowColor.replace(/[\d.]+\)$/, "0.40)")}/>
          </radialGradient>
        </defs>

        {/* Outer glow ring */}
        <circle cx={R} cy={R} r={R + 5}
          fill="none"
          stroke={glowColor}
          strokeWidth={hovered ? "20" : "12"}
          strokeOpacity={hovered ? "0.42" : "0.18"}
          filter={`url(#${glowId})`}
        />

        {/* Day-side warm brightening */}
        <circle cx={R} cy={R} r={R - 0.5}
          fill={`url(#day-${id})`}
          clipPath={`url(#${clipId})`}
        />

        {/* Night-side terminator — sweeps across, blends into background */}
        <circle cx={R} cy={R} r={R - 0.5}
          fill={`url(#term-${id})`}
          clipPath={`url(#${clipId})`}
        />

        {/* Specular highlight — top-left */}
        <circle cx={R} cy={R} r={R - 0.5}
          fill={`url(#spec-${id})`}
          clipPath={`url(#${clipId})`}
        />

        {/* Atmosphere rim */}
        <circle cx={R} cy={R} r={R - 0.5}
          fill={`url(#atmo-${id})`}
          clipPath={`url(#${clipId})`}
        />

        {/* Ink outline */}
        <circle cx={R} cy={R} r={R - 0.5}
          fill="none"
          stroke={hovered ? "rgba(200,215,235,0.55)" : "rgba(200,215,235,0.28)"}
          strokeWidth={hovered ? "2.0" : "1.2"}
        />
      </svg>
    </div>
  );
}


// ─── Planet wrapper ───────────────────────────────────────────────────────────
function Planet({ planet, index, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const { size, top, left, labelSide, glowColor, isReef, floatDuration, floatDelay } = planet;
  const ringPad = 80;
  const ringSvgSize = size + ringPad * 2;

  return (
    <div
      className="planet-wrapper"
      style={{
        position: "absolute",
        top,
        left,
        transform: "translate(-50%, -50%)",
        zIndex: 10 + index,
        animation: hovered ? `floatPlanet 2.5s ease-in-out infinite` : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect && onSelect(planet)}
    >
      {/* Outer glow halo */}
      <div
        className="planet-halo"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: ringSvgSize * 1.15,
          height: ringSvgSize * 1.15,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle at 50% 50%, ${glowColor} 0%, transparent 65%)`,
          opacity: hovered ? 1 : 0.45,
          transition: "opacity 0.35s ease",
          pointerEvents: "none",
          animation: "haloPulse 5s ease-in-out infinite",
        }}
      />

      {/* Rings SVG — centered behind planet */}
      {!isReef && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <PlanetRings planet={planet} hovered={hovered} />
        </div>
      )}

      {/* Planet body */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {isReef ? (
          <ReefAsteroid planet={planet} hovered={hovered} />
        ) : (
          <PlanetSphere planet={planet} hovered={hovered} />
        )}
      </div>

      {/* Label */}
      <div
        className={`planet-label label-${labelSide}${hovered ? " label-bright" : ""}`}
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          ...(labelSide === "right"
            ? { left: `calc(50% + ${size / 2 + 28}px)` }
            : { right: `calc(50% + ${size / 2 + 28}px)` }),
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 5,
        }}
      >
        {planet.title && <span className="label-title">{planet.title}</span>}
        <span className="label-name">{planet.name}</span>
        <span className="label-sub">{planet.sub}</span>
        <span className="label-data">{planet.data}</span>
      </div>
    </div>
  );
}

// ─── GridOverlay ──────────────────────────────────────────────────────────────
function GridOverlay() {
  // 36 radial lines from center
  const radialLines = Array.from({ length: 36 }, (_, i) => {
    const angle = (i / 36) * Math.PI * 2;
    const isMajor = i % 9 === 0;
    return {
      x2: 512 + Math.cos(angle) * 900,
      y2: 288 + Math.sin(angle) * 900,
      isMajor,
    };
  });

  // 10 concentric circles — more rings, more prominent
  const concentricR = [60, 110, 170, 240, 315, 395, 480, 570, 665, 760];

  // Tick marks on circles (24 per circle)
  const circleTicks = [];
  for (const r of concentricR) {
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const isMajor = i % 6 === 0;
      const r1 = r - (isMajor ? 6 : 3);
      const r2 = r + (isMajor ? 6 : 3);
      circleTicks.push({
        x1: 512 + Math.cos(angle) * r1,
        y1: 288 + Math.sin(angle) * r1,
        x2: 512 + Math.cos(angle) * r2,
        y2: 288 + Math.sin(angle) * r2,
        isMajor,
      });
    }
  }

  // Crosshatch
  const hLines = Array.from({ length: 16 }, (_, i) => ((i + 1) / 17) * 576);
  const vLines = Array.from({ length: 24 }, (_, i) => ((i + 1) / 25) * 1024);

  // Edge ruler ticks
  const topTicks = Array.from({ length: 64 }, (_, i) => ({ x: (i / 64) * 1024, major: i % 8 === 0 }));
  const leftTicks = Array.from({ length: 36 }, (_, i) => ({ y: (i / 36) * 576, major: i % 6 === 0 }));

  return (
    <svg
      className="grid-overlay"
      viewBox="0 0 1024 576"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="gridFade" cx="50%" cy="50%" r="60%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.55" />
          <stop offset="45%"  stopColor="white" stopOpacity="0.75" />
          <stop offset="75%"  stopColor="white" stopOpacity="0.95" />
          <stop offset="100%" stopColor="white" stopOpacity="1.0"  />
        </radialGradient>
        <mask id="gridMask">
          <rect width="1024" height="576" fill="url(#gridFade)" />
        </mask>
      </defs>

      <g mask="url(#gridMask)">
        {/* Radial lines — major brighter */}
        {radialLines.map((l, i) => (
          <line key={`r${i}`} x1="512" y1="288" x2={l.x2} y2={l.y2}
            stroke={l.isMajor ? "rgba(200,215,235,0.22)" : "rgba(200,215,235,0.09)"}
            strokeWidth={l.isMajor ? "0.9" : "0.5"} />
        ))}

        {/* Concentric circles — alternating brightness */}
        {concentricR.map((r, i) => (
          <circle key={`c${i}`} cx="512" cy="288" r={r}
            fill="none"
            stroke={i % 3 === 0 ? "rgba(200,215,235,0.22)" : "rgba(200,215,235,0.10)"}
            strokeWidth={i % 3 === 0 ? "0.9" : "0.55"} />
        ))}

        {/* Circle tick marks */}
        {circleTicks.map((tk, i) => (
          <line key={`ct${i}`}
            x1={tk.x1} y1={tk.y1} x2={tk.x2} y2={tk.y2}
            stroke="rgba(200,215,235,0.28)"
            strokeWidth={tk.isMajor ? 1.0 : 0.5} />
        ))}

        {/* Crosshatch horizontal */}
        {hLines.map((y, i) => (
          <line key={`h${i}`} x1="0" y1={y} x2="1024" y2={y}
            stroke="rgba(200,215,235,0.055)" strokeWidth="0.4" />
        ))}

        {/* Crosshatch vertical */}
        {vLines.map((x, i) => (
          <line key={`v${i}`} x1={x} y1="0" x2={x} y2="576"
            stroke="rgba(200,215,235,0.055)" strokeWidth="0.4" />
        ))}

      </g>
    </svg>
  );
}

// ─── DestinyStarSymbol ────────────────────────────────────────────────────────
function DestinyStarSymbol() {
  // 32 tick marks on outer ring
  const outerTicks = Array.from({ length: 32 }, (_, i) => {
    const angle = (i / 32) * Math.PI * 2 - Math.PI / 2;
    const isMajor = i % 4 === 0;
    return {
      x1: Math.cos(angle) * 50,
      y1: Math.sin(angle) * 50,
      x2: Math.cos(angle) * (isMajor ? 58 : 54),
      y2: Math.sin(angle) * (isMajor ? 58 : 54),
      isMajor,
    };
  });

  // 16 radiating lines between inner rings
  const innerLines = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2 - Math.PI / 2;
    return {
      x1: Math.cos(angle) * 14,
      y1: Math.sin(angle) * 14,
      x2: Math.cos(angle) * 30,
      y2: Math.sin(angle) * 30,
    };
  });

  // 4 elongated N/S/E/W spikes
  const cardinalSpikes = [0, 1, 2, 3].map((i) => {
    const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
    const tipX = Math.cos(angle) * 62;
    const tipY = Math.sin(angle) * 62;
    const perpAngle = angle + Math.PI / 2;
    const baseW = 2.5;
    const baseR = 22;
    const b1x = Math.cos(angle) * baseR + Math.cos(perpAngle) * baseW;
    const b1y = Math.sin(angle) * baseR + Math.sin(perpAngle) * baseW;
    const b2x = Math.cos(angle) * baseR - Math.cos(perpAngle) * baseW;
    const b2y = Math.sin(angle) * baseR - Math.sin(perpAngle) * baseW;
    return `M${b1x},${b1y} L${tipX},${tipY} L${b2x},${b2y} Z`;
  });

  // 4 shorter diagonal spikes at 45°
  const diagSpikes = [0, 1, 2, 3].map((i) => {
    const angle = (i / 4) * Math.PI * 2 - Math.PI / 4;
    const tipX = Math.cos(angle) * 42;
    const tipY = Math.sin(angle) * 42;
    const perpAngle = angle + Math.PI / 2;
    const baseW = 1.5;
    const baseR = 16;
    const b1x = Math.cos(angle) * baseR + Math.cos(perpAngle) * baseW;
    const b1y = Math.sin(angle) * baseR + Math.sin(perpAngle) * baseW;
    const b2x = Math.cos(angle) * baseR - Math.cos(perpAngle) * baseW;
    const b2y = Math.sin(angle) * baseR - Math.sin(perpAngle) * baseW;
    return `M${b1x},${b1y} L${tipX},${tipY} L${b2x},${b2y} Z`;
  });

  // Diamond markers at cardinal tips
  const cardinalDiamonds = [0, 1, 2, 3].map((i) => {
    const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
    const r = 66;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    const s = 3;
    return `M${px},${py - s} L${px + s},${py} L${px},${py + s} L${px - s},${py} Z`;
  });

  const color = "rgba(200,215,235,0.35)";

  return (
    <svg
      className="destiny-star"
      width="260"
      height="260"
      viewBox="-65 -65 130 130"
      style={{
        position: "absolute",
        top: "-130px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      {/* 5 concentric circles */}
      {[12, 22, 32, 44, 56].map((r, i) => (
        <circle key={i} cx="0" cy="0" r={r} fill="none" stroke={color} strokeWidth="0.8" />
      ))}

      {/* 16 inner radiating lines */}
      {innerLines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={color} strokeWidth="0.6" />
      ))}

      {/* 4 elongated cardinal spikes */}
      {cardinalSpikes.map((d, i) => (
        <path key={i} d={d} fill={color} />
      ))}

      {/* 4 shorter diagonal spikes */}
      {diagSpikes.map((d, i) => (
        <path key={i} d={d} fill={color} />
      ))}

      {/* 32 outer tick marks */}
      {outerTicks.map((tk, i) => (
        <line key={i} x1={tk.x1} y1={tk.y1} x2={tk.x2} y2={tk.y2}
          stroke={color} strokeWidth={tk.isMajor ? 1 : 0.5} />
      ))}

      {/* Diamond markers at cardinal tips */}
      {cardinalDiamonds.map((d, i) => (
        <path key={i} d={d} fill={color} />
      ))}
    </svg>
  );
}

// ─── VanguardBadge — shield with 3 chevrons, blue-grey ───────────────────────
function VanguardBadge({ onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="ui-badge vanguard-badge"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect && onSelect({
        id: "vanguard",
        title: "Education",
        name: "VANGUARD",
        sub: "Guardians of the City",
        data: "FACTION · ALLIED",
        slides: [
          "- Ontario Tech University\n- Bachelor of Science (Honours) in Computer Science & Co-op\n- 2023 – 2027\n- Honor Roll student",
          "- Relevant Coursework:\n- Artificial Intelligence\n- Software Design & Analysis\n- Digital Media\n- Technical Communications",
        ],
      })}
      style={{
        position: "absolute", left: "80%", top: "5%",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 6, zIndex: 20, cursor: "pointer",
        transform: hovered ? "scale(1.06)" : "scale(1)",
        transition: "transform 0.25s ease",
        filter: hovered ? "drop-shadow(0 0 12px rgba(160,200,255,0.60))" : "none",
      }}>
      <svg width="110" height="110" viewBox="0 0 60 60">
        {/* Outer ring */}
        <circle cx="30" cy="30" r="28" fill="none"
          stroke="rgba(140,175,220,0.55)" strokeWidth="1.2"/>
        {/* Inner ring */}
        <circle cx="30" cy="30" r="22" fill="none"
          stroke="rgba(140,175,220,0.30)" strokeWidth="0.8"/>
        {/* Shield body */}
        <path d="M30,8 L50,15 L50,32 C50,43 40,51 30,55 C20,51 10,43 10,32 L10,15 Z"
          fill="rgba(15,35,65,0.70)" stroke="rgba(140,175,220,0.80)" strokeWidth="1.4"
          strokeLinejoin="round"/>
        {/* Inner shield line */}
        <path d="M30,12 L46,18 L46,32 C46,41 37,48 30,51 C23,48 14,41 14,32 L14,18 Z"
          fill="none" stroke="rgba(140,175,220,0.25)" strokeWidth="0.7"/>
        {/* 3 rank chevrons — pointing up */}
        <polyline points="18,38 30,30 42,38"
          fill="none" stroke="rgba(160,200,255,0.90)" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/>
        <polyline points="18,44 30,36 42,44"
          fill="none" stroke="rgba(160,200,255,0.72)" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
        <polyline points="18,50 30,42 42,50"
          fill="none" stroke="rgba(160,200,255,0.52)" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/>
        {/* Top dot / gem */}
        <circle cx="30" cy="19" r="2.5" fill="rgba(160,200,255,0.70)"/>
        {/* Tick marks on outer ring */}
        {Array.from({length:24},(_,i)=>{
          const a=(i/24)*Math.PI*2-Math.PI/2;
          const isMaj=i%6===0;
          return <line key={i}
            x1={30+Math.cos(a)*24} y1={30+Math.sin(a)*24}
            x2={30+Math.cos(a)*(isMaj?27:25.5)} y2={30+Math.sin(a)*(isMaj?27:25.5)}
            stroke="rgba(140,175,220,0.45)" strokeWidth={isMaj?"1.0":"0.5"}/>;
        })}
      </svg>
      <span style={{
        fontFamily:"'Barlow Condensed',sans-serif", fontSize:9,
        fontWeight:700, letterSpacing:2.5, textTransform:"uppercase",
        color:"rgba(220,235,255,0.90)", marginBottom: 2,
        textShadow: "0 0 3px rgba(0,0,0,0.16)",
      }}>Education</span>
      <span style={{
        fontFamily:"'Barlow Condensed',sans-serif", fontSize:11,
        letterSpacing:4, textTransform:"uppercase", color:"rgba(160,200,255,0.65)",
      }}>VANGUARD</span>
    </div>
  );
}

// ─── CrucibleBadge — circle with crossed swords, warm brown ──────────────────
function CrucibleBadge({ onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="ui-badge crucible-badge"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect && onSelect({
        id: "crucible",
        title: "Achievements",
        name: "CRUCIBLE",
        sub: "The Proving Ground",
        data: "PVP · COMPETITIVE",
        slides: [
          "- Honor Roll student\n- Multiple software projects completed\n- Multiplayer game development\n- Raspberry Pi hardware experience",
          "- Creative media production\n- NFT procedural asset design\n- Destiny-inspired interactive portfolio\n- Strong written and verbal communication\n- Fluent in English, Urdu, Hindi, Pashto (conversational), Punjabi (conversational)",
          "- Experience leading and teaching students\n- Comfortable working in teams, mentoring others, and presenting technical ideas clearly",
        ],
      })}
      style={{
        position: "absolute", left: "70%", top: "20%",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 6, zIndex: 20, cursor: "pointer",
        transform: hovered ? "scale(1.06)" : "scale(1)",
        transition: "transform 0.25s ease",
        filter: hovered ? "drop-shadow(0 0 12px rgba(200,130,60,0.60))" : "none",
      }}>
      <svg width="146" height="146" viewBox="0 0 80 80">
        {/* Outer ring */}
        <circle cx="40" cy="40" r="37" fill="none"
          stroke="rgba(180,110,50,0.65)" strokeWidth="1.4"/>
        {/* Second ring */}
        <circle cx="40" cy="40" r="31" fill="none"
          stroke="rgba(180,110,50,0.35)" strokeWidth="0.8"/>
        {/* Dark fill */}
        <circle cx="40" cy="40" r="30" fill="rgba(30,14,5,0.75)"/>
        {/* Inner decorative ring */}
        <circle cx="40" cy="40" r="24" fill="none"
          stroke="rgba(180,110,50,0.28)" strokeWidth="0.7"/>

        {/* Sword 1 — top-left to bottom-right */}
        {/* Blade */}
        <line x1="18" y1="18" x2="62" y2="62"
          stroke="rgba(210,145,70,0.90)" strokeWidth="2.8" strokeLinecap="round"/>
        {/* Guard (crossguard) */}
        <line x1="24" y1="32" x2="32" y2="24"
          stroke="rgba(210,145,70,0.75)" strokeWidth="2.2" strokeLinecap="round"/>
        {/* Pommel */}
        <circle cx="18" cy="18" r="3" fill="rgba(210,145,70,0.85)"/>
        {/* Tip detail */}
        <circle cx="62" cy="62" r="1.5" fill="rgba(210,145,70,0.60)"/>

        {/* Sword 2 — top-right to bottom-left */}
        <line x1="62" y1="18" x2="18" y2="62"
          stroke="rgba(210,145,70,0.90)" strokeWidth="2.8" strokeLinecap="round"/>
        <line x1="56" y1="32" x2="48" y2="24"
          stroke="rgba(210,145,70,0.75)" strokeWidth="2.2" strokeLinecap="round"/>
        <circle cx="62" cy="18" r="3" fill="rgba(210,145,70,0.85)"/>
        <circle cx="18" cy="62" r="1.5" fill="rgba(210,145,70,0.60)"/>

        {/* Center gem where swords cross */}
        <circle cx="40" cy="40" r="4.5"
          fill="rgba(210,145,70,0.80)" stroke="rgba(255,190,110,0.70)" strokeWidth="1.2"/>
        <circle cx="40" cy="40" r="2" fill="rgba(255,210,140,0.90)"/>

        {/* Decorative S-curve on sword handles (matching image detail) */}
        <path d="M22,22 C26,18 30,22 26,26" fill="none"
          stroke="rgba(210,145,70,0.55)" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M58,22 C54,18 50,22 54,26" fill="none"
          stroke="rgba(210,145,70,0.55)" strokeWidth="1.2" strokeLinecap="round"/>

        {/* Tick marks on outer ring */}
        {Array.from({length:24},(_,i)=>{
          const a=(i/24)*Math.PI*2-Math.PI/2;
          const isMaj=i%6===0;
          return <line key={i}
            x1={40+Math.cos(a)*32} y1={40+Math.sin(a)*32}
            x2={40+Math.cos(a)*(isMaj?36:34)} y2={40+Math.sin(a)*(isMaj?36:34)}
            stroke="rgba(180,110,50,0.50)" strokeWidth={isMaj?"1.2":"0.6"}/>;
        })}
      </svg>
      <span style={{
        fontFamily:"'Barlow Condensed',sans-serif", fontSize:9,
        fontWeight:700, letterSpacing:2.5, textTransform:"uppercase",
        color:"rgba(240,220,160,0.95)", marginBottom: 2,
        textShadow: "0 0 3px rgba(0,0,0,0.16)",
      }}>Achievements</span>
      <span style={{
        fontFamily:"'Barlow Condensed',sans-serif", fontSize:11,
        letterSpacing:4, textTransform:"uppercase", color:"rgba(200,130,60,0.65)",
      }}>CRUCIBLE</span>
    </div>
  );
}

// ─── HourglassIcon — detailed animated canvas hourglass ──────────────────────
function HourglassIcon({ onClick }) {
  const canvasRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);

  // Keep a ref in sync so the canvas loop can read it without re-running useEffect
  useEffect(() => { hoveredRef.current = hovered; }, [hovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;

    // Geometry
    const topY  = H * 0.10;
    const botY  = H * 0.90;
    const neckY = H * 0.50;
    const neckW = W * 0.055;
    const topW  = W * 0.40;
    const frameP = 5;

    // Helper: x-width of hourglass at a given y
    const hgWidth = (y) => {
      if (y <= neckY) {
        return neckW + (topW - neckW) * ((neckY - y) / (neckY - topY));
      } else {
        return neckW + (topW - neckW) * ((y - neckY) / (botY - neckY));
      }
    };

    // Sand particles — stream through neck with spread & gravity
    const PCOUNT = 40;
    const particles = Array.from({ length: PCOUNT }, (_, i) => ({
      x: cx + (Math.random() - 0.5) * neckW * 2,
      y: neckY + Math.random() * (botY - neckY) * 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: 0.12 + Math.random() * 0.25,
      r:  0.7 + Math.random() * 1.3,
      alpha: 0.55 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
    }));

    // Cycle t: 0→1 over ~6s
    let t = 0;
    let animId;
    let frame = 0;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      // Only advance time when hovered — freeze at t=0 when idle
      if (hoveredRef.current) {
        t += 0.0006;
        if (t > 1) t = 0;
      }
      frame++;

      ctx.clearRect(0, 0, W, H);

      const c  = (a) => `rgba(180,210,255,${a})`;
      const cg = (a) => `rgba(140,175,240,${a})`;
      const cs = (a) => `rgba(200,225,255,${a})`;  // sand highlight

      // ── Outer frame with corner details ──
      ctx.strokeStyle = c(0.50);
      ctx.lineWidth = 1.8;
      ctx.strokeRect(frameP, frameP, W - frameP*2, H - frameP*2);

      // Corner L-marks
      const mk = 12;
      ctx.strokeStyle = c(0.40);
      ctx.lineWidth = 1.2;
      const corners = [
        [frameP, frameP+mk, frameP, frameP, frameP+mk, frameP],
        [W-frameP, frameP+mk, W-frameP, frameP, W-frameP-mk, frameP],
        [frameP, H-frameP-mk, frameP, H-frameP, frameP+mk, H-frameP],
        [W-frameP, H-frameP-mk, W-frameP, H-frameP, W-frameP-mk, H-frameP],
      ];
      corners.forEach(([x1,y1,x2,y2,x3,y3]) => {
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.lineTo(x3,y3); ctx.stroke();
      });

      // Inner frame ring
      ctx.strokeStyle = c(0.12);
      ctx.lineWidth = 0.8;
      ctx.strokeRect(frameP+5, frameP+5, W-frameP*2-10, H-frameP*2-10);

      // Tick marks along inner frame edges
      for (let i = 0; i <= 8; i++) {
        const x = (frameP+8) + i * ((W-frameP*2-16)/8);
        const len = i % 4 === 0 ? 5 : 3;
        ctx.strokeStyle = c(i % 4 === 0 ? 0.35 : 0.18);
        ctx.lineWidth = i % 4 === 0 ? 1.0 : 0.6;
        ctx.beginPath(); ctx.moveTo(x, frameP+5); ctx.lineTo(x, frameP+5+len); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, H-frameP-5); ctx.lineTo(x, H-frameP-5-len); ctx.stroke();
      }
      for (let i = 0; i <= 6; i++) {
        const y = (frameP+8) + i * ((H-frameP*2-16)/6);
        const len = i % 3 === 0 ? 5 : 3;
        ctx.strokeStyle = c(i % 3 === 0 ? 0.35 : 0.18);
        ctx.lineWidth = i % 3 === 0 ? 1.0 : 0.6;
        ctx.beginPath(); ctx.moveTo(frameP+5, y); ctx.lineTo(frameP+5+len, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W-frameP-5, y); ctx.lineTo(W-frameP-5-len, y); ctx.stroke();
      }

      // ── Hourglass glass walls (curved path) ──
      const drawGlass = () => {
        ctx.beginPath();
        ctx.moveTo(cx - topW, topY);
        ctx.bezierCurveTo(cx - topW*0.6, topY + (neckY-topY)*0.5,
                          cx - neckW*1.8, neckY - (neckY-topY)*0.15,
                          cx - neckW, neckY);
        ctx.bezierCurveTo(cx - neckW*1.8, neckY + (botY-neckY)*0.15,
                          cx - topW*0.6, botY - (botY-neckY)*0.5,
                          cx - topW, botY);
        ctx.lineTo(cx + topW, botY);
        ctx.bezierCurveTo(cx + topW*0.6, botY - (botY-neckY)*0.5,
                          cx + neckW*1.8, neckY + (botY-neckY)*0.15,
                          cx + neckW, neckY);
        ctx.bezierCurveTo(cx + neckW*1.8, neckY - (neckY-topY)*0.15,
                          cx + topW*0.6, topY + (neckY-topY)*0.5,
                          cx + topW, topY);
        ctx.closePath();
      };

      // Glass fill (very subtle)
      drawGlass();
      ctx.fillStyle = c(0.03);
      ctx.fill();

      // Glass stroke
      drawGlass();
      ctx.strokeStyle = c(0.55);
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Glass inner highlight (left edge shimmer)
      ctx.beginPath();
      ctx.moveTo(cx - topW + 4, topY + 4);
      ctx.bezierCurveTo(cx - topW*0.55, topY + (neckY-topY)*0.5,
                        cx - neckW*1.6, neckY - (neckY-topY)*0.1,
                        cx - neckW + 1, neckY);
      ctx.strokeStyle = c(0.18);
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // ── Cap bars ──
      const capGrad = ctx.createLinearGradient(cx-topW-3, 0, cx+topW+3, 0);
      capGrad.addColorStop(0,   c(0.20));
      capGrad.addColorStop(0.5, c(0.90));
      capGrad.addColorStop(1,   c(0.20));
      ctx.strokeStyle = capGrad;
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx-topW-3, topY); ctx.lineTo(cx+topW+3, topY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx-topW-3, botY); ctx.lineTo(cx+topW+3, botY); ctx.stroke();

      // Cap inner lines
      ctx.strokeStyle = c(0.30);
      ctx.lineWidth = 1.0;
      ctx.beginPath(); ctx.moveTo(cx-topW+2, topY+3); ctx.lineTo(cx+topW-2, topY+3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx-topW+2, botY-3); ctx.lineTo(cx+topW-2, botY-3); ctx.stroke();

      // ── Sand in top chamber ──
      const topFill = 1 - t;
      if (topFill > 0.005) {
        const chamH = neckY - topY;
        const sandY = neckY - chamH * topFill;
        const wTop  = hgWidth(sandY);

        // Clip to top chamber
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx - topW, topY);
        ctx.bezierCurveTo(cx-topW*0.6, topY+(neckY-topY)*0.5, cx-neckW*1.8, neckY-(neckY-topY)*0.15, cx-neckW, neckY);
        ctx.lineTo(cx+neckW, neckY);
        ctx.bezierCurveTo(cx+neckW*1.8, neckY-(neckY-topY)*0.15, cx+topW*0.6, topY+(neckY-topY)*0.5, cx+topW, topY);
        ctx.closePath();
        ctx.clip();

        // Sand body gradient
        const sg = ctx.createLinearGradient(cx, sandY, cx, neckY);
        sg.addColorStop(0,   c(0.06));
        sg.addColorStop(0.4, c(0.22));
        sg.addColorStop(1,   c(0.38));
        ctx.fillStyle = sg;
        ctx.fillRect(cx - topW - 2, sandY, topW*2 + 4, neckY - sandY + 2);

        // Sand surface — wavy line
        ctx.beginPath();
        ctx.moveTo(cx - wTop, sandY);
        for (let xi = -wTop; xi <= wTop; xi += 2) {
          const wave = Math.sin((xi / wTop) * Math.PI * 3 + frame * 0.04) * 1.2;
          ctx.lineTo(cx + xi, sandY + wave);
        }
        ctx.strokeStyle = cs(0.55);
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Sand texture dots
        for (let di = 0; di < 12; di++) {
          const dx = cx + (Math.sin(di * 2.3 + t * 5) * wTop * 0.7);
          const dy = sandY + 4 + (di / 12) * (neckY - sandY - 6);
          ctx.beginPath();
          ctx.arc(dx, dy, 0.8, 0, Math.PI*2);
          ctx.fillStyle = cs(0.25);
          ctx.fill();
        }

        ctx.restore();
      }

      // ── Sand in bottom chamber ──
      const botFill = t;
      if (botFill > 0.005) {
        const chamH = botY - neckY;
        const sandTopY = botY - chamH * botFill;
        const wBot = hgWidth(sandTopY);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx-neckW, neckY);
        ctx.bezierCurveTo(cx-neckW*1.8, neckY+(botY-neckY)*0.15, cx-topW*0.6, botY-(botY-neckY)*0.5, cx-topW, botY);
        ctx.lineTo(cx+topW, botY);
        ctx.bezierCurveTo(cx+topW*0.6, botY-(botY-neckY)*0.5, cx+neckW*1.8, neckY+(botY-neckY)*0.15, cx+neckW, neckY);
        ctx.closePath();
        ctx.clip();

        // Sand body
        const bg = ctx.createLinearGradient(cx, neckY, cx, botY);
        bg.addColorStop(0,   c(0.40));
        bg.addColorStop(0.5, c(0.25));
        bg.addColorStop(1,   c(0.12));
        ctx.fillStyle = bg;
        ctx.fillRect(cx - topW - 2, sandTopY, topW*2 + 4, botY - sandTopY + 2);

        // Sand surface — wavy
        ctx.beginPath();
        ctx.moveTo(cx - wBot, sandTopY);
        for (let xi = -wBot; xi <= wBot; xi += 2) {
          const wave = Math.sin((xi / wBot) * Math.PI * 3 - frame * 0.04) * 1.0;
          ctx.lineTo(cx + xi, sandTopY + wave);
        }
        ctx.strokeStyle = cs(0.60);
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Sand texture dots
        for (let di = 0; di < 10; di++) {
          const dx = cx + (Math.cos(di * 1.9 + t * 4) * wBot * 0.65);
          const dy = sandTopY + 4 + (di / 10) * (botY - sandTopY - 8);
          ctx.beginPath();
          ctx.arc(dx, dy, 0.8, 0, Math.PI*2);
          ctx.fillStyle = cs(0.22);
          ctx.fill();
        }

        ctx.restore();
      }

      // ── Falling sand stream ──
      // Clip to hourglass interior
      ctx.save();
      drawGlass();
      ctx.clip();

      particles.forEach((p, i) => {
        // Only move particles when hovered
        if (!hoveredRef.current) return;
        // Gravity + slight horizontal drift
        p.vy += 0.006;
        p.x  += p.vx + Math.sin(frame * 0.03 + p.phase) * 0.15;
        p.y  += p.vy;

        // Constrain x to hourglass width at current y
        const maxX = hgWidth(p.y);
        if (Math.abs(p.x - cx) > maxX - 1) {
          p.vx *= -0.4;
          p.x = cx + Math.sign(p.x - cx) * (maxX - 1);
        }

        // Reset when hitting bottom sand surface or bottom wall
        const botSandY = botFill > 0.005 ? botY - (botY - neckY) * botFill : botY - 2;
        if (p.y >= botSandY - 2) {
          // Respawn at neck
          p.x  = cx + (Math.random() - 0.5) * neckW * 1.8;
          p.y  = neckY - 2;
          p.vx = (Math.random() - 0.5) * 0.5;
          p.vy = 0.5 + Math.random() * 0.8;
        }

        // Only draw if below neck (falling through bottom chamber)
        if (p.y < neckY) return;

        // Fade near top and bottom
        const distFromNeck = (p.y - neckY) / (botY - neckY);
        const fade = Math.min(1, distFromNeck * 6) * Math.min(1, (1 - distFromNeck) * 8);

        // Particle glow
        const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        pg.addColorStop(0, cs(p.alpha * fade));
        pg.addColorStop(1, c(0));
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI*2);
        ctx.fill();

        // Solid core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = cs(p.alpha * fade * 0.9);
        ctx.fill();
      });

      ctx.restore();

      // ── Neck glow ──
      const ng = ctx.createRadialGradient(cx, neckY, 0, cx, neckY, neckW * 5);
      ng.addColorStop(0,   cg(0.55));
      ng.addColorStop(0.4, cg(0.20));
      ng.addColorStop(1,   cg(0));
      ctx.fillStyle = ng;
      ctx.beginPath();
      ctx.arc(cx, neckY, neckW * 5, 0, Math.PI*2);
      ctx.fill();

      // Neck pinch highlight dots
      ctx.fillStyle = cs(0.70);
      ctx.beginPath(); ctx.arc(cx - neckW, neckY, 1.5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + neckW, neckY, 1.5, 0, Math.PI*2); ctx.fill();

      // ── Decorative small circles at cap corners ──
      [cx - topW, cx + topW].forEach(x => {
        [topY, botY].forEach(y => {
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI*2);
          ctx.strokeStyle = c(0.55);
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      className="ui-badge"
      onClick={onClick}
      style={{
        position: "absolute",
        top: 24,
        left: 24,
        zIndex: 20,
        pointerEvents: "auto",
        cursor: "pointer",
        animation: "fadeInUp 2s ease forwards",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <canvas ref={canvasRef} width={90} height={110}
        style={{ display: "block" }} />
      <div style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 9,
        letterSpacing: 3,
        color: "rgba(180,210,255,0.45)",
        textTransform: "uppercase",
      }}>TIMELINE</div>
    </div>
  );
}

function TimelinePanel({ onClose }) {
  const timeline = [
    { time: "2301.7", title: "First Explorer Pulse", description: "Discovery of the outer reef and the beginning of the uncharted age.", note: "Guardians began mapping the sector and establishing orbital waypoints for safe travel." },
    { time: "2312.2", title: "Settlement Beacon", description: "The first orbital cities were established over the gas giants.", note: "Civilization expanded with early data networks, research hubs, and layered defenses." },
    { time: "2320.4", title: "Data Convergence", description: "A network of allied systems came online, fusing sensor grids and mission telemetry.", note: "Infrastructure matured and the Tower began coordinating Guardian operations." },
    { time: "2324.9", title: "Lost Signal", description: "A mysterious transmission sparked the search for the traveler.", note: "Scouts followed fragmented coordinates into the outer reef while rumors spread." },
    { time: "2336.5", title: "Tower Rise", description: "The Traveler established the Tower as a stronghold and beacon.", note: "A centralized command hub formed, giving Guardians purpose and unified strategy." },
    { time: "2341.8", title: "Ghost Forge", description: "Guardians began customizing gear and refining tactical approaches.", note: "Training evolved into specialized roles for offense, support, and exploration missions." },
    { time: "2348.3", title: "Cosmic Rift", description: "The reef fractured and the timeline splintered across the system.", note: "New challenges emerged as the environment became unstable and rival factions moved in." },
    { time: "2357.1", title: "Current Age", description: "Guardians patrol the map while factions vie for control.", note: "The present day is a blend of legacy systems, modern tech, and ongoing discovery." },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(4, 6, 12, 0.92)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        cursor: "pointer",
        animation: "simpleFade 0.3s ease forwards",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "min(1000px, 92vw)",
          maxHeight: "88vh",
          overflow: "auto",
          background: "rgba(12, 18, 30, 0.96)",
          border: "1px solid rgba(160, 195, 240, 0.18)",
          borderRadius: 22,
          padding: "32px 36px",
          boxShadow: "0 0 120px rgba(0, 0, 0, 0.50)",
          cursor: "default",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}>
          <div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 32,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "rgba(210, 235, 255, 0.95)",
              marginBottom: 8,
            }}>TIMELINE</div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 13,
              letterSpacing: 2.5,
              color: "rgba(170, 200, 235, 0.70)",
              textTransform: "uppercase",
            }}>System History • Evolution of the world</div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "rgba(255, 255, 255, 0.10)",
              color: "rgba(210, 235, 255, 0.95)",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 11,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              padding: "10px 18px",
              borderRadius: 999,
              cursor: "pointer",
              transition: "background 0.25s ease",
              flexShrink: 0,
            }}
            onMouseEnter={e => e.target.style.background = "rgba(255, 255, 255, 0.16)"}
            onMouseLeave={e => e.target.style.background = "rgba(255, 255, 255, 0.10)"}
          >CLOSE</button>
        </div>

        <div style={{
          position: "relative",
          padding: "8px 0",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          flex: 1,
        }}>
          <div style={{
            width: "100%",
            minHeight: 160,
            borderRadius: 16,
            border: "1px solid rgba(170, 205, 235, 0.16)",
            background: "rgba(16, 24, 38, 0.92)",
            padding: "20px 18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "visible",
            flexShrink: 0,
          }}>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 11,
              letterSpacing: 1.8,
              color: "rgba(160, 190, 220, 0.68)",
              marginBottom: 10,
            }}>Timeline Overview</div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 16,
              lineHeight: 1.5,
              color: "rgba(220, 235, 255, 0.95)",
              marginBottom: 8,
            }}>Track the major milestones across the system's history, from first exploration and established settlements to the fractured world of the present age.</div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 13,
              lineHeight: 1.55,
              color: "rgba(180, 205, 225, 0.75)",
            }}>Each event shows the approximate system timestamp, the narrative milestone, and a short note describing the tactical or cultural impact of the change.</div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 14,
            overflowY: "auto",
            maxHeight: "calc(88vh - 280px)",
            paddingRight: 8,
          }}>
            {timeline.map((item, index) => (
              <div key={index} style={{
                padding: "20px 16px",
                borderRadius: 16,
                background: "rgba(10, 16, 28, 0.95)",
                border: "1px solid rgba(160, 195, 240, 0.12)",
                boxShadow: "0 0 16px rgba(0, 0, 0, 0.18)",
                flexShrink: 0,
              }}>
                <div style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 11,
                  letterSpacing: 1.8,
                  color: "rgba(155, 190, 225, 0.70)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}>{item.time}</div>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 16,
                  lineHeight: 1.2,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: "rgba(220, 235, 255, 0.95)",
                  marginBottom: 8,
                }}>{item.title}</div>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: "rgba(180, 205, 225, 0.88)",
                  marginBottom: 10,
                }}>{item.description}</div>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: "rgba(160, 190, 215, 0.78)",
                }}>{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MapTitle ─────────────────────────────────────────────────────────────────
function MapTitle({ onTimelineClick }) {
  return (
    <>
      {/* Timeline icon — top-left, animated hourglass */}
      <HourglassIcon onClick={onTimelineClick} />

      {/* Main title block — offset down to give timeline room */}
      <div className="map-title" style={{ bottom: 28, left: 28 }}>
        <div className="map-title-icons">
          {/* Ghost icon */}
          <svg width="28" height="28" viewBox="0 0 28 28">
            <polygon
              points="14,2 22,8 24,18 14,26 4,18 6,8"
              fill="none"
              stroke="rgba(180,210,255,0.55)"
              strokeWidth="1.2"
            />
            <circle cx="14" cy="13" r="4" fill="none" stroke="rgba(180,210,255,0.55)" strokeWidth="1" />
            <circle cx="14" cy="13" r="1.5" fill="rgba(180,210,255,0.55)" />
            <line x1="14" y1="2" x2="14" y2="6" stroke="rgba(180,210,255,0.40)" strokeWidth="0.8" />
            <line x1="14" y1="20" x2="14" y2="26" stroke="rgba(180,210,255,0.40)" strokeWidth="0.8" />
          </svg>
          {/* Titan helmet icon */}
          <svg width="28" height="28" viewBox="0 0 28 28">
            <path
              d="M6,14 L6,8 Q6,3 14,3 Q22,3 22,8 L22,14 L22,20 Q22,25 14,25 Q6,25 6,20 Z"
              fill="none"
              stroke="rgba(180,210,255,0.55)"
              strokeWidth="1.2"
            />
            <rect x="8" y="11" width="12" height="4" rx="1"
              fill="rgba(100,160,255,0.25)" stroke="rgba(180,210,255,0.45)" strokeWidth="0.8" />
            <line x1="10" y1="20" x2="18" y2="20" stroke="rgba(180,210,255,0.35)" strokeWidth="0.8" />
          </svg>
          {/* Forsaken emblem */}
          <svg width="28" height="28" viewBox="0 0 28 28">
            <path d="M14,4 L8,18 L14,24 L20,18 Z" fill="none" stroke="rgba(180,210,255,0.55)" strokeWidth="1.2" />
            <path d="M10,10 L14,16 L18,10" fill="none" stroke="rgba(180,210,255,0.55)" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M12,18 L14,14 L16,18" fill="none" stroke="rgba(180,210,255,0.55)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {/* Beyond Light snowflake */}
          <svg width="28" height="28" viewBox="0 0 28 28">
            <line x1="14" y1="4" x2="14" y2="24" stroke="rgba(180,210,255,0.55)" strokeWidth="1.2" />
            <line x1="6" y1="10" x2="22" y2="18" stroke="rgba(180,210,255,0.55)" strokeWidth="1.2" />
            <line x1="6" y1="18" x2="22" y2="10" stroke="rgba(180,210,255,0.55)" strokeWidth="1.2" />
            <circle cx="14" cy="14" r="3" fill="none" stroke="rgba(180,210,255,0.55)" strokeWidth="1" />
          </svg>
          {/* Lightfall emblem */}
          <svg width="28" height="28" viewBox="0 0 28 28">
            <path d="M10,4 L18,4 L18,14 L24,14 L14,24 L4,14 L10,14 Z" fill="none" stroke="rgba(180,210,255,0.55)" strokeWidth="1.2" />
            <path d="M12,8 L16,8 L16,12 L20,12" fill="none" stroke="rgba(180,210,255,0.55)" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>
        <div className="map-title-rule" />
        <div className="map-title-main">MHJ PORTFOLIO</div>
        <div className="map-title-sub">Milky Way Galaxy, Local Group</div>
      </div>
    </>
  );
}

// ─── CustomCursor — spinning triangle ────────────────────────────────────────
function CustomCursor() {
  const cursorRef  = useRef(null);
  const posRef     = useRef({ x: -100, y: -100 });
  const hoveredRef = useRef(false);
  const rotRef     = useRef(0);
  const animRef    = useRef(null);

  useEffect(() => {
    const onMove = (e) => { posRef.current = { x: e.clientX, y: e.clientY }; };
    const onOver = (e) => {
      if (e.target.closest('.planet-wrapper, .ui-badge, button, a, [role="button"]'))
        hoveredRef.current = true;
    };
    const onOut = (e) => {
      if (e.target.closest('.planet-wrapper, .ui-badge, button, a, [role="button"]'))
        hoveredRef.current = false;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout",  onOut);

    const tick = () => {
      animRef.current = requestAnimationFrame(tick);
      const { x, y } = posRef.current;
      rotRef.current += hoveredRef.current ? 3 : 0;
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${x}px, ${y}px) rotate(${rotRef.current}deg)`;
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout",  onOut);
    };
  }, []);

  return (
    <div ref={cursorRef} style={{
      position: "fixed", top: 0, left: 0,
      pointerEvents: "none", zIndex: 99999,
      willChange: "transform",
      marginLeft: -12, marginTop: -12,
    }}>
      <svg width="24" height="24" viewBox="0 0 20 20">
        {/* Outer triangle */}
        <polygon
          points="10,1 19,18 1,18"
          fill="none"
          stroke="rgba(200,220,255,0.90)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Inner triangle */}
        <polygon
          points="10,6 15,15 5,15"
          fill="rgba(200,220,255,0.20)"
          stroke="rgba(200,220,255,0.55)"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        {/* Center dot */}
        <circle cx="10" cy="12" r="1.2" fill="rgba(220,235,255,0.95)"/>
      </svg>
    </div>
  );
}
function IntroScreen({ onEnter, onFinish }) {
  const [blink, setBlink] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const ambientRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 800);
    return () => clearInterval(id);
  }, []);

  const handleClick = () => {
    if (transitioning) return;

    // Play preloaded click sound instantly
    playClick();

    setTransitioning(true);
    onEnter();
    setTimeout(() => onFinish?.(), 700);
  };

  // Synthetic sci-fi UI sound — rising energy pulse with metallic resonance
  const playSyntheticClick = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const t = ctx.currentTime;

      // Rising energy sweep — the "power up" feel
      const sweep = ctx.createOscillator();
      const sweepGain = ctx.createGain();
      sweep.type = "sawtooth";
      sweep.frequency.setValueAtTime(80, t);
      sweep.frequency.exponentialRampToValueAtTime(600, t + 0.25);
      sweepGain.gain.setValueAtTime(0.0, t);
      sweepGain.gain.linearRampToValueAtTime(0.28, t + 0.05);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, t + 0.40);
      // Low-pass filter to soften the sawtooth harshness
      const lpf = ctx.createBiquadFilter();
      lpf.type = "lowpass";
      lpf.frequency.setValueAtTime(800, t);
      lpf.frequency.exponentialRampToValueAtTime(3000, t + 0.25);
      sweep.connect(lpf); lpf.connect(sweepGain); sweepGain.connect(ctx.destination);
      sweep.start(t); sweep.stop(t + 0.40);

      // Metallic ping — high resonant tone
      const ping = ctx.createOscillator();
      const pingGain = ctx.createGain();
      ping.type = "sine";
      ping.frequency.setValueAtTime(2200, t + 0.18);
      ping.frequency.exponentialRampToValueAtTime(1800, t + 0.65);
      pingGain.gain.setValueAtTime(0.0, t + 0.18);
      pingGain.gain.linearRampToValueAtTime(0.35, t + 0.22);
      pingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
      ping.connect(pingGain); pingGain.connect(ctx.destination);
      ping.start(t + 0.18); ping.stop(t + 0.65);

      // Sub bass thump on impact
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(55, t + 0.20);
      sub.frequency.exponentialRampToValueAtTime(30, t + 0.35);
      subGain.gain.setValueAtTime(0.0, t + 0.20);
      subGain.gain.linearRampToValueAtTime(0.50, t + 0.22);
      subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
      sub.connect(subGain); subGain.connect(ctx.destination);
      sub.start(t + 0.20); sub.stop(t + 0.38);

      // Short noise burst for texture (like a shield activating)
      const bufLen = Math.floor(ctx.sampleRate * 0.06);
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 2);
      }
      const noise = ctx.createBufferSource();
      const noiseGain = ctx.createGain();
      const bpf = ctx.createBiquadFilter();
      bpf.type = "bandpass";
      bpf.frequency.value = 4000;
      bpf.Q.value = 1.5;
      noise.buffer = buf;
      noiseGain.gain.setValueAtTime(0.18, t + 0.20);
      noise.connect(bpf); bpf.connect(noiseGain); noiseGain.connect(ctx.destination);
      noise.start(t + 0.20); noise.stop(t + 0.26);

    } catch (e) { /* audio not supported */ }
  };

  return (
    <div
      className={`intro-overlay${transitioning ? " intro-overlay--leaving" : ""}`}
      onClick={handleClick}
      style={{ cursor: "none", userSelect: "none" }}
    >
      {/* Background image */}
      <img
        className={`intro-bg${transitioning ? " intro-bg--fade" : ""}`}
        src="/src/assets/intro-bg.jpg"
        alt=""
        onError={e => { e.target.style.display = "none"; }}
      />

      {/* Overlay text */}
      <div className={`intro-text${transitioning ? " intro-text--fade" : ""}`}>
        <div style={{
          width: 320, height: 1,
          background: "linear-gradient(to right, transparent, rgba(200,220,255,0.70), transparent)",
        }}/>
        <div style={{
          fontFamily: "'Barlow Condensed', 'Rajdhani', sans-serif",
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: 10,
          textTransform: "uppercase",
          color: `rgba(220,235,255,${blink ? 1.0 : 0.45})`,
          transition: "color 0.4s ease",
          textShadow: `0 0 30px rgba(140,190,255,0.90), 0 0 60px rgba(100,160,255,0.50), 0 2px 8px rgba(0,0,0,0.95)`,
          whiteSpace: "nowrap",
        }}>
          CLICK TO ENTER
        </div>
        <div style={{
          width: 320, height: 1,
          background: "linear-gradient(to right, transparent, rgba(200,220,255,0.70), transparent)",
        }}/>
      </div>
    </div>
  );
}



// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [entered, setEntered] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [selected, setSelected] = useState(null);
  const [sectionSlideIndex, setSectionSlideIndex] = useState(0);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [showCaution, setShowCaution] = useState(false);
  const [cautionBlink, setCautionBlink] = useState(false);

  const sectionSlideCount = selected?.slides?.length ?? 0;
  const activeSlide = selected?.slides?.[sectionSlideIndex] ?? "";
  const ghostPanelItems = [...planets, ...badgeSections].map(item => ({ name: item.name, title: item.title }));

  const ghostHint = selected
    ? "Ghost is ready. hover over to view what each section and badge shows, use the left and right arrow key (<-- / -->) to control the slides. CLICK anywhere outside the tabs to close them."
    : "Ghost is ready. hover over to view what each section and badge shows, use the left and right arrow key (<-- / -->) to control the slides. CLICK anywhere outside the tabs to close them.";

  const renderSlideContent = (slideText) => {
    return slideText.split("\n\n").map((paragraph, index) => {
      const lines = paragraph.split("\n").map(line => line.trim()).filter(Boolean);
      const isList = lines.length > 0 && lines.every(line => line.startsWith("-"));
      if (isList) {
        return (
          <ul key={index} className="info-panel-list">
            {lines.map((line, lineIndex) => (
              <li key={lineIndex}>{line.replace(/^[-\s]+/, "")}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} style={{ margin: 0 }}>
          {paragraph}
        </p>
      );
    });
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelected(null);
        setTimelineOpen(false);
        if (entered) playClick();
      }

      if (selected && entered && sectionSlideCount > 0) {
        if (e.key === "ArrowRight" && sectionSlideIndex < sectionSlideCount - 1) {
          playClick();
          setSectionSlideIndex(sectionSlideIndex + 1);
        }
        if (e.key === "ArrowLeft" && sectionSlideIndex > 0) {
          playClick();
          setSectionSlideIndex(sectionSlideIndex - 1);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [entered, selected, sectionSlideIndex, sectionSlideCount]);

  const handleSelect = (item) => {
    playClick();
    setSelected(item);
    setSectionSlideIndex(0);
  };

  const handleTimelineOpen = () => {
    playClick();
    setTimelineOpen(true);
  };

  const selectSectionSlideByIndex = (index) => {
    if (index < 0 || index >= sectionSlideCount) return;
    playClick();
    setSectionSlideIndex(index);
  };

  const handleTimelineClose = () => {
    setTimelineOpen(false);
  };

  const handleIntroEnter = () => {
    setEntered(true);
    // Start preloaded background music immediately, fade in
    bgMusic.play();
    bgMusic.fade(0, 0.06, 2000);
    setShowCaution(true);
  };

  const handleIntroFinish = () => {
    setIntroVisible(false);
  };

  useEffect(() => {
    if (showCaution) {
      const timer = setTimeout(() => setShowCaution(false), 8000);
      const blinkInterval = setInterval(() => setCautionBlink(prev => !prev), 400);
      return () => {
        clearTimeout(timer);
        clearInterval(blinkInterval);
      };
    }
  }, [showCaution]);

  return (
    <div className="solar-map">
      {introVisible && (
        <IntroScreen onEnter={handleIntroEnter} onFinish={handleIntroFinish} />
      )}
      <div className={`main-scene${entered ? " main-scene--visible" : ""}`}>
        {/* Custom cursor */}
        <CustomCursor />

        {/* z-index 0: Starfield canvas */}
      <StarCanvas />

      {/* z-index 1: Nebula atmospheric haze */}
      <div className="nebula-layer nebula-center" />
      <div className="nebula-layer nebula-right" />
      <div className="nebula-layer nebula-topleft" />

      {/* z-index 2: Grid overlay */}
      <GridOverlay />

      {/* z-index 10+: Planets */}
      {planets.map((planet, index) => (
        <Planet key={planet.id} planet={planet} index={index} onSelect={handleSelect} />
      ))}

      {/* z-index 20: Destiny star symbol top-center */}
      <DestinyStarSymbol />

      {/* z-index 20: UI badges */}
      <VanguardBadge onSelect={handleSelect} />
      <CrucibleBadge onSelect={handleSelect} />

      {/* z-index 20: Bottom-left title */}
      <MapTitle onTimelineClick={handleTimelineOpen} />

      {/* Timeline panel */}
      {timelineOpen && <TimelinePanel onClose={handleTimelineClose} />}

      {/* Ghost companion panel */}
      <div className="ghost-panel">
        <div className="ghost-panel-icon">
          <svg viewBox="0 0 64 64" width="38" height="38">
            <path d="M32 4C18 4 6 16 6 30c0 12 8 16 8 26 0 6 4 8 18 8s18-2 18-8c0-10 8-14 8-26C58 16 46 4 32 4z" fill="rgba(220,235,255,0.10)" stroke="rgba(220,235,255,0.75)" strokeWidth="2"/>
            <circle cx="24" cy="28" r="4" fill="rgba(220,235,255,0.90)"/>
            <circle cx="40" cy="28" r="4" fill="rgba(220,235,255,0.90)"/>
            <path d="M22 40c4 4 12 4 16 0" fill="none" stroke="rgba(220,235,255,0.75)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="ghost-panel-copy">
          <div className="ghost-panel-title">Ghost</div>
          <div className="ghost-panel-text">{ghostHint}</div>
        </div>
        <div className="ghost-panel-hover-card">
          <div className="ghost-panel-hover-title">Hover to preview</div>
          <div className="ghost-panel-hover-copy">See which section each planet or badge opens.</div>
          <ul className="ghost-panel-hover-list">
            {ghostPanelItems.map(item => (
              <li key={item.name}>
                <span>{item.name}</span>
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Info panel — appears when an object is clicked ── */}
      {selected && (
        <div className="info-panel-overlay" onClick={() => { playClick(); setSelected(null); }}>
          <div className="info-panel-shell" onClick={e => e.stopPropagation()}>
            <div className="info-panel-tab" />
            <div className="info-panel-content">
              <div className="info-panel-nav">
                <button
                  type="button"
                  className="info-panel-nav-button"
                  onClick={() => selectSectionSlideByIndex(sectionSlideIndex - 1)}
                  disabled={sectionSlideIndex <= 0}
                >
                  ←
                </button>
                <div className="info-panel-nav-label">
                  Page {sectionSlideIndex + 1} of {sectionSlideCount}
                </div>
                <button
                  type="button"
                  className="info-panel-nav-button"
                  onClick={() => selectSectionSlideByIndex(sectionSlideIndex + 1)}
                  disabled={sectionSlideIndex >= sectionSlideCount - 1}
                >
                  →
                </button>
              </div>

              {/* Corner accents */}
              {[["0","0"],["0","auto"],["auto","0"],["auto","auto"]].map(([t,b],i) => (
                <div key={i} style={{
                  position:"absolute", top:t==="0"?8:"auto", bottom:b==="auto"?8:"auto",
                  left:i<2?8:"auto", right:i>=2?8:"auto",
                  width:14, height:14,
                  borderTop: t==="0" ? "1px solid rgba(160,195,240,0.55)" : "none",
                  borderBottom: t!=="0" ? "1px solid rgba(160,195,240,0.55)" : "none",
                  borderLeft: i<2 ? "1px solid rgba(160,195,240,0.55)" : "none",
                  borderRight: i>=2 ? "1px solid rgba(160,195,240,0.55)" : "none",
                }}/>
              ))}

              {/* Header */}
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 32, fontWeight: 700, letterSpacing: 6,
                color: "rgba(220,235,255,0.95)",
                textTransform: "uppercase",
                marginBottom: 10,
                textShadow: "0 0 20px rgba(120,180,255,0.35)",
                textAlign: "center",
                width: "100%",
              }}>
                {selected.title || selected.name}
              </div>

              {/* Thin rule */}
              <div style={{ height:1, background:"linear-gradient(to right, rgba(160,195,240,0.50), transparent)", marginBottom:12 }}/>

              {selected.sub && (
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 14, fontStyle: "italic", letterSpacing: 2,
                  color: "rgba(205,215,225,0.72)", marginBottom: 8,
                }}>
                  {selected.sub}
                </div>
              )}

              {selected.data && (
                <div style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 10, letterSpacing: 2,
                  color: "rgba(170,185,200,0.45)",
                  textTransform: "uppercase", marginBottom: 20,
                }}>
                  {selected.data}
                </div>
              )}

              <div style={{
                fontFamily: "'Barlow Condensed', 'Rajdhani', sans-serif",
                fontSize: 16, lineHeight: 1.9, letterSpacing: 0.5,
                color: "rgba(190,205,225,0.90)",
                marginBottom: 24,
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}>
                {renderSlideContent(activeSlide)}
              </div>

              {/* Close hint */}
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 10, letterSpacing: 3,
                color: "rgba(160,170,185,0.42)",
                textTransform: "uppercase",
                textAlign: "center",
              }}>
                CLICK ANYWHERE TO CLOSE
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Caution message overlay */}
      {showCaution && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 150,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "auto",
          animation: "fadeInUp 0.5s ease forwards",
        }} onClick={() => { playClick(); setShowCaution(false); }}>
          <div style={{
            background: "rgba(8, 12, 18, 0.98)",
            border: "2px solid rgba(200, 220, 240, 0.35)",
            borderRadius: 16,
            padding: "28px 32px",
            maxWidth: 420,
            textAlign: "center",
            boxShadow: "0 0 80px rgba(0, 0, 0, 0.60)",
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: `rgba(220, 235, 255, ${cautionBlink ? 1.0 : 0.7})`,
              marginBottom: 10,
              transition: "color 0.4s ease",
            }}>
              Caution
            </div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: 1,
              color: `rgba(180, 200, 230, ${cautionBlink ? 0.95 : 0.65})`,
              lineHeight: 1.5,
              transition: "color 0.4s ease",
            }}>
              This is better viewed on a bigger screen (laptop or monitor)
            </div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: `rgba(160, 170, 185, ${cautionBlink ? 0.75 : 0.45})`,
              marginTop: 14,
              transition: "color 0.4s ease",
            }}>
              Click anywhere to close or exit
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}