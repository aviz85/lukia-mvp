import axios from 'axios';
import { Lukon } from '../types/Lukon';

const API_BASE_URL = 'http://localhost:5001'; // שים לב שזה http ולא https

export const fetchLukons = async (keyword?: string, tags?: string[]): Promise<Lukon[]> => {
  try {
    const response = await axios.get<Lukon[]>(`${API_BASE_URL}/search`, {
      params: { 
        keyword,
        tags: tags?.join(',')
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching lukons:', error);
    throw error;
  }
};

export const createLukon = async (lukon: Omit<Lukon, 'id'>): Promise<{ id: string, message: string }> => {
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