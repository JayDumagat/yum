import Header from "../components/Header";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import PropTypes from "prop-types";
import Breadcrumb from "../components/Breadcrumb";
import Backdrop from "../components/Backdrop";
export default function AuthLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <Backdrop />
      <Header />
      <Breadcrumb onClick={toggleSidebar} />

      <Sidebar />
      <div className="w-full lg:ps-64 lg:mt-10">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-100 h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
