import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { LocateFixed, Search } from "lucide-react";

function LocationFilter({
  locationArea,
  selectedLocations,
  setSelectedLocations,
}) {
  const [searchTermLocation, setSearchTermLocation] = useState("");
  const filteredLocations = locationArea.filter((item) =>
    item.label.toLowerCase().includes(searchTermLocation.toLowerCase()),
  );

  const handleLocationChange = (value) => {
    if (value === "Pan India") {
      // If Pan India selected → remove others
      if (selectedLocations.includes("Pan India")) {
        setSelectedLocations([]);
      } else {
        setSelectedLocations(["Pan India"]);
      }
    } else {
      let updated = [...selectedLocations];
      // Remove Pan India if selecting states
      updated = updated.filter((loc) => loc !== "Pan India");
      if (updated.includes(value)) {
        updated = updated.filter((loc) => loc !== value);
      } else {
        updated.push(value);
      }
      setSelectedLocations(updated);
    }
  };
  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        );
        const data = await res.json();

        const state = data.address.state;

        if (state) {
          // select state
          setSearchTermLocation(state);

          // optionally store selected state
          setSelectedLocations([state]);
        }
      } catch (error) {
        console.error("Location fetch failed", error);
      }
    });
  };

  return (
    <>
      <div className="relative">
        <InputText
          type="search"
          placeholder="Search more states..."
          value={searchTermLocation}
          onChange={(e) => setSearchTermLocation(e.target.value)}
          className="pr-10 pl-5 w-full py-2 border border-black rounded-none focus:outline-none shadow-none bg-white"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5" />
        </div>
      </div>
      <ul className="space-y-5 pt-5">
        <li>
          <div
            onClick={handleUseCurrentLocation}
            className="flex gap-2 items-center cursor-pointer"
          >
            <LocateFixed className="w-6 h-6" />
            <span className="flex gap-2">Use My Current Location</span>
          </div>
        </li>
        {filteredLocations.slice(0, 10).map((item) => (
          <li key={item._id}>
            <div className="flex justify-between items-center cursor-pointer">
              <span className="flex gap-2">{item.label}</span>
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={selectedLocations.includes(item.value)}
                disabled={
                  selectedLocations.includes("Pan India") &&
                  item.value !== "Pan India"
                }
                onChange={() => handleLocationChange(item.value)}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default LocationFilter;
