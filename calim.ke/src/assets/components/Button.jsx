// Button.jsx is a reusable button component used across the app.
// It accepts label text, click handlers, button type, custom classes,
// and a disabled state.
function Button({
  text,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      className={`btn ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;