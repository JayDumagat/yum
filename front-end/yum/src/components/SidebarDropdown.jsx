import PropTypes from "prop-types";
const SidebarDropdown = ({ isOpen, toggle, title, icon, children }) => {
  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        className="w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:focus:bg-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200"
      >
        {icon}
        {title}
        <svg
          className={`ms-auto size-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
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
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        className={`w-full overflow-hidden transition-[height] duration-300 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <ul className="ps-8 pt-1 space-y-1">{children}</ul>
      </div>
    </div>
  );
};

export default SidebarDropdown;

SidebarDropdown.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.element,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};
