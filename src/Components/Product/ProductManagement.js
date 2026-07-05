import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Edit,
  Filter,
  Plus,
  Search,
  Trash2,
  User2,
} from "lucide-react";
import { InputText } from "primereact/inputtext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/Card";
import { Button } from "../../ui/buttons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Link, useLocation, useSearchParams } from "wouter";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Paginator } from "primereact/paginator";
import { template1 } from "../../ui/pagination";
import { deleteProduct, getProductsByUserId } from "./ProductAPI";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { ScrollArea } from "../../ui/scrollarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import ColorFilters from "./Filters/ColorFilters";
import MaterialFilter from "./Filters/MaterialFilter";
import BrandFilter from "./Filters/BrandFilter";
import SizeFilter from "./Filters/SizeFilter";
import PriceFilter from "./Filters/PriceFilter";
import LocationFilter from "./Filters/LocationFilter";
import { fetchBrandOptions } from "../BrandOptions/brandOptionsAPI";
import { fetchCategory } from "../CategoryManagement/categoriesAPI";
import { fetchMaterialOptions } from "../MaterialOptions/materialOptionsAPI";
import CategoriesFilter from "./Filters/CategoriesFilter";
import { State } from "country-state-city";

export default function ProductManagement() {
  const dispatch = useDispatch();
  const {
    products = [],
    total,
    loading,
    error,
  } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const [locationArea, setLocationArea] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [, navigate] = useLocation();
  const [searchParams] = useSearchParams();

  const getArrayParam = (key) =>
    searchParams.get(key)?.split(",").filter(Boolean) || [];

  const getRangeParam = (key, defaultValue) => {
    const value = searchParams.get(key);
    if (!value) return defaultValue;

    const [min, max] = value.split("-").map(Number);
    return [min, max];
  };
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 0,
  );
  const [rows, setRows] = useState(Number(searchParams.get("rows")) || 24);

  const [selectedLocations, setSelectedLocations] = useState(
    getArrayParam("locations"),
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState(
    getArrayParam("subCategories"),
  );
  const [selectedSubSubCategories, setSelectedSubSubCategories] = useState(
    getArrayParam("subSubCategories"),
  );
  const [selectedColors, setSelectedColors] = useState(getArrayParam("colors"));
  const [selectedMaterial, setSelectedMaterial] = useState(
    getArrayParam("materials"),
  );
  const [selectedBrand, setSelectedBrand] = useState(getArrayParam("brands"));

  const [lengthRange, setLengthRange] = useState(
    getRangeParam("length", [0, 200]),
  );
  const [widthRange, setWidthRange] = useState(
    getRangeParam("width", [0, 200]),
  );
  const [heightRange, setHeightRange] = useState(
    getRangeParam("height", [0, 200]),
  );
  const [priceRange, setPriceRange] = useState(
    getRangeParam("price", [0, 1000000]),
  );

  const [featuredProduct, setFeaturedProduct] = useState(
    searchParams.get("featuredProduct") === "true",
  );
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const debounceTimeout = useRef(null);
  const isFirstPageReset = useRef(true);

  // Update debouncedSearchTerm with a delay
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // 500ms debounce delay
  }, [searchTerm]);

  const fetchBrandOptionsOnce = useCallback(() => {
    dispatch(fetchBrandOptions());
  }, [dispatch]);
  const fetchCategoriesOnce = useCallback(() => {
    dispatch(fetchCategory());
  }, [dispatch]);
  const fetchMaterialOptionsOnce = useCallback(() => {
    dispatch(fetchMaterialOptions());
  }, [dispatch]);

  // 👇 useEffect will only run once and call the fetch function
  useEffect(() => {
    fetchBrandOptionsOnce();
    fetchCategoriesOnce();
    fetchMaterialOptionsOnce();
  }, [fetchBrandOptionsOnce, fetchCategoriesOnce, fetchMaterialOptionsOnce]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (currentPage > 0) params.set("page", currentPage);
    if (rows !== 24) params.set("rows", rows);

    const setArray = (key, value) => {
      if (value?.length) params.set(key, value.join(","));
    };

    setArray("locations", selectedLocations);
    setArray("subCategories", selectedSubCategories);
    setArray("subSubCategories", selectedSubSubCategories);
    setArray("colors", selectedColors);
    setArray("materials", selectedMaterial);
    setArray("brands", selectedBrand);

    const setRange = (key, value, defaultValue) => {
      if (value[0] !== defaultValue[0] || value[1] !== defaultValue[1]) {
        params.set(key, `${value[0]}-${value[1]}`);
      }
    };

    setRange("length", lengthRange, [0, 200]);
    setRange("width", widthRange, [0, 200]);
    setRange("height", heightRange, [0, 200]);
    setRange("price", priceRange, [0, 1000000]);

    if (featuredProduct) params.set("featuredProduct", "true");

    const query = params.toString();
    navigate(query ? `/product-management?${query}` : "/product-management", {
      replace: true,
    });
  }, [
    searchTerm,
    currentPage,
    rows,
    selectedLocations,
    selectedSubCategories,
    selectedSubSubCategories,
    selectedColors,
    selectedMaterial,
    selectedBrand,
    lengthRange,
    widthRange,
    heightRange,
    priceRange,
    featuredProduct,
    navigate,
  ]);

  useEffect(() => {
    const payload = {
      page: currentPage + 1,
      limit: rows,
      search: debouncedSearchTerm,
      locations: selectedLocations,
      subCategories: selectedSubCategories,
      subSubCategories: selectedSubSubCategories,
      brands: selectedBrand,
      materials: selectedMaterial,
      colors: selectedColors,
      featuredProduct: featuredProduct,
    };

    if (priceRange[0] !== 0) payload.minPrice = priceRange[0];
    if (priceRange[1] !== 1000000) payload.maxPrice = priceRange[1];

    if (lengthRange[0] !== 0) payload.minLength = lengthRange[0];
    if (lengthRange[1] !== 200) payload.maxLength = lengthRange[1];

    if (widthRange[0] !== 0) payload.minWidth = widthRange[0];
    if (widthRange[1] !== 200) payload.maxWidth = widthRange[1];

    if (heightRange[0] !== 0) payload.minHeight = heightRange[0];
    if (heightRange[1] !== 200) payload.maxHeight = heightRange[1];

    dispatch(getProductsByUserId(payload));
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // or "smooth"
    });
  }, [
    dispatch,
    rows,
    currentPage,
    selectedLocations,
    selectedSubCategories,
    selectedSubSubCategories,
    selectedBrand,
    selectedMaterial,
    selectedColors,
    priceRange,
    lengthRange,
    widthRange,
    heightRange,
    debouncedSearchTerm,
    featuredProduct,
  ]);

  useEffect(() => {
    if (isFirstPageReset.current) {
      isFirstPageReset.current = false;
      return;
    }
    setCurrentPage(0);
  }, [
    selectedLocations,
    selectedSubCategories,
    selectedSubSubCategories,
    selectedBrand,
    selectedMaterial,
    selectedColors,
    priceRange,
    lengthRange,
    widthRange,
    heightRange,
    searchTerm,
    featuredProduct,
  ]);

  useEffect(() => {
    // Load Indian states on mount
    const indianStates = State.getStatesOfCountry("IN").map((s) => ({
      label: s.name,
      value: s.name,
    }));
    setLocationArea([
      { label: "Pan India", value: "Pan India" }, // ✅ extra option
      ...indianStates,
    ]);
  }, []);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (productToDelete) {
        const actionResult = await dispatch(deleteProduct(productToDelete._id));
        if (deleteProduct.rejected.match(actionResult)) {
          toast.error(actionResult.payload || "Something went wrong");
        } else {
          toast.success("Product deleted successfully!");
          setDeleteDialogOpen(false);
          setProductToDelete(null);
        }
      }
    } catch (error) {
      console.error("Error deleting Product:", error);
      toast.error("An error occurred while deleting the Product.");
    }
  };

  const handleResetFilters = () => {
    setCurrentPage(0);
    setSelectedLocations([]);
    setSelectedSubCategories([]);
    setSelectedSubSubCategories([]);
    setSelectedColors([]);
    setSelectedMaterial([]);
    setSelectedBrand([]);
    setLengthRange([0, 200]);
    setWidthRange([0, 200]);
    setHeightRange([0, 200]);
    setPriceRange([0, 1000000]);
    setFeaturedProduct(false);
    setSearchTerm("");
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your products effectively.
            </p>
          </div>
          <div className="w-full lg:w-fit mt-4 md:mt-0 flex items-center gap-3">
            <Popover className="w-full lg:w-fit">
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-full lg:w-fit border-dashed"
                >
                  <Filter className="mr-2 h-3.5 w-3.5" />
                  <span>Filters</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="ml-2 lg:ml-0 w-full lg:w-96 max-h-[70vh]">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      Product Filters
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Customize your view with these filters
                    </p>
                  </div>
                  <ScrollArea className="h-[50vh] pr-4">
                    <Accordion type="multiple" defaultValue={[""]}>
                      {/* Categories */}
                      <AccordionItem value="categories">
                        <AccordionTrigger className="text-sm font-medium">
                          Categories
                        </AccordionTrigger>
                        <AccordionContent>
                          <CategoriesFilter
                            selectedSubCategories={selectedSubCategories}
                            setSelectedSubCategories={setSelectedSubCategories}
                            selectedSubSubCategories={selectedSubSubCategories}
                            setSelectedSubSubCategories={
                              setSelectedSubSubCategories
                            }
                          />
                        </AccordionContent>
                      </AccordionItem>
                      {/* Color */}
                      <AccordionItem value="colors">
                        <AccordionTrigger className="text-sm font-medium">
                          Colors
                        </AccordionTrigger>
                        <AccordionContent>
                          <ColorFilters
                            selectedColors={selectedColors}
                            setSelectedColors={setSelectedColors}
                          />
                        </AccordionContent>
                      </AccordionItem>
                      {/* Material */}
                      <AccordionItem value="material">
                        <AccordionTrigger className="text-sm font-medium">
                          Material
                        </AccordionTrigger>
                        <AccordionContent>
                          <MaterialFilter
                            selectedMaterial={selectedMaterial}
                            setSelectedMaterial={setSelectedMaterial}
                          />
                        </AccordionContent>
                      </AccordionItem>
                      {/* Brand */}
                      <AccordionItem value="brand">
                        <AccordionTrigger className="text-sm font-medium">
                          Brand
                        </AccordionTrigger>
                        <AccordionContent>
                          <BrandFilter
                            selectedBrand={selectedBrand}
                            setSelectedBrand={setSelectedBrand}
                          />
                        </AccordionContent>
                      </AccordionItem>
                      {/* Size */}
                      <AccordionItem value="size">
                        <AccordionTrigger className="text-sm font-medium">
                          Size
                        </AccordionTrigger>
                        <AccordionContent>
                          <SizeFilter
                            lengthRange={lengthRange}
                            setLengthRange={setLengthRange}
                            widthRange={widthRange}
                            setWidthRange={setWidthRange}
                            heightRange={heightRange}
                            setHeightRange={setHeightRange}
                          />
                        </AccordionContent>
                      </AccordionItem>
                      {/* Pricing */}
                      <AccordionItem value="price">
                        <AccordionTrigger className="text-sm font-medium">
                          Price
                        </AccordionTrigger>
                        <AccordionContent>
                          <PriceFilter
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                          />
                        </AccordionContent>
                      </AccordionItem>
                      {/* Location */}
                      <AccordionItem value="location">
                        <AccordionTrigger className="text-sm font-medium">
                          Location
                        </AccordionTrigger>
                        <AccordionContent>
                          <LocationFilter
                            locationArea={locationArea}
                            selectedLocations={selectedLocations}
                            setSelectedLocations={setSelectedLocations}
                          />
                        </AccordionContent>
                      </AccordionItem>
                      {/* Featured Product */}
                      {user?.parentId === null && (
                        <AccordionItem value="featuredProduct">
                          <AccordionTrigger className="text-sm font-medium">
                            Featured Product
                          </AccordionTrigger>
                          <AccordionContent>
                            <div
                              onClick={() =>
                                setFeaturedProduct((prev) => !prev)
                              }
                              className="flex justify-between items-center cursor-pointer"
                            >
                              <span>Featured Product</span>
                              <input
                                type="checkbox"
                                className="w-5 h-5"
                                checked={featuredProduct}
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </Accordion>
                  </ScrollArea>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetFilters}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Link href="/create-product">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Product
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Product List</CardTitle>
            <CardDescription>View and Manage all your products</CardDescription>
            <div className="mt-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400 h-5 w-5" />
              </div>
              <InputText
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full pr-3 py-1.5 border border-gray-300 rounded-md focus:outline-none shadow-none bg-white"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-10">
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="w-full text-center py-10">
                <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
                <h3 className="mt-2 text-sm font-semibold text-red-500">
                  Error: {error}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  There was an error fetching products. Please try again later.
                </p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((item) => (
                  <div
                    key={item._id}
                    className="text-black overflow-hidden shadow-lg rounded-2xl lg:rounded-3xl"
                  >
                    <div className="overflow-hidden relative rounded-2xl lg:rounded-3xl">
                      <img
                        src={item?.bannerImage}
                        alt={item?.name}
                        className="aspect-square w-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigate(`/edit-product/${item?._id}`);
                          }}
                          className="h-10 w-10 p-0 bg-white shadow-lg"
                        >
                          <Edit className="h-6 w-6" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 bg-white text-red-500 hover:text-red-600 shadow-lg"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <Trash2 className="h-6 w-6" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full px-3 lg:px-4 py-3 lg:py-4 h-1/3 flex flex-col justify-end gap-1 text-black transition-all bg-gradient-to-t from-black/80 via-black/20 to-transparent backdrop-blur-[1px]">
                        <h3
                          style={{ fontFamily: "Playfair Display" }}
                          className="text-[clamp(10px,2.5vw,40px)] sm:text-[clamp(10px,1.5vw,30px)] lg:text-[clamp(10px,0.9vw,40px)] bg-white w-fit rounded-full px-4 py-1"
                        >
                          {item?.category?.name}
                        </h3>
                      </div>
                    </div>

                    <div className="text-[clamp(10px,2.5vw,40px)] sm:text-[clamp(10px,1.5vw,30px)] lg:text-[clamp(10px,0.9vw,40px)] p-4">
                      <p className="mb-1">
                        <span className="font-bold">
                          ₹{item.price?.min?.toLocaleString("en-IN")} - ₹
                          {item.price?.max?.toLocaleString("en-IN")}
                        </span>
                      </p>
                      <h3 className="font-semibold mb-1">{item?.name}</h3>
                      <p className="text-[var(--secondary)] flex gap-1 items-center">
                        <User2 className="w-4 h-4" />
                        {item?.user.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full text-center py-10">
                <AlertCircle className="mx-auto h-10 w-10 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No Product found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? "No Product match your search criteria."
                    : "Get started by creating a new Product."}
                </p>
                <div className="mt-6">
                  <Link href="/create-product">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Product
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
          {total > 24 && (
            <CardFooter className="flex justify-between border-t pt-6">
              <Paginator
                template={template1}
                first={currentPage * rows}
                rows={rows}
                totalRecords={total}
                onPageChange={(e) => {
                  setCurrentPage(e.first / e.rows); // Correctly set page number
                  setRows(e.rows);
                }}
                className="flex gap-2 ml-auto justify-end"
              />
            </CardFooter>
          )}
        </Card>
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this Product
                <span className="font-bold"> {productToDelete?.name} </span>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
