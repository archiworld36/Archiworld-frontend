import React from "react";
import { Slider } from "primereact/slider";

function PriceFilter({ priceRange, setPriceRange }) {
  return (
    <>
      <div className="relative px-5">
        <label className="font-normal">Price Range</label>
        <Slider
          value={priceRange}
          onChange={(e) => {
            const [min, max] = e.value;
            if (min <= max) {
              setPriceRange([min, max]);
            }
          }}
          range
          min={0}
          max={1000000}
          step={1000}
          className="mt-6"
        />

        <div className="flex gap-2 items-center justify-center mt-8">
          <div className="relative">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value <= priceRange[1]) {
                  setPriceRange([priceRange[1], value]);
                }
              }}
              className="pr-12 pl-5 w-full py-2 border border-[var(--stroke)] rounded-none focus:outline-none shadow-none bg-white"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              ₹
            </div>
          </div>
          <div className="">-</div>
          <div className="relative">
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= priceRange[0]) {
                  setPriceRange([priceRange[0], value]);
                }
              }}
              className="pr-12 pl-5 w-full py-2 border border-[var(--stroke)] rounded-none focus:outline-none shadow-none bg-white"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              ₹
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PriceFilter;
