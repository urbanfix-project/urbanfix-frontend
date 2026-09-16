const Badge = ({ children, variant = "success" }) => {
  const styles = {
    success: "border-green-600 bg-green-50 text-green-600",
    warning: "border-yellow-600 bg-yellow-50 text-yellow-600",
    error: "border-red-600 bg-red-50 text-red-600",
  };

  return (
    <span
      className={`
        w-[107px]
        h-[28px]
        px-[20px]
        rounded-[33px]
        border
        inline-flex
        items-center
        justify-center
        text-caption
        ${styles[variant]}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;