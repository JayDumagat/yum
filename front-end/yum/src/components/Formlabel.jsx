import PropTypes from "prop-types";

const FormLabel = ({ htmlFor, value, className = "" }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm mb-2 dark:text-white ${className}`}
    >
      {value}
    </label>
  );
};

FormLabel.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default FormLabel;
