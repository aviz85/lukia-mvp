import axios, { AxiosError } from 'axios';
import { Lukon } from '../types/Lukon';

// Use an environment variable for the API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

export const fetchLukons = async (keyword?: string, tags?: string[], includeDeleted: boolean = false): Promise<Lukon[]> => {
  try {
    const response = await axios.get<Lukon[]>(`${API_BASE_URL}/search`, {
      params: { 
        keyword,
        tags: tags?.join(','),
        include_deleted: includeDeleted
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching lukons:', error);
    throw error;
  }
};

export const createLukon = async (lukon: Omit<Lukon, 'id' | 'is_deleted' | 'deleted_at'>): Promise<{ id: string, message: string }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create`, lukon);
    return response.data;
  } catch (error) {
    console.error('Error creating lukon:', error);
    throw error;
  }
};

export const getAllTags = async (): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>(`${API_BASE_URL}/tags`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

export const deleteLukon = async (lukonId: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/lukons/${lukonId}`);
  } catch (error) {
    console.error('Error deleting lukon:', error);
    throw error;
  }
};

export const restoreLukon = async (lukonId: string): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/lukons/${lukonId}/restore`);
  } catch (error) {
    console.error('Error restoring lukon:', error);
    throw error;
  }
};

// אין צורך להגדיר שוב את הממשק Lukon כאן