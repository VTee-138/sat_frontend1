import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, CircularProgress, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getAssessments,
  getCompletedAssessments,
  getAssessmentCompletionStatus,
} from "../../services/AssessmentService";
import { useLanguage } from "../../contexts/LanguageContext";
import Header from "../Header";
import ExamCard from "./components/ExamCard";
import CompletedExamCard from "./components/CompletedExamCard";
import ExamSearchBox from "./components/ExamSearchBox";
import ExamPagination from "./components/ExamPagination";
import LoadMore from "./components/LoadMore";

// CSS Animation cho tab glow effect
const tabGlowAnimation = `
  @keyframes tabGlow {
    0% {
      box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
    }
    50% {
      box-shadow: 0 8px 35px rgba(37, 99, 235, 0.5);
    }
    100% {
      box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
    }
  }
`;

export default function ExamListPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // 0: Tất cả, 1: Đã làm
  const [assessments, setAssessments] = useState([]);
  const [completedAssessments, setCompletedAssessments] = useState([]);
  const [completionStatus, setCompletionStatus] = useState({}); // Store completion status for all assessments
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(18);
  const [hasMore, setHasMore] = useState(true);

  // Debounce function
  const debounce = useCallback((func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  // Fetch assessments (tab "Tất cả")
  const fetchAssessments = async (
    query = "",
    currentPage = 1,
    statusData = null
  ) => {
    setLoading(true);
    try {
      const response = await getAssessments(currentPage, limit, query);

      const data = response.data || [];

      // Use passed statusData or current completionStatus
      const statusToUse = statusData || completionStatus;

      // Add completion status to each assessment
      const assessmentsWithStatus = data.map((assessment) => ({
        ...assessment,
        status: statusToUse[assessment._id]?.status || "notCompleted",
        isCompleted: statusToUse[assessment._id]?.isCompleted || false,
        inProgress: statusToUse[assessment._id]?.inProgress || false,
        notCompleted: statusToUse[assessment._id]?.notCompleted || true,
        progress: statusToUse[assessment._id]?.progress || 0,
        completedExamsCount:
          statusToUse[assessment._id]?.completedExamsCount || 0,
        totalExamsRequired:
          statusToUse[assessment._id]?.totalExamsRequired || 4,
      }));

      // Update assessments data
      setAssessments(assessmentsWithStatus);

      // Update pagination info
      const totalAssessments = response.totalAssessments || data.length;
      let calculatedTotalPages =
        response.totalPages || Math.ceil(totalAssessments / limit);

      // Ensure totalPages is at least 1 and is a valid number
      if (
        !calculatedTotalPages ||
        calculatedTotalPages < 1 ||
        isNaN(calculatedTotalPages)
      ) {
        calculatedTotalPages = 1;
      }

      setTotalItems(totalAssessments);
      setTotalPages(calculatedTotalPages);

      // Check if there are more items to load
      setHasMore(currentPage < calculatedTotalPages);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      setAssessments([]);
      setTotalItems(0);
      setTotalPages(1);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch completed assessments (tab "Đã làm")
  const fetchCompletedAssessments = async (currentPage = 1) => {
    setLoading(true);
    try {
      const response = await getCompletedAssessments(currentPage, limit);

      const data = response.data || [];

      // Update completed assessments data
      setCompletedAssessments(data);

      // Update pagination info
      const totalCompletedAssessments = response.totalItems || data.length;
      let calculatedTotalPages =
        response.totalPages || Math.ceil(totalCompletedAssessments / limit);

      // Ensure totalPages is at least 1 and is a valid number
      if (
        !calculatedTotalPages ||
        calculatedTotalPages < 1 ||
        isNaN(calculatedTotalPages)
      ) {
        calculatedTotalPages = 1;
      }

      setTotalItems(totalCompletedAssessments);
      setTotalPages(calculatedTotalPages);

      // Check if there are more items to load
      setHasMore(currentPage < calculatedTotalPages);
    } catch (error) {
      console.error("Error fetching completed assessments:", error);
      setCompletedAssessments([]);
      setTotalItems(0);
      setTotalPages(1);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch function
  const debouncedFetch = useCallback(
    (query, currentPage, statusData = null) => {
      const debouncedFn = debounce((q, cp, sd) => {
        fetchAssessments(q, cp, sd);
      }, 500);
      debouncedFn(query, currentPage, statusData);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [debounce]
  );

  // Fetch assessments for load more - append to existing data
  const fetchAssessmentsLoadMore = async (
    query = "",
    currentPage = 1,
    statusData = null
  ) => {
    setLoading(true);
    try {
      const response = await getAssessments(currentPage, limit, query);
      const data = response.data || [];

      const statusToUse = statusData || completionStatus;

      const assessmentsWithStatus = data.map((assessment) => ({
        ...assessment,
        status: statusToUse[assessment._id]?.status || "notCompleted",
        isCompleted: statusToUse[assessment._id]?.isCompleted || false,
        inProgress: statusToUse[assessment._id]?.inProgress || false,
        notCompleted: statusToUse[assessment._id]?.notCompleted || true,
        progress: statusToUse[assessment._id]?.progress || 0,
        completedExamsCount:
          statusToUse[assessment._id]?.completedExamsCount || 0,
        totalExamsRequired:
          statusToUse[assessment._id]?.totalExamsRequired || 4,
      }));

      // Append new data to existing assessments
      setAssessments((prevAssessments) => [
        ...prevAssessments,
        ...assessmentsWithStatus,
      ]);

      // Update pagination info
      const totalAssessments = response.totalAssessments || data.length;
      let calculatedTotalPages =
        response.totalPages || Math.ceil(totalAssessments / limit);

      if (
        !calculatedTotalPages ||
        calculatedTotalPages < 1 ||
        isNaN(calculatedTotalPages)
      ) {
        calculatedTotalPages = 1;
      }

      setTotalItems(totalAssessments);
      setTotalPages(calculatedTotalPages);
      setHasMore(currentPage < calculatedTotalPages);
    } catch (error) {
      console.error("Error fetching assessments for load more:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch completed assessments for load more - append to existing data
  const fetchCompletedAssessmentsLoadMore = async (currentPage = 1) => {
    setLoading(true);
    try {
      const response = await getCompletedAssessments(currentPage, limit);
      const data = response.data || [];

      // Append new data to existing completed assessments
      setCompletedAssessments((prevCompleted) => [...prevCompleted, ...data]);

      // Update pagination info
      const totalCompletedAssessments = response.totalItems || data.length;
      let calculatedTotalPages =
        response.totalPages || Math.ceil(totalCompletedAssessments / limit);

      if (
        !calculatedTotalPages ||
        calculatedTotalPages < 1 ||
        isNaN(calculatedTotalPages)
      ) {
        calculatedTotalPages = 1;
      }

      setTotalItems(totalCompletedAssessments);
      setTotalPages(calculatedTotalPages);
      setHasMore(currentPage < calculatedTotalPages);
    } catch (error) {
      console.error(
        "Error fetching completed assessments for load more:",
        error
      );
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch completion status for all assessments
  const fetchCompletionStatus = async () => {
    try {
      const response = await getAssessmentCompletionStatus();
      const statusData = response.data || {};
      setCompletionStatus(statusData);
      return statusData;
    } catch (error) {
      console.error("Error fetching completion status:", error);
      setCompletionStatus({});
      return {};
    }
  };

  // Initial load and tab change handler
  useEffect(() => {
    const initializeData = async () => {
      if (activeTab === 0) {
        // Tab "Tất cả" - fetch completion status first, then assessments
        try {
          const statusResponse = await getAssessmentCompletionStatus();
          const statusData = statusResponse.data || {};
          setCompletionStatus(statusData);

          // Pass statusData directly to fetchAssessments to ensure immediate use
          await fetchAssessments("", 1, statusData);
        } catch (error) {
          console.error("Error fetching completion status:", error);
          setCompletionStatus({});
          await fetchAssessments("", 1, {});
        }
      } else {
        // Tab "Đã làm"
        fetchCompletedAssessments(1);
      }
    };

    initializeData();
    setPage(1);
    setInputValue("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);

    if (activeTab === 0) {
      // Tab "Tất cả"
      if (Object.keys(completionStatus).length === 0) {
        // Fetch completion status first if not loaded
        fetchCompletionStatus().then((statusData) => {
          if (inputValue.trim() === "") {
            fetchAssessments("", newPage, statusData);
          } else {
            fetchAssessments(inputValue.trim(), newPage, statusData);
          }
        });
      } else {
        if (inputValue.trim() === "") {
          fetchAssessments("", newPage);
        } else {
          fetchAssessments(inputValue.trim(), newPage);
        }
      }
    } else {
      // Tab "Đã làm" - không hỗ trợ search
      fetchCompletedAssessments(newPage);
    }
  };

  // Handle load more - append data to existing list
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);

    if (activeTab === 0) {
      // Tab "Tất cả" - append to existing assessments
      if (Object.keys(completionStatus).length === 0) {
        fetchCompletionStatus().then((statusData) => {
          const query = inputValue.trim() === "" ? "" : inputValue.trim();
          fetchAssessmentsLoadMore(query, nextPage, statusData);
        });
      } else {
        const query = inputValue.trim() === "" ? "" : inputValue.trim();
        fetchAssessmentsLoadMore(query, nextPage);
      }
    } else {
      // Tab "Đã làm" - append to existing completed assessments
      fetchCompletedAssessmentsLoadMore(nextPage);
    }
  };

  // Handle input change for search (chỉ cho tab "Tất cả")
  const handleInputChange = (event) => {
    if (activeTab !== 0) return; // Chỉ cho phép search trong tab "Tất cả"

    const value = event.target.value;
    setInputValue(value);
    setPage(1); // Reset to first page when searching

    // Call API with debounce
    if (value.trim() === "") {
      // If input is empty, fetch all assessments
      if (Object.keys(completionStatus).length === 0) {
        // Fetch completion status first if not loaded
        fetchCompletionStatus().then((statusData) =>
          fetchAssessments("", 1, statusData)
        );
      } else {
        fetchAssessments("", 1);
      }
    } else {
      // Call API with search query
      if (Object.keys(completionStatus).length === 0) {
        // Fetch completion status first if not loaded
        fetchCompletionStatus().then((statusData) =>
          debouncedFetch(value.trim(), 1, statusData)
        );
      } else {
        debouncedFetch(value.trim(), 1);
      }
    }
  };

  // Handle exam card click
  const handleCardClick = (assessment) => {
    // Navigate to countdown page with assessment ID
    navigate(`/countdown/${assessment._id}`);
  };

  // Handle completed exam card click
  const handleCompletedCardClick = (assessment) => {
    // Navigate to score details page
    navigate(`/score-details/${assessment._id}`);
  };

  return (
    <Box>
      {/* Inject CSS Animation */}
      <style>{tabGlowAnimation}</style>
      <Header />

      {/* Main Content */}
      <Box
        sx={{
          pt: "80px",
          px: { xs: 1, sm: 2, md: 4 },
          py: 4,
          mt: "60px",
          minHeight: "calc(100vh - 60px)",
        }}
      >
        {/* Page Title */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#333",
              mb: 2,
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
            }}
          >
            {t("examList.title")}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              fontSize: { xs: "0.8rem", sm: "0.875rem", md: "1rem" },
              px: { xs: 2, sm: 0 },
            }}
          >
            {t("examList.subtitle")}
          </Typography>
        </Box>

        {/* Tab Menu */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-25px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "80px",
              height: "6px",
              background:
                "linear-gradient(90deg, #2563eb, #3b82f6, #1d4ed8, #3b82f6, #2563eb)",
              borderRadius: "3px",
              opacity: 0.7,
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
            },
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              backgroundColor: "#f8fafc",
              borderRadius: "20px",
              padding: "10px",
              boxShadow:
                "0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.05)",
              "& .MuiTabs-indicator": {
                display: "none", // Ẩn indicator mặc định
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                fontWeight: 700,
                color: "#64748b",
                minWidth: { xs: "140px", sm: "180px" },
                height: "52px",
                borderRadius: "16px",
                margin: "0 6px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  backgroundColor: "rgba(37, 99, 235, 0.08)",
                  color: "#2563eb",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
                    borderRadius: "16px",
                    zIndex: -1,
                  },
                },
                "&.Mui-selected": {
                  color: "#ffffff",
                  // backgroundColor:
                  //   "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  // boxShadow: "0 8px 25px rgba(37, 99, 235, 0.3)",
                  transform: "translateY(-2px)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    // background:
                    //   "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    borderRadius: "16px",
                    zIndex: -1,
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: "2px",
                    left: "2px",
                    right: "2px",
                    bottom: "2px",
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    borderRadius: "14px",
                    zIndex: -1,
                  },
                },
                "&:not(.Mui-selected)": {
                  "&:hover": {
                    backgroundColor: "rgba(37, 99, 235, 0.1)",
                  },
                },
              },
              // Animation cho tab khi chuyển đổi
              "& .MuiTabs-flexContainer": {
                gap: "12px",
              },
            }}
          >
            <Tab
              label={t("examList.allExams")}
              sx={{
                "&.Mui-selected": {
                  animation: "tabGlow 0.6s ease-out",
                },
              }}
            />
            <Tab
              label={t("examList.completedExams")}
              sx={{
                "&.Mui-selected": {
                  animation: "tabGlow 0.6s ease-out",
                },
              }}
            />
          </Tabs>
        </Box>

        {/* Search Box - chỉ hiển thị cho tab "Tất cả" */}
        {activeTab === 0 && (
          <ExamSearchBox
            inputValue={inputValue}
            loading={loading}
            onInputChange={handleInputChange}
          />
        )}

        {/* Results Info */}
        {!loading && totalItems > 0 && (
          <Box sx={{ textAlign: "center", mb: 3, px: { xs: 2, sm: 0 } }}>
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              {t("examList.showing")}{" "}
              {activeTab === 0
                ? assessments.length
                : completedAssessments.length}{" "}
              {t("examList.of")} {totalItems}{" "}
              {activeTab === 0
                ? t("examList.courses")
                : t("examList.completedCourses")}
              {inputValue &&
                activeTab === 0 &&
                ` ${t("examList.for")} "${inputValue}"`}
            </Typography>
          </Box>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Content based on active tab */}
        {!loading && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: { xs: 2, sm: 3 },
              justifyContent: "center",
              maxWidth: "992px",
              mx: "auto",
              px: { xs: 1, sm: 0 },
            }}
          >
            {activeTab === 0 ? (
              // Tab "Tất cả"
              assessments.length > 0 ? (
                assessments.map((assessment) => (
                  <Box
                    key={assessment._id}
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "calc(50% - 12px)",
                        lg: "calc(33.333% - 16px)",
                      },
                      minWidth: { xs: "280px", sm: "300px" },
                    }}
                  >
                    <ExamCard
                      assessment={assessment}
                      onCardClick={handleCardClick}
                      showCompletionStatus={true} // Hiển thị status
                    />
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 6,
                    px: { xs: 2, sm: 0 },
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#666",
                      mb: 1,
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                  >
                    {t("examList.noCoursesFound")}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#999",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    {t("examList.tryAdjustingSearch")}
                  </Typography>
                </Box>
              )
            ) : // Tab "Đã làm"
            completedAssessments.length > 0 ? (
              completedAssessments.map((assessment) => (
                <Box
                  key={assessment._id}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 12px)",
                      lg: "calc(33.333% - 16px)",
                    },
                    minWidth: { xs: "280px", sm: "300px" },
                  }}
                >
                  <CompletedExamCard
                    assessment={assessment}
                    onCardClick={handleCompletedCardClick}
                  />
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 6,
                  px: { xs: 2, sm: 0 },
                  width: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#666",
                    mb: 1,
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  {t("examList.noCompletedExams")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#999",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  {t("examList.startTakingExams")}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Pagination */}
        {/* {!loading && totalPages > 1 && (
          <ExamPagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )} */}

        {/* Load More Button */}
        {!loading && hasMore && (
          <LoadMore
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loading={loading}
            currentPage={page}
            totalPages={totalPages}
          />
        )}
      </Box>
    </Box>
  );
}
