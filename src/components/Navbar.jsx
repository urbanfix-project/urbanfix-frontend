const Navbar = () => {
  return (
    <nav className="w-full h-[56px] bg-gradient-to-b from-primary to-blueLight shadow-md">
      <div className="mx-auto max-w-[1160px] h-full px-6 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center">
          <span className="text-[20px] font-extrabold text-white">
            Urban<span className="text-secondary">Fix</span>
          </span>
        </div>

        {/* Navegación */}
        <div className="flex items-center h-full gap-5">

          <button
            type="button"
            className="h-full text-[12px] font-medium text-white hover:opacity-80"
          >
            Administrador
          </button>

          <button
            type="button"
            className="
              h-full
              text-[12px]
              font-semibold
              text-white
              border-b-2
              border-white
            "
          >
            Solicitudes (128)
          </button>

          <button
            type="button"
            className="h-full text-[12px] font-medium text-white hover:opacity-80"
          >
            Usuarios (214)
          </button>

          {/* Avatar */}
          <button
            type="button"
            className="
              ml-1
              w-[24px]
              h-[24px]
              rounded-full
              bg-[#B21E6F]
              flex
              items-center
              justify-center
              text-[8px]
              font-semibold
              text-white
            "
          >
            ER
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;