import React from "react";

function ColorFilters({ selectedColors, setSelectedColors }) {
  const colors = [
    { code: "000000", name: "Black" },
    { code: "1447E6", name: "Blue" },
    { code: "008236", name: "Green" },
    { code: "FF8409", name: "Orange" },
    { code: "FF00AA", name: "Pink" },
    { code: "C0C0C0", name: "Silver" },
    { code: "FFFFFF", name: "White" },
    { code: "FFF70B", name: "Yellow" },
    { code: "808080", name: "Gray" },
    { code: "FF0000", name: "Red" },
  ];

  const handleColorsChange = (colorName) => {
    setSelectedColors((prev) => {
      if (prev.includes(colorName)) {
        // remove if already selected
        return prev.filter((c) => c !== colorName);
      } else {
        // add if not selected
        return [...prev, colorName];
      }
    });
  };
  return (
      <ul className="space-y-5">
        {colors.map((item) => (
          <li key={item.code}>
            <div
              onClick={() => handleColorsChange(item.name)}
              className="flex justify-between items-center cursor-pointer"
            >
              <span className="flex gap-2">
                <div
                  style={{ backgroundColor: `#${item.code}` }}
                  className={`w-5 h-5 p-1 rounded-full overflow-hidden`}
                ></div>
                {item.name}
              </span>
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={selectedColors.includes(item.name)}
              />
            </div>
          </li>
        ))}
      </ul>
  );
}

export default ColorFilters;
