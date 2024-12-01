import React, { useState, useEffect } from 'react';

const LotManagement = () => {
    const [lots, setLots] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [newLot, setNewLot] = useState({ register_date: '' });
    const [editingLot, setEditingLot] = useState(null);
    const [showLotModal, setShowLotModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [productSearch, setProductSearch] = useState('');

    // Fetch lots
    const fetchLots = async () => {
        try {
            const response = await fetch('http://localhost:4000/lote-producto');
            const data = await response.json();
            setLots(data);
        } catch (error) {
            console.error('Error fetching lots:', error);
        }
    };

    // Fetch products
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:4000/producto');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchLots();
        fetchProducts();
    }, []);

    // Add a new lot
    const handleAddLot = () => {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
        const formattedDate = formatter.format(now).replace(',', '');
        setNewLot({ register_date: formattedDate });
        setShowLotModal(true);
    };

    const handleSaveLot = async () => {
        try {
            const response = await fetch('http://localhost:4000/lote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ registerdate: newLot.register_date }),
            });
            const result = await response.json();
            const idlote = result.body.lot.idlote;

            const promises = selectedProducts.map((product) =>
                fetch('http://localhost:4000/productolote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        idlot: idlote,
                        idproduct: product.idproduct,
                        quantity: product.quantity,
                        purchase_price: product.purchase_price,
                        expiredate: product.expiredate || null,
                    }),
                })
            );

            await Promise.all(promises);
            alert('Lote creado con éxito');
            setShowLotModal(false);
            fetchLots();
        } catch (error) {
            console.error('Error saving lot:', error);
        }
    };

    const handleAddProductToLot = (product) => {
        if (selectedProducts.some((p) => p.idproduct === product.idproduct)) {
            alert('Este producto ya está en el lote.');
            return;
        }

        setSelectedProducts((prev) => [
            ...prev,
            {
                ...product,
                quantity: '',
                purchase_price: '',
                expiredate: '',
            },
        ]);
        setShowProductModal(false);
    };

    const handleRemoveProductFromLot = (productId) => {
        setSelectedProducts((prev) => prev.filter((product) => product.idproduct !== productId));
    };

    const handleInputChange = (productId, field, value) => {
        setSelectedProducts((prev) =>
            prev.map((product) =>
                product.idproduct === productId ? { ...product, [field]: value } : product
            )
        );
    };

    const handleDeleteLot = async (idlote) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este lote y sus productos relacionados?')) {
            return;
        }

        try {
            await fetch(`http://localhost:4000/lote/${idlote}`, {
                method: 'DELETE',
            });
            alert('Lote eliminado correctamente');
            fetchLots(); // Refrescar la lista de lotes
        } catch (error) {
            console.error('Error al eliminar el lote:', error);
            alert('Error al eliminar el lote');
        }
    };

    return (
        <div>
            <h2>Gestión de Lotes</h2>
            <button onClick={handleAddLot}>Agregar Lote</button>
            <table>
                <thead>
                    <tr>
                        <th>Fecha de Registro</th>
                        <th>Productos Asociados</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {lots.map((lot) => (
                        <tr key={lot.idlot}>
                            <td>{lot.registerdate}</td>
                            <td>
                                {lot.products && lot.products.length > 0 ? (
                                    <ul>
                                        {lot.products.map((product) => (
                                            <li key={product.idproduct}>
                                                {product.name} - {product.quantity} unidades
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    'Sin productos'
                                )}
                            </td>
                            <td>
                                <button onClick={() => handleDeleteLot(lot.idlot)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showLotModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Agregar Lote</h3>
                        <p>Fecha de Registro: {newLot.register_date}</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Cantidad</th>
                                    <th>Precio de Compra</th>
                                    <th>Fecha de Caducidad</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedProducts.map((product) => (
                                    <tr key={product.idproduct}>
                                        <td>{product.name}</td>
                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                value={product.quantity}
                                                onChange={(e) =>
                                                    handleInputChange(product.idproduct, 'quantity', e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={product.purchase_price}
                                                onChange={(e) =>
                                                    handleInputChange(product.idproduct, 'purchase_price', e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                value={product.expiredate}
                                                onChange={(e) =>
                                                    handleInputChange(product.idproduct, 'expiredate', e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => handleRemoveProductFromLot(product.idproduct)}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={() => setShowProductModal(true)}>Agregar Productos</button>
                        <button onClick={handleSaveLot}>Guardar Lote</button>
                        <button onClick={() => setShowLotModal(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {showProductModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Seleccionar Producto</h3>
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                        />
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Unidad de Medida</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products
                                    .filter((product) =>
                                        product.name.toLowerCase().includes(productSearch.toLowerCase())
                                    )
                                    .map((product) => (
                                        <tr key={product.idproduct}>
                                            <td>{product.name}</td>
                                            <td>{product.price}</td>
                                            <td>{product.unitmeasure}</td>
                                            <td>
                                                <button onClick={() => handleAddProductToLot(product)}>Agregar</button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <button onClick={() => setShowProductModal(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LotManagement;
