import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../store";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const { user, error: reduxError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate("/listings");
  }, [user, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      await dispatch(signup({ email, password, role })).unwrap();
      navigate("/login");
    } catch (err) {
      setError(reduxError || "Signup failed. Please try again.");
    }
  };

  const handleGoogleSignup = async () => {
    const googleEmail = `googleuser${Date.now()}@example.com`;
    const googleRole = role;

    try {
      await dispatch(signup({ email: googleEmail, password: "google-auth", role: googleRole })).unwrap();
      navigate("/login");
    } catch (err) {
      setError(reduxError || "Google signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-neutral-900 mb-6 text-center">
          Sign Up to Stay Finder
        </h2>
        {error && (
          <p className="text-red-500 bg-red-50 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}
        <form onSubmit={handleSignup} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
          >
            <option value="user">User (Tenant)</option>
            <option value="owner">Owner</option>
          </select>
          <button
            type="submit"
            className="w-full bg-primary-500 text-white p-3 rounded-lg hover:bg-primary-600 transition-all duration-300 font-semibold transform hover:-translate-y-1 shadow-md"
          >
            Sign Up
          </button>
        </form>
        <button
          onClick={handleGoogleSignup}
          className="w-full mt-4 bg-white text-neutral-900 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-all duration-300 flex items-center justify-center shadow-md transform hover:-translate-y-1"
        >
          <span className="mr-2 text-red-500 font-bold">G</span> Sign Up with Google
        </button>
        <p className="text-center text-neutral-700 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-500 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;