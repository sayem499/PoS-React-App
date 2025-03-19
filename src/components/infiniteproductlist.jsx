import '../css/infiniteproductlist.css';
import { useEffect, useRef, useState } from "react";
import ProductCard from "./productcard"; // Your product card component
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { allProducts, reset, updateProducts } from '../redux/products/productSlice';
import { setSearchRef } from '../redux/search/searchSlice';
import { toast } from 'react-toastify'
import Loading from '../components/loading';
import Swal from 'sweetalert2';


function InfiniteProductList() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { products, isLoading } = useSelector((state) => state.products)
    //const { purchase } = useSelector((state) => state.purchases)
    const { searchInput, searchRef } = useSelector((state) => state.search)
    const { customers } = useSelector((state) => state.customerState)
    //const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    //const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef < IntersectionObserver | null > (null);
    const lastProductRef = useRef(null);

    //   useEffect(() => {
    //     fetchProducts();
    //   }, [page]);
    
    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
        if (products.length === 0 )
            dispatch(allProducts())
    }, [user, navigate, dispatch]);

    //   const fetchProducts = async () => {
    //     if (!hasMore) return;
    //     setLoading(true);

    //     try {
    //       const { data } = await axios.get(`/api/products?page=${page}&limit=10`); // Adjust your API
    //       setProducts((prev) => [...prev, ...data.products]);
    //       setHasMore(data.hasMore);
    //     } catch (error) {
    //       console.error("Error fetching products", error);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    //   useEffect(() => {
    //     if (loading) return;
    //     observer.current = new IntersectionObserver(
    //       (entries) => {
    //         if (entries[0].isIntersecting) {
    //           setPage((prev) => prev + 1);
    //         }
    //       },
    //       { threshold: 1.0 }
    //     );
    //     if (lastProductRef.current) {
    //       observer.current.observe(lastProductRef.current);
    //     }
    //     return () => observer.current?.disconnect();
    //   }, [loading]);

    return (
        <div className="product-container">
            {console.log("products ", products)}
            {products.map((product, index) => (
                <div key={product._id} ref={index === products.length - 1 ? lastProductRef : null}>
                    {console.log("product ", product)}
                    <ProductCard image={product.productImageUrl} name={product.productTitle} price={product.productUnitPrice} />
                </div>
            ))}
            { isLoading && <p>Loading more products...</p>}
        </div>
    );
}

export default InfiniteProductList;