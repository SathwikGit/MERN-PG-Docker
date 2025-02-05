import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  TextField,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: "", date_of_birth: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5002/users");
      setUsers(res.data);
    } catch (err) {
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    if (!newUser.name || !newUser.date_of_birth) {
      toast.error("Name and Date of Birth are required");
      return;
    }

    try {
      await axios.post("http://localhost:5002/users", newUser);
      toast.success("User added!");
      setNewUser({ name: "", date_of_birth: "" });
      fetchUsers();
    } catch (err) {
      toast.error("Error adding user");
    }
  };

  const updateUser = async () => {
    if (!editingUser.name || !editingUser.date_of_birth) {
      toast.error("Name and Date of Birth are required");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5002/users/${editingUser.id}`,
        editingUser
      );
      toast.success("User updated!");
      setOpenDialog(false);
      fetchUsers();
    } catch (err) {
      toast.error("Error updating user");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/users/${id}`);
      toast.success("User deleted!");
      fetchUsers();
    } catch (err) {
      toast.error("Error deleting user");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "date_of_birth", headerName: "Date of Birth", width: 150 },
    { field: "age", headerName: "Age", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            onClick={() => {
              setEditingUser(params.row);
              setOpenDialog(true);
            }}
          >
            <Edit />
          </Button>
          <Button color="error" onClick={() => deleteUser(params.row.id)}>
            <Delete />
          </Button>
        </>
      ),
    },
  ];

  return (
    <Container>
      <h2>User Management</h2>

      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid rows={users} columns={columns} pageSize={5} autoHeight />
      )}

      {/* Add User Form */}
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <TextField
          label="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <TextField
          type="date"
          value={newUser.date_of_birth}
          onChange={(e) =>
            setNewUser({ ...newUser, date_of_birth: e.target.value })
          }
        />
        <Button variant="contained" onClick={addUser}>
          Add User
        </Button>
      </Box>

      {/* Edit User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            value={editingUser?.name || ""}
            onChange={(e) =>
              setEditingUser({ ...editingUser, name: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            type="date"
            fullWidth
            value={editingUser?.date_of_birth || ""}
            onChange={(e) =>
              setEditingUser({ ...editingUser, date_of_birth: e.target.value })
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={updateUser} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
