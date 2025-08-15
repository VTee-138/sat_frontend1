import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  getQuestionTypes,
  generateFilteredExam,
  generateRandomExam,
} from "../../services/QuestionBankService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    minWidth: "600px",
    maxWidth: "800px",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 48,
  fontWeight: 600,
  textTransform: "none",
  fontSize: "16px",
}));

const FormSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  borderRadius: 12,
  border: "1px solid #e3f2fd",
}));

const CustomTestModal = ({ open, onClose, data }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const [selectedSubject, setSelectedSubject] = useState("ENGLISH");
  const [randomQuestionCount, setRandomQuestionCount] = useState("");
  const [testItems, setTestItems] = useState([
    {
      questionType: "",
      questionCount: "",
      difficulty: "",
    },
  ]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingQuestionTypes, setLoadingQuestionTypes] = useState(false);
  const [testItemErrors, setTestItemErrors] = useState([
    { questionType: false, questionCount: false, difficulty: false },
  ]);
  const [randomCountError, setRandomCountError] = useState(false);

  const subjects = [
    {
      value: "ENGLISH",
      label: t("questionBank.customTestModal.readingWriting"),
    },
    { value: "MATH", label: t("questionBank.customTestModal.math") },
  ];

  const difficulties = [
    { value: "EASY", label: t("questionBank.EASY") },
    { value: "MEDIUM", label: t("questionBank.MEDIUM") },
    { value: "HARD", label: t("questionBank.HARD") },
  ];

  // Fetch question types when subject changes
  useEffect(() => {
    const fetchQuestionTypes = async () => {
      if (!selectedSubject) return;

      try {
        setLoadingQuestionTypes(true);
        const response = await getQuestionTypes(selectedSubject);
        if (response && response.data) {
          const types = response.data.map((type) => ({
            value: type,
            label: type,
          }));
          setQuestionTypes(types);
        }
      } catch (error) {
        toast.error(t("errors.networkError"));
      } finally {
        setLoadingQuestionTypes(false);
      }
    };

    fetchQuestionTypes();
  }, [selectedSubject, open]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
    // Reset test items and question types when subject changes
    setTestItems([
      {
        questionType: "",
        questionCount: "",
        difficulty: "",
      },
    ]);
    setQuestionTypes([]);
    setTestItemErrors([
      { questionType: false, questionCount: false, difficulty: false },
    ]);
    setRandomCountError(false);
  };

  const handleAddTestItem = () => {
    setTestItems([
      ...testItems,
      {
        questionType: "",
        questionCount: "",
        difficulty: "",
      },
    ]);
    setTestItemErrors([
      ...testItemErrors,
      { questionType: false, questionCount: false, difficulty: false },
    ]);
  };

  const handleRemoveTestItem = (index) => {
    if (testItems.length > 1) {
      const newItems = testItems.filter((_, i) => i !== index);
      setTestItems(newItems);
      const newErrors = testItemErrors.filter((_, i) => i !== index);
      setTestItemErrors(newErrors);
    }
  };

  const handleTestItemChange = (index, field, value) => {
    const newItems = [...testItems];
    newItems[index][field] = value;
    setTestItems(newItems);
    const newErrors = [...testItemErrors];
    if (value !== "" && value !== null && value !== undefined) {
      newErrors[index] = {
        ...newErrors[index],
        [field]: false,
      };
      setTestItemErrors(newErrors);
    }
  };

  const handleCreateTest = async () => {
    try {
      setLoading(true);

      if (activeTab === 0) {
        // Validate all required fields for each item
        const newErrors = testItems.map((item) => ({
          questionType: !item.questionType,
          questionCount:
            !item.questionCount ||
            isNaN(parseInt(item.questionCount)) ||
            parseInt(item.questionCount) <= 0,
          difficulty: !item.difficulty,
        }));
        setTestItemErrors(newErrors);
        const hasError = newErrors.some(
          (e) => e.questionType || e.questionCount || e.difficulty
        );
        if (hasError) {
          return;
        }

        // Prepare data for generateFilteredExam API
        const examParams = {
          subject: selectedSubject,
          filters: testItems.map((item) => ({
            questionType: item.questionType,
            numberOfQuestions: parseInt(item.questionCount),
            difficulty: item.difficulty,
          })),
        };

        const response = await generateFilteredExam(examParams);
        if (response && response.data) {
          // Save custom exam data to localStorage
          localStorage.setItem("customExamData", JSON.stringify(response.data));
          toast.success(t("questionBank.customTestModal.testCreatedSuccess"));
          navigate("/countdown-bank");
          onClose();
        }
      } else {
        // Random Test - Validate required fields
        const invalidRandom =
          !randomQuestionCount ||
          isNaN(parseInt(randomQuestionCount)) ||
          parseInt(randomQuestionCount) <= 0;
        setRandomCountError(invalidRandom);
        if (invalidRandom) {
          toast.error(
            t("questionBank.customTestModal.pleaseEnterValidQuestionCount")
          );
          return;
        }

        // Prepare data for generateRandomExam API
        const examParams = {
          subject: selectedSubject,
          numberOfQuestions: parseInt(randomQuestionCount),
        };

        const response = await generateRandomExam(examParams);
        if (response && response.data) {
          // Save custom exam data to localStorage
          localStorage.setItem("customExamData", JSON.stringify(response.data));
          toast.success(t("questionBank.customTestModal.testCreatedSuccess"));
          navigate("/countdown-bank");
          onClose();
        }
      }
    } catch (error) {
      console.error("Error creating test:", error);
      toast.error(error.response?.data?.message || t("errors.networkError"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setActiveTab(0);
    setSelectedSubject("ENGLISH");
    setRandomQuestionCount("");
    setTestItems([
      {
        questionType: "",
        questionCount: "",
        difficulty: "",
      },
    ]);
    setQuestionTypes([]);
    setLoading(false);
    setLoadingQuestionTypes(false);
    setTestItemErrors([
      { questionType: false, questionCount: false, difficulty: false },
    ]);
    setRandomCountError(false);
    onClose();
  };

  const isFormValid = () => {
    if (!selectedSubject) return false;

    if (activeTab === 0) {
      return testItems.some(
        (item) => item.questionType && item.questionCount && item.difficulty
      );
    } else {
      return randomQuestionCount && parseInt(randomQuestionCount) > 0;
    }
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 2 }}>
        <Typography variant="h5" fontWeight={700} color="primary">
          {t("questionBank.customTestModal.title")}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: "10px !important" }}>
        {/* Subject Selection - Shared */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>{t("questionBank.customTestModal.subject")}</InputLabel>
          <Select
            value={selectedSubject}
            onChange={handleSubjectChange}
            label={t("questionBank.customTestModal.subject")}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.value} value={subject.value}>
                {subject.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <StyledTab
              label={t("questionBank.customTestModal.createTestTab")}
            />
            <StyledTab
              label={t("questionBank.customTestModal.randomTestTab")}
            />
          </Tabs>
        </Box>

        {/* Create Test Tab */}
        {activeTab === 0 && (
          <Box>
            {testItems.map((item, index) => (
              <FormSection key={index} elevation={1}>
                <Grid container spacing={3} alignItems="flex-start">
                  <Grid item xs={12} md={4}>
                    <FormControl
                      fullWidth
                      error={testItemErrors[index]?.questionType}
                    >
                      <InputLabel>
                        {t("questionBank.customTestModal.questionType")}
                      </InputLabel>
                      <Select
                        value={item.questionType}
                        onChange={(e) =>
                          handleTestItemChange(
                            index,
                            "questionType",
                            e.target.value
                          )
                        }
                        label={t("questionBank.customTestModal.questionType")}
                        disabled={!selectedSubject || loadingQuestionTypes}
                      >
                        {loadingQuestionTypes ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            {t("common.loading")}
                          </MenuItem>
                        ) : (
                          questionTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                      {testItemErrors[index]?.questionType && (
                        <FormHelperText>
                          {t("questionBank.customTestModal.fieldRequired")}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <FormControl
                      fullWidth
                      error={testItemErrors[index]?.questionCount}
                    >
                      <TextField
                        fullWidth
                        type="number"
                        label={t("questionBank.customTestModal.questionCount")}
                        value={item.questionCount}
                        error={Boolean(testItemErrors[index]?.questionCount)}
                        onChange={(e) =>
                          handleTestItemChange(
                            index,
                            "questionCount",
                            e.target.value
                          )
                        }
                        placeholder={t(
                          "questionBank.customTestModal.questionCountPlaceholder"
                        )}
                        inputProps={{ min: 1 }}
                      />
                      {testItemErrors[index]?.questionCount && (
                        <FormHelperText>
                          {t(
                            "questionBank.customTestModal.pleaseEnterValidQuestionCount"
                          )}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <FormControl
                      fullWidth
                      error={testItemErrors[index]?.difficulty}
                    >
                      <InputLabel>
                        {t("questionBank.customTestModal.difficulty")}
                      </InputLabel>
                      <Select
                        value={item.difficulty}
                        onChange={(e) =>
                          handleTestItemChange(
                            index,
                            "difficulty",
                            e.target.value
                          )
                        }
                        label={t("questionBank.customTestModal.difficulty")}
                      >
                        {difficulties.map((difficulty) => (
                          <MenuItem
                            key={difficulty.value}
                            value={difficulty.value}
                          >
                            {difficulty.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {testItemErrors[index]?.difficulty && (
                        <FormHelperText>
                          {t("questionBank.customTestModal.fieldRequired")}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        onClick={handleAddTestItem}
                        color="primary"
                        size="small"
                      >
                        <AddIcon />
                      </IconButton>
                      {testItems.length > 1 && (
                        <IconButton
                          onClick={() => handleRemoveTestItem(index)}
                          color="error"
                          size="small"
                        >
                          <RemoveIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </FormSection>
            ))}
          </Box>
        )}

        {/* Random Test Tab */}
        {activeTab === 1 && (
          <FormSection elevation={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth error={randomCountError}>
                  <TextField
                    fullWidth
                    type="number"
                    label={t(
                      "questionBank.customTestModal.randomQuestionCount"
                    )}
                    value={randomQuestionCount}
                    error={Boolean(randomCountError)}
                    onChange={(e) => setRandomQuestionCount(e.target.value)}
                    placeholder={t(
                      "questionBank.customTestModal.randomQuestionCountPlaceholder"
                    )}
                    inputProps={{ min: 1 }}
                  />
                  {randomCountError && (
                    <FormHelperText>
                      {t(
                        "questionBank.customTestModal.pleaseEnterValidQuestionCount"
                      )}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </FormSection>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} color="inherit" size="large">
          {t("common.cancel")}
        </Button>
        <Button
          onClick={handleCreateTest}
          variant="contained"
          size="large"
          disabled={!isFormValid() || loading}
          sx={{
            borderRadius: 2,
            px: 4,
            fontWeight: 600,
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              {t("common.loading")}
            </>
          ) : (
            t("questionBank.customTestModal.createTest")
          )}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default CustomTestModal;
