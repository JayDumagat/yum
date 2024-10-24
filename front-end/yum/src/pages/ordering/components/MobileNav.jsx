import { useState } from "react";
export default function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <>
      {/* Header */}
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-blue-600 text-sm py-3">
        <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <a
              className="flex-none text-xl font-black text-white focus:outline-none focus:opacity-80"
              href="#"
            >
              Yum!
            </a>
            <div className="sm:hidden">
              <button
                type="button"
                onClick={toggleMenu}
                className="relative size-7 flex justify-center items-center gap-2 rounded-lg border border-white/20 font-medium bg-blue-600 text-white shadow-sm align-middle hover:bg-white/10 focus:outline-none focus:bg-white/10 text-sm"
              >
                <svg
                  className={`shrink-0 size-4 ${menuOpen ? "hidden" : "block"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
                <svg
                  className={`shrink-0 size-4 ${menuOpen ? "block" : "hidden"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div
            className={`sm:flex sm:flex-grow ${menuOpen ? "block" : "hidden"}`}
          >
            <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5">
              <a
                className="font-medium text-white hover:opacity-90 focus:outline-none"
                href="/ordering-home"
              >
                Home
              </a>
              <a
                className="font-medium text-white hover:opacity-90 focus:outline-none"
                href="/ordering-browse"
              >
                Browse
              </a>
              <a
                className="font-medium text-gray-300 hover:text-white focus:outline-none focus:text-white"
                href="/ordering-cart"
              >
                Cart
              </a>
              <a
                className="font-medium text-gray-300 hover:text-white focus:outline-none focus:text-white"
                href="/ordering-orders"
              >
                Orders
              </a>
              <a
                className="font-medium text-gray-300 hover:text-white focus:outline-none focus:text-white"
                href="/ordering-profile"
              >
                Profile
              </a>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
