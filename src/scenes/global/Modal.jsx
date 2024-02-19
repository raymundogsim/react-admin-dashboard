import {  ReactFragment, useEffect, useState, } from 'react';
import axios  from 'axios';
import moment from 'moment';
import {
  Box,
  Container,
  CssBaseline,
  Dialog,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Routes, Route } from "react-router-dom";
import { API_URL, itemFormStart } from '../../constants/constants';



const Modal = () => {
  const [popupModal, setPopupModal] = useState(null);
  const [itemData, setItemData] = useState([]);
  const [formData, setFormData] = useState({itemFormStart});

  const getAllItems = () => {
    return axios.get(`${API_URL}/items/get-item`)
    .then((res) => {
      console.log(res, "RES HERE!")
          setItemData(res.data)
          console.log(res, "pinanfetch");
      })
      .catch((err) => {
          console.log(err);
      })
  }

  const handleChanges = prop => event => {
    setFormData({...formData, [prop] : event.target.value})
  }

  const handleClose = () => {
  setFormData({itemFormStart})
  setPopupModal(false)
  }

  const handleSubmit = () => {
  return axios.post(`${API_URL}/items/add-item`, formData)
  .then((res) => {
      console.log(res)
      getAllItems()
      handleClose()
  })
  .catch((err) => {
      console.log(err)
  })
  }

  const handleDelete = (val) => {
    axios.delete(`${API_URL}/items/delete-item/${val}`)
    .then((res) => {
          getAllItems()
          handleClose()
    })
    .catch((err) => {
          console.log(err)
    })
  }

  const handleEditSubmit = () => {
    axios.put(`${API_URL}/items/edit-item/${formData._id}`, formData)
    .then((res) => {
          console.log(res)
          getAllItems()
          handleClose()
    })
    .catch((err) => {
          console.log(err)
    })
    }

    useEffect(() => {
        getAllItems()
    },[]);

      const theme = useTheme();
      const colors = tokens(theme.palette.mode);


return (

<DialogTitle>
  {popupModal == "edit" ? "EDIT ITEM DETAILS" : "ADD NEW ITEM"}
</DialogTitle>
<DialogContent>
<DialogContentText>
</DialogContentText>
<Table m="dense">
    <TableHead>
      <TableRow height="5px">               
        <TableCell>
            <TextField 
            m="dense"
            id="showdate"
            name="showdate"
            label="Date"
            value={moment(formData.date).format("MM/DD/YYYY")}
            variant="standard" 
            />
        </TableCell>
        <TableCell>
          <TextField
            onChangeCapture={handleChanges("date")}
            required
            m="dense"
            id="date"
            name="date"
            label="Select Date"
            type="date"
            value={moment(formData.date).format("MM/DD/YYYY")}
            defaultValue={moment(formData.date).format(
              "MM/DD/YYYY"
            )}
            variant="outlined"
            fullWidth
            height="10px"
          />
        </TableCell>
      </TableRow>
    </TableHead>
  </Table>
  <TextField
    onChangeCapture={handleChanges("branch")}
    required
    m="dense"
    id="branch"
    name="branch"
    label="Branch"
    value={formData.branch}
    fullWidth
    variant="standard"
  />
  <TextField
    onChangeCapture={handleChanges("name")}
    required
    m="dense"
    id="name"
    name="name"
    label="Name"
    value={formData.name}
    fullWidth
    variant="standard"
  />
  <TextField
    onChangeCapture={handleChanges("purchaseAmt")}
    required
    m="dense"
    id="purchaseAmt"
    name="purchaseAmt"
    label="Purchase Amount"
    type="number"
    value={formData.purchaseAmt}
    fullWidth
    variant="standard"
  />
  <TextField
    onChangeCapture={handleChanges("costPerUnit")}
    required
    m="dense"
    id="costPerUnit"
    name="costPerUnit"
    label="Cost Per Unit"
    value={formData.costPerUnit}
    fullWidth
    variant="standard"
  />
  <TextField
    onChangeCapture={handleChanges("quantity")}
    required
    m="dense"
    id="quantity"
    name="quantity"
    label="Quantity"
    value={formData.quantity}
    type="number"
    fullWidth
    variant="standard"
  />
</DialogContent>
<DialogActions>
  <Button
    color="secondary"
    onClick={handleClose} variant="contained">Cancel</Button>
  <Button
    color="secondary"
    variant="contained"
    type="submit"
    onClick={() => {popupModal == "edit" ? handleEditSubmit() : handleSubmit()}}           
    >
    {popupModal == "edit" ? "Save Changes" : "Save"}
  </Button>
</DialogActions>
  )
}

export default Modal




