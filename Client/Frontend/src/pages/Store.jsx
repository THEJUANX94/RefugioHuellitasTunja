import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./css/style_store.css";

const StorePage = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const productsPerPage = 9;

    // Función para obtener los productos con inventario e imágenes
    const fetchProductsWithStockAndImages = async () => {
        try {
            const response = await fetch("http://localhost:4000/producto");
            const productsData = await response.json();

            const productsWithDetails = await Promise.all(
                productsData.map(async (product) => {
                    const inventoryResponse = await fetch(`http://localhost:4000/inventory/${product.idproduct}`);
                    const inventoryData = await inventoryResponse.json();

                    if (inventoryData[0]?.inventario_actual > 0) {
                        const imageResponse = await fetch(`http://localhost:4000/productimages/${product.idproduct}`);
                        const imageData = await imageResponse.json();

                        return {
                            idproduct: product.idproduct,
                            name: product.name,
                            image: imageData[0]?.linkimage || "https://via.placeholder.com/150",
                            price: product.price,
                            category: product.category_name,
                        };
                    }
                    return null;
                })
            );

            const validProducts = productsWithDetails.filter((product) => product !== null);
            setProducts(validProducts);
            setFilteredProducts(validProducts);
        } catch (error) {
            console.error("Error fetching products with stock and images:", error);
        } finally {
            setLoading(false);
        }
    };

    // Obtener categorías
    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:4000/categorias");
            const categoriesData = await response.json();
            setCategories(categoriesData.map((category) => category.name));
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchProductsWithStockAndImages();
        fetchCategories();
    }, []);

    // Función para filtrar productos
    const handleFilter = () => {
        let filtered = products;

        // Filtrar por categorías
        if (selectedCategories.length > 0) {
            filtered = filtered.filter((product) => selectedCategories.includes(product.category));
        }

        // Filtrar por término de búsqueda
        if (searchTerm.trim() !== "") {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
        setCurrentPage(1); // Resetear a la primera página al aplicar filtros
    };

    // Manejar cambio en selección de categorías
    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    // Manejar búsqueda
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Calcular productos para la página actual
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Generar números de página
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredProducts.length / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        handleFilter();
    }, [selectedCategories, searchTerm]);

    // Función para agregar al carrito
    const addToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Verificar si el producto ya está en el carrito
        const productExists = cart.some(item => item.id === product.idproduct);

        if (!productExists) {
            const newItem = {
                id: product.idproduct,
                name: product.name,
                price: product.price,
                quantity: 1, // La cantidad siempre será 1
                image: product.image
            };

            cart.push(newItem);
            localStorage.setItem('cart', JSON.stringify(cart)); // Guardar el carrito en localStorage
            alert('Producto añadido al carrito');
        } else {
            alert('Este producto ya está en el carrito');
        }
    };

    return (
        <>
            <Header />
            <div className="store-container">
                <section className="store-hero">
                    <div className="store-hero-content">
                        <div className="store-hero-text">
                            <h1>La acogedora y pequeña tienda de mascotas</h1>
                            <p>Tu rincón de confianza para el cuidado y amor de tus mascotas.</p>
                        </div>
                        <img
                            src="https://img.freepik.com/foto-gratis/adorable-perro-dueno-tienda-mascotas_23-2148872556.jpg?t=st=1733125330~exp=1733128930~hmac=27da8c76c92394a45c304d5ad59827f966a586f538a58c5960300999ec59af54&w=826"
                            alt="Mascotas"
                            className="store-hero-image"
                        />
                    </div>
                </section>

                <section className="store-filters-and-products">
                    <div className="store-sidebar">
                        <div className="filter-panel">
                            <h3>Filtrar por categorías</h3>
                            <ul className="filter-options">
                                {categories.map((category, index) => (
                                    <li key={index}>
                                        <input
                                            type="checkbox"
                                            id={`cat-${index}`}
                                            onChange={() => handleCategoryChange(category)}
                                        />
                                        <label htmlFor={`cat-${index}`}>{category}</label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Buscar producto..."
                                className="search-input"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    <div className="store-products">
                        <h2>Comprar productos para mascota</h2>
                        {loading ? (
                            <p>Cargando productos...</p>
                        ) : (
                            <>
                                <div className="product-grid">
                                    {currentProducts.map((product) => (
                                        <div className="product-card" key={product.idproduct}>
                                            <Link to={`/store/product-detail/${product.idproduct}`}>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="product-image"
                                                />
                                                <h3 className="product-name">{product.name}</h3>
                                                <p className="product-price">{product.price}</p>
                                            </Link>
                                            <button
                                                className="add-to-cart-store"
                                                onClick={() => addToCart(product)}
                                            >
                                                Añadir al carrito
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Paginación */}
                                <div className="pagination">
                                    {pageNumbers.map((number) => (
                                        <button
                                            key={number}
                                            className={`pagination-btn ${currentPage === number ? "active" : ""}`}
                                            onClick={() => paginate(number)}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default StorePage;
