const { pool } = require('../database')

const getBillDetail = async (req, res) => {
    const response = await pool.query('SELECT * FROM bill_detail');
    res.status(200).json(response.rows);
};

const getBill_DetailbyBill = async (req, res) => {
    const idbill = req.params.idbill
    const response = await pool.query('SELECT * FROM bill_detail WHERE idfbill = $1' , [idbill]);
    res.json(response.rows);
}

const getBill_DetailbyProduct = async (req, res) => {
    const idproduct = req.params.idproduct
    const response = await pool.query('SELECT * FROM bill_detail WHERE idproduct = $1' , [idproduct]);
    res.json(response.rows);
}

const createBill_Detail = async (req, res) => {
    const { idbill, idproduct, quantity, iva} = req.body;
    const response = await pool.query('INSERT INTO bill_detail (idbill, idproduct, quantity, iva) VALUES($1, $2, $3, $4)', [idbill, idproduct, quantity, iva]);
    console.log(response);
    res.json({
        message: 'detalle de factura añadido correctamente',
        body: {
            detalle_factura: {idbill, idproduct, quantity, iva}
        }
    })
}

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
    const {quantity, iva} = req.body
    const response = await pool.query('UPDATE bill_detail SET quantity = $1, iva = $2 WHERE (idproduct = $3 and idbill = $4)', [
        quantity, iva, idproduct, idbill
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

