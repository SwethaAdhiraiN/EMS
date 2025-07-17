import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getApiClient } from "../api";
import { useAuth } from "../context/AuthContext";

function EmployeeProfile() {
  const [emp, setEmp] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getApiClient(token)
      .get(`employees/${id}/`)
      .then(res => setEmp(res.data))
      .catch(() => setEmp(null))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return <CircularProgress />;
  if (!emp) return <Typography>Employee not found.</Typography>;
  return (
    <Paper sx={{ maxWidth: 500, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>Employee Profile</Typography>
      <Box>
        <Typography><b>Name:</b> {emp.name}</Typography>
        <Typography><b>Email:</b> {emp.email}</Typography>
        <Typography><b>Department:</b> {emp.department}</Typography>
        <Typography><b>Position:</b> {emp.position}</Typography>
        <Typography><b>Phone:</b> {emp.phone}</Typography>
        <Typography><b>Address:</b> {emp.address}</Typography>
      </Box>
      <Box mt={2}>
        <Button
          variant="contained"
          onClick={() => navigate(`/employees/${emp.id}/edit`)}
          sx={{ mr: 2 }}
        >
          Edit
        </Button>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Back
        </Button>
      </Box>
    </Paper>
  );
}

export default EmployeeProfile;
