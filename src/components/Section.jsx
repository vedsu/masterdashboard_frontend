import PropTypes from "prop-types";

const Section = (props) => {
  const { className } = props;

  return (
    <div
      className={`w-full p-6 bg-primary-bg-section border border-primary-light-900 rounded-md ${
        className ?? ""
      }`}
    >
      {props?.children}
    </div>
  );
};

Section.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
};

export default Section;
