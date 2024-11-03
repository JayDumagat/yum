import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import Cookies from "js-cookie";
import Form from "../components/Form";
import Layout from "../layouts/Layout";

const MultiStepLogin = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      } else {
        navigate("/overview");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleNext = () => {
    if (step === 1 && email) {
      setStep(2);
    } else if (step === 2 && password) {
      handleLogin();
    } else {
      setError("Please fill in all fields.");
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      Cookies.set("userToken", token, { expires: 7 });
      alert("Login successful!");
      navigate("/overview");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const formProps = step === 1
    ? {
        inputs: [
          {
            for: "email",
            label: "Email Address",
            type: "email",
            placeholder: "Enter your email",
            value: email,
            onChange: setEmail,
          },
        ],
        buttonText: "Next",
      }
    : {
        inputs: [
          {
            for: "password",
            label: "Password",
            type: "password",
            placeholder: "Enter your password",
            value: password,
            onChange: setPassword,
          },
        ],
        buttonText: "Login",
      };

  return (
    <Layout>
      <div
        className="h-screen flex justify-center items-center"
        style={{
          backgroundImage: "url('/BG.png')", // Ensure the path matches the public folder setup
          backgroundSize: "cover",           // Ensures the image covers the full screen
          backgroundPosition: "center",      // Centers the image
          backgroundRepeat: "no-repeat"      // Prevents the image from repeating
        }}
      >
        <div className="max-w-md mx-auto p-4 mt-7 bg-white border border-gray-100 rounded-xl shadow-md dark:bg-neutral-900 dark:border-neutral-700">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Sign in</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                Don&apos;t have an account yet?&nbsp;
                <Link
                  className="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                  to={"/register"}
                >
                  Sign up here
                </Link>
              </p>
            </div>
            <div className="mt-5">
              <Form
                inputs={formProps.inputs}
                onSubmit={handleNext}
                buttonText={formProps.buttonText}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MultiStepLogin;
