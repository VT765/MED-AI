/**
 * TypeScript interface for Med-AI structured report analysis response.
 * Matches backend JSON schema from prompt_builder / response_parser.
 */

export interface AbnormalValue {
  test_name: string;
  observed_value: string;
  normal_range: string;
  status: "high" | "low" | "normal";
}

export interface ReportAnalysisResponse {
  summary: string;
  key_findings: string[];
  abnormal_values: AbnormalValue[];
  possible_conditions: string[];
  recommendations: string[];
}
