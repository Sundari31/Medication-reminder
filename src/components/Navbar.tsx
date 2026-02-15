import { logout } from "../firebase/authService";
import { useAuth } from "../context/AuthContext";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const { user } = useAuth();

  const displayName = user?.displayName || "User";

  return (
   <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-blue-600">
              MedTrack
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">

            <span className="text-sm text-gray-600 hidden sm:block">
              Hi, {displayName}
            </span>

            <button
              onClick={logout}
              className="p-2 rounded-full hover:bg-red-100 transition group"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6 text-red-500 group-hover:text-red-600 transition" />
            </button>

          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
