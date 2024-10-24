import Layout from "../../layouts/AuthLayout";

export default function ReviewStockOrder() {
  return (
    <div>
      <Layout>
        <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto my-4 sm:my-10">
          <div className="mb-5 pb-5 flex justify-between items-center border-b border-gray-200 dark:border-neutral-700">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-neutral-200">
                Invoice
              </h2>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
