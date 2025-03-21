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
    const productContainerRef = useRef(null);
    const lastProductRef = useRef(null);

    //   useEffect(() => {
    //     fetchProducts();
    //   }, [page]);

    useEffect(() => {
        dragBasedScroll();
        if (!user) {
            navigate('/login')
        }
        if (products.length === 0)
            dispatch(allProducts())
    }, [user, navigate, dispatch]);

    const dragBasedScroll = () => {
        const productContainer = productContainerRef.current;
        if (!productContainer) return;
        console.log(productContainer)
        let isDown = false;
        let startY;
        let scrollTop;
    
        // Mouse Events
        productContainer.addEventListener("mousedown", (e) => {
            isDown = true;
            productContainer.classList.add("active");
            startY = e.pageY - productContainer.offsetTop;
            scrollTop = productContainer.scrollTop;
        });
    
        productContainer.addEventListener("mouseleave", () => {
            isDown = false;
            productContainer.classList.remove("active");
        });
    
        productContainer.addEventListener("mouseup", () => {
            isDown = false;
            productContainer.classList.remove("active");
        });
    
        productContainer.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const y = e.pageY - productContainer.offsetTop;
            const walk = (y - startY) * 2; // Adjust speed
            productContainer.scrollTop = scrollTop - walk;
        });
    
        // Touch Support
        let startTouchY, startScrollTop;
    
        productContainer.addEventListener("touchstart", (e) => {
            startTouchY = e.touches[0].pageY;
            startScrollTop = productContainer.scrollTop;
        });
    
        productContainer.addEventListener("touchmove", (e) => {
            const touchY = e.touches[0].pageY;
            const move = (touchY - startTouchY) * 2; // Adjust speed
            productContainer.scrollTop = startScrollTop - move;
        });
    };

    return (
        <div className="product-container" ref={productContainerRef}>
            {products.map((product, index) => (
                <div key={product._id} ref={index === products.length - 1 ? lastProductRef : null}>
                    <ProductCard image={product.productImageUrl} name={product.productTitle} price={product.productUnitPrice} />
                </div>
            ))}
            {isLoading && <p>Loading more products...</p>}
        </div>
    );
}

export default InfiniteProductList;