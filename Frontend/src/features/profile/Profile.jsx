// src/features/profile/Profile.jsx
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Profile() {
  const { user, role } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {user ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Profile
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <span className="font-semibold">Email:</span> {user}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Role:</span> {role}
              </p>
              <Link
                to="/"
                className="block w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 text-center"
              >
                Go to Home
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Please Login
            </h2>
            <div className="space-y-4">
              <Link
                to="/login"
                className="block w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 text-center"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block w-full bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-300 transition-all duration-300 text-center"
              >
                Sign Up
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;