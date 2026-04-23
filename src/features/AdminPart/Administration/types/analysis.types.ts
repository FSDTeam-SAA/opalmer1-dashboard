export type AnalysisSummary = {
  totalDays: number;
  present: number;
  absent: number;
  percentage: string;
};

export type AnalysisChartItem = {
  label: string;
  present: number;
  absent: number;
};

export type AnalysisData = {
  studentId: string;
  classId: string;
  filter: string;
  summary: AnalysisSummary;
  chartData: AnalysisChartItem[];
};

export type AnalysisResponse = {
  success: boolean;
  data: AnalysisData;
};
