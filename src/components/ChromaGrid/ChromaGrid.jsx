import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./ChromaGrid.css";

const isTouch =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

// Terima `onItemClick` di props
export const ChromaGrid = ({
  items,
  onItemClick, // Fungsi handler dari App.jsx
  className = "",
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  // Gunakan `items` yang di-pass dari App.jsx, bukan data demo
  const data = items?.length ? items : [];

  useEffect(() => {
    if (!rootRef.current) return;

    const cards = rootRef.current.querySelectorAll(".chroma-card");

    gsap.set(cards, {
      clipPath: "inset(100% 0 0 0 round 16px)",
    });

    gsap.to(cards, {
      clipPath: "inset(0% 0 0 0 round 16px)",
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
      delay: 0.2,
    });
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e) => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={
        {
          "--r": `${radius}px`,
          "--cols": columns,
          "--rows": rows,
        }
      }
      onPointerMove={!isTouch ? handleMove : undefined}
      onPointerLeave={!isTouch ? handleLeave : undefined}
    >
      {data.map((c, i) => (
        <article
          key={i}
          className="chroma-card"
          onMouseMove={!isTouch ? handleCardMove : undefined}
          onPointerDown={(e) => {
            e.currentTarget.classList.add("is-pressed");
          }}
          onPointerUp={(e) => {
            e.currentTarget.classList.remove("is-pressed");
            onItemClick(c);
          }}
          onPointerLeave={(e) => {
            e.currentTarget.classList.remove("is-pressed");
          }}
          style={{
            "--card-border": c.borderColor || "transparent",
            "--card-gradient": c.gradient,
            cursor: "pointer",
          }}
        >
          {/* 🔥 FIRE / EMBER LAYER */}
          <div className="fire-glow" />

          <div className="chroma-img-wrapper">
            <img
              src={c.image}
              alt={c.title}
              loading="lazy"
              draggable="false"
            />
          </div>

          <footer className="chroma-info">
            <h3 className="name">{c.title}</h3>
            <p className="role">{c.subtitle}</p>
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
};

export default ChromaGrid;
