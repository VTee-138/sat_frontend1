// RouterWrapper.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import ExamLocalCleaner from "./components/ExamLocalCleaner";

const RouterWrapper = () => {
  return (
    <>
      <ExamLocalCleaner />
      <Outlet />
    </>
  );
};

export default RouterWrapper;
