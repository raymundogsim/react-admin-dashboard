import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  Box,
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
  Dialog,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { API_URL, itemFormStart } from "../../constants/constants";
import Modal from "../../components/Modal";

const Inventory = () => {
  const [popupModal, setPopupModal] = useState(null);
  const [itemData, setItemData] = useState([]);
  const [formData, setFormData] = useState([itemFormStart]);
  const [ayde, setAyde] = useState();


  const handleClose = () => {
    setFormData({itemFormStart})
    setPopupModal(null)
    }

  const getAllItems = () => {
    return axios
      .get(`${API_URL}/items/get-item`)
      .then((res) => {
        setItemData(res.data);
        console.log(res, "pinanfetch");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (val) => {
    axios
      .delete(`${API_URL}/items/delete-item/${val}`)
      .then((res) => {
        getAllItems();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChanges = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
    console.log(formData, "ginbabalyuan");
  };

  const handleEditSubmit = () => {
    return axios.put(`${API_URL}/items/edit-item/${ayde}`, formData)
    .then((res) => {
          console.log(res, "edit success!")
          getAllItems()
          handleClose()
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



  useEffect(() => {
    getAllItems();
  }, []);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);



  return (
    <Box m="20px" mt="0px">
      <Header title="INVENTORY" />
      <Box
        m="40px 0 0 0"
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },

        }}
      >
      <Modal />
        <Box>
          <TableContainer>
            <Table sx={{ mw: 800 }} mt="20px">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Business Unit</TableCell>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Purchase Amount</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemData && itemData.length > 0 ? (
                  itemData.map((item, index) => {
                    return (
                      <TableRow align="center" key={index}>
                         <Dialog open={popupModal} onClose={handleClose} sx={{m: 20}}>
                         <DialogTitle>
                          EDIT ITEM DETAILS
                         </DialogTitle>
                         <DialogContent>
                           <DialogContentText></DialogContentText>
                          
                           <TableRow>
                           <TextField
                             onChangeCapture={handleChanges("businessUnit")}
                             required
                             m="dense"
                             name="businessUnit"
                             label="Business Unit"
                             value={formData.businessUnit}
                             fullWidth
                             variant="standard"
                           />
                           </TableRow>
                           <TableRow>
                           <TextField
                             onChangeCapture={handleChanges("inventoryId")}
                             required
                             m="dense"
                             name="inventoryId"
                             label="Inventory Code"
                             value={formData.inventoryId}
                             fullWidth
                             variant="standard"
                           />
                           </TableRow>
                           <TableRow>
                             <TextField
                             onChangeCapture={handleChanges("itemName")}
                             required
                             m="dense"
                             name="itemName"
                             label="Item Name"
                             value={formData.itemName}
                             fullWidth
                             variant="standard"
                           />
                           </TableRow>
                          <TableRow>
                           <TextField
                             onChangeCapture={handleChanges("purchaseAmt")}
                             m="dense"
                             name="purchaseAmt"
                             label="Purchase Amount"
                             type="number"
                             value={formData.purchaseAmt}
                             fullWidth
                             variant="standard"
                           />
                         </TableRow>
                          <TableRow>
                           <TextField
                             onChangeCapture={handleChanges("quantity")}
                             required
                             m="dense"
                             name="quantity"
                             label="Quantity"
                             value={formData.quantity}
                             type="number"
                             fullWidth
                             variant="standard"
                           />
                           </TableRow>
                         </DialogContent>
                         <DialogActions>
                           <Button
                             color="secondary"
                             onClick={handleClose}
                             variant="contained"
                           >
                             Cancel
                           </Button>
                           <Button
                             color="secondary"
                             variant="contained"
                             type="submit"
                             onClick={() => {
                                handleEditSubmit()
                             }}
                           >
                            Save Changes
                           </Button>
                         </DialogActions>
                       </Dialog>
                        <TableCell>
                          {moment(item.date).format("MM/DD")}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {item.businessUnit}
                        </TableCell>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.purchaseAmt}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <Button
                            color="secondary"
                            variant="contained"
                            onClick={() => {
                              setFormData(item)
                              setAyde(item._id)
                              setPopupModal("edit");
                            }}
                          >
                            EDIT
                          </Button>
                          &nbsp;
                          &nbsp;
                          <Button
                            color="secondary"
                            variant="contained"
                            onClick={() => {
                              handleDelete(item._id);
                            }}
                          >
                            DELETE
                          </Button>
                        </TableCell>
                      </TableRow>

                       
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell>No data Available in Database!</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell>TOTALS</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
       
      </Box>
    </Box>
  );
};

export default Inventory;
