import React, { useState, useEffect } from "react";

const CertificationModal = ({ isOpen, onClose, certification }) => {
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

  if (!isOpen || !certification) return null;

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
          relative w-full max-w-4xl
          bg-zinc-950 text-white
          overflow-hidden
          rounded-t-3xl sm:rounded-3xl
          max-h-[92vh] sm:max-h-none
          flex flex-col
          ${isClosing ? "animate-out" : "animate-in"}
          fire-border
        `}
      >
        {/* FIRE GLOW */}
        <div className="fire-glow" />

        {/* IMAGE */}
        <div className="relative w-full bg-black flex items-center justify-center py-4 sm:py-6">
          <img
            src={certification.image}
            alt={certification.title}
            className="
              max-w-full
              max-h-[260px] sm:max-h-[460px]
              object-contain
              drop-shadow-[0_0_30px_rgba(255,60,0,0.45)]
            "
          />
        </div>

        {/* CONTENT */}
        <div className="p-5 sm:p-8 space-y-6 overflow-y-auto max-h-[40vh] sm:max-h-none">
        <div className="flex justify-between items-start">
            <h2 className="text-xl sm:text-3xl font-bold">
            {certification.title}
            </h2>

            <button
            onClick={handleClose}
            className="close-btn absolute top-4 right-4 sm:static"
            aria-label="Close"
            >
            <span className="close-line" />
            <span className="close-line" />
            </button>
        </div>

        {/* DESKRIPSI — INI YANG KAMU CARI */}
        <p className="text-zinc-300 text-sm sm:text-lg leading-relaxed">
            {certification.fullDescription}
        </p>
        </div>
      </div>

      {/* 🔥 ANIMATIONS & FIRE EFFECT — PERSIS SAMA */}
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

        .close-btn {
          position: relative;
          width: 38px;
          height: 38px;
          background: transparent;
          border: none;
          cursor: pointer;
          display: grid;
          place-items: center;
        }

        .close-line {
          position: absolute;
          width: 18px;
          height: 1.75px;
          background: linear-gradient(to right, #d6d6d6, #ffffff);
          border-radius: 2px;
          transition:
            width 0.25s ease,
            background 0.25s ease,
            box-shadow 0.25s ease,
            opacity 0.25s ease;
        }

        .close-line:first-child {
          transform: rotate(45deg);
        }

        .close-line:last-child {
          transform: rotate(-45deg);
        }

        .close-btn:hover .close-line {
          width: 14px;
          background: linear-gradient(to right, #ffb199, #ff3c00);
          box-shadow: 0 0 8px rgba(255, 60, 0, 0.45);
        }

        .close-btn:active .close-line {
          width: 12px;
          opacity: 0.7;
        }

        .close-btn::after {
          content: "";
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255,80,0,0.25),
            transparent 65%
          );
          filter: blur(10px);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .close-btn:hover::after {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default CertificationModal;