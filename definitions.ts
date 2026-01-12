
export interface GroundTruth {
  index: number;
  content: string;
}

export interface BiasMapping {
  fact_id: number;
  framing_narrative: string;
  pivotal_terms: string[];
}

export interface NewsSource {
  publisher: string;
  source_url: string;
  political_alignment: string;
  narratives: BiasMapping[];
}

export interface EditorialSynthesis {
  consensus_points: string[];
  divergent_perspectives: string[];
  analytical_meta_notes: string[];
}

export interface MediaInsight {
  verified_facts: GroundTruth[];
  publications: NewsSource[];
  synthesis: EditorialSynthesis;
}

export interface SourceReference {
  web?: {
    uri: string;
    title: string;
  };
}
