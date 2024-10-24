import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";
import Layout from "../../layouts/AuthLayout";
import ChartCard from "../../components/ChartCard";
import ChartStat from "../../components/ChartStat";

import Timeline from "../../components/Timeline";
import Table from "../../components/Table";

const Dashboard = () => {
  const navigate = useNavigate();
  const columns = [
    "Order",
    "Date",
    "Customer",
    "Payment Status",
    "Payment Method",
  ];
  const data = [
    ["#35463", "Aug 17, 2020, 5:48 (ET)", "Jase Marley", "Paid", "Paypal"],
    [
      "#35464",
      "Aug 18, 2020, 6:00 (ET)",
      "Alex Johnson",
      "Pending",
      "Mastercard",
    ],
    ["#35465", "Aug 20, 2020, 6:00 (ET)", "Kurt Maxwell", "Declined", "Visa"],
    ["#35465", "Aug 20, 2020, 6:00 (ET)", "Kurt Maxwell", "Declined", "Visa"],
    ["#35465", "Aug 20, 2020, 6:00 (ET)", "Kurt Maxwell", "Declined", "Visa"],
    ["#35465", "Aug 20, 2020, 6:00 (ET)", "Kurt Maxwell", "Declined", "Visa"],
    ["#35465", "Aug 20, 2020, 6:00 (ET)", "Kurt Maxwell", "Declined", "Visa"],
    ["#35465", "Aug 20, 2020, 6:00 (ET)", "Kurt Maxwell", "Declined", "Visa"],
    ["#35465", "Aug 20, 2020, 6:00 (ET)", "Kurt Maxwell", "Declined", "Visa"],
    ["#35465", "Aug 20, 2020, 6:00 (ET)", "Kurt Maxwell", "Declined", "Visa"],
    ["#35465", "Aug 20, 2020, 6:00 (ET)", "Kurt Maxwell", "Declined", "Visa"],
    ["#35465", "Aug 20, 2020, 6:00 (ET)", "Kurt Maxwell", "Declined", "Visa"],
    // Add more rows as needed
  ];
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login"); // Redirect to login if not authenticated
      } else {
        navigate("/overview");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div>
      <Layout>
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-start-1 md:col-end-6 md:row-start-1 md:row-end-2">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <ChartCard
                  title={"Ttl. Revenue"}
                  value={"$180,240"}
                  href={"/revenue/10"}
                />
                <ChartCard
                  title={"Ttl. Orders"}
                  value={"1047"}
                  href={"/revenue/10"}
                />
                <ChartCard
                  title={"Ttl. Menu"}
                  value={"120"}
                  href={"/revenue/10"}
                />
                <ChartCard
                  title={"Ttl. Staff"}
                  value={"180"}
                  className={"bg-[#E3170A] text-white"}
                  href={"/revenue/10"}
                />
              </div>
            </div>

            <div className="md:col-start-1 md:col-end-3 lg:col-end-4 md:row-start-2 md:row-end-3 ">
              <Table columns={columns} data={data} />
            </div>

            <div className="md:col-start-3 lg:col-start-4 md:col-end-6 md:row-start-2 md:row-end-3 ">
              <Timeline />
            </div>
          </div>
        </div>

        <ChartStat />
      </Layout>
    </div>
  );
};

export default Dashboard;
