import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../store";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, error: reduxError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate("/listings");
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
      navigate("/listings");
    } catch (err) {
      setError(reduxError || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-neutral-900 mb-6 text-center">
          Login to Stay Finder
        </h2>
        {error && (
          <p className="text-red-500 bg-red-50 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
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
          <button
            type="submit"
            className="w-full bg-primary-500 text-white p-3 rounded-lg hover:bg-primary-600 transition-all duration-300 font-semibold transform hover:-translate-y-1 shadow-md"
          >
            Login
          </button>
        </form>
        <p className="text-center text-neutral-700 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-primary-500 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;