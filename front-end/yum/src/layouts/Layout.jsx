import PropTypes from "prop-types";

export default function Layout({ children }) {
  Layout.propTypes = {
    children: PropTypes.node.isRequired,
  };
  return (
    <div>
      <div className=" w-full h-screen flex justify-center items-center  bg-white border border-gray-200  shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        {/* Layout1*/}
        <div className="w-full ">{children}</div>
      </div>
      <div>{/*Layout2*/}</div>
    </div>
  );
}
