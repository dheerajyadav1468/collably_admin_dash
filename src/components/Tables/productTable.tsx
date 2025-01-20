'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store/store';
import { fetchAllProducts, deleteProduct } from '../../app/store/prductSlice';
import { fetchAllBrands } from '../../app/store/brandSlice';
import Link from 'next/link';
import { Filter, Plus, Search } from 'lucide-react';

const ProductsTable = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { products, status, error } = useSelector((state: RootState) => state.products);
    const { brands } = useSelector((state: RootState) => state.brands);
    
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
      brand: '',
      category: '',
      stockStatus: '',
      status: '',
      product: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
      dispatch(fetchAllProducts());
      dispatch(fetchAllBrands());
    }, [dispatch]);

    const handleViewClick = (productId: string) => {
      router.push(`/profileProduct?id=${productId}`);
    };

    const handleEditClick = (productId: string) => {
      router.push(`/productForm?id=${productId}`);
    };

    const handleDeleteClick = async (productId: string) => {
      if (window.confirm('Are you sure you want to delete this product?')) {
        try {
          await dispatch(deleteProduct(productId)).unwrap();
          alert('Product deleted successfully');
        } catch (error) {
          alert('Failed to delete product');
        }
      }
    };

    const handleFilterChange = (filterName: string, value: string) => {
      setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const toggleFilters = () => {
      setShowFilters(!showFilters);
    };

    const filteredProducts = products.filter(product => {
      return (
        (!filters.brand || product.brandId === filters.brand) &&
        (!filters.category || product.category === filters.category) &&
        (!filters.stockStatus || 
          (filters.stockStatus === 'In Stock' ? product.quantity > 0 : product.quantity === 0)) &&
        (!filters.status || product.status === filters.status) &&
        (!filters.product || product.productname.toLowerCase().includes(filters.product.toLowerCase())) &&
        (!searchTerm || product.productname.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'failed') return <div>Error: {error}</div>;

    const categories = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'];

    return (
      <div className="p-4">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Products</h1>
            <div className="flex gap-2">
              <Link
                href="/productForm"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Link>
              <button
                onClick={toggleFilters}
                className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-200 ${
                  showFilters ? 'bg-gray-200' : 'bg-gray-100'
                } text-gray-700`}
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand._id} value={brand._id}>
                    {brand.brandName}
                  </option>
                ))}
              </select>

              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={filters.stockStatus}
                onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Stock Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          )}

          <div className="relative mt-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name"
              className="w-full p-2 bg-black border rounded-md pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
        </div>

        <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                <th className="px-2 pb-3.5 text-left text-sm font-medium uppercase xsm:text-base">Product</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Category</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Price</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Stock Status</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Status</th>
                <th className="hidden px-2 pb-3.5 text-center text-sm font-medium uppercase sm:table-cell xsm:text-base">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, key) => (
                <tr key={product._id} className={key === filteredProducts.length - 1 ? "" : "border-b border-stroke dark:border-dark-3"}>
                  <td className="flex items-center gap-3.5 px-2 py-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                      {product.productname ? product.productname.charAt(0).toUpperCase() : ''}
                    </div>
                    <p className="hidden font-medium text-dark dark:text-white sm:block">{product.productname}</p>
                  </td>
                  <td className="px-2 py-4 text-center font-medium text-dark dark:text-white">{product.category}</td>
                  <td className="px-2 py-4 text-center font-medium text-green-light-1">${product.price}</td>
                  <td className="px-2 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      product.quantity > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      product.status === 'Published' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-center sm:table-cell">
                    <button className="hover:text-primary" onClick={() => handleViewClick(product._id)}>View</button>
                    <button className="hover:text-primary ml-3" onClick={() => handleEditClick(product._id)}>Edit</button>
                    <button className="hover:text-primary ml-3" onClick={() => handleDeleteClick(product._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

export default ProductsTable;
