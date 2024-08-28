import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import InputPasswordCustom from "../../components/InputPassword";
import Loader from "../../components/Loader";
import { LINK_WEBINAR } from "../../routes";
import LoginService from "../../services/LoginService";
import { validatePostRequest } from "../../utils/commonUtils";
import "./PageLogin.css";

const initialFormData = {
  email: "",
  password: "",
};

const PageLogin = () => {
  const [loginFormData, setLoginFormData] = useState(initialFormData);
  const [loginBtnLoader, setLoginBtnLoader] = useState(false);
  const [showLoginFailedValidation, setShowLoginFailedValidation] =
    useState(false);

  const navigate = useNavigate();

  // Event Handler

  const handleLoginFormChange = (e) => {
    setLoginFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setShowLoginFailedValidation(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (loginFormData.email && loginFormData.password) {
      setLoginBtnLoader(true);

      const payload = {
        Email: loginFormData.email,
        Password: loginFormData.password,
      };

      try {
        const res = await LoginService.postLoginData("", payload);

        if (validatePostRequest(res)) {
          if (
            res?.data?.success &&
            res?.data?.message !== "invalid credentials"
          ) {
            setLoginBtnLoader(false);
            localStorage.setItem("userInfo", JSON.stringify(res?.data));
            navigate(`${LINK_WEBINAR}`);
          } else {
            setLoginBtnLoader(false);
            setShowLoginFailedValidation(true);
          }
        }
      } catch (error) {
        setLoginBtnLoader(false);
        console.error(error);
      }
    }
  };

  return (
    <div>
      <Loader />
    </div>
  );

  return (
    <div className="login-container">
      <div className="title text-primary-pLabel">Login</div>
      <div className="p-10 login-form-group-box">
        <form
          className="py-3 flex flex-col items-center gap-5"
          onSubmit={handleLoginSubmit}
        >
          <div className="w-full">
            <Input
              label={"Email"}
              name="email"
              type="email"
              placeholder="Enter Email"
              value={loginFormData.email}
              handler={handleLoginFormChange}
            />
          </div>

          <div className="w-full">
            <InputPasswordCustom
              label={"Password"}
              name="password"
              type="password"
              placeholder="Enter Password"
              value={loginFormData.password}
              handler={handleLoginFormChange}
            />
          </div>

          <button
            type="submit"
            className="login-btn w-full h-8 flex items-center justify-center bg-primary-bg-base text-primary-pTextLight rounded-md"
          >
            <span>Login</span>
            {loginBtnLoader && (
              <i
                className={`pi pi-spin pi-spinner absolute right-3`}
                style={{ fontSize: "12px" }}
              ></i>
            )}
          </button>

          {showLoginFailedValidation && (
            <div className="-my-4 text-primary-error-crimson">
              <small>Invalid Credentials !</small>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PageLogin;
