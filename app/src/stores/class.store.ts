import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';
import cryptoService from '../services/crypto.service';

export interface Class {
  id: number;
  name: string;
  course_id: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClassPayload {
  name: string;
  course_id?: number;
}

export interface UpdateClassPayload {
  name?: string;
  course_id?: number;
}

export const useClassStore = defineStore('class', () => {
  const loggedId = String(localStorage.getItem('userID'));
  const userId = cryptoService.encryptId(loggedId); 
  const classs = ref<Class[]>([]);
  const currentClass = ref<Class | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  function clearError(): void {
    error.value = null;
  }

  async function list(): Promise<Class[]> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get<unknown, Class[]>('/classes');
      classs.value = response;
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao carregar {{pluralLabel.toLowerCase()}}.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function find(id: number | string): Promise<Class> {
    isLoading.value = true;
    error.value = null;
    try {
      const encryptedId = cryptoService.encryptId(String(id));
      const response = await api.get<unknown, Class>('/classes/' + encryptedId);
      currentClass.value = response;
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao procurar {{singularLabel.toLowerCase()}}.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function create(payload: CreateClassPayload): Promise<Class> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.post<unknown, Class>('/classes', payload);
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

  async function update(id: number | string, payload: UpdateClassPayload): Promise<Class> {
    isLoading.value = true;
    error.value = null;
    try {
      const encryptedId = cryptoService.encryptId(String(id));
      const response = await api.put<unknown, Class>('/classes/' + encryptedId, payload);
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
      await api.delete('/classes/' + encryptedId);
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
    classs,
    currentClass,
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