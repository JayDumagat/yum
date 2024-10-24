import { PropTypes } from "prop-types";
import { useState } from "react";
const FormSelect = ({ id, label, options, disabled = false }) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={selectedCategory}
        onChange={handleCategoryChange}
        disabled={disabled}
        className="py-2 px-3 pe-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value || option.label}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
FormSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
