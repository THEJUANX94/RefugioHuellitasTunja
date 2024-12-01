import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './css/style_cart.css';

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('D'); // Empezamos con 'D' como predeterminado (Débito)
    const [formData, setFormData] = useState({
        clientName: '',
        cardNumber: '',
        expirationDate: '',
        cvc: '',
        bankName: '',
        email: ''
    }); // Datos del formulario
    const navigate = useNavigate();
    const shippingCost = 5000; // Costo de envío
    const commission = 3000; // Comisión

    // Verificar si el usuario está logueado
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    const user = localStorage.getItem('username');

    useEffect(() => {
        if (!auth) {
            // Si el usuario no está autenticado, redirigimos a la página de login
            navigate('/login');
        }

        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);

        // Calcular el total
        const totalAmount = storedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(totalAmount);
    }, [auth, navigate]);

    // Eliminar producto del carrito
    const removeFromCart = (productId) => {
        const updatedCart = cart.filter(item => item.id !== productId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // Actualizamos el carrito en localStorage
    };

    // Ir a la tienda
    const goToStore = () => {
        navigate('/store');
    };

    // Manejar el cambio en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Manejar cambio en el método de pago
    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    // Función para procesar el pago y guardar el carrito
    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        // Validar los campos del formulario dependiendo del método de pago
        if (paymentMethod === 'D' || paymentMethod === 'C') {
            // Si es tarjeta de débito o crédito, validamos los campos de tarjeta
            if (!formData.cardNumber || !formData.expirationDate || !formData.cvc) {
                alert("Por favor complete todos los campos de la tarjeta.");
                return;
            }
        }

        if (paymentMethod === 'E') {
            // Si es transferencia, validamos el banco y correo
            if (!formData.bankName || !formData.email) {
                alert("Por favor complete todos los campos de la transferencia.");
                return;
            }
        }

        // Crear la factura con el nombre del usuario logueado
        const bill = {
            client: user, // Tomamos el nombre del usuario del localStorage
            payment_method: paymentMethod,
            total_amount: total + shippingCost + commission,
        };

        // Insertar la factura en la base de datos
        const billResponse = await fetch("http://localhost:4000/factura", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bill),
        });

        const billData = await billResponse.json(); // Obtener el id de la factura creada
        const billId = billData.body.bill.idbill; // Asegurarse de que recibimos el idbill


        // Insertar los detalles de la factura
        for (const item of cart) {
            const billDetail = {
                idbill: billId,
                idproduct: item.id,
                quantity: item.quantity,
                unit_price: item.price,
            };

            console.log(billDetail)

            await fetch("http://localhost:4000/detallefactura", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(billDetail),
            });
        }

        // Limpiar el carrito en el localStorage
        localStorage.removeItem('cart');

        // Redirigir a la página de confirmación o al inicio
        navigate('/order-confirmation');
    };

    return (
        <>
            <Header />
            <div className="cart-container">
                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <p>No tienes productos en tu carrito</p>
                        <button onClick={goToStore}>Ir a la tienda</button>
                    </div>
                ) : (
                    <>
                        <h2>Mi carrito</h2>
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                    <th>Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price * item.quantity}</td>
                                        <td>
                                            <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="cart-summary">
                            <h3>Resumen</h3>
                            <p>Total de productos: {total}</p>
                            <p>Costo de envío: {shippingCost}</p>
                            <p>Comisión: {commission}</p>
                            <p><strong>Total: {total + shippingCost + commission}</strong></p>
                        </div>

                        <div className="payment-form">
                            <h3>Formulario de pago</h3>
                            <form onSubmit={handlePaymentSubmit}>
                                <label>Nombre Completo</label>
                                <input
                                    type="text"
                                    name="clientName"
                                    value={formData.clientName || user} // Prellena con el nombre del usuario si está logueado
                                    onChange={handleInputChange}
                                    placeholder="Nombre"
                                    required
                                    disabled
                                />

                                <label>Método de pago</label>
                                <select
                                    name="paymentMethod"
                                    value={paymentMethod}
                                    onChange={handlePaymentMethodChange}
                                    required
                                >
                                    <option value="D">Débito</option>
                                    <option value="C">Crédito</option>
                                    <option value="E">Transferencia</option>
                                </select>

                                {paymentMethod === 'D' || paymentMethod === 'C' ? (
                                    <>
                                        <label>Tarjeta de Crédito/Débito</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleInputChange}
                                            placeholder="Número de tarjeta"
                                            required
                                        />
                                        <label>Fecha de Expiración</label>
                                        <input
                                            type="text"
                                            name="expirationDate"
                                            value={formData.expirationDate}
                                            onChange={handleInputChange}
                                            placeholder="MM/AA"
                                            required
                                        />
                                        <label>CVC</label>
                                        <input
                                            type="text"
                                            name="cvc"
                                            value={formData.cvc}
                                            onChange={handleInputChange}
                                            placeholder="CVC"
                                            required
                                        />
                                    </>
                                ) : null}

                                {paymentMethod === 'E' ? (
                                    <>
                                        <label>Nombre del Banco</label>
                                        <input
                                            type="text"
                                            name="bankName"
                                            value={formData.bankName}
                                            onChange={handleInputChange}
                                            placeholder="Nombre del banco"
                                            required
                                        />
                                        <label>Correo electrónico</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Correo electrónico"
                                            required
                                        />
                                    </>
                                ) : null}

                                <button type="submit">Pagar</button>
                            </form>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default CartPage;
