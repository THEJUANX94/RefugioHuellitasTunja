import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Usamos useNavigate en lugar de useHistory
import Header from "../components/Header";
import Footer from "../components/Footer";
import './css/style_product_detail.css'

const ProductDetailPage = () => {
    const { idproducto } = useParams(); // Usamos idproducto para obtener el ID del producto
    const navigate = useNavigate(); // Usamos navigate en lugar de history
    const [product, setProduct] = useState(null);
    const [productImage, setProductImage] = useState(""); // Estado para la imagen
    const [quantity, setQuantity] = useState(1); // Estado para la cantidad
    const [availableStock, setAvailableStock] = useState(0); // Estado para la cantidad en stock
    const [addedToCart, setAddedToCart] = useState(false); // Estado para controlar si el producto fue agregado al carrito
    const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal

    // Función para obtener los detalles del producto
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await fetch(`http://localhost:4000/producto/${idproducto}`);
                const productData = await response.json();
                setProduct(productData[0]); // Suponiendo que el backend devuelve un array de resultados
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        const fetchProductImage = async () => {
            try {
                const imageResponse = await fetch(`http://localhost:4000/productimages/${idproducto}`);
                const imageData = await imageResponse.json();
                if (imageData.length > 0) {
                    setProductImage(imageData[0].linkimage); // Establecemos la imagen del producto
                } else {
                    setProductImage("https://via.placeholder.com/150"); // Imagen por defecto si no hay imagen
                }
            } catch (error) {
                console.error("Error fetching product image:", error);
                setProductImage("https://via.placeholder.com/150"); // Imagen por defecto en caso de error
            }
        };

        const fetchProductStock = async () => {
            try {
                const stockResponse = await fetch(`http://localhost:4000/inventory/${idproducto}`);
                const stockData = await stockResponse.json();
                setAvailableStock(stockData[0]?.inventario_actual || 0); // Seteamos el stock disponible
            } catch (error) {
                console.error("Error fetching product stock:", error);
            }
        };

        fetchProductDetail();
        fetchProductImage();
        fetchProductStock();
    }, [idproducto]);

    // Incrementar cantidad
    const incrementQuantity = () => {
        if (quantity < availableStock) {
            setQuantity(quantity + 1);
        }
    };

    // Decrementar cantidad
    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Función para retroceder a la página anterior
    const handleGoBack = () => {
        navigate(-1); // Usamos navigate(-1) para ir atrás en la historia
    };

    // Función para formatear el precio
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(price);
    };

    // Función para agregar el producto al carrito
    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Verificar si el producto ya está en el carrito
        const productExists = cart.some(item => item.id === product.idproduct);

        if (!productExists) {
            const newItem = {
                id: product.idproduct,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: productImage
            };

            cart.push(newItem);
            localStorage.setItem('cart', JSON.stringify(cart)); // Guardamos en localStorage
            setAddedToCart(true);
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
            }, 2000); // Cerrar el modal después de 2 segundos
        } else {
            alert('Este producto ya está en el carrito');
        }
    };

    return (
        <>
            <Header />
            <div className="product-detail-container">
                {product && (
                    <div className="product-detail">
                        <img
                            src={productImage} // Usamos la imagen obtenida
                            alt={product ? product.name || "Imagen del producto" : "Imagen del producto"}
                            className="product-detail-image"
                        />
                        <div className="product-info">
                            <h1>{product.name || "Producto sin nombre"}</h1>
                            <p className="product-price">{formatPrice(product.price)}</p>

                            <div className="product-category">
                                <strong>Categoría:</strong> {product.category_name || "Categoría no disponible"}
                            </div>

                            {/* Control de cantidad con botones de más y menos */}
                            <div className="quantity-container">
                                <button
                                    className="quantity-button"
                                    onClick={decrementQuantity}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="quantity-display">{quantity}</span>
                                <button
                                    className="quantity-button"
                                    onClick={incrementQuantity}
                                    disabled={quantity >= availableStock}
                                >
                                    +
                                </button>
                            </div>

                            <div className="available-stock">
                                <strong>Disponible: </strong>{availableStock} unidades
                            </div>

                            {/* Botón para añadir al carrito */}
                            <button
                                className="add-to-cart"
                                onClick={addToCart}
                                disabled={addedToCart} // Desactivamos el botón si el producto ya está en el carrito
                            >
                                {addedToCart ? "Producto agregado" : "Añadir al carrito"}
                            </button>

                            <button className="back-button" onClick={handleGoBack}>Volver</button>
                        </div>
                    </div>
                )}

                {/* Descripción debajo de la imagen */}
                {product && (
                    <div className="product-description">
                        <label><strong>Descripción del producto:</strong></label>
                        <p>{product.description || "Descripción no disponible"}</p>
                    </div>
                )}
            </div>

            {/* Modal de confirmación de añadido al carrito */}
            {showModal && (
                <div className="modal">
                    <p>Producto añadido al carrito</p>
                </div>
            )}
            <Footer />
        </>
    );
};

export default ProductDetailPage;
