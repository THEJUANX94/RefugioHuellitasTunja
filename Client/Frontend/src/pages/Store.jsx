import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./css/style_store.css";

const StorePage = () => {
    const [categories] = useState([
        "Productos de limpieza",
        "Huacal",
        "Alimentos/snacks",
        "Juguetes",
        "Colchoneta",
    ]);

    const products = [
        { id: 1, name: "Correa de perro", image: "https://via.placeholder.com/150", price: "$10,000" },
        { id: 2, name: "Comedero para gatos", image: "https://via.placeholder.com/150", price: "$13,000" },
        { id: 3, name: "Bulto comida para gato", image: "https://via.placeholder.com/150", price: "$72,000" },
        { id: 4, name: "Premio para gato", image: "https://via.placeholder.com/150", price: "$20,000" },
        { id: 5, name: "Comedero para perros", image: "https://via.placeholder.com/150", price: "$15,000" },
        { id: 6, name: "Cama para gato", image: "https://via.placeholder.com/150", price: "$60,000" },
    ];

    return (
        <>
            <Header />
            <div className="store-container">
                {/* Hero Section */}
                <section className="store-hero">
                    <div className="store-hero-content">
                        <div className="store-hero-text">
                            <h1>La acogedora y pequeña tienda de mascotas</h1>
                            <p>Tu rincón de confianza para el cuidado y amor de tus mascotas.</p>
                        </div>
                        <img
                            src="https://via.placeholder.com/400x300"
                            alt="Mascotas"
                            className="store-hero-image"
                        />
                    </div>
                </section>

                {/* Filtros y barra de búsqueda */}
                <section className="store-filters-and-products">
                    <div className="store-sidebar">
                        <div className="filter-panel">
                            <h3>Filtrar por categorías</h3>
                            <ul className="filter-list">
                                {categories.map((category, index) => (
                                    <li key={index}>
                                        <input type="checkbox" id={`cat-${index}`} />
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
                            />
                        </div>
                    </div>

                    {/* Productos */}
                    <div className="store-products">
                        <h2>Comprar productos para mascota</h2>
                        <div className="product-grid">
                            {products.map((product) => (
                                <div className="product-card" key={product.id}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-price">{product.price}</p>
                                    <button className="add-to-cart">Añadir al carrito</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default StorePage;
