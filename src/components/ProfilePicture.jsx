import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import profilePictureIcon from "../assets/img/Profile_Avatar.svg";
import uploadIcon from "../assets/img/Upload.svg";

const initialImageUploadStates = {
  uploadInitiated: false,
  loadingImage: false,
  preview: null,
  uploadFinished: false,
};

const ProfilePicture = (props) => {
  const { source, getFile, backgroundIcon } = props;
  const [uploadStatus, setUploadStatus] = useState(initialImageUploadStates);

  const inputRef = useRef(null);

  useEffect(() => {
    //trigger the below state update only when source is having a http url
    if (source && typeof source === "string") {
      setUploadStatus({
        uploadInitiated: false,
        loadingImage: false,
        preview: source,
        uploadFinished: true,
      });
    }
  }, [source]);

  const handleFileChange = (e) => {
    const uploadItem = e.target?.files[0];
    setUploadStatus({
      uploadInitiated: true,
      loadingImage: true,
      preview: null,
      uploadFinished: false,
    });
    let base64String = "";
    const reader = new FileReader();
    reader.onload = function () {
      base64String = reader.result;
      setUploadStatus({
        uploadInitiated: false,
        loadingImage: false,
        preview: base64String,
        uploadFinished: true,
      });
    };
    reader.readAsDataURL(uploadItem);

    if (getFile) {
      getFile(uploadItem);
    }
  };

  const onUploadClick = () => {
    if (inputRef && inputRef?.current) {
      inputRef.current.value = "";
      inputRef.current?.click();
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex border border-primary-light-900 rounded-md">
        {(uploadStatus.uploadInitiated && uploadStatus.loadingImage) ||
        (typeof source === "string" && !uploadStatus.preview) ? (
          <div className="w-72 h-72 flex items-center justify-center">
            <i className="pi pi-spinner animate-spin"></i>
          </div>
        ) : (
          <img
            className={`w-full h-full object-cover ${
              !uploadStatus.preview
                ? "bg-primary-light-100"
                : "!w-72 !h-72 border rounded-md"
            }`}
            src={
              uploadStatus.preview
                ? uploadStatus.preview
                : backgroundIcon
                ? backgroundIcon
                : profilePictureIcon
            }
          />
        )}
      </div>

      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept={"image/png, image/jpeg"}
        onChange={handleFileChange}
      />

      {!uploadStatus.preview && (
        <div className="text-center">
          <small>*Please upload image below 5 MB</small>
        </div>
      )}

      <div className="text-center">
        <button
          type="button"
          className="w-24 h-6 inline-flex items-center justify-center gap-2 bg-secondary-bg-btnLight text-primary-pTextLight border-primary-light-900 rounded-full text-xs"
          onClick={onUploadClick}
        >
          <img className="w-4 h-4" src={uploadIcon}></img>
          <span>{"Upload"}</span>
        </button>
      </div>
    </div>
  );
};

ProfilePicture.propTypes = {
  source: PropTypes.any,
  getFile: PropTypes.func,
  backgroundIcon: PropTypes.string,
};

export default ProfilePicture;
