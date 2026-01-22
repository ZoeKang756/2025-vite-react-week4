import { useState, useEffect } from "react";
import axios from "axios";

const { VITE_BASE_URL } = import.meta.env;

function LoginForm({ loginCompleted, loginFailure }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loginErrMessage, setLoginErrMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${VITE_BASE_URL}/admin/signin`,
        formData,
      );

      loginCompleted(response);
      setLoginErrMessage(!response.data.success ? response.data.message : null);
    } catch (error) {
      setLoginErrMessage(error.response?.data);
      loginFailure(error);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="container login">
      <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
        <div className="col-8">
          <form
            id="form"
            className="form-signin"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                name="username"
                placeholder="name@example.com"
                onChange={(e) => handleInputChange(e, "loginForm")}
                required
                autoFocus
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                onChange={(e) => handleInputChange(e, "loginForm")}
                required
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-lg btn-primary w-100 mt-3" type="submit">
              登入
            </button>
          </form>
          {loginErrMessage ? (
            <p className="text-danger">
              {loginErrMessage}，您的帳號或密碼錯誤!
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>
  );
}
export default LoginForm;
