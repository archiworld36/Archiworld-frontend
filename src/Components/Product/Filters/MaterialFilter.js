import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { useSelector } from "react-redux";
import { Search } from "lucide-react";

function MaterialFilter({ selectedMaterial, setSelectedMaterial }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { materialOptions = [] } = useSelector((state) => state.materialOption);
  const filteredMaterials = materialOptions.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const handleMaterialClick = (id) => {
    setSelectedMaterial((prev) => {
      if (prev.includes(id)) {
        // remove if already selected
        return prev.filter((c) => c !== id);
      } else {
        // add if not selected
        return [...prev, id];
      }
    });
  };
  return (
    <>
      <div className="relative">
        <InputText
          type="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10 pl-5 w-full py-2 border border-black rounded-none focus:outline-none shadow-none bg-white"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5" />
        </div>
      </div>
      <ul className="space-y-5 pt-5">
        {filteredMaterials.length === 0 ? (
          <li className="text-[var(--secondary)]">No materials found</li>
        ) : (
          filteredMaterials.map((item) => (
            <li
              key={item._id}
              onClick={() => handleMaterialClick(item._id)}
              className="cursor-pointer"
            >
              <div className="flex justify-between items-center cursor-pointer">
                <span className="flex gap-2">{item.name}</span>
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  checked={selectedMaterial.includes(item._id)}
                />
              </div>
            </li>
          ))
        )}
      </ul>
    </>
  );
}

export default MaterialFilter;
