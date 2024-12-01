const { pool } = require('../database')

const getBillDetail = async (req, res) => {
    const response = await pool.query('SELECT * FROM bill_detail');
    res.status(200).json(response.rows);
};

const getBill_DetailbyBill = async (req, res) => {
    const idbill = req.params.idfactura;
    
    try {
        // Hacemos un JOIN entre bill_detail y products para obtener el nombre del producto
        const response = await pool.query(
            `SELECT 
                bill_detail.idproduct,
                bill_detail.quantity,
                bill_detail.unit_price,
                bill_detail.total_price,
                products.name AS product_name
            FROM bill_detail
            JOIN products ON bill_detail.idproduct = products.idproduct
            WHERE bill_detail.idbill = $1`, 
            [idbill]
        );
        
        res.json(response.rows);
    } catch (error) {
        console.error('Error retrieving bill details with product name:', error);
        res.status(500).json({
            message: 'Error retrieving bill details',
            error: error.message
        });
    }
};


const getBill_DetailbyProduct = async (req, res) => {
    const idproduct = req.params.idproduct
    const response = await pool.query('SELECT * FROM bill_detail WHERE idproduct = $1' , [idproduct]);
    res.json(response.rows);
}

const createBill_Detail = async (req, res) => {
    const { idbill, idproduct, quantity, unit_price } = req.body;

    try {
        const response = await pool.query(
            'INSERT INTO bill_detail (idbill, idproduct, quantity, unit_price) VALUES($1, $2, $3, $4)', 
            [idbill, idproduct, quantity, unit_price]
        );

        res.json({
            message: 'Detalle de factura añadido correctamente',
            body: {
                detalle_factura: { idbill, idproduct, quantity, unit_price }
            }
        });
    } catch (error) {
        console.error('Error adding bill detail:', error);
        res.status(500).json({
            message: 'Error al añadir el detalle de la factura',
            error: error.message
        });
    }
};

const deleteBill_Detail = async (req, res) => {
    const idproduct = req.params.idproduct
    const idbill = req.params.idbill
    const response = await pool.query('DELETE FROM bill_detail WHERE (idproduct = $1 and idbill = $2)', [idproduct, idbill])
    console.log(response);
    res.json('Detalle de factura borrado correctamente')
}

const updateBill_Detail = async (req, res) => {
    const idproduct = req.params.idproduct
    const idbill = req.params.idbill
    const {quantity, unit_price} = req.body
    const response = await pool.query('UPDATE bill_detail SET quantity = $1, unit_price = $2 WHERE (idproduct = $3 and idbill = $4)', [
        quantity, unit_price, idproduct, idbill
    ])
    console.log(response);
    res.send('detalle de factura actualizado')
}

module.exports = {
    getBillDetail,
    createBill_Detail,
    getBill_DetailbyBill,
    getBill_DetailbyProduct,
    deleteBill_Detail, 
    updateBill_Detail
}

