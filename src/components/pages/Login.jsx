import { useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { currentUser, signInGoogle } = UserAuth();

  const handleLogin = async () => {
    try {
      await signInGoogle();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    } else return;
  }, [currentUser, navigate]);

  return (
    <>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1562577309-4932fdd64cd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80")`,
        }}
      >
        <div className="hero-overlay bg-opacity-70"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">BUTTERFLY !</h1>
            <p className="mb-5">
              Stay connected with your friends - Butterfly - Your go-to app for
              hassle-free social needs.
            </p>
            <button
              onClick={() => {
                handleLogin();
              }}
              className="p-3 bg-cyan-400 rounded btn-ghost hover:bg-cyan-500 hover:shadow"
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
