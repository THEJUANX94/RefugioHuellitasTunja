import React, { useState, useEffect } from 'react';

const InventoryManagement = () => {
    const [products, setProducts] = useState([]);

    // Obtener todos los productos
    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch("http://localhost:4000/producto");
            const data = await response.json();

            // Para cada producto, obtener el stock desde el endpoint de inventario
            const productsWithStock = await Promise.all(data.map(async (product) => {
                const stockResponse = await fetch(`http://localhost:4000/inventory/${product.idproduct}`);
                const stockData = await stockResponse.json();
                const stock = stockData[0]?.inventario_actual || 0; // Si no hay stock, se considera 0
                return { ...product, stock }; // Añadimos el stock al producto
            }));

            setProducts(productsWithStock);
        };
        fetchProducts();
    }, []);

    return (
        <div className="inventory-management">
            <h2>Gestión de Inventario</h2>
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.idproduct}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryManagement;
