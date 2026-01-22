import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
import "./assets/style.css";
import DeleteConfirmModal from "./components/deleteConfirmModal";
import ProductModal from "./components/ProductModal";
import LoginForm from "./views/LoginForm";
import MessageToast from "./components/MessageToast";
import GetAuthToken from "./untils/GetAuthToken";
import Pagination from "./components/Pagination";
import ViewProductModal from "./components/viewProductModal";
import Loading from "./components/Loading";

const { VITE_BASE_URL, VITE_API_PATH } = import.meta.env;
const PRODUCT_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: 1,
  imageUrl: "",
  imagesUrl: [],
};

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [showMessages, setShowMessages] = useState({ type: "", msgs: [] });
  const [pagination, setPagination] = useState({});

  const [isCheckedAuth, setIsCheckedAuth] = useState(false);
  const [tempProductData, setTempProductData] = useState(PRODUCT_DATA);
  const [delConfirmData, setDelConfirmData] = useState({
    id: "",
    title: "",
  });
  const [modalType, setModalType] = useState("");

  const productModalRef = useRef(null);
  const delProductModalRef = useRef(null);
  const viewProductModalRef = useRef(null);
  const msgToastRef = useRef(null);

  const loginCompleted = (response, isCheckLogin = false) => {
    setIsLogin(response.data.success);
    if (response.data.success) {
      if (!isCheckLogin) {
        const { token, expired } = response.data;
        document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      }
      getProducts();
    }
  };

  const loginFailure = (error) => {
    setIsLogin(false);
    console.log(error.response);
  };

  const checkLogin = async () => {
    const token = GetAuthToken();
    try {
      const config = {
        headers: { Authorization: token },
      };

      const checkRes = await axios.post(
        `${VITE_BASE_URL}/api/user/check`,
        {},
        config,
      );
      loginCompleted(checkRes, true);
    } catch (error) {
      loginFailure(error);
    } finally {
      setIsCheckedAuth(true);
      viewProductModalRef.current = new bootstrap.Modal("#viewProductModal");
      delProductModalRef.current = new bootstrap.Modal("#delProductModal");
    }
  };

  const logout = () => {
    document.cookie =
      "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLogin(false);
  };

  const getProducts = async (page = 1) => {
    const token = GetAuthToken();
    try {
      const response = await axios.get(
        `${VITE_BASE_URL}/api/${VITE_API_PATH}/admin/products?page=${page}`,
        { headers: { Authorization: token } },
      );
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error(error.response?.data);
    }
  };

  const deleteCompleted = (messages, isCancel = false) => {
    closeDelProductModal();
    if (!isCancel) {
      getProducts();
      setShowMessages({
        type: "success",
        msgs: [...messages],
      });
      msgToastRef.current.show();
    }
  };

  const deleteFailure = (messages) => {
    setShowMessages({ type: "error", msgs: [...messages] });
    msgToastRef.current.show();
  };

  const updateCompleted = (messages, isCancel = false) => {
    closeProductModal();
    if (!isCancel) {
      getProducts();
      setShowMessages({
        type: "success",
        msgs: [...messages],
      });
      msgToastRef.current.show();
    }
  };

  const updateFailure = (messages) => {
    setShowMessages({ type: "error", msgs: [...messages] });
    msgToastRef.current.show();
  };

  const openProductModal = (product, modelType) => {
    setTempProductData({
      ...PRODUCT_DATA,
      ...product,
    });

    setModalType(modelType);
    productModalRef.current.show();
  };

  const closeProductModal = () => {
    productModalRef.current.hide();
  };

  const openViewProductModal = (e, product) => {
    e.preventDefault();
    setTempProductData({
      ...PRODUCT_DATA,
      ...product,
    });
    viewProductModalRef.current.show();
  };

  const openDelProductModal = (product) => {
    setDelConfirmData({
      id: product.id,
      title: product.title,
    });

    delProductModalRef.current.show();
  };

  const closeDelProductModal = () => {
    delProductModalRef.current.hide();
  };

  useEffect(() => {
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });

    msgToastRef.current = new bootstrap.Toast("#msgToast");

    // Modal 關閉時移除焦點
    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

    const token = GetAuthToken();

    if (token) checkLogin();
    else setIsCheckedAuth(true);
  }, []);

  return (
    <>
      {isCheckedAuth ? (
        <div>
          {isLogin ? (
            <div>
              <div className="container">
                <div className="row">
                  <div className="col-6">
                    <div className="text-start mt-4">
                      <button
                        className="btn btn-danger mb-5"
                        type="button"
                        onClick={logout}
                      >
                        管理員登出
                      </button>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-end mt-4">
                      <button
                        className="btn btn-primary"
                        onClick={() => openProductModal(PRODUCT_DATA, "create")}
                      >
                        建立新的產品
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border rounded">
                  <table className="table mt-4 table-striped ">
                    <thead>
                      <tr>
                        <th className="text-start">產品名稱</th>
                        <th>分類</th>
                        <th width="120" className="text-end">
                          原價
                        </th>
                        <th width="120" className="text-end">
                          售價
                        </th>
                        <th>是否啟用</th>
                        <th width="120">編輯</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="text-start">
                            <a
                              href="#"
                              className="text-decoration-none"
                              onClick={(e) => openViewProductModal(e, product)}
                            >
                              {product.title}
                            </a>
                          </td>
                          <td>{product.category}</td>
                          <td className="text-end">{product.origin_price}</td>
                          <td className="text-end">{product.price}</td>
                          <td>
                            {product.is_enabled === 1 ? (
                              <span className="text-success">啟用</span>
                            ) : (
                              <span>未啟用</span>
                            )}
                          </td>
                          <td>
                            <div className="btn-group">
                              <button
                                type="button"
                                onClick={() =>
                                  openProductModal(product, "edit")
                                }
                                className="btn btn-outline-primary btn-sm"
                              >
                                編輯
                              </button>
                              <button
                                type="button"
                                onClick={() => openDelProductModal(product)}
                                className="btn btn-outline-danger btn-sm"
                              >
                                刪除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Pagination
                    pagination={pagination}
                    onChangePage={getProducts}
                  ></Pagination>
                </div>
              </div>
            </div>
          ) : (
            <LoginForm
              loginCompleted={loginCompleted}
              loginFailure={loginFailure}
            ></LoginForm>
          )}
        </div>
      ) : (
        <Loading></Loading>
      )}
      <ViewProductModal tempProductData={tempProductData}></ViewProductModal>
      <DeleteConfirmModal
        delConfirmData={delConfirmData}
        deleteCompleted={deleteCompleted}
        deleteFailure={deleteFailure}
      />
      <ProductModal
        modalType={modalType}
        tempProductData={tempProductData}
        updateCompleted={updateCompleted}
        updateFailure={updateFailure}
      />
      <MessageToast showMessages={showMessages} />
    </>
  );
}

export default App;
