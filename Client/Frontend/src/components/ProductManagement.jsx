import React, { useState, useEffect } from 'react';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        unitmeasure: '',
        quantity_per_unit: 1,
        description: '',
        category_id: '',
        price: ''
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const unitMeasures = [
        { value: 'Kg', label: 'Kilogramos (Kg)' },
        { value: 'g', label: 'Gramos (g)' },
        { value: 'l', label: 'Litros (l)' },
        { value: 'ml', label: 'Mililitros (ml)' },
        { value: 'U', label: 'Unidades (U)' }
    ];

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

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:4000/categorias');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file)); // Crear una vista previa de la imagen seleccionada
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.unitmeasure || !formData.quantity_per_unit || !formData.category_id || !formData.price) {
            alert("Por favor, completa todos los campos requeridos.");
            return;
        }

        try {
            if (isEditing) {
                // Editar producto
                const productRes = await fetch(`http://localhost:4000/producto/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        unitmeasure: formData.unitmeasure,
                        quantity_per_unit: formData.quantity_per_unit,
                        description: formData.description,
                        category_id: formData.category_id,
                        price: formData.price,
                    }),
                });

                if (!productRes.ok) throw new Error("Error actualizando el producto.");

                if (image) {
                    // Borrar imagen existente (si aplica)
                    const deleteResponse = await fetch(`http://localhost:4000/delete-image-product/${editId}`, {
                        method: 'DELETE',
                    });
                    if (!deleteResponse.ok) throw new Error("Error al borrar la imagen existente.");

                    // Subir nueva imagen
                    const formDataImg = new FormData();
                    formDataImg.append('image', image);

                    const uploadRes = await fetch(`http://localhost:4000/productupload/${editId}`, {
                        method: 'POST',
                        body: formDataImg,
                    });
                    if (!uploadRes.ok) throw new Error("Error al subir la nueva imagen.");
                }

                alert("Producto actualizado con éxito!");
                // Actualizar la lista de productos
                setProducts(products.map(product => product.idproduct === editId ? { ...formData, idproduct: editId } : product));

                await fetchCategories(); // Actualizar categorías en caso de que afecte los filtros
                await fetchProducts();
            } else {
                // Crear producto
                const productRes = await fetch('http://localhost:4000/producto', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        unitmeasure: formData.unitmeasure,
                        quantity_per_unit: formData.quantity_per_unit,
                        description: formData.description,
                        category_id: formData.category_id,
                        price: formData.price,
                    }),
                });

                if (!productRes.ok) throw new Error("Error creando el producto.");
                const { idproduct } = await productRes.json();

                // Subir imagen asociada
                if (image) {
                    const formDataImg = new FormData();
                    formDataImg.append('image', image);

                    const uploadRes = await fetch(`http://localhost:4000/productupload/${idproduct}`, {
                        method: 'POST',
                        body: formDataImg,
                    });

                    if (!uploadRes.ok) throw new Error("Error al subir la imagen.");
                }

                alert("Producto creado con éxito!");
                // Actualizar la lista de productos
                setProducts([...products, { ...formData, idproduct }]);
            }

            // Resetear el formulario y cerrar el modal
            closeProductModal();
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo crear/actualizar el producto. Por favor verifica el servidor o la red.");
        }
    };


    const handleEdit = async (product) => {
        setFormData({
            name: product.name,
            unitmeasure: product.unitmeasure,
            quantity_per_unit: product.quantity_per_unit,
            description: product.description,
            category_id: product.category_id,
            price: product.price
        });

        // Obtener la imagen del producto
        try {
            const response = await fetch(`http://localhost:4000/productimages/${product.idproduct}`);
            if (!response.ok) throw new Error('Error al obtener la imagen del producto.');

            const imageData = await response.json();
            setCurrentImage(imageData[0]?.linkimage || null); // Asignar la URL de la imagen o null si no existe
        } catch (error) {
            console.error('Error fetching product image:', error);
            setCurrentImage(null); // En caso de error, no se asigna ninguna imagen
        }

        setImage(null); // Limpiar cualquier imagen seleccionada
        setPreview(null); // Limpiar la vista previa
        setIsEditing(true);
        setEditId(product.idproduct);
        setShowProductModal(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/producto/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Error al eliminar el producto');

            alert('Producto eliminado con éxito');
            fetchProducts();
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    const openCreateModal = () => {
        setFormData({
            name: '',
            unitmeasure: '',
            quantity_per_unit: 1,
            description: '',
            category_id: '',
            price: ''
        });
        setImage(null);
        setPreview(null);
        setCurrentImage(null);
        setIsEditing(false);
        setShowProductModal(true);
    };

    const openCategoryModal = () => {
        setNewCategoryName('');
        setShowCategoryModal(true);
    };

    const closeProductModal = () => {
        setShowProductModal(false);
    };

    const closeCategoryModal = () => {
        setShowCategoryModal(false);
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) {
            alert('El nombre de la categoría no puede estar vacío.');
            return;
        }
        try {
            const response = await fetch('http://localhost:4000/categorias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName })
            });

            if (!response.ok) throw new Error('Error al crear la categoría');

            alert('Categoría creada con éxito');
            fetchCategories(); // Actualizar la lista de categorías
            setSelectedCategory(''); // Reiniciar el filtro
            closeCategoryModal(); // Cerrar el modal
        } catch (error) {
            console.error('Error al crear la categoría:', error);
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === '' || product.category_id === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };


    return (
        <div>
            <h2>Gestión de Productos</h2>
            <button onClick={openCreateModal}>Agregar Producto</button>
            <button onClick={openCategoryModal}>Agregar Categoría</button>

            <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={handleSearchChange}
            />

            <h3>Filtrar por Categoría</h3>
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                    <option key={category.idcategory} value={category.idcategory}>
                        {category.name}
                    </option>
                ))}
            </select>

            <h3>Lista de Productos</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Unidad de Medida</th>
                        <th>Cantidad por Unidad</th>
                        <th>Descripción</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product.idproduct}>
                            <td>{product.name}</td>
                            <td>{product.unitmeasure}</td>
                            <td>{product.quantity_per_unit}</td>
                            <td>
                                {product.description.length > 100
                                    ? `${product.description.slice(0, 100)}...`
                                    : product.description}
                            </td>
                            <td>{product.category_name || 'Sin Categoría'}</td>
                            <td>{product.price}</td>
                            <td>
                                <button onClick={() => handleEdit(product)}>Editar</button>
                                <button onClick={() => handleDelete(product.idproduct)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showProductModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</h2>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div>
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Unidad de Medida:</label>
                                <select
                                    name="unitmeasure"
                                    value={formData.unitmeasure}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione una unidad</option>
                                    {unitMeasures.map((unit) => (
                                        <option key={unit.value} value={unit.value}>
                                            {unit.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Cantidad por Unidad:</label>
                                <input
                                    type="number"
                                    name="quantity_per_unit"
                                    value={formData.quantity_per_unit}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Descripción:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Categoría:</label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {categories.map((category) => (
                                        <option key={category.idcategory} value={category.idcategory}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Precio:</label>
                                <input
                                    type="number"
                                    step="0"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Imagen:</label>
                                <input type="file" onChange={handleImageChange} />
                                {preview ? (
                                    <img src={preview} alt="Vista previa" className="preview-image" />
                                ) : currentImage ? (
                                    <img src={currentImage} alt="Imagen actual" className="preview-image" />
                                ) : (
                                    <p>No hay imagen disponible</p>
                                )}
                            </div>
                            <button type="submit">
                                {isEditing ? 'Actualizar' : 'Crear'}
                            </button>
                            <button type="button" onClick={closeProductModal}>
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showCategoryModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Agregar Categoría</h2>
                        <form onSubmit={handleCategorySubmit}>
                            <div>
                                <label>Nombre de la Categoría:</label>
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Crear Categoría</button>
                            <button type="button" onClick={closeCategoryModal}>
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
