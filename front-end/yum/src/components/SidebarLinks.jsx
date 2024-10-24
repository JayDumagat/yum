import PropTypes from "prop-types";
import { useLocation, Link } from "react-router-dom";

function SidebarLinks({ link, title, icon }) {
  const location = useLocation();
  const isActivePath = location.pathname.startsWith(link);

  return (
    <div>
      <Link
        to={link}
        className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600 ${
          isActivePath ? "bg-gray-100 dark:bg-neutral-600" : ""
        }`}
      >
        {icon}
        {title}
      </Link>
    </div>
  );
}

SidebarLinks.propTypes = {
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

export default SidebarLinks;
