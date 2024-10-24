export default function Timeline() {
  return (
    <div className="p-4 md:p-5 h-[310px] overflow-y-scroll flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500 dark:text-neutral-500">
            Timeline
          </h2>
          <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
            Activity
          </p>
        </div>
      </div>

      {/* Example timeline entries */}
      <div className="flex gap-x-3">
        <div className="w-16 text-end">
          <span className="text-xs text-gray-500 dark:text-neutral-400">
            12:05PM
          </span>
        </div>
        <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
          <div className="relative z-10 size-7 flex justify-center items-center">
            <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
          </div>
        </div>
        <div className="grow pt-0.5 pb-8">
          <h5 className="flex gap-x-1.5 text-sm font-medium text-gray-800 dark:text-white">
            Completed a POS transaction for $45.00
          </h5>
          <p className="mt-1 text-xs text-gray-600 dark:text-neutral-400">
            Transaction ID: #12345
          </p>
        </div>
      </div>

      <div className="flex gap-x-3">
        <div className="w-16 text-end">
          <span className="text-xs text-gray-500 dark:text-neutral-400">
            12:10PM
          </span>
        </div>
        <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
          <div className="relative z-10 size-7 flex justify-center items-center">
            <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
          </div>
        </div>
        <div className="grow pt-0.5 pb-8">
          <h5 className="flex gap-x-1.5 text-sm font-medium text-gray-800 dark:text-white">
            Inventory stock alert for &apos;Chips&apos;
          </h5>
          <p className="mt-1 text-xs text-gray-600 dark:text-neutral-400">
            Only 5 units left in stock.
          </p>
        </div>
      </div>

      <div className="flex gap-x-3">
        <div className="w-16 text-end">
          <span className="text-xs text-gray-500 dark:text-neutral-400">
            12:15PM
          </span>
        </div>
        <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
          <div className="relative z-10 size-7 flex justify-center items-center">
            <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
          </div>
        </div>
        <div className="grow pt-0.5 pb-8">
          <h5 className="flex gap-x-1.5 text-sm font-medium text-gray-800 dark:text-white">
            Menu item &apos;Burger&apos; updated
          </h5>
          <p className="mt-1 text-xs text-gray-600 dark:text-neutral-400">
            Price changed from $10 to $12.
          </p>
        </div>
      </div>

      <div className="flex gap-x-3">
        <div className="w-16 text-end">
          <span className="text-xs text-gray-500 dark:text-neutral-400">
            12:20PM
          </span>
        </div>
        <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
          <div className="relative z-10 size-7 flex justify-center items-center">
            <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
          </div>
        </div>
        <div className="grow pt-0.5 pb-8">
          <h5 className="flex gap-x-1.5 text-sm font-medium text-gray-800 dark:text-white">
            Canceled transaction ID: #12344
          </h5>
          <p className="mt-1 text-xs text-gray-600 dark:text-neutral-400">
            Reason: Customer request.
          </p>
        </div>
      </div>

      <div className="flex gap-x-3">
        <div className="w-16 text-end">
          <span className="text-xs text-gray-500 dark:text-neutral-400">
            12:30PM
          </span>
        </div>
        <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
          <div className="relative z-10 size-7 flex justify-center items-center">
            <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
          </div>
        </div>
        <div className="grow pt-0.5 pb-8">
          <h5 className="flex gap-x-1.5 text-sm font-medium text-gray-800 dark:text-white">
            Added new item &apos;Fresh Juice&apos; to the menu
          </h5>
          <p className="mt-1 text-xs text-gray-600 dark:text-neutral-400">
            Available in various flavors.
          </p>
        </div>
      </div>
    </div>
  );
}
