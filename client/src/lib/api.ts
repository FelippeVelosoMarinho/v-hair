/**
 * API Service
 * Serviço para comunicação com o backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export interface HairClassificationResponse {
  curvature: string;
  confidence: number;
  curvature_info?: {
    id: string;
    name: string;
    description: string;
    characteristics: string[];
    care_tips: string[];
    porosity?: string;
  };
  all_detections?: Array<{
    curvature: string;
    confidence: number;
    bbox?: number[];
  }>;
  message?: string;
}

export interface CurvatureInfo {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  care_tips: string[];
  porosity?: string;
}

export interface ApiError {
  detail: string;
}

/**
 * Classifica a curvatura do cabelo a partir de uma imagem
 */
export async function classifyHair(
  imageFile: File,
  confidenceThreshold: number = 0.5
): Promise<HairClassificationResponse> {
  const formData = new FormData();
  formData.append('file', imageFile);

  const url = new URL(`${API_BASE_URL}/hair/classify`);
  url.searchParams.append('confidence_threshold', confidenceThreshold.toString());

  const response = await fetch(url.toString(), {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ detail: 'Erro desconhecido' }));
    throw new Error(error.detail || `Erro ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Lista todas as curvaturas disponíveis
 */
export async function listCurvatures(): Promise<{ total: number; curvatures: CurvatureInfo[] }> {
  const response = await fetch(`${API_BASE_URL}/hair/curvatures`);

  if (!response.ok) {
    throw new Error('Erro ao carregar curvaturas');
  }

  return response.json();
}

/**
 * Obtém informações de uma curvatura específica
 */
export async function getCurvature(curvatureType: string): Promise<CurvatureInfo> {
  const response = await fetch(`${API_BASE_URL}/hair/curvatures/${curvatureType}`);

  if (!response.ok) {
    throw new Error('Curvatura não encontrada');
  }

  return response.json();
}

/**
 * Health check da API
 */
export async function healthCheck(): Promise<{ status: string; version: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error('API não disponível');
  }

  return response.json();
}
