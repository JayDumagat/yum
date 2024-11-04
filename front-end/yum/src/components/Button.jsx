import PropTypes from "prop-types";
import classNames from "classnames";

const Button = ({ onClick, disabled, className, children }) => {
  const baseStyles =
    "w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-[#E6AF2E] text-[#272829]";
  const hoverStyles = "hover:bg-[#F5D061]";
  const focusStyles = "focus:outline-none focus:bg-[#4b4b4b]";
  const disabledStyles = "disabled:opacity-50 disabled:pointer-events-none";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        baseStyles,
        hoverStyles,
        focusStyles,
        disabledStyles,
        className
      )}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  onClick: () => {},
  disabled: false,
  className: "",
};

export default Button;
