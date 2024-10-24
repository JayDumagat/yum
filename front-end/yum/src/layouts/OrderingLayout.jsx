import PropTypes from "prop-types";
import MobileNav from "../pages/ordering/components/MobileNav";

export default function OrderingLayout({ children }) {
  return (
    <div className="w-full min-h-screen max-w-md mx-auto px-4 pt-4 lg:max-w-lg">
      <MobileNav />
      {children}
    </div>
  );
}

OrderingLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
