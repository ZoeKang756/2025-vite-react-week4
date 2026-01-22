import { useState, useEffect, useRef } from "react";
import axios from "axios";
import GetAuthToken from "../untils/GetAuthToken";
const { VITE_BASE_URL, VITE_API_PATH } = import.meta.env;

function DeleteConfirmModal({
  delConfirmData,
  deleteCompleted,
  deleteFailure,
}) {
  const [tempData, setTempData] = useState(delConfirmData);
  const [isSubmit, setIsSubmit] = useState(null);

  const deleteProduct = async (e, id) => {
    const url = `${VITE_BASE_URL}/api/${VITE_API_PATH}/admin/product/${id}`;
    const token = GetAuthToken();
    setIsSubmit(true);

    try {
      const response = await axios.delete(url, {
        headers: { Authorization: token },
      });

      if (response.data.success) {
        deleteCompleted(["產品刪除成功"]);
      } else {
        const errMsg = Array.isArray(response.data.message)
          ? [...response.data.message]
          : [response.data.message];
        deleteFailure(errMsg);
      }
    } catch (error) {
      deleteFailure(["產品刪除失敗"]);
    } finally {
      setIsSubmit(false);
    }
  };

  useEffect(() => {
    setTempData(delConfirmData);
  }, [delConfirmData]);

  return (
    <div
      className="modal fade"
      id="delProductModal"
      data-bs-backdrop="static"
      tabIndex="-1"
      aria-labelledby="delProductModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h1 className="modal-title fs-5" id="delProductModalLabel">
              刪除產品
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p className="fs-5 py-3">
              您確定要刪除
              <span className="text-danger"> {tempData.title} </span>嗎？
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => deleteCompleted([], true)}
            >
              取消
            </button>
            <button
              type="button"
              disabled={isSubmit}
              className="btn btn-danger"
              onClick={() => deleteProduct(tempData.id)}
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DeleteConfirmModal;
