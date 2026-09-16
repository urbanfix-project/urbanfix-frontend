const Input = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  disabled = false,
  error = false,
  success = false,
}) => {
  let borderColor = "border-blueLight";
  let textColor = "text-blueLight";

  if (error) {
    borderColor = "border-red-600";
    textColor = "text-red-600";
  } else if (success) {
    borderColor = "border-green-600";
    textColor = "text-green-600";
  }

  return (
    <div className="w-[499px] flex flex-col gap-[4px]">
      {label && (
        <label className="text-label text-blueLight">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-[499px]
          h-[68px]
          px-10
          rounded-full
          border-2
          bg-background
          text-body
          outline-none
          transition
          ${borderColor}
          ${textColor}
          focus:border-primary
          focus:text-primary
          disabled:cursor-not-allowed
          disabled:bg-gray-200
          disabled:border-blueLight
          disabled:text-blueLight
        `}
      />
    </div>
  );
};

export default Input;