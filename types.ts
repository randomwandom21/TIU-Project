export interface Fact {
  id: number;
  statement: string;
}

export interface Interpretation {
  fact_id: number;
  how_they_spin_it: string;
  notable_language: string[];
}

export interface Outlet {
  name: string;
  url: string;
  claimed_leaning: string;
  interpretations: Interpretation[];
}

export interface PerspectiveSummary {
  areas_of_agreement: string[];
  areas_of_disagreement: string[];
  meta_observations: string[];
}

export interface AnalysisResult {
  facts: Fact[];
  outlets: Outlet[];
  perspective_summary: PerspectiveSummary;
}

export interface GroundingMetadata {
  web?: {
    uri: string;
    title: string;
  };
}