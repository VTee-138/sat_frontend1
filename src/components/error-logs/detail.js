import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Container, Button } from "@mui/material";
import { ArrowBack, Folder as FolderIcon } from "@mui/icons-material";
import ErrorLogService from "../../services/ErrorLogService";
import Header from "../Header";
import { useLanguage } from "../../contexts/LanguageContext";
import Loading from "../Loading";
import SectionTabs from "../score-detail-result/components/SectionTabs";
import PageSizeControls from "../score-detail-result/components/PageSizeControls";
import QuestionsTable from "./components/QuestionsTable";

export default function ErrorLogDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Get folder info from navigation state
  const folderName = location.state?.folderName || "Error Log";
  const folderColor = location.state?.folderColor || "#4285F4";

  // Lọc dữ liệu theo tab
  const filteredData = React.useMemo(() => {
    if (tab === 0) return data;

    if (tab === 1) {
      const englishData = data.filter(
        (q) => q?.questionData.section?.trim().toUpperCase() === "TIẾNG ANH"
      );
      return englishData;
    }

    if (tab === 2) {
      const mathData = data.filter(
        (q) => q?.questionData.section?.trim().toUpperCase() === "TOÁN"
      );
      return mathData;
    }

    return data;
  }, [data, tab]);

  // Phân trang
  const pagedData = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Handle tab changes and reset page
  const handleTabChange = (newTab) => {
    setTab(newTab);
    setPage(1);
    setPageSize(10);
  };

  // Handle page size changes and reset page
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const fetchErrorLogs = async () => {
    try {
      setLoading(true);
      const response = await ErrorLogService.getErrorLogsByFolder(
        id,
        page,
        100
      );
      setData(response.data || []);
    } catch (error) {
      console.error("Error fetching error logs:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchErrorLogs();
    }
  }, [id]);

  const handleBackClick = () => {
    navigate("/error-logs");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Header />

      <Container
        maxWidth="lg"
        sx={{ pt: 12, pb: 6, position: "relative", zIndex: 1 }}
      >
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackClick}
          sx={{
            mb: 3,
            fontWeight: 600,
            color: "#546e7a",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
            },
          }}
        >
          {t("errorLogs.backToErrorLogs")}
        </Button>

        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              border: `1px solid #e0e0e0`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <FolderIcon sx={{ fontSize: 48, color: folderColor, mr: 2.5 }} />
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "#1a237e" }}
              >
                {folderName}
              </Typography>
              <Typography variant="body2" sx={{ color: "#546e7a" }}>
                {data.length || 0} {t("errorLogs.question")}
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Main Content Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: "#fff",
            border: `1px solid #e0e0e0`,
            boxShadow: `0 8px 16px rgba(0,0,0,0.05)`,
          }}
        >
          {/* Tabs Section */}
          <SectionTabs tab={tab} onTabChange={handleTabChange} />

          {/* Content */}
          <Box sx={{ p: 4 }}>
            {/* Page Size Controls */}
            <PageSizeControls
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              totalItems={filteredData.length}
            />

            {loading ? (
              <Loading />
            ) : (
              <QuestionsTable
                data={pagedData}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                totalItems={filteredData.length}
                folderId={id}
                onRefresh={fetchErrorLogs}
              />
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
