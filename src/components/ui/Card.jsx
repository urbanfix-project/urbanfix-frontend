const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`
        w-[497px]
        h-[378px]
        rounded-[20px]
        border-2
        border-primary
        pt-[29px]
        pr-[23px]
        pb-[28px]
        pl-[23px]
        flex
        flex-col
        gap-[10px]
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;