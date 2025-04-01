import '../css/infiniteproductlist.css';
import { useEffect, useRef, useState } from "react";
import ProductCard from "./productcard"; // Your product card component
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { allProducts, reset, updateProducts, loadMoreProducts } from '../redux/products/productSlice';
import { setSearchRef } from '../redux/search/searchSlice';
import { toast } from 'react-toastify'
import Loading from '../components/loading';
import Swal from 'sweetalert2';


function InfiniteProductList({products, isLoading, hasMore, type, handleProductClick}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { searchInput, searchRef } = useSelector((state) => state.search)
    const { customers } = useSelector((state) => state.customerState)
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(1);
    const productContainerRef = useRef(null);
    const lastProductRef = useRef(null);
    const observer = useRef(null);
    const resetTriggered = useRef(false);

    useEffect(() => {
        dragBasedScroll();
        if (!user) {
            navigate('/login')
            return;
        }
        if (products.length === 0) {
            dispatch(allProducts({ page: 1 }));
        }
    }, [user, products.length, navigate, dispatch]);

    useEffect(() => {
        if (isLoading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    if (hasMore) {
                        setPage((prevPage) => prevPage + 1);
                    } else {
                        if (!resetTriggered.current) {
                            resetTriggered.current = true 
                            setPage(1);
                            dispatch(allProducts({ page: 1 }));
                            setTimeout(() => {
                                resetTriggered.current = false;
                            }, 1000);
                        }    
                    }
                }
            },
            { threshold: 0.95 }
        );

        if (lastProductRef.current) {
            observer.current.observe(lastProductRef.current);
        }

        return () => observer.current?.disconnect();
    }, [products, isLoading, hasMore, dispatch]);

    useEffect(() => {
        if (page > 1) {
            dispatch(loadMoreProducts({ page })).then((response) => {
                if (response.payload?.products?.length === 0) {
                    // No more products, restart pagination
                    setTimeout(() => {
                        setPage(1);
                        dispatch(loadMoreProducts({ page: 1 })); // Restart loading from the first page
                    }, 500);
                }
            });
        }
    }, [page, dispatch]);

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
            {products && products?.map((product, index) => (
                <div key={product._id} ref={index === products.length - 1 ? lastProductRef : null} onClick={(e) => handleProductClick(product._id,e)}>
                    <ProductCard 
                        image={product.productImageUrl} 
                        name={product.productTitle} 
                        price={product.productUnitPrice} 
                        quantity={product.productQuantity} 
                        cost={product.productUnitCost} 
                        type={type}
                        />
                </div>
            ))}
            {isLoading && <Loading />}
        </div>
    );
}

export default InfiniteProductList;