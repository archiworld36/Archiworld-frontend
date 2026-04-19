import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubSubCategory,
  deleteSubSubCategory,
  fetchSubSubCategory,
  updateSubSubCategory,
} from "./categoriesAPI";
import { toast } from "react-toastify";
import { Button } from "../../ui/buttons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { InputText } from "primereact/inputtext";
import { Edit, Trash2, Plus, AlertCircle, ArrowLeft } from "lucide-react";
import { useParams } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/Card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

export default function SubSubCategoryManagement() {
  const dispatch = useDispatch();
  const { name, subCategoryId } = useParams();
  const {
    subSubCategories: subSubCategoriesMap = {},
    loadingSubSubCategories,
    error,
  } = useSelector((state) => state.category);

  const subSubCategories = subSubCategoriesMap[subCategoryId] || [];
  const [isAdding, setIsAdding] = useState(false);
  const [editingSubSubCategory, setEditingSubSubCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subSubCategoryToDelete, setSubSubCategoryToDelete] = useState(null);
  const [newSubSubCategory, setNewSubSubCategory] = useState("");
  const [bannerImage, setBannerImage] = useState(null);

  const fetchSubSubCategoriesOnce = useCallback(() => {
    dispatch(fetchSubSubCategory(subCategoryId));
  }, [dispatch, subCategoryId]);

  // 👇 useEffect will only run once and call the fetch function
  useEffect(() => {
    fetchSubSubCategoriesOnce();
  }, [fetchSubSubCategoriesOnce]);

  const handleDeleteClick = (item) => {
    setSubSubCategoryToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (subSubCategoryToDelete) {
      try {
        const actionResult = await dispatch(
          deleteSubSubCategory(subSubCategoryToDelete._id),
        );
        if (deleteSubSubCategory.rejected.match(actionResult)) {
          toast.error(actionResult.payload || "Something went wrong");
        } else {
          toast.success("Sub-Sub-Category deleted successfully!");
          setDeleteDialogOpen(false);
          setSubSubCategoryToDelete(null);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("An error occurred while deleting the sub-sub-category.");
      }
    }
  };

  const handleSave = async () => {
    if (!newSubSubCategory.trim()) {
      toast.error("Please enter sub-category name");
      return;
    }
    const formData = new FormData();
    formData.append("name", newSubSubCategory);
    formData.append("subCategoryId", subCategoryId);

    if (bannerImage) {
      formData.append("bannerImage", bannerImage);
    }

    let result;

    if (editingSubSubCategory) {
      result = await dispatch(
        updateSubSubCategory({ id: editingSubSubCategory._id, data: formData }),
      );

      if (updateSubSubCategory.rejected.match(result)) {
        toast.error(result.payload);
        return;
      }

      toast.success("Sub-Sub-category updated");
    } else {
      result = await dispatch(createSubSubCategory(formData));

      if (createSubSubCategory.rejected.match(result)) {
        toast.error(result.payload);
        return;
      }

      toast.success("Sub-Sub-category added");
    }

    setNewSubSubCategory("");
    setIsAdding(false);
    setEditingSubSubCategory(null);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 lg:flex-row justify-between lg:items-center mb-6">
        <div className="flex items-center mb-6">
          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            size="sm"
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Sub-Sub-Category of {name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your sub-sub-categoies effectively.
            </p>
          </div>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="mr-2 h-4 w-4" />
          Add Sub Sub Category
        </Button>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Product Sub-Sub-Categories List</CardTitle>
          <CardDescription>
            View and Manage sub-sub-categories option
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingSubSubCategories ? (
            <div className="w-full text-center py-10">
              <p className="mt-2 text-sm text-gray-600">
                Loading sub-sub-categories...
              </p>
            </div>
          ) : error ? (
            <div className="w-full text-center py-10">
              <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
              <h3 className="mt-2 text-sm font-semibold text-red-500">
                Error: {error}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                There was an error fetching sub-sub-categories. Please try again
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sub-Sub-Category Name</TableHead>
                  <TableHead>Banner Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isAdding && (
                  <TableRow>
                    <TableCell className="w-[60%]">
                      <InputText
                        type="text"
                        className="w-full border py-2 px-3 text-start border-gray-300 rounded-md shadow-none text-sm"
                        placeholder="Enter Category Name"
                        value={newSubSubCategory}
                        onChange={(e) => setNewSubSubCategory(e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setBannerImage(e.target.files[0])}
                      />
                      <p className="text-xs text-gray-500">
                        Recommended size: <b>315 x 420</b>
                      </p>
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-4">
                      <Button onClick={handleSave} variant="default" size="sm">
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setIsAdding(false);
                          setNewSubSubCategory("");
                          setEditingSubSubCategory(null);
                          setBannerImage(null);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
                {subSubCategories
                  .filter((item) => item._id !== editingSubSubCategory?._id)
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.bannerImage && (
                          <a
                            href={item.bannerImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-pointer hover:underline"
                          >
                            View Image
                          </a>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setEditingSubSubCategory(item);
                            setNewSubSubCategory(item.name);
                            setIsAdding(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the Order Number{" "}
              {subSubCategoryToDelete ? `${subSubCategoryToDelete.name}` : ""} ?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={confirmDelete} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
