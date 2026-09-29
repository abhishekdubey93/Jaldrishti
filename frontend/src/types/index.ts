export interface BlockForecast {
  date: string;
  block_id: string;
  block_name: string;
  temp_max: number;
  temp_min: number;
  rainfall_mm: number;
  humidity_pct: number;
  wind_speed_kmh: number;
}

export interface PanchayatForecast {
  date: string;
  panchayat_id: string;
  panchayat_name: string;
  temp_max: number;
  temp_min: number;
  rainfall_mm: number;
  humidity_pct: number;
  wind_speed_kmh: number;
  weather_summary: string;
  alert_level: 'NORMAL' | 'MODERATE' | 'HEAVY_RAIN' | 'HEAT_WAVE' | 'HIGH_TEMP' | 'HIGH_WIND';
  confidence: number;
  uncertainty_mm: number;
  model_version: string;
  data_mode: string;
}

export interface PanchayatMeta {
  panchayat_id: string;
  panchayat_name: string;
  block_id: string;
  block_name: string;
  district_name: string;
  state_name: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  slope_deg: number;
  aspect_deg: number;
  ndvi: number;
  lst_c: number;
  soil_type: string;
  primary_crops: string[];
}

export interface AdvisoryItem {
  id: string;
  advisory_type: string;
  title: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  affected_panchayat: string;
  relevant_period: string;
  explanation: string;
  recommended_action: string;
  data_confidence: string;
}

export interface AdvisoryResponse {
  panchayat_id: string;
  panchayat_name: string;
  crop_name: string;
  advisories: AdvisoryItem[];
  generated_at: string;
}

export interface ModelMetrics {
  model_version: string;
  status: string;
  metrics: Record<string, {
    variable: string;
    mae: number;
    rmse: number;
    r2: number;
    sample_count: number;
    rain_event_metrics?: {
      precision: number;
      recall: number;
      f1: number;
    };
  }>;
  baseline_metrics: Record<string, {
    mae: number;
    rmse: number;
    r2: number;
  }>;
  features_used: string[];
  training_sample_count: number;
  last_evaluation_date: string;
}

export interface DataSourceItem {
  source_name: string;
  type: string;
  status: string;
  update_frequency: string;
  resolution: string;
  last_updated: string;
}
