import PropTypes from "prop-types";

const SidebarDropdownLinks = ({ href, name }) => (
  <div>
    <li>
      <a
        className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none  focus:bg-gray-100   dark:text-neutral-200 dark:hover:bg-neutral-600"
        href={href}
      >
        {name}
      </a>
    </li>
  </div>
);

export default SidebarDropdownLinks;

SidebarDropdownLinks.propTypes = {
  name: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
};
