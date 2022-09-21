import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { useState } from "react";

function Table({
  style,
  data,
  columns,
  clickRowFunction,
  selectFunction,
  toolbar,
  gridStyle,
  density,
  checkboxSelection,
}) {
  const [pageSize, setPageSize] = useState(10);

  return (
    <Box style={style}>
      <DataGrid
        rows={data}
        columns={columns}
        style={gridStyle}
        // autoPageSize={true}
        hideFooterPagination={false}
        hideFooter={false}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 20, 50]}
        // rowsPerPageOptions={1000}
        checkboxSelection={checkboxSelection}
        disableSelectionOnClick
        onRowClick={(row) => clickRowFunction(row)}
        // onCellClick={(cell) => console.log("cell", cell)}
        density={density}
        onSelectionModelChange={(ids) => selectFunction(ids, data)}
        components={{
          Toolbar: () => {
            return (
              <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>
                {toolbar ? <GridToolbar /> : ""}
              </GridToolbarContainer>
            );
          },
        }}
      />
    </Box>
  );
}

export default Table;
