const VARIANTS = {
  outline: {
    width: "w-[172px]",
    className: "bg-white border border-black text-primary",
  },

  disabled: {
    width: "w-[172px]",
    className: "bg-[#011659BA] text-white cursor-not-allowed",
  },

  active: {
    width: "w-[124px]",
    className: "bg-primary text-white",
  },

  cta: {
    width: "w-[124px]",
    className: "bg-[#FB6A27] text-white hover:bg-[#E15A28]",
  },
};

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
      type="button"
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={`
        ${config.width}
        h-[44px]
        px-[20px]
        rounded-[33px]
        inline-flex
        items-center
        justify-center
        text-button
        transition-colors
        duration-150
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary
        ${config.className}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}