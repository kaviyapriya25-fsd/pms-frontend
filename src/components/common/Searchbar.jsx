import { FaSearch, FaTimes } from "react-icons/fa";

function SearchBar({ value, onChange, onSearch, onClear, placeholder = "Search..." }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    onChange("");
    if (onClear) onClear();
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          alignItems: "center",
          background: "#ffffff",
          border: "1.5px solid #d1d5db",
          borderRadius: "10px",
          padding: "8px 14px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <FaSearch style={{ color: "#9ca3af", marginRight: "10px", fontSize: "14px", flexShrink: 0 }} />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            border: "none",
            outline: "none",
            width: "100%",
            fontSize: "14px",
            color: "#111827",
            background: "transparent",
          }}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            title="Clear search"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "4px",
              fontSize: "13px",
              borderRadius: "50%",
            }}
          >
            <FaTimes />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleSearchClick}
        style={{
          background: "#2563eb",
          color: "#ffffff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "10px",
          fontWeight: "600",
          fontSize: "14px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
          whiteSpace: "nowrap",
          transition: "background 0.2s ease-in-out",
        }}
      >
        <FaSearch style={{ fontSize: "13px" }} /> Search
      </button>
    </div>
  );
}

export default SearchBar;
