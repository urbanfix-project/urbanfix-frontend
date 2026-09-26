import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const PrivateLayout = () => {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">
        <Outlet />
      </main>
    </>
  );
};

export default PrivateLayout;