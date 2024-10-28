import React, { useEffect, useState } from "react";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const COUNTRY_API = "https://crio-location-selector.onrender.com/countries";

  // Only construct URLs when we have the required parameters
  const getStateURL = (countryName) => {
    if (!countryName) return null;
    return `https://crio-location-selector.onrender.com/country=${countryName}/states`;
  };

  const getCityURL = (countryName, stateName) => {
    if (!countryName || !stateName) return null;
    return `https://crio-location-selector.onrender.com/country=${countryName}/state=${stateName}/cities`;
  };

  // Fetch countries on mount
  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch(COUNTRY_API);
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    async function fetchStates() {
      // Reset states and cities when country changes
      setStates([]);
      setCities([]);
      setSelectedState("");
      setSelectedCity("");

      // Only fetch if we have a selected country
      if (selectedCountry) {
        const url = getStateURL(selectedCountry);
        try {
          const response = await fetch(url);
          const data = await response.json();
          setStates(data);
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      }
    }
    fetchStates();
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    async function fetchCities() {
      // Reset cities when state changes
      setCities([]);
      setSelectedCity("");

      // Only fetch if we have both country and state
      if (selectedCountry && selectedState) {
        const url = getCityURL(selectedCountry, selectedState);
        try {
          const response = await fetch(url);
          const data = await response.json();
          setCities(data);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      }
    }
    fetchCities();
  }, [selectedCountry, selectedState]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Select Location</h1>

      <div className="space-y-4">
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-64 p-2 border rounded"
        >
          <option value="">Select Country</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          disabled={!selectedCountry}
          className="w-64 p-2 border rounded"
        >
          <option value="">Select State</option>
          {states.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedState}
          className="w-64 p-2 border rounded"
        >
          <option value="">Select City</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>

        {selectedCountry && (
          <div className="mt-4">
            <p>
              {selectedCity &&
                `You Selected ${selectedCity}, ${selectedState}, ${selectedCountry}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
