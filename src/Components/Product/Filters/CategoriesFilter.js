import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  fetchSubCategory,
  fetchSubSubCategory,
} from "../../CategoryManagement/categoriesAPI";

function CategoriesFilter({
  selectedSubCategories,
  setSelectedSubCategories,
  selectedSubSubCategories,
  setSelectedSubSubCategories,
}) {
  const {
    categories = [],
    loadingCategories = false,
    subCategories = [],
    loadingSubCategories = false,
    subSubCategories = {},
    loadingSubSubCategories = false,
  } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [openSubCategoryId, setOpenSubCategoryId] = useState(null);

  const handleCategoryClick = async (id) => {
    if (openCategoryId === id) {
      setOpenCategoryId(null);
      return;
    }

    setOpenCategoryId(id);

    const res = await dispatch(fetchSubCategory(id));

    if (res.payload) {
      res.payload.forEach((sub) => {
        dispatch(fetchSubSubCategory(sub._id));
      });
    }
  };

  const handleSubCategoryClick = (id) => {
    if (openSubCategoryId === id) {
      setOpenSubCategoryId(null);
    } else {
      setOpenSubCategoryId(id);
    }
  };

  const handleSubCategoryChange = (id) => {
    setSelectedSubCategories(
      (prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id) // remove
          : [...prev, id], // add
    );
  };
  const handleSubSubCategoryChange = (id) => {
    setSelectedSubSubCategories(
      (prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id) // remove
          : [...prev, id], // add
    );
  };

  return (
    <ul className="space-y-5">
      {loadingCategories ? (
        <li className="text-[var(--secondary)] pt-5">Loading categories...</li>
      ) : categories.length === 0 ? (
        <li className="text-[var(--secondary)] pt-5">No categories found</li>
      ) : (
        categories.map((item) => (
          <li key={item._id}>
            {/* Category Row */}
            <div
              onClick={() => handleCategoryClick(item._id)}
              className="flex justify-between items-center cursor-pointer"
            >
              <span>{item.name}</span>

              {openCategoryId === item._id ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </div>
            {/* SubCategories */}
            {openCategoryId === item._id && (
              <ul className="pl-3">
                {loadingSubCategories ? (
                  <li className="text-[var(--secondary)] pt-5">
                    Loading sub-categories...
                  </li>
                ) : subCategories.length === 0 ? (
                  <li className="text-[var(--secondary)] pt-5">
                    No sub-categories found
                  </li>
                ) : (
                  subCategories.map((sub) => {
                    const subSubs = subSubCategories[sub._id] || [];
                    const hasSubSub = subSubs.length > 0;

                    return (
                      <li key={sub._id} className="flex flex-col pt-5">
                        <div
                          onClick={() => {
                            if (hasSubSub) {
                              handleSubCategoryClick(sub._id);
                            }
                            handleSubCategoryChange(sub._id); // ALWAYS select on row click
                          }}
                          className="flex justify-between items-center cursor-pointer"
                        >
                          <span>{sub.name}</span>

                          {hasSubSub ? (
                            openSubCategoryId === sub._id ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )
                          ) : (
                            <input
                              type="checkbox"
                              checked={selectedSubCategories.includes(sub._id)}
                              className="w-5 h-5"
                            />
                          )}
                        </div>

                        {/* SubSubCategories */}
                        {hasSubSub && openSubCategoryId === sub._id && (
                          <ul className="pl-5 pt-3">
                            {loadingSubSubCategories && subSubs.length === 0 ? (
                              <li className="text-[var(--secondary)] pt-3">
                                Loading sub-sub-categories...
                              </li>
                            ) : subSubs.length === 0 ? (
                              <li className="text-[var(--secondary)] pt-3">
                                No sub-sub-categories found
                              </li>
                            ) : (
                              subSubs.map((subsub) => (
                                <li
                                  key={subsub._id}
                                  onClick={() =>
                                    handleSubSubCategoryChange(subsub._id)
                                  }
                                  className="flex justify-between items-center pt-3 cursor-pointer"
                                >
                                  <span>{subsub.name}</span>

                                  <input
                                    type="checkbox"
                                    checked={selectedSubSubCategories.includes(
                                      subsub._id,
                                    )}
                                    className="w-5 h-5"
                                  />
                                </li>
                              ))
                            )}
                          </ul>
                        )}
                      </li>
                    );
                  })
                )}
              </ul>
            )}
          </li>
        ))
      )}
    </ul>
  );
}

export default CategoriesFilter;
