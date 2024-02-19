import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableCell, TableHead, TableRow, TextField } from '@mui/material'
import React, {  useState } from 'react'
import { itemFormStart } from '../constants/constants'
import { API_URL } from '../constants/constants'
import moment from 'moment';
import axios  from 'axios';

const Modal = ({open}) => {
    const [formData, setFormData] = useState({itemFormStart});
    const [itemData, setItemData] = useState([]);
    const [opener, setOpener] = useState(open)


   const handleClose = () => {
    setFormData({itemFormStart})
    setOpener(null)
    console.log(open, "state han modal pagka close")
    }
 

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

    const handleEditSubmit = () => {
        axios.put(`${API_URL}/items/edit-item/${formData._id}`, formData)
        .then((res) => {
              console.log(res)
              getAllItems()
        })
        .catch((err) => {
              console.log(err)
        })
        }

    const handleSubmit = () => {
        return axios.post(`${API_URL}/items/add-item`, formData)
        .then((res) => {
            console.log(res, "res submitted")
            setFormData(itemFormStart)
            getAllItems()
            handleClose()
        })
        .catch((err) => {
            console.log(err)
        })
        }
   

    const handleChanges = prop => event => {
        setFormData({...formData, [prop] : event.target.value})
        console.log(formData,"ginbabalyuan")
      }

      

  return (
    <div>
                      <Button    
                      fullWidth
                      color="secondary"
                      onClick={() => {
                      setFormData({
                       itemFormStart
                      });
                      setOpener("create");
                    }}
                    variant="contained"
                  >
                 + CREATE NEW ITEM
             </Button>
      <Dialog 
      open={opener} 
      onClose={handleClose} 
      minWidth="250"   
          >
             <DialogTitle>
  {opener == "edit" ? "EDIT ITEM DETAILS" : "ADD NEW ITEM"}
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
    onChangeCapture={handleChanges("businessUnit")}
    required
    m="dense"
    id="businessUnit"
    name="businessUnit"
    label="Business Unit"
    value={formData.businessUnit}
    fullWidth
    variant="standard"
  />
  <TextField
    onChangeCapture={handleChanges("itemName")}
    required
    m="dense"
    id="itemName"
    name="itemName"
    label="Item Name"
    value={formData.itemName}
    fullWidth
    variant="standard"
  />
  <TextField
    onChangeCapture={handleChanges("purchaseAmt")}
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
    onChangeCapture={handleChanges("inventoryId")}
    required
    m="dense"
    id="inventoryId"
    name="inventoryId"
    label="Inventory ID"
    value={formData.inventoryId}
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
    onClick={() => {opener == "edit" ? handleEditSubmit() : handleSubmit()}}           
    >
    {opener == "edit" ? "Save Changes" : "Save"}
  </Button>
</DialogActions>
             </Dialog>
    </div>

  )
}

export default Modal
