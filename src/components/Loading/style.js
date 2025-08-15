import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const loadingRotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;
const loadingDash = keyframes`
  0% {
    stroke-dasharray: 1,200;
    stroke-dashoffset:0
  }
  50% {
    stroke-dasharray: 90,150;
    stroke-dashoffset: -40px;
  }
  to {
    stroke-dasharray: 90,150;
    stroke-dashoffset: -120px;
  }
`;

const StyledLoadingMask = styled.div((props) => ({
  display: props.show ? "block" : "none",
  position: "fixed",
  zIndex: 2002,
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  margin: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  transition: "opacity",
}));

const StyledLoadingSpinner = styled.div(() => ({
  top: "50%",
  width: "100%",
  textAlign: "center",
  position: "absolute",
  transform: "translateY(-50%)",
  "& svg": {
    width: 70,
    height: 70,
    display: "inline",
    verticalAlign: "middle",
    animation: loadingRotate + " 1.5s ease-in-out infinite",
    "& path": {
      strokeWidth: 4,
      fill: "transparent",
      animation: loadingDash + " 1.5s ease-in-out infinite",
      strokeDasharray: "90,150",
      strokeDashoffset: 0,
      stroke: "#cd1628",
      strokeLinecap: "round",
    },
  },
}));

export { StyledLoadingMask, StyledLoadingSpinner };
