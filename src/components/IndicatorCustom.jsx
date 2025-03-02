import PropTypes from "prop-types";
import {
  WEBINAR_OR_NEWSLETTER_INDICATOR,
  WEBINAR_STATUS_INDICATOR,
} from "../constants/enums";

const IndicatorCustom = (props) => {
  if (props?.variant === WEBINAR_STATUS_INDICATOR.LIVE)
    return (
      <div className="mx-2 max-w-fit">
        <span className="inline-block w-3 h-3 border border-primary-light-900 bg-green-500 rounded-[50%]" />
      </div>
    );
  else if (props?.variant === WEBINAR_STATUS_INDICATOR.NOT_LIVE)
    return (
      <div className="mx-2 max-w-fit">
        <span className="inline-block w-3 h-3 border border-primary-light-900 bg-red-500 rounded-[50%]" />
      </div>
    );
  else if (props?.variant === WEBINAR_OR_NEWSLETTER_INDICATOR.WEBINAR)
    return (
      <div className="mx-2 max-w-fit">
        <span className="inline-block w-3 h-3 border border-primary-light-900 bg-yellow-500 rounded-[50%]" />
      </div>
    );
  else if (props?.variant === WEBINAR_OR_NEWSLETTER_INDICATOR.NEWSLETTER)
    return (
      <div className="mx-2 max-w-fit">
        <span className="inline-block w-3 h-3 border border-primary-light-900 bg-blue-500 rounded-[50%]" />
      </div>
    );
};

IndicatorCustom.propTypes = {
  variant: PropTypes.string,
};

export default IndicatorCustom;
