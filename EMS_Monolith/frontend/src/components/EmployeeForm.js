import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getApiClient } from "../api";
import { useAuth } from "../context/AuthContext";

const departments = [
  "Engineering", "HR", "Sales", "Support", "Marketing", "Finance"
];

function EmployeeForm({ editMode }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    phone: "",
    address: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(editMode);
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (editMode && id) {
      getApiClient(token)
        .get(`employees/${id}/`)
        .then(res => setForm(res.data))
        .catch(() => setError("Failed to load employee"))
        .finally(() => setLoading(false));
    }
  }, [editMode, id, token]);

  const handleChange = (e) => {
    setForm(f => ({
      ...f,
      [e.target.name]: e.target.value
    }));
  };

  const validate = () => {
    if (!form.name || !form.email || !form.department) {
      return "Name, Email and Department are required fields.";
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return "Please enter a valid email address.";
    }
    // More valid rules as needed
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }
    try {
      if(editMode){
        await getApiClient(token).put(`employees/${id}/`, form);
      } else {
        await getApiClient(token).post("employees/", form);
      }
      navigate("/");
    } catch (err) {
      setError("Failed to save employee");
    }
  };

  if (loading) return <CircularProgress />;
  return (
    <Paper sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h5" mb={2}>{editMode ? "Edit" : "Add"} Employee</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          required
          name="name"
          label="Name"
          value={form.name}
          onChange={handleChange}
          margin="normal"
          fullWidth
        />
        <TextField
          required
          name="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          type="email"
          margin="normal"
          fullWidth
        />
        <TextField
          select
          required
          name="department"
          label="Department"
          value={form.department}
          onChange={handleChange}
          margin="normal"
          fullWidth
        >
          <MenuItem value="">Select...</MenuItem>
          {departments.map(dep => (
            <MenuItem value={dep} key={dep}>{dep}</MenuItem>
          ))}
        </TextField>
        <TextField
          name="position"
          label="Position"
          value={form.position}
          onChange={handleChange}
          margin="normal"
          fullWidth
        />
        <TextField
          name="phone"
          label="Phone"
          value={form.phone}
          onChange={handleChange}
          margin="normal"
          fullWidth
        />
        <TextField
          name="address"
          label="Address"
          value={form.address}
          onChange={handleChange}
          margin="normal"
          fullWidth
        />
        <Box mt={2} display="flex" gap={2}>
          <Button type="submit" variant="contained" color="primary">
            {editMode ? "Save" : "Add"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default EmployeeForm;
