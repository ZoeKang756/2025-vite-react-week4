import { useState, useEffect, useRef } from "react";
import axios from "axios";
import GetAuthToken from "../untils/GetAuthToken";

const { VITE_BASE_URL, VITE_API_PATH } = import.meta.env;
const token = GetAuthToken();

function ProductModal({
  modalType,
  tempProductData,
  updateCompleted,
  updateFailure,
}) {
  const inputImageUrlRef = useRef(null);
  const [tempData, setTempData] = useState(tempProductData);
  const [uploadFile, setUploadFile] = useState(null);
  const uploadFileRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempData((preData) => ({
      ...preData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddImage = (uploadImage) => {
    const url = uploadImage ? uploadImage : inputImageUrlRef.current.value;
    if (!url) return;

    if (tempData.imageUrl) {
      setTempData((preData) => ({
        ...preData,
        imagesUrl: [...preData.imagesUrl, url],
      }));
    } else {
      setTempData((preData) => ({
        ...preData,
        imageUrl: url,
      }));
    }

    inputImageUrlRef.current.value = "";
  };

  const handleRemoveImage = (url) => {
    const index = tempData.imagesUrl.findIndex((item) => item === url);

    setTempData((preData) => {
      const newImages = [...preData.imagesUrl];
      newImages.splice(index, 1);
      return { ...preData, imagesUrl: newImages };
    });

    inputImageUrlRef.current.value = "";
  };

  const handleChangeMainImage = (url) => {
    const newMainImageIndex = tempData.imagesUrl.findIndex(
      (item) => item === url,
    );
    const oldMainImage = tempData.imageUrl;

    setTempData((preData) => {
      const newImages = [...preData.imagesUrl];
      newImages.splice(newMainImageIndex, 1);
      newImages.push(oldMainImage);
      return { ...preData, imagesUrl: newImages, imageUrl: url };
    });

    inputImageUrlRef.current.value = "";
  };

  const updateProduct = async (id) => {
    let url = `${VITE_BASE_URL}/api/${VITE_API_PATH}/admin/product`;
    let method = "post";

    if (modalType === "edit") {
      url = `${VITE_BASE_URL}/api/${VITE_API_PATH}/admin/product/${id}`;
      method = "put";
    }

    const productData = {
      ...tempData,
      origin_price: parseInt(tempData.origin_price),
      price: parseInt(tempData.price),
      is_enabled: parseInt(tempData.is_enabled),
    };

    try {
      const response = await axios[method](
        url,
        { data: productData },
        {
          headers: { Authorization: token },
        },
      );

      if (response.data.success) {
        updateCompleted([`產品${modalType === "edit" ? "更新" : "新增"}成功`]);
      } else {
        updateFailure([...response.data.message]);
      }
    } catch (error) {
      console.error("更新失敗：", error.response?.data);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!uploadFile) return;

    try {
      const formData = new FormData();
      formData.append("file-to-upload", uploadFile); // file-to-upload 為欄位名稱

      const response = await axios.post(
        `${VITE_BASE_URL}/api/${VITE_API_PATH}/admin/upload`,
        formData,
        {
          headers: { Authorization: token },
        },
      );

      if (response.data.success) {          
        handleAddImage(response.data.imageUrl);
        uploadFileRef.current.value =[]
      }
    } catch (error) {
      console.log(error);
    }

    // 使用 fetch 或 axios 上傳 formData
  };

  useEffect(() => {
    setTempData(tempProductData);
  }, [tempProductData,]);

  return (
    <div
      id="productModal"
      className="modal fade"
      tabIndex="-1"
      data-bs-backdrop="static"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div className="modal-header bg-dark text-white">
            <h5 id="productModalLabel" className="modal-title">
              <span>{modalType === "create" ? "新增產品" : "編輯產品"}</span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div>
              <div>
                <div className="mb-3 row">
                  <div className="col-sm-2">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                  </div>
                  <div className="col-sm-10">
                    <input
                      name="title"
                      onChange={(e) => handleInputChange(e)}
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      value={tempData.title}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <div className="row">
                      <div className="col-sm-4">
                        <label htmlFor="category" className="form-label">
                          分類
                        </label>
                      </div>
                      <div className="col-sm-8">
                        <input
                          name="category"
                          onChange={(e) => handleInputChange(e)}
                          type="text"
                          className="form-control"
                          placeholder="請輸入分類"
                          value={tempData.category}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 col-md-6">
                    <div className="row">
                      <div className="col-sm-2">
                        <label htmlFor="unit" className="form-label">
                          單位
                        </label>
                      </div>
                      <div className="col-sm-10">
                        <input
                          name="unit"
                          onChange={(e) => handleInputChange(e)}
                          type="text"
                          className="form-control"
                          placeholder="請輸入單位"
                          value={tempData.unit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3 col-md-6"></div>
                </div>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <div className="row">
                      <div className="col-sm-4">
                        <label htmlFor="origin_price" className="form-label">
                          原價
                        </label>
                      </div>
                      <div className="col-sm-8">
                        <input
                          name="origin_price"
                          onChange={(e) => handleInputChange(e)}
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder="請輸入原價"
                          value={tempData.origin_price}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3 col-md-6">
                    <div className="row">
                      <div className="col-sm-2">
                        <label htmlFor="price" className="form-label">
                          售價
                        </label>
                      </div>
                      <div className="col-sm-10">
                        <input
                          name="price"
                          onChange={(e) => handleInputChange(e)}
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder="請輸入售價"
                          value={tempData.price}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <hr />

                <div className="mb-3">
                  <div className="row">
                    <div className="col-sm-2">
                      <label htmlFor="description" className="form-label">
                        產品描述
                      </label>
                    </div>
                    <div className="col-sm-10">
                      <textarea
                        name="description"
                        onChange={(e) => handleInputChange(e)}
                        className="form-control"
                        placeholder="請輸入產品描述"
                        value={tempData.description}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="row">
                    <div className="col-sm-2">
                      <label htmlFor="content" className="form-label">
                        說明內容
                      </label>
                    </div>
                    <div className="col-sm-10">
                      <textarea
                        name="content"
                        onChange={(e) => handleInputChange(e)}
                        className="form-control"
                        value={tempData.content}
                        placeholder="請輸入說明內容"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="row">
                    <div className="col-sm-2">
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                    <div className="col-sm-10 d-flex">
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="is_enabled"
                          id="is_enabled_1"
                          value="1"
                          onChange={(e) => handleInputChange(e)}
                          checked={tempData.is_enabled * 1 === 1}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="is_enabled_1"
                        >
                          啟用
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="is_enabled"
                          id="is_enabled_0"
                          value="0"
                          onChange={(e) => handleInputChange(e)}
                          checked={tempData.is_enabled * 1 !== 1}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="is_enabled_0"
                        >
                          不啟用
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-2">
                  <div className="mb-3">
                    <div className="row">
                      <div className="col-sm-2">
                        <label htmlFor="imageUrl" className="form-label">
                          圖片網址
                        </label>
                      </div>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          ref={inputImageUrlRef}
                          defaultValue={""}
                          className="form-control"
                          placeholder="請輸入圖片連結"
                        />
                      </div>
                      <div className="col-sm-2">
                        <button
                          className="btn btn-outline-info btn-sm d-block w-100"
                          onClick={() => handleAddImage()}
                        >
                          新增圖片
                        </button>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-sm-2">
                        <label htmlFor="fileUpload" className="form-label">
                          上傳圖片
                        </label>
                      </div>
                      <div className="col-sm-8">
                        <input
                          type="file" ref={uploadFileRef}
                          className="form-control"
                          id="fileUpload"
                          name="fileUpload"
                          onChange={(e) => {
                            handleFileChange(e);
                          }}
                          accept=".jpg,jpeg,.png"
                        />
                      </div>
                      <div className="col-sm-2">
                        <button
                          className="btn btn-outline-success btn-sm d-block w-100"
                          onClick={() => uploadImage()}
                        >
                          上傳圖片
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap">
                  {tempData.imageUrl && (
                    <div className="position-relative">
                      <div className="images-thumbnails">
                        <img
                          src={tempData.imageUrl}
                          className="mx-auto card-img-top"
                          alt={tempData.imageUrl}
                        />
                      </div>
                      <div className="position-absolute bottom-0 start-0 w-100">
                        <div className="d-flex justify-content-center p-1 bg-white p-2 bg-opacity-75">
                          <div className="flex-grow-1 m-1">主圖</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {tempData.imagesUrl.map((pic, index) => (
                    <div className="position-relative" key={`image_${index}`}>
                      <div className="images-thumbnails">
                        <img
                          src={pic}
                          className="mx-auto card-img-top"
                          alt={pic}
                        />
                      </div>
                      <div className="position-absolute bottom-0 start-0 w-100">
                        <div className="d-flex justify-content-center p-1 bg-white p-2 bg-opacity-75">
                          <div className="flex-grow-1 m-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-info w-100"
                              onClick={() => handleChangeMainImage(pic)}
                            >
                              主圖
                            </button>
                          </div>
                          <div className="flex-grow-1 m-1">
                            <button
                              className="btn btn-outline-danger btn-sm w-100"
                              onClick={() => handleRemoveImage(pic)}
                            >
                              刪除
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => updateCompleted([], true)}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                updateProduct(tempData.id);
              }}
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductModal;
