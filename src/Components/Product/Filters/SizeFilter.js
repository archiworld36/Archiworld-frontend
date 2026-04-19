import React from "react";
import { Slider } from "primereact/slider";

function SizeFilter({
  lengthRange,
  setLengthRange,
  widthRange,
  setWidthRange,
  heightRange,
  setHeightRange,
}) {
  return (
    <div className="px-5">
      <div className="relative">
        <label className="font-normal">Length</label>
        <Slider
          value={lengthRange}
          onChange={(e) => {
            const [min, max] = e.value;
            if (min <= max) {
              setLengthRange([min, max]);
            }
          }}
          range
          min={0}
          max={200}
          className="mt-6"
        />
        <div className="flex gap-2 items-center justify-center mt-8">
          <div className="relative">
            <input
              type="number"
              value={lengthRange[0]}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value <= lengthRange[1]) {
                  setLengthRange([value, lengthRange[1]]);
                }
              }}
              className="pr-12 pl-5 w-full py-2 border border-[var(--stroke)] rounded-none focus:outline-none shadow-none bg-white"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              cm
            </div>
          </div>
          <div>-</div>
          <div className="relative">
            <input
              type="number"
              value={lengthRange[1]}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= lengthRange[0]) {
                  setLengthRange([lengthRange[0], value]);
                }
              }}
              className="pr-12 pl-5 w-full py-2 border border-[var(--stroke)] rounded-none focus:outline-none shadow-none bg-white"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              cm
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 relative">
        <label className="font-normal">Width</label>
        <Slider
          value={widthRange}
          onChange={(e) => {
            const [min, max] = e.value;
            if (min <= max) {
              setWidthRange([min, max]);
            }
          }}
          range
          min={0}
          max={200}
          className="mt-6"
        />

        <div className="flex gap-2 items-center justify-center mt-8">
          <div className="relative">
            <input
              type="number"
              value={widthRange[0]}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value <= widthRange[1]) {
                  setWidthRange([value, widthRange[1]]);
                }
              }}
              className="pr-12 pl-5 w-full py-2 border border-[var(--stroke)] rounded-none focus:outline-none shadow-none bg-white"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              cm
            </div>
          </div>
          <div>-</div>
          <div className="relative">
            <input
              type="number"
              value={widthRange[1]}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= widthRange[0]) {
                  setWidthRange([widthRange[0], value]);
                }
              }}
              className="pr-12 pl-5 w-full py-2 border border-[var(--stroke)] rounded-none focus:outline-none shadow-none bg-white"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              cm
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 relative">
        <label className="font-normal">Height</label>
        <Slider
          value={heightRange}
          onChange={(e) => {
            const [min, max] = e.value;
            if (min <= max) {
              setHeightRange([min, max]);
            }
          }}
          range
          min={0}
          max={200}
          className="mt-6"
        />
        <div className="flex gap-2 items-center justify-center mt-8">
          <div className="relative">
            <input
              type="number"
              value={heightRange[0]}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value <= heightRange[1]) {
                  setHeightRange([value, heightRange[1]]);
                }
              }}
              className="pr-12 pl-5 w-full py-2 border border-[var(--stroke)] rounded-none focus:outline-none shadow-none bg-white"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              cm
            </div>
          </div>
          <div>-</div>
          <div className="relative">
            <input
              type="number"
              value={heightRange[1]}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= heightRange[0]) {
                  setHeightRange([heightRange[0], value]);
                }
              }}
              className="pr-12 pl-5 w-full py-2 border border-[var(--stroke)] rounded-none focus:outline-none shadow-none bg-white"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              cm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SizeFilter;
