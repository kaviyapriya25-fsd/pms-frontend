import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  return (
    <>
      <Sidebar />

      <div
        style={{
          marginLeft: "280px",
          minHeight: "100vh",
          background: "#f4f7fc"
        }}
      >
        <Navbar />

        <div
          style={{
            padding: "30px"
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;