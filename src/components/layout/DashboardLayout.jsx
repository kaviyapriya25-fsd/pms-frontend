import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {

  return (

    <div style={{ display: "flex", width: "100%", minHeight: "100vh", overflowX: "hidden" }}>

      <Sidebar />

      <div
        style={{
          marginLeft: "260px",
          width: "calc(100% - 260px)",
          background: "#f4f7fc",
          minHeight: "100vh",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >

        <Navbar />

        <div
          style={{
            padding: "25px",
            boxSizing: "border-box",
          }}
        >
          {children}
        </div>

      </div>

    </div>

  );

}

export default DashboardLayout;