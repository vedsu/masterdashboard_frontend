/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import { useState } from "react";

const ButtonCustom = (props) => {
  const {
    className,
    containerClassName,
    loaderIconClassName,
    label,
    handleClick,
    handleClickWithLoader,
    callbackSuccess,
    ...nativeProps
  } = props;

  const [showLoader, setShowLoader] = useState(false);

  const onClickCustomHandler = () => {
    if (handleClickWithLoader && callbackSuccess) {
      setShowLoader(true);
      handleClickWithLoader().then(() => {
        setShowLoader(false);
        callbackSuccess();
      });
    } else if (handleClick) {
      handleClick();
    }
  };

  return (
    <div
      className={`flex items-center justify-between ${
        containerClassName ?? ""
      }`}
    >
      <Button
        className={`block ${className ?? ""} relative`}
        onClick={onClickCustomHandler}
        {...nativeProps}
      >
        {showLoader ? (
          <i
            className={`i-focus pi pi-spin pi-spinner text-xs ${
              loaderIconClassName ?? ""
            }`}
          ></i>
        ) : (
          <span>{label}</span>
        )}
      </Button>
    </div>
  );
};

export default ButtonCustom;
