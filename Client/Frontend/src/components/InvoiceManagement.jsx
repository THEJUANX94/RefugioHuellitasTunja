import React, { useState, useEffect } from 'react';

const InvoiceManagement = () => {
    const [invoices, setInvoices] = useState([]);
    const [invoiceDetails, setInvoiceDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [infoInvoice, setinfoInvoice] = useState(null);

    // Obtener todas las facturas
    useEffect(() => {
        const fetchInvoices = async () => {
            const response = await fetch("http://localhost:4000/factura");
            const data = await response.json();
            setInvoices(data);
        };
        fetchInvoices();
    }, []);

    // Obtener los detalles de la factura
    const fetchInvoiceDetails = async (idbill, invoice) => {
        const response = await fetch(`http://localhost:4000/detallefactura/${idbill}`);
        const data = await response.json();
        setInvoiceDetails(data);
        setinfoInvoice(invoice);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="invoice-management">
            <h2>Gestión de Facturas</h2>
            <table className="invoice-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Tipo de Pago</th>
                        <th>Total Pagado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.idbill}>
                            <td>{invoice.date}</td>
                            <td>{invoice.client}</td>
                            <td>{invoice.payment_method === 'D' ? 'Débito' : invoice.payment_method === 'C' ? 'Crédito' : 'Transferencia'}</td>
                            <td>{invoice.total_amount}</td>
                            <td>
                                <button onClick={() => fetchInvoiceDetails(invoice.idbill, invoice)}>Ver Detalles</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para mostrar detalles de la factura */}
            {showModal && invoiceDetails && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={closeModal}>
                            &times;
                        </button>
                        <h3>Detalles de la Factura</h3>
                        <p><strong>Fecha:</strong> {infoInvoice.date}</p>
                        <p><strong>Cliente:</strong> {infoInvoice.client}</p>
                        <p><strong>Tipo de Pago:</strong> {infoInvoice.payment_method === 'D' ? 'Débito' : invoiceDetails.payment_method === 'C' ? 'Crédito' : 'Transferencia'}</p>
                        <p><strong>Total:</strong> {infoInvoice.total_amount}</p>

                        <h4>Productos Comprados</h4>
                        <table className="invoice-detail-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceDetails.map((item) => (
                                    <tr key={item.idproduct}>
                                        <td>{item.product_name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.unit_price}</td>
                                        <td>{item.total_price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceManagement;
