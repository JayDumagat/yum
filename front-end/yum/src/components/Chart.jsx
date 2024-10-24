import { PropTypes } from "prop-types";

const Chart = ({ title, value, changePercentage, chartId }) => {
  return (
    <div className="container mx-auto p-4">
      <div className="p-4 md:p-5 min-h-[410px] flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm text-gray-500 dark:text-neutral-500">
              {title}
            </h2>
            <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
              {value}
            </p>
          </div>

          <div>
            <span className="py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-500">
              <svg
                className="inline-block size-3.5"
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
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
              21%
            </span>
            <span className="py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-teal-100 text-teal-800 dark:bg-teal-500/10 dark:text-teal-500">
              <svg
                className="inline-block size-3.5"
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
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
              {changePercentage}%
            </span>
          </div>
        </div>

        <div id={chartId}></div>
      </div>
    </div>
  );
};

export default Chart;
Chart.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  changePercentage: PropTypes.number.isRequired,
  chartId: PropTypes.number.isRequired,
};
