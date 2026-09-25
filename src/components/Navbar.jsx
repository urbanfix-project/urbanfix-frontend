const Navbar = () => {
  return (
    <nav className="w-full h-[80px] bg-white border-b border-blueLight/30 px-8 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <span className="text-[24px] font-extrabold text-primary">
          Urban<span className="text-secondary">Fix</span>
        </span>
      </div>

      {/* Navegación */}
      <div className="flex items-center gap-6">
        <button
          type="button"
          className="
            h-[44px]
            px-6
            rounded-[33px]
            text-button
            text-primary
            hover:bg-background
            transition-colors
          "
        >
          Inicio
        </button>

        <button
          type="button"
          className="
            h-[44px]
            px-6
            rounded-[33px]
            bg-primary
            text-white
            text-button
            hover:opacity-90
            transition-opacity
          "
        >
          Mis trabajos
        </button>

        {/* Avatar */}
        <button
          type="button"
          aria-label="Abrir perfil"
          className="
            w-[44px]
            h-[44px]
            rounded-full
            bg-blueLight
            border-2
            border-primary
            flex
            items-center
            justify-center
            text-white
            text-button
          "
        >
          J
        </button>
      </div>
    </nav>
  );
};

export default Navbar;