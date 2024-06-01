import { useRouteError } from "react-router-dom";

const PageError = () => {
  const error = useRouteError();
  console.error(error);
  return <div className="text-center text-2xl"> Page not found !</div>;
};

export default PageError;
