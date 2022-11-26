import React from "react";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import { Button } from "@mui/material";
import { Tooltip } from "@mui/material";
import { FiDownload } from "react-icons/fi";
import { minWidth } from "@mui/system";

function ExcelExport({ excelData, fileName }) {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = async () => {
    // const ws = XLSX.utils.json_to_sheet(excelData);
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <div>
      <Tooltip title="Download as Excel">
        <Button
          variant="contained"
          onClick={(e) => exportToExcel(fileName)}
          color="success"
          style={{ borderRadius: "50%", minWidth: "0px", padding: "11px 12px" }}
        >
          {/* Download as excel */}
          <FiDownload />
        </Button>
      </Tooltip>
    </div>
  );
}

export default ExcelExport;
