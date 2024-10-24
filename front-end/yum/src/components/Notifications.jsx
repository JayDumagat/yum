import { useState, useEffect, useRef } from "react";
import Bell from "../Icons/Bell";

function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleNotifications = () => setIsOpen((prev) => !prev);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both the dropdown and the button
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className=" [--placement:bottom-right] relative inline-flex ">
      <button
        type="button"
        onClick={toggleNotifications}
        ref={buttonRef}
        className="size-[38px] relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
      >
        <Bell />
        <span className="sr-only">Notifications</span>
      </button>
      <div
        ref={dropdownRef}
        className={`transition-transform duration-700 ease-in-out absolute right-0 top-9 min-w-60 bg-white shadow-lg rounded-lg mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full ${
          isOpen
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="py-3 px-5 bg-white  rounded-t-lg dark:bg-neutral-700">
          <p className="text-sm text-center font-medium text-gray-800 dark:text-neutral-200">
            Notifications
          </p>
        </div>
        {/*
        <div className="py-1.5 space-y-0.5">
          <a
            className="flex items-center gap-x-3.5 py-2 px-3 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
            href="#"
          >
            Newsletter
          </a>
        </div>
        */}
        <div className="w-full py-1.5 space-y-0.5 bg-gray-50 dark:bg-neutral-800">
          <a className="flex justify-center items-center gap-x-3.5 py-2 px-3 text-xs text-gray-800  focus:outline-none focus:bg-gray-100 dark:text-neutral-400  dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"></a>
          <a className="flex justify-center text-center items-center gap-x-3.5 py-2 px-3 text-xs text-gray-800  focus:outline-none focus:bg-gray-100 dark:text-neutral-400  dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300">
            You&apos;re all caught up! No new notifications.
          </a>
          <a className="flex justify-center items-center gap-x-3.5 py-2 px-3 text-xs text-gray-800  focus:outline-none focus:bg-gray-100 dark:text-neutral-400  dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"></a>
        </div>
        <div className="py-3 px-5  ">
          <button className="w-full text-sm text-center font-medium text-blue-600 hover:underline dark:text-neutral-200 ">
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
