import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper, Container } from "@mui/material";
// Giả sử có service getResultHistory hoặc getResultById
import { getExamResult, getResultHistory } from "../../services/TestService";
import Header from "../Header";
import { useLanguage } from "../../contexts/LanguageContext";
import Loading from "../Loading";
import StatisticsCards from "./components/StatisticsCards";
import SectionTabs from "./components/SectionTabs";
import PageSizeControls from "./components/PageSizeControls";
import QuestionsTable from "./components/QuestionsTable";

export default function ScoreDetailResultPage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [tab, setTab] = useState(0);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Lọc dữ liệu theo tab
  const filteredData = React.useMemo(() => {
    if (tab === 0) return data;

    if (tab === 1) {
      const englishData = data.filter(
        (q) => q.section?.trim().toUpperCase() === "TIẾNG ANH"
      );
      return englishData;
    }

    if (tab === 2) {
      const mathData = data.filter(
        (q) => q.section?.trim().toUpperCase() === "TOÁN"
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
    setPageSize(10); // Reset page size to default when tab changes
  };

  // Handle page size changes and reset page
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleGetExamResult = async () => {
    try {
      setLoading(true);
      const response = await getExamResult(id);
      setTitle(response?.title);
      setLoading(false);
      setData(response?.data);
    } catch (error) {
      setLoading(false);
    }
  };

  // ============ USEEFFECT HOOKS ============
  useEffect(() => {
    if (id) {
      handleGetExamResult();
    }
  }, [id]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // background:
          //   "radial-gradient(circle at 20% 50%, rgba(120,119,198,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,119,198,0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(120,219,255,0.3) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Header />

      {/* Floating Decoration Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "8%",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-15px)" },
          },
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "70%",
          right: "10%",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          animation: "float 4s ease-in-out infinite reverse",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{ pt: 12, pb: 6, position: "relative", zIndex: 1 }}
      >
        {/* Page Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: "#000000",
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            {t("scoreDetails.questionsOverviewTitle") || "Questions Overview"}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              color: "#f44336",
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: "1rem", md: "2rem" },
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <StatisticsCards data={data} tab={tab} />

        {/* Main Content Card */}
        <Paper
          elevation={6}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(102,126,234,0.2)",
            boxShadow: "0 20px 60px rgba(102,126,234,0.15)",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "rgba(102,126,234,0.4)",
              boxShadow: "0 25px 80px rgba(102,126,234,0.2)",
            },
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
              />
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
