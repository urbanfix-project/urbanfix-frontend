// Paleta basada en el diseño enviado
const COLORS = {
  navy: "#0E1B4D",        // texto outline / fondo "activo"
  navyDark: "#0A1444",    // fondo "activo" (un poco más oscuro)
  disabled: "#545F8F",    // fondo "desactivado"
  cta: "#F26B3A",         // fondo "CTA"
  ctaHover: "#E15A28",
  white: "#FFFFFF",
  border: "#111111",
};

const BASE_STYLES =
  "inline-flex items-center justify-center font-semibold rounded-full px-6 py-3 text-base transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const VARIANTS = {
  outline: {
    className: `${BASE_STYLES} bg-white border-2`,
    style: { color: COLORS.navy, borderColor: COLORS.border },
  },
  disabled: {
    className: `${BASE_STYLES} cursor-not-allowed`,
    style: { backgroundColor: COLORS.disabled, color: COLORS.white },
  },
  active: {
    className: `${BASE_STYLES}`,
    style: { backgroundColor: COLORS.navyDark, color: COLORS.white },
  },
  cta: {
    className: `${BASE_STYLES} hover:brightness-105`,
    style: { backgroundColor: COLORS.cta, color: COLORS.white },
  },
};

/**
 * Button
 *
 * @param {"outline"|"disabled"|"active"|"cta"} variant
 * @param {React.ReactNode} children
 * @param {function} onClick
 * @param {string} className - clases extra opcionales
 */
export default function Button({
  variant = "active",
  children,
  onClick,
  className = "",
  ...props
}) {
  const config = VARIANTS[variant] || VARIANTS.active;
  const isDisabled = variant === "disabled";

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={`${config.className} ${className}`}
      style={config.style}
      {...props}
    >
      {children}
    </button>
  );
}

// --- Ejemplo de uso ---
export function ButtonShowcase() {
  return (
    <div className="flex flex-col gap-4 items-start p-6">
      <Button variant="outline">Botón 1 (Outline)</Button>
      <Button variant="disabled">Botón desactivado</Button>
      <Button variant="active">Botón activo</Button>
      <Button variant="cta">Botón CTA</Button>
    </div>
  );
}