import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  Box,
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
import { API_URL } from '../../constants/constants';
import { purFormStart } from '../../constants/constants';

const Purchases = () => {
  const [popupModal, setPopupModal] = useState(null);
  const [purchasesData, setPurchasesData] = useState([]);
  const [purchaseItem, setPurchaseItem] = useState([]);
  const [formData, setFormData] = useState(purFormStart);

  const getAllPurchases = async () => {
    try {
      const res = await axios.get(`${API_URL}/purchases/get-purchases`);
      setPurchasesData(res.data);
      console.log(res, "MAYDA NA!");
    } catch (err) {
      console.error(err, "waray pakaGET");
    }
  }

  const extractPurchaseItem = async () => {
    try {
      const res = await axios.get(`${API_URL}/purchases/:purchaseId/extract-properties`);
      console.log(res, "nagEEXTRACT");
      setPurchaseItem(res.data);
    } catch (err) {
      console.error(err, "waray pakaEXTRACT");
    }
  }

  const handleChanges = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
  }

  const handleClose = () => {
    setFormData(purFormStart);
    setPopupModal(false);
  }

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${API_URL}/purchases/add-purchases`, formData);
      console.log(res);
      await getAllPurchases();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  }

  const handleDelete = async (val) => {
    try {
      const res = await axios.delete(`${API_URL}/purchases/delete-purchases/${val}`);
      await getAllPurchases();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  }

  const handleEditSubmit = async () => {
    try {
      const res = await axios.put(`${API_URL}/purchases/edit-purchases/${formData._id}`, formData);
      console.log(res);
      await getAllPurchases();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getAllPurchases();
  }, []);

  let totalQuantity = 0;
  purchasesData.forEach((purchase) => {
    totalQuantity += purchase.quantity;
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px" mt="0">
          <Header title="PURCHASES" />
          <Box m="20px 0px 0px 0px" height="35vh" 
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
              }}>
          </Box>      
            <Box>
                <Dialog open={popupModal}>
                  <DialogTitle>
                    {popupModal == "edit" ? "EDIT PURCHASE DETAILS" : "SAVE PURCHASE"}
                  </DialogTitle>
                  <DialogContent>
                      <DialogContentText>
                      </DialogContentText>
                  <Table>
                      <TableHead>
                        <TableRow height="10px">               
                          <TableCell>
                              <TextField 
                              margin="none"
                              id="date"
                              name="date"
                              label="Date"
                              value={moment(formData.date).format("MM/DD/YYYY")}
                              variant="outlined" 
                              />
                          </TableCell>
                        </TableRow>
                      </TableHead>
                  </Table>
                  <TableBody>
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
                      onChangeCapture={handleChanges("price")}
                      required
                      m="dense"
                      id="price"
                      name="price"
                      label="Price"
                      type="number"
                      value={formData.price}
                      fullWidth
                      variant="standard"
                    />
                    <TextField
                      onChangeCapture={handleChanges("category")}
                      required
                      m="dense"
                      id="category"
                      name="category"
                      label="Category"
                      value={formData.category}
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
                  </TableBody>
                  <DialogActions>
                    <Button onClick={handleClose} variant="contained">Cancel</Button>
                    <Button
                      variant="contained"
                      type="submit"
                      onClick={() => {popupModal == "edit" ? handleEditSubmit() : handleSubmit()}}           
                      >
                      {popupModal == "edit" ? "Save Changes" : "Save"}
                    </Button>
                  </DialogActions>
                 </DialogContent>
              </Dialog>


            <TableContainer>
                <Table
                      sx={{ mw: 800 }}
                  >
                    <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>BusinessUnit</TableCell>
                          <TableCell>Purchase Order No.</TableCell>
                          <TableCell>Processed By</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                      {purchasesData && purchasesData.length > 0 ? (
                        purchasesData.map((purchase, index) => {
                          return (
                            <TableRow
                              align="center"
                              key={index}>
                              <TableCell>
                                {moment(purchase.date).format("MM/DD")}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {purchase.businessUnit}
                              </TableCell>
                              <TableCell >{purchase.purchaseOrderId}</TableCell>
                              <TableCell >{purchase.processedBy}</TableCell>
                              <TableCell >{purchase.status}</TableCell>
                              <TableCell > <Button 
                                              color="secondary"
                                              variant="contained"
                                              onClick={() => {
                                                setFormData(purchase);
                                                setPopupModal("edit");
                                                      }}> EDIT
                                            </Button>
                                            &nbsp;&nbsp;
                                            <Button
                                                color="secondary"
                                                variant="contained"
                                                onClick={() => {
                                                  handleDelete(purchase._id);
                                                       }}>DELETE
                                          </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      ) : (
                        <TableRow>
                              <TableCell>No data Available in Database!</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                      </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>


              <Button color="secondary"
                      variant="contained"
                      size="large"
                      onClick={() => {
                      setFormData({purFormStart});
                      setPopupModal("create");
                      }}
                  > + RECORD NEW PURCHASE
              </Button> 

              
      </Box>
  </Box>
  );
}

export default Purchases;
