import Sidebar from "../../../../components/Sidebar/Sidebar";
import "../adminLayout.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-wrapper">
      <Sidebar />
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
