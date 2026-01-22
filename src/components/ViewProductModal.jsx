import { useState, useEffect } from "react";

function ViewProductModal({ tempProductData }) {
  const [primaryImage, setPrimaryImage] = useState(tempProductData.imageUrl);
  const [tempData, setTempData] = useState(tempProductData);

  useEffect(() => {
    setTempData(tempProductData);
    setPrimaryImage(tempProductData.imageUrl);
  }, [tempProductData]);

  return (
    <div
      className="modal fade"
      id="viewProductModal"
      data-bs-backdrop="static"
      tabIndex="-1"
      aria-labelledby="viewProductModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h1 className="modal-title fs-5" id="viewProductModalLabel">
              {tempData ? `產品細節-${tempData.title}` : `請選擇一個商品查看`}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-1 d-flex justify-content-between">
              <div>
                <h5 className="text-start">
                  <span className="badge fs-6 bg-primary ms-2 me-2">
                    {tempData.category}
                  </span>
                  {tempData.title}
                </h5>
              </div>
              <div className="fs-5">
                <span className="text-secondary">
                  <del>{tempData.origin_price}</del>
                </span>
                元 / <span className="text-danger"> {tempData.price} </span>元
              </div>
            </div>

            <div>
              {tempData ? (
                <div className="pb-1 pt-1 border-top">
                  {primaryImage && (
                    <img
                      src={primaryImage}
                      className="card-img-top primary-image"
                      alt="主圖"
                    />
                  )}

                  <div className="d-flex flex-wrap justify-content-center">
                    {tempData.imagesUrl.map((photo, index) => (
                      <div className="m-1" key={`photo_${index}`}>
                        <img
                          onClick={() => setPrimaryImage(photo)}
                          src={photo}
                          className="card-img-top images rounded border p-1"
                          alt="其他圖片"
                        />{" "}
                      </div>
                    ))}
                  </div>
                  <div className="text-start m-3">
                    <p>商品描述：{tempData.description}</p>
                    <p>商品內容：{tempData.content}</p>
                  </div>
                </div>
              ) : (
                <p className="text-secondary">請選擇一個商品查看</p>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProductModal;
