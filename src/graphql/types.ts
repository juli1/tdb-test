export interface FileAnalysisViolation {
  identifier: number;
  language: string;
  description: string;
  severity: number;
  category: string;
  line: number;
  lineCount: number;
  tool: string;
  rule: string;
  ruleUrl: string | undefined;
}

export interface FileAnalysis {
  identifier: number;
  language: string;
  status: string;
  filename: number;
  runningTimeSeconds: number;
  violations: FileAnalysisViolation[];
}

export enum Language {
  Java = "Java",
  Javascript = "Javascript",
  Shell = "Shell",
  Python = "Python",
  Typescript = "Typescript",
  C = "C",
  Unknown = "Unknown",
  Yaml = "Yaml",
  Cpp = "Cpp",
  Apex = "Apex",
  Ruby = "Ruby",
  Php = "Php",
  Scala = "Scala",
  Docker = "Docker",
  Terraform = "Terraform",
}
