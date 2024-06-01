import { useNavigate, useRouteError } from "react-router-dom";

const PageUnauthorizeError = () => {
  const navigate = useNavigate();
  const error = useRouteError();
  console.error(error);

  return (
    <div className="h-screen text-center text-2xl">
      <div className="h-full py-20 flex flex-col items-center gap-5">
        <h3>Sorry, this page is not available.</h3>
        <p className="text-base">
          The link you followed may be broken, or the page may have been
          removed.
        </p>
        <span>
          <a
            className="no-underline text-blue-900 text-base cursor-pointer select-none"
            onClick={() => {
              navigate(-1);
            }}
          >
            Go back
          </a>
        </span>
      </div>
    </div>
  );
};

export default PageUnauthorizeError;
