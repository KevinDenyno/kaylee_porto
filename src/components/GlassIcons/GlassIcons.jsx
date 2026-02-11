import "./GlassIcons.css";

const gradientMapping = {
  blood: "linear-gradient(135deg, hsl(0, 70%, 18%), hsl(0, 85%, 35%))",
  darkBlood: "linear-gradient(135deg, hsl(355, 80%, 12%), hsl(350, 90%, 28%))",
  ember: "linear-gradient(135deg, hsl(8, 90%, 40%), hsl(0, 85%, 30%))",
  wine: "linear-gradient(135deg, hsl(345, 70%, 18%), hsl(355, 80%, 32%))",
  rust: "linear-gradient(135deg, hsl(12, 80%, 32%), hsl(5, 90%, 22%))",

  // lightning accent (kuning emas)
  gold: "linear-gradient(135deg, hsl(42, 95%, 55%), hsl(36, 90%, 45%))",
};

const GlassIcons = ({ items, className }) => {
  const getBackgroundStyle = (color) => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <div className={`icon-btns ${className || ""}`}>
      {items.map((item, index) => (
        <button
          key={index}
          className={`icon-btn ${item.customClass || ""}`}
          aria-label={item.label}
          type="button"
        >
          <span
            className="icon-btn__back"
            style={getBackgroundStyle(item.color)}
          ></span>
          <span className="icon-btn__front">
            <span className="icon-btn__icon" aria-hidden="true">{item.icon}</span>
          </span>
          <span className="icon-btn__label">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default GlassIcons;
