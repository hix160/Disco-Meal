import { useState } from "react";
import PropTypes from "prop-types";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery); // Update the state with user input
    onSearch(newQuery); // Trigger the search instantly
  };

  return (
    <div style={{ display: "flex" }}>
      <input
        type="text"
        placeholder="Meklēt produktu.."
        value={query}
        onChange={handleInputChange}
        style={{
          width: "300px",
          padding: "10px",
          border: "1px solid rgba(0,0,0,0.5)",
          backgroundColor:"rgba(0,0,0,0)",
          borderRadius: "1vh",
        }}
      />
    </div>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
