import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Input,
  Button,
  TextField,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { API_URL } from '../../constants/constants';
import { purFormStart } from '../../constants/constants';
import moment from 'moment';
import { getRowIdFromRowModel } from '@mui/x-data-grid/hooks/features/rows/gridRowsUtils';

const InventoryForm = () => {
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [purchasesData, setPurchasesData] = useState([]);
  const [purchaseItem, setPurchaseItem] = useState([]);
  const [formData, setFormData] = useState(purFormStart);
  const [editMode, setEditMode] = useState(false);


  const getAllPurchases = async () => {
    try {
      const res = await axios.get(`${API_URL}/purchases/get-purchases`);
      setPurchasesData(res.data);
      console.log(res, "MAYDA NA!");
    } catch (err) {
      console.error(err, "waray pakaGET");
    }
  };

  const extractPurchaseItem = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/purchases/:purchaseId/extract-properties`
      );
      console.log(res, "nagEEXTRACT");
      setPurchaseItem(res.data);
    } catch (err) {
      console.error(err, "waray pakaEXTRACT");
    }
  };

  const handleChanges = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
  };

  const handleClose = () => {
    setFormData(purFormStart);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/purchases/add-purchases`,
        formData
      );
      console.log(res);
      await getAllPurchases();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (val) => {
    try {
      const res = await axios.delete(
        `${API_URL}/purchases/delete-purchases/${val}`
      );
      await getAllPurchases();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/purchases/edit-purchases/${formData._id}`,
        formData
      );
      console.log(res);
      await getAllPurchases();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllPurchases();
  }, []);

  const columns = [
    { field: 'quantity', headerName: 'Quantity', width: 120 },
    { field: 'purchaseOrderId', headerName: 'Purchase Order ID', width: 150 },
    { field: 'date', headerName: 'Date', width: 120, type: 'date', valueFormatter: (params) => moment(params.value).format('MM/DD/YYYY') },
    { field: 'processedBy', headerName: 'Processed By', width: 150 },
  ];

  const purchaseItemsColumns = [
    { field: 'itemName', headerName: 'Item Name', width: 200 },
    { field: 'itemDesc', headerName: 'Item Description', width: 200 },
    { field: 'purchaseAmt', headerName: 'Item Purchase Amount', width: 200 },
    { field: 'qtyUom', headerName: 'Quantity UOM', width: 150 },
    { field: 'quantity', headerName: 'Quantity', width: 120 },
    { field: 'supplierDetails', headerName: 'Supplier Details', width: 200 },
    { field: 'receiverDetails', headerName: 'Receiver Details', width: 200 },
  ];

  const handleRowClick = (params) => {
    setSelectedRow(params.id);
  };

  const generateFormFields = () => {
    if (selectedRow === null) {
      return null;
    }

    const selectedData = rows.find((row) => row.id === selectedRow);
    return columns.map((column) => (
      <FormControl fullWidth key={column.field} margin="normal">
        <InputLabel>{column.headerName}</InputLabel>
        <Input disabled value={selectedData ? selectedData[column.field] : ''} />
      </FormControl>
    ))
  };

  const addIdToRows = (rows) => {
    return rows.map((row) => ({ ...row, id: row._id }));
  };
  
console.log(purchasesData, "PURCHASEES DATA")
  
return (
  <div style={{ height: 400, width: '100%' }}>
  <DataGrid
    rows={addIdToRows(purchasesData)}
    columns={columns}
    pageSize={5}
    rowsPerPageOptions={[5, 10, 20]}
    checkboxSelection
    disableSelectionOnClick
    getRowId={(row) => row.id}
  />
</div>
);
};
  
export default InventoryForm;
