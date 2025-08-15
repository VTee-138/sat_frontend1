import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import RouterWrapper from "./RouterWrapper";
import LogoGridBackground from "./components/LogoGridBackground";
import VocabularyManagerPage from "./Pages/VocabularyManagerPage";
import ExamPage from "./Pages/ExamPage";
import ExamListPage from "./Pages/ExamListPage";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import CountdownPage from "./Pages/CountdownPage";
import CountdownBreakPage from "./Pages/CountdownBreakPage";
import ExamCompletedPage from "./Pages/ExamCompletedPage";
import ScoreDetailsPage from "./Pages/ScoreDetailsPage";
import ScoreDetailResultPage from "./components/score-detail-result";
import ErrorLogsPage from "./Pages/ErrorLogsPage";
import ErrorLogDetailPage from "./Pages/ErrorLogDetailPage";
import PracticePage from "./Pages/PracticePage";
import PracticeErrorPage from "./Pages/PracticeErrorPage";
import QuestionBankPage from "./Pages/QuestionBankPage";
import CountdownPageBank from "./components/countdown/index-bank";
import PracticeExam from "./components/question-bank/PracticeExam";
import PracticeSubmitResultPage from "./components/question-bank/PracticeSubmitResultPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RouterWrapper />}>
      <Route element={<PrivateRoute />}>
        <Route path="/vocabulary-manager" element={<VocabularyManagerPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/practice/error" element={<PracticeErrorPage />} />
        <Route path="/practice/question-bank" element={<QuestionBankPage />} />
        <Route path="/exam-list" element={<ExamListPage />} />
        <Route path="/countdown/:assessmentId" element={<CountdownPage />} />
        <Route
          path="/countdown-break/:assessmentId"
          element={<CountdownBreakPage />}
        />
        <Route path="/exam/:id" element={<ExamPage />} />
        <Route path="/exam-bank/" element={<PracticeExam />} />
        <Route path="/countdown-bank/" element={<CountdownPageBank />} />
        <Route
          path="/practice/submit-result"
          element={<PracticeSubmitResultPage />}
        />
        <Route path="/exam/completed" element={<ExamCompletedPage />} />
        <Route path="/score-details/:id" element={<ScoreDetailsPage />} />
        <Route
          path="/score-details/:id/result"
          element={<ScoreDetailResultPage />}
        />
        <Route path="/error-logs" element={<ErrorLogsPage />} />
        <Route path="/error-logs/:id" element={<ErrorLogDetailPage />} />
      </Route>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Route>
  )
);
function App() {
  return (
    <>
      <LogoGridBackground />
      <div className="App">
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
}

export default App;
