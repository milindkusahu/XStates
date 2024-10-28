import React, { useEffect, useState } from "react";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const COUNTRY_API = "https://crio-location-selector.onrender.com/countries";

  const getStateURL = (countryName) => {
    if (!countryName) return null;
    return `https://crio-location-selector.onrender.com/country=${countryName}/states`;
  };

  const getCityURL = (countryName, stateName) => {
    if (!countryName || !stateName) return null;
    return `https://crio-location-selector.onrender.com/country=${countryName}/state=${stateName}/cities`;
  };

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

  useEffect(() => {
    async function fetchStates() {
      setStates([]);
      setCities([]);
      setSelectedState("");
      setSelectedCity("");

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

  useEffect(() => {
    async function fetchCities() {
      setCities([]);
      setSelectedCity("");

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
    <div>
      <h1>Select Location</h1>

      <div>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
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
        >
          <option value="">Select City</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>

        {selectedCity && selectedState && selectedCountry && (
          <p>
            You selected {selectedCity}, {selectedState}, {selectedCountry}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
