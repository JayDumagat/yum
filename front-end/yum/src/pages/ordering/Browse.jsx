import { Tab } from "@headlessui/react";
import OrderingLayout from "../../layouts/OrderingLayout";

// Dummy categories and products data
const dummyCategories = [
  {
    id: 1,
    name: "Pizza",
    products: [
      {
        id: 1,
        name: "Margherita",
        description: "Tomato, mozzarella, basil",
        image:
          "https://images.unsplash.com/photo-1680868543815-b8666dba60f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&q=80",
      },
      {
        id: 2,
        name: "Pepperoni",
        description: "Pepperoni, mozzarella, tomato sauce",
        image:
          "https://images.unsplash.com/photo-1604908177525-f4b2ce50066a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHBlcHBlcm9uaXxlbnwwfHx8fDE2OTcwMDg5NzU&ixlib=rb-1.2.1&q=80&w=400",
      },
    ],
  },
  {
    id: 2,
    name: "Burgers",
    products: [
      {
        id: 3,
        name: "Cheeseburger",
        description: "Beef, cheddar, lettuce, tomato",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&q=80",
      },
      {
        id: 4,
        name: "Bacon Burger",
        description: "Beef, bacon, cheddar, BBQ sauce",
        image:
          "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&q=80",
      },
    ],
  },
  {
    id: 3,
    name: "Sushi",
    products: [
      {
        id: 5,
        name: "Salmon Roll",
        description: "Salmon, avocado, seaweed",
        image:
          "https://images.unsplash.com/photo-1514910768536-0bc387a848b8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&q=80",
      },
      {
        id: 6,
        name: "Tuna Roll",
        description: "Tuna, cucumber, rice",
        image:
          "https://images.unsplash.com/photo-1562967916-eb82221dfb1b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&q=80",
      },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Browse = () => {
  return (
    <OrderingLayout>
      <div className="w-full px-4 py-16 sm:px-0">
        <Tab.Group>
          <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
            {dummyCategories.map((category) => (
              <Tab
                key={category.id}
                className={({ selected }) =>
                  classNames(
                    "w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg",
                    "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60",
                    selected
                      ? "bg-white shadow"
                      : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                  )
                }
              >
                {category.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {dummyCategories.map((category) => (
              <Tab.Panel
                key={category.id}
                className={classNames(
                  "bg-white rounded-xl p-3",
                  "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
                )}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
                    >
                      <img
                        className="w-full h-auto rounded-t-xl"
                        src={product.image}
                        alt={product.name}
                      />
                      <div className="p-4 md:p-5">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-gray-500 dark:text-neutral-400">
                          {product.description}
                        </p>
                        <a
                          className="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                          href="#"
                        >
                          Order now
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </OrderingLayout>
  );
};

export default Browse;
