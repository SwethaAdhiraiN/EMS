import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Snackbar,
  MenuItem,
} from "@mui/material";
import { Delete, Edit, Person, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getApiClient } from "../api";
import { useAuth } from "../context/AuthContext";

const departments = [
  "Engineering", "HR", "Sales", "Support", "Marketing", "Finance"
];

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      let q = "";
      if(query) q += `search=${encodeURIComponent(query)}`;
      if(department) {
        q += (q ? "&" : "") + `department=${encodeURIComponent(department)}`;
      }
      const res = await getApiClient(token).get(`employees/?${q}`);
      setEmployees(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => { fetchEmployees(); }, [query, department, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    await getApiClient(token).delete(`employees/${id}/`);
    setSnackbarMsg("Employee deleted");
    fetchEmployees();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Employees</Typography>
      <Box mb={2} display="flex" gap={2}>
        <TextField
          label="Search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Department"
          select
          value={department}
          onChange={e => setDepartment(e.target.value)}
          sx={{ width: 160 }}
        >
          <MenuItem value="">All</MenuItem>
          {departments.map(dep => (
            <MenuItem value={dep} key={dep}>{dep}</MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: 150 }}
          onClick={() => navigate("/employees/new")}
        >
          Add Employee
        </Button>
        <Button
          variant="outlined"
          onClick={() => logout()}
          color="secondary"
        >
          Logout
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
            {employees.map(emp => (
              <TableRow key={emp.id}>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.department}</TableCell>
                <TableCell>{emp.phone}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/employees/${emp.id}`)}
                  >
                    <Person />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => navigate(`/employees/${emp.id}/edit`)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(emp.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbarMsg !== ""}
        autoHideDuration={2000}
        onClose={() => setSnackbarMsg("")}
        message={snackbarMsg}
      />
    </Box>
  );
}

export default EmployeeList;
