import { useEffect, useState } from "react";

export default function GalleryModal({ isOpen, image, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);

    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 250);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen || !image) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 bg-black/80
        flex items-center justify-center
        p-4 sm:p-6
      "
    >
      {/* BACKDROP */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className={`
          relative w-full max-w-5xl
          bg-zinc-950 text-white
          overflow-hidden
          rounded-t-3xl sm:rounded-3xl
          max-h-[92vh]
          flex flex-col
          ${isClosing ? "animate-out" : "animate-in"}
          fire-border
        `}
      >
        {/* FIRE GLOW */}
        <div className="fire-glow" />

        {/* IMAGE */}
        <div className="relative z-10 w-full bg-black flex items-center justify-center py-4 sm:py-6">
          <img
            src={image}
            alt="Gallery Preview"
            className="
              max-w-full
              max-h-[75vh]
              object-contain
              drop-shadow-[0_0_35px_rgba(255,60,0,0.45)]
            "
          />
        </div>

        {/* CLOSE BUTTON */}
        <button
        onClick={handleClose}
        aria-label="Close"
        className="close-btn-basic"
        >
        ×
        </button>
      </div>

      {/* 🔥 STYLE — PERSIS SAMA */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(40px);
            opacity: 0;
          }
        }

        .animate-in {
          animation: slideUp 0.35s ease-out forwards;
        }

        .animate-out {
          animation: slideDown 0.25s ease-in forwards;
        }

        .fire-border {
          border: 1px solid rgba(255,80,40,0.6);
          box-shadow:
            0 0 25px rgba(255,60,0,0.35),
            inset 0 0 35px rgba(255,80,40,0.25);
        }

        .fire-glow {
          pointer-events: none;
          position: absolute;
          inset: -30%;
          background:
            radial-gradient(circle at 30% 120%, rgba(255,90,0,0.25), transparent 50%),
            radial-gradient(circle at 70% 130%, rgba(255,0,0,0.2), transparent 55%);
          filter: blur(60px);
          animation: fireMove 10s ease-in-out infinite alternate;
          z-index: 0;
        }

        @keyframes fireMove {
          0% { transform: translateY(0); opacity: 0.6 }
          100% { transform: translateY(-40px); opacity: 0.9 }
        }

       
        /* BASIC CLOSE BUTTON */

        .close-btn-basic {
        position: absolute;
        top: 10px;
        right: 10px;

        width: 28px;
        height: 28px;

        display: flex;
        align-items: center;
        justify-content: center;

        background: #1a1a1a;
        color: #ff3b3b;

        border: 1px solid #ff3b3b;
        border-radius: 4px;

        font-size: 18px;
        line-height: 1;
        font-weight: 600;

        cursor: pointer;
        }

        .close-btn-basic:hover {
        background: #2a0000;
        }

        .close-btn-basic:active {
        background: #3a0000;
        }

      `}</style>
    </div>
  );
}
