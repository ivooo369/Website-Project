/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import PaginationButtons from "../../layouts/others/PaginationButtons";
import BasicSelect from "../../layouts/others/Select";
import ProductCard from "../../components/ProductCard";
import Skeleton from "@mui/material/Skeleton";
import useProductSorting from "../../utils/useProductSorting";
import { sortOptions } from "../../utils/sortOptions";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export default function IconsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const productsPerPage = 20;

  const { products, sortOption, handleSortChange, setProducts } =
    useProductSorting([]);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await axios.get(`${apiUrl}/products/icons`);
        handleSortChange("");
        handleSortChange("name_asc");
        setProducts(response.data);
      } catch (error) {
        console.error("Грешка при извличане на иконите:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIcons();
  }, []);

  const indexOfLastIcon = currentPage * productsPerPage;
  const indexOfFirstIcon = indexOfLastIcon - productsPerPage;
  const currentIcons = products.slice(indexOfFirstIcon, indexOfLastIcon);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="site-products-container pages">
      <header className="page-header">
        <span className="material-symbols-outlined">church</span>
        <h1>Икони</h1>
      </header>
      <div className="paginations-and-select-containers">
        <BasicSelect
          label="Сортиране"
          labelId="sort-select-label"
          menuItems={sortOptions}
          value={sortOption}
          handleChange={handleSortChange}
          fullWidth
        />
        {loading || products.length > 0 ? (
          <PaginationButtons
            productsPerPage={productsPerPage}
            totalProducts={products.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        ) : null}
      </div>
      {loading ? (
        <div className="loading-container">
          {[...Array(productsPerPage)].map((_, index) => (
            <Skeleton key={index} animation="wave" height={150} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div>
          <div className="products-grid-container">
            {currentIcons.map((icon) => (
              <ProductCard product={icon} key={icon.product_id} />
            ))}
          </div>
          <PaginationButtons
            productsPerPage={productsPerPage}
            totalProducts={products.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      ) : (
        <p className="no-products-found-message">Няма намерени продукти!</p>
      )}
    </div>
  );
}
