import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { auth, db } from "../firebase-config";
import Form from "../components/Form";
import Layout from "../layouts/Layout";

const MultiStepRegister = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 1 && name && email) {
      setStep(2);
    } else if (step === 2 && password && confirmPassword) {
      if (password === confirmPassword) {
        handleRegister();
      } else {
        setError("Passwords do not match.");
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Attempting to register user...");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("User registered:", user);

      await updateProfile(user, { displayName: name });
      console.log("User profile updated");

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
        role: "admin",
      });
      console.log("User role set in Firestore");

      const token = await user.getIdToken();
      Cookies.set("userToken", token, { expires: 7 });
      Cookies.set("userRole", "user", { expires: 7 });
      console.log("Cookies set");

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      if (err.code) {
        switch (err.code) {
          case "auth/email-already-in-use":
            setError("This email is already in use.");
            break;
          case "auth/invalid-email":
            setError("Invalid email address.");
            break;
          case "auth/weak-password":
            setError("Password should be at least 6 characters.");
            break;
          default:
            setError("Registration failed. Please try again.");
            break;
        }
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formProps =
    step === 1
      ? {
          inputs: [
            {
              for: "name",
              label: "Name",
              type: "text",
              placeholder: "Enter your name",
              value: name,
              onChange: setName,
            },
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
            {
              for: "confirm-password",
              label: "Confirm Password",
              type: "password",
              placeholder: "Confirm your password",
              value: confirmPassword,
              onChange: setConfirmPassword,
            },
          ],
          buttonText: "Register",
        };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row h-screen" style={{ backgroundColor: "#232323" }}>
        {/* Left side image */}
        <div className="hidden lg:block lg:w-full">
          <img
            src={'src/pages/ordering/Images/foodhub.jpg'} 
            alt="Sign-up side image"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right side form */}
        <div className="flex items-center justify-center lg:w-1/2 w-full">
        <div
          className="max-w-md mx-auto p-5 mt-8 border border-gray-100 rounded-xl shadow-md dark:border-neutral-500"
          style={{ backgroundColor: "#272829" }}
        >
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                  Sign Up
                </h1>
                <p className="mt-2 text-sm text-gray-900 dark:text-neutral-400">
                  Already have an account?&nbsp;
                  <Link
                    className="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-[#F5D061]"
                    to={"/login"}
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
              <div className="mt-5">
                <button
                  disabled
                  type="button"
                  className="mb-2 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none disabled:select-none dark:bg-white dark:border-neutral-700 dark:text-[#272829] dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                >
                  <svg
                    className="w-4 h-auto"
                    width="46"
                    height="47"
                    viewBox="0 0 46 47"
                    fill="none"
                  >
                    <path
                      d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                      fill="#34A853"
                    />
                    <path
                      d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                      fill="#EB4335"
                    />
                  </svg>
                  Sign up with Google
                </button>

                <div className="py-3 flex items-center text-xs text-white uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600">
                  Or
                </div>
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
      </div>
    </Layout>
  );
};

export default MultiStepRegister;
