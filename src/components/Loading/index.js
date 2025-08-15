import PropTypes from "prop-types";
import { forwardRef } from "react";
// import { useAppSelector } from "../../../hooks/useStore";
import { StyledLoadingMask, StyledLoadingSpinner } from "./style";

const Loading = forwardRef((props, ref) => {
  return (
    <StyledLoadingMask {...props} show={true} ref={ref}>
      <StyledLoadingSpinner>
        <svg viewBox="-10, -10, 50, 50">
          <path
            d="
            M 30 15
            L 28 17
            M 25.61 25.61
            A 15 15, 0, 0, 1, 15 30
            A 15 15, 0, 1, 1, 27.99 7.5
            L 15 15
          "
          ></path>
        </svg>
      </StyledLoadingSpinner>
    </StyledLoadingMask>
  );
});

export default Loading;

Loading.displayName = "Loading";

Loading.propTypes = {
  isLoading: PropTypes.bool,
};
