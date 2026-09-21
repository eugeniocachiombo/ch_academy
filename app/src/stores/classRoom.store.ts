import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';
import cryptoService from '../services/crypto.service';

export interface ClassRoom {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClassRoomPayload {
  name: string;
}

export interface UpdateClassRoomPayload {
  name?: string;
}

export const useClassRoomStore = defineStore('classRoom', () => {
  const loggedId = String(localStorage.getItem('userID'));
  const userId = cryptoService.encryptId(loggedId); 
  const classRooms = ref<ClassRoom[]>([]);
  const currentClassRoom = ref<ClassRoom | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  function clearError(): void {
    error.value = null;
  }

  async function list(): Promise<ClassRoom[]> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get<unknown, ClassRoom[]>('/class-rooms');
      classRooms.value = response;
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao carregar {{pluralLabel.toLowerCase()}}.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function find(id: number | string): Promise<ClassRoom> {
    isLoading.value = true;
    error.value = null;
    try {
      const encryptedId = cryptoService.encryptId(String(id));
      const response = await api.get<unknown, ClassRoom>('/class-rooms/' + encryptedId);
      currentClassRoom.value = response;
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao procurar {{singularLabel.toLowerCase()}}.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function create(payload: CreateClassRoomPayload): Promise<ClassRoom> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.post<unknown, ClassRoom>('/class-rooms', payload);
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

  async function update(id: number | string, payload: UpdateClassRoomPayload): Promise<ClassRoom> {
    isLoading.value = true;
    error.value = null;
    try {
      const encryptedId = cryptoService.encryptId(String(id));
      const response = await api.put<unknown, ClassRoom>('/class-rooms/' + encryptedId, payload);
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
      await api.delete('/class-rooms/' + encryptedId);
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
    classRooms,
    currentClassRoom,
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