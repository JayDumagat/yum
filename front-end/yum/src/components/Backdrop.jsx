import { useSidebarStore } from "../store/sidebarStore";

export default function Backdrop() {
  const { isOpen, toggleSidebar } = useSidebarStore();
  return (
    <div>
      <span
        onClick={toggleSidebar}
        className={` w-full h-full fixed  z-50  ${
          isOpen
            ? " backdrop-brightness-75 translate-x-0"
            : " backdrop-brightness-100 -translate-x-full"
        } transition-opacity  duration-300 lg:hidden`}
      />
    </div>
  );
}
