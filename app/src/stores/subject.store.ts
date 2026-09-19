import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';
import cryptoService from '../services/crypto.service';

export interface Subject {
  id: number;
  name: string;
  class_id: number;
  course_id: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubjectPayload {
  name: string;
  class_id?: number;
  course_id?: number;
}

export interface UpdateSubjectPayload {
  name?: string;
  class_id?: number;
  course_id?: number;
}

export const useSubjectStore = defineStore('subject', () => {
  const loggedId = String(localStorage.getItem('userID'));
  const userId = cryptoService.encryptId(loggedId); 
  const subjects = ref<Subject[]>([]);
  const currentSubject = ref<Subject | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  function clearError(): void {
    error.value = null;
  }

  async function list(): Promise<Subject[]> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get<unknown, Subject[]>('/subjects');
      subjects.value = response;
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao carregar {{pluralLabel.toLowerCase()}}.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function find(id: number | string): Promise<Subject> {
    isLoading.value = true;
    error.value = null;
    try {
      const encryptedId = cryptoService.encryptId(String(id));
      const response = await api.get<unknown, Subject>('/subjects/' + encryptedId);
      currentSubject.value = response;
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao procurar {{singularLabel.toLowerCase()}}.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function create(payload: CreateSubjectPayload): Promise<Subject> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.post<unknown, Subject>('/subjects', payload);
      await list();
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao criar {{singularLabel.toLowerCase()}}.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function update(id: number | string, payload: UpdateSubjectPayload): Promise<Subject> {
    isLoading.value = true;
    error.value = null;
    try {
      const encryptedId = cryptoService.encryptId(String(id));
      const response = await api.put<unknown, Subject>('/subjects/' + encryptedId, payload);
      await list();
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao actualizar {{singularLabel.toLowerCase()}}.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function remove(id: number | string): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const encryptedId = cryptoService.encryptId(String(id));
      await api.delete('/subjects/' + encryptedId);
      await list();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao eliminar {{singularLabel.toLowerCase()}}.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    subjects,
    currentSubject,
    isLoading,
    error,
    clearError,
    list,
    find,
    create,
    update,
    remove
  };
});