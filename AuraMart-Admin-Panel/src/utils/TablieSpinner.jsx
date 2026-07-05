
import React from "react";
import { ScaleLoader } from "react-spinners";

const TableSpinner = ({ colSpan, height }) => {
  return (
    <tbody>
      <tr>
        <td colSpan={colSpan} className="py-4 text-center align-middle">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: `${height}px` }}
          >
            <ScaleLoader color="#A59168CC" height={30} />
          </div>
        </td>
      </tr>
    </tbody>

  );
};

export default TableSpinner;
