import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { fetchCities } from "../util/route";
import { Box, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface OptionType {
  value: string;
  label: string;
}

interface SearchBarProps {
  onCitySelect: (lat: number, lon: number, label: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onCitySelect }) => {
  const [searchValue, setSearchValue] = useState<OptionType | null>(null);

  const loadOptions = async (inputValue: string) => {
    if (!inputValue.trim()) {
      return { options: [] }; 
    }
    const cities = await fetchCities(inputValue);
    return { options: cities };
  };
  

  const onChangeHandler = (selectedCity: OptionType | null) => {
    if (selectedCity) {
      const [lat, lon] = selectedCity.value.split(" ").map(Number);
      onCitySelect(lat, lon, selectedCity.label);
      setSearchValue(null);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 400, mx: "auto" }}>
      <AsyncPaginate
        placeholder="Search for a city"
        debounceTimeout={600}
        value={searchValue}
        onChange={onChangeHandler}
        loadOptions={loadOptions}
        components={{
          DropdownIndicator: () => (
            <InputAdornment position="end">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        styles={{
          control: (provided) => ({
            ...provided,
            padding: "6px",
            borderRadius: "8px",
            boxShadow: "none",
            borderColor: "#ccc",
            "&:hover": { borderColor: "#888" },
          }),
        }}
      />
    </Box>
  );
};

export default SearchBar;
