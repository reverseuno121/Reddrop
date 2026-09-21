import { useState } from "react";
import indiaLocations from "../data/indiaLocations";
import "./styles/LocationSelector.css";

function LocationSelector({ onLocationChange }) {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");

  const states = Object.keys(indiaLocations);

  const districts = state
    ? Object.keys(indiaLocations[state])
    : [];

  const cities =
    state && district
      ? indiaLocations[state][district]
      : [];

  const handleStateChange = (e) => {
    const selectedState = e.target.value;

    setState(selectedState);
    setDistrict("");
    setCity("");

    if (onLocationChange) {
      onLocationChange({
        state: selectedState,
        district: "",
        city: ""
      });
    }
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;

    setDistrict(selectedDistrict);
    setCity("");

    if (onLocationChange) {
      onLocationChange({
        state,
        district: selectedDistrict,
        city: ""
      });
    }
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;

    setCity(selectedCity);

    if (onLocationChange) {
      onLocationChange({
        state,
        district,
        city: selectedCity
      });
    }
  };

  return (
    <div className="location-selector">
      {/* State */}
      <div className="filter-group">
        <label htmlFor="state">
          State
        </label>

        <select
          id="state"
          value={state}
          onChange={handleStateChange}
        >
          <option value="">
            Select State
          </option>

          {states.map((stateName) => (
            <option
              key={stateName}
              value={stateName}
            >
              {stateName}
            </option>
          ))}
        </select>
      </div>

      {/* District */}
      <div className="filter-group">
        <label htmlFor="district">
          District
        </label>

        <select
          id="district"
          value={district}
          onChange={handleDistrictChange}
          disabled={!state}
        >
          <option value="">
            Select District
          </option>

          {districts.map((districtName) => (
            <option
              key={districtName}
              value={districtName}
            >
              {districtName}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className="filter-group">
        <label htmlFor="city">
          City
        </label>

        <select
          id="city"
          value={city}
          onChange={handleCityChange}
          disabled={!district}
        >
          <option value="">
            Select City
          </option>

          {cities.map((cityName) => (
            <option
              key={cityName}
              value={cityName}
            >
              {cityName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default LocationSelector;