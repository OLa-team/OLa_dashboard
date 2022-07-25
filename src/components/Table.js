import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { usePageDispatch, usePatientDispatch } from "../context";
import { useNavigate } from "react-router-dom";
import { setCurrentPatient } from "../service";

function Table({ data, columns, deletePatient }) {
  const gridStyle = {
    minHeight: "600",
    fontSize: "20px",
    fontWeight: "bold",
  };
  const [pageSize, setPageSize] = useState(10);

  const dispatch = usePatientDispatch();
  const pageDispatch = usePageDispatch();

  const navigate = useNavigate();

  function setSelectedPatientList(ids) {
    const selectedIDs = new Set(ids);
    const selectedRowData = data.filter((row) => selectedIDs.has(row.id));
    console.log(selectedRowData);

    dispatch({
      type: "SELECT_AND_SET_SELECTED_PATIENT_LIST_TO_DELETE",
      payload: selectedRowData,
    });
  }

  return (
    <Box style={{ height: "90%", width: "95%", margin: "auto" }}>
      <DataGrid
        rows={data}
        columns={columns}
        style={gridStyle}
        // autoPageSize={true}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 20, 50]}
        checkboxSelection
        disableSelectionOnClick
        onRowClick={async (row) => {
          console.log("Patient id", row.row.patientId);
          await setCurrentPatient(dispatch, row.row.patientId);
          navigate(`/dashboard/patient/${row.row.patientId}`);
        }}
        density="comfortable"
        onSelectionModelChange={(ids) => setSelectedPatientList(ids)}
        components={{
          Toolbar: () => {
            return (
              <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>
                <GridToolbar />
              </GridToolbarContainer>
            );
          },
        }}
      />
    </Box>
  );
}

export default Table;
