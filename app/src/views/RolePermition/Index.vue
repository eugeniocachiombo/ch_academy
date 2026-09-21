<script setup>
import { ref, computed, onMounted } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import ProgressSpinner from 'primevue/progressspinner';
import { useRolePermitionStore } from '@/stores/rolePermition.store';
import RolePermitionDialog from '@/views/RolePermition/Dialog.vue';
import { useToast } from 'primevue/usetoast';
import { usePermitionStore } from '@/stores/permition.store';
import { useRoleStore } from '@/stores/role.store';
import { findModel } from '@/services/general.service.js';
import { useUserStore } from '@/stores/user.store.ts';

const permitionRoleStore = useRolePermitionStore();
const permitionStore = usePermitionStore();
const roleStore = useRoleStore();
const toast = useToast();
const user = useUserStore();

const pluralLabel = 'Permissões de Funções';
const singularLabel = 'Permissão de Função';

const isDialogVisible = ref(false);
const isEditing = ref(false);
const selectedItem = ref(null);

const isConfirmDeleteVisible = ref(false);
const itemToDelete = ref(null);

const rowsPerPage = ref(10);
const searchQuery = ref('');
const fieldErrors = ref({});

const filteredItems = computed(() => {
  let list = permitionRoleStore.rolePermitions || [];

  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const q = searchQuery.value.trim().toLowerCase();
    list = list.filter((item) => {
      const itemId = String(item.id || '');
      const item_permition_id = String(item.permition_id || '').toLowerCase();
      const item_role_id = String(item.role_id || '').toLowerCase();
      return itemId.includes(q) || item_permition_id.includes(q) ||
        item_role_id.includes(q);
    });
  }

  return list;
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (searchQuery.value && searchQuery.value.trim() !== '') count++;
  return count;
});

function clearAllFilters() {
  searchQuery.value = '';
}

function getStatusSeverity(status) {
  switch (status) {
    case 'activa':
    case 'active': return 'success';
    case 'inactiva':
    case 'inactive': return 'danger';
    default: return 'info';
  }
}

function openCreateDialog() {
  isEditing.value = false;
  selectedItem.value = null;
  fieldErrors.value = {};
  isDialogVisible.value = true;
}

function openEditDialog(item) {
  isEditing.value = true;
  selectedItem.value = item;
  fieldErrors.value = {};
  isDialogVisible.value = true;
}

async function handleSave(formPayload) {
  if (permitionRoleStore.isLoading) return;

  try {
    if (isEditing.value && selectedItem.value) {
      await permitionRoleStore.update(selectedItem.value.id, formPayload);
      isDialogVisible.value = false;
      toast.add({ severity: 'success', summary: 'Sucesso', detail: `${singularLabel} actualizado com sucesso.`, life: 3500 });
    } else {
      await permitionRoleStore.create(formPayload);
      isDialogVisible.value = false;
      toast.add({ severity: 'success', summary: 'Sucesso', detail: `${singularLabel} criado com sucesso.`, life: 3500 });
    }
    selectedItem.value = {data: null};
  } catch (error) {
    const responseData = error?.response?.data;
    if (responseData?.errors) {
      fieldErrors.value = { ...responseData.errors };
    }
    toast.add({ severity: 'error', summary: 'Erro na Operação', detail: responseData?.message || 'Verifique os campos.', life: 5000 });
  }
}

function confirmDelete(item) {
  itemToDelete.value = item;
  isConfirmDeleteVisible.value = true;
}

async function executeDelete() {
  if (!itemToDelete.value || permitionRoleStore.isLoading) return;

  try {
    await permitionRoleStore.remove(itemToDelete.value.id);
    toast.add({ severity: 'success', summary: 'Sucesso', detail: `${singularLabel} eliminado com sucesso.`, life: 3500 });
    isConfirmDeleteVisible.value = false;
    itemToDelete.value = null;
  } catch (error) {
    const responseData = error?.response?.data;
    toast.add({ severity: 'error', summary: 'Erro ao Eliminar', detail: responseData?.message || 'Erro ao eliminar.', life: 5000 });
  }
}

async function reloadData() {
  try {
    await permitionStore.list();
    await roleStore.list();
    await permitionRoleStore.list();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar dados.', life: 5000 });
  }
}

onMounted(async () => {
  await reloadData();
  await user.initUser();
});
</script>

<template>
  <section class="category-page">
    <header class="page-heading">
      <div class="heading-content">
        <div class="title-with-badge">
          <h1>Permissões de Funções</h1>
          <Tag v-if="permitionRoleStore.rolePermitions" :value="permitionRoleStore.rolePermitions.length" severity="info" class="count-badge" />
        </div>
        <p>Gerencie {{pluralLabel.toLowerCase()}} do sistema.</p>
      </div>
      <div class="heading-actions">
        <Button label="Nova Função Permissão"
          v-if="user.getPermition('role_permition.create')"
          icon="pi pi-plus"
          class="p-button-primary btn-add"
          :disabled="permitionRoleStore.isLoading"
          @click="openCreateDialog" />
      </div>
    </header>

    <div class="kpi-summary-grid">
      <div class="kpi-card">
        <div class="kpi-icon bg-primary-soft"><i class="pi pi-folder"></i></div>
        <div class="kpi-details">
          <span class="kpi-label">Total</span>
          <span class="kpi-value">{{ permitionRoleStore.rolePermitions?.length || 0 }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon bg-info-soft"><i class="pi pi-list"></i></div>
        <div class="kpi-details">
          <span class="kpi-label">Exibidos</span>
          <span class="kpi-value">{{ filteredItems.length }} / {{ permitionRoleStore.rolePermitions?.length || 0 }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon bg-warning-soft"><i class="pi pi-filter"></i></div>
        <div class="kpi-details">
          <span class="kpi-label">Filtros</span>
          <span class="kpi-value">{{ activeFiltersCount > 0 ? `${activeFiltersCount} aplicado(s)` : 'Nenhum' }}</span>
        </div>
      </div>
    </div>

    <Card class="table-card border-none shadow-1">
      <template #content>
        <DataTable
          :value="filteredItems"
          :loading="permitionRoleStore.isLoading"
          responsiveLayout="scroll"
          paginator
          v-model:rows="rowsPerPage"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          class="custom-datatable p-datatable-sm"
          dataKey="id"
        >
          <template #header>
            <div class="table-header-wrapper table-header">
              <div class="filter-top-row">
                <div class="search-container">
                  <i class="pi pi-search search-icon" />
                  <InputText v-model="searchQuery" placeholder="Pesquisar..." class="search-input theme-input" />
                  <Button v-if="searchQuery" icon="pi pi-times" class="p-button-text p-button-rounded clear-search-btn" @click="searchQuery = ''" />
                </div>
                <div class="toolbar-actions">
                  <Button icon="pi pi-refresh" class="p-button-text p-button-secondary p-button-rounded" :loading="permitionRoleStore.isLoading" @click="reloadData" />
                </div>
              </div>
            </div>
          </template>

          <template #empty>
            <div class="empty-state">
              <p class="empty-title">Ainda não existem registos</p>
              <Button label="Criar Nova"
                v-if="user.getPermition('role_permition.create')"
                icon="pi pi-plus"
                class="p-button-primary p-button-sm mt-3"
                @click="openCreateDialog" />
            </div>
          </template>

          <Column field="id" header="ID" style="width: 110px" sortable>
            <template #body="{ data }"><span class="id-badge">#{{ data.id }}</span></template>
          </Column>

          <Column field="permition_id" header="Permissão" style="width: 150px" sortable>
            <template #body="{ data }">
              {{findModel(permitionStore.permitions, data.permition_id)?.name ?? '---- ---- ----'}}
            </template>
          </Column>

          <Column field="role_id" header="Função" style="width: 150px" sortable>
            <template #body="{ data }">
              <Tag :value="findModel(roleStore.roles, data.role_id)?.name ?? '---- ---- ----'" :severity="getStatusSeverity(data.role_id)" />
            </template>
          </Column>

          <Column header="Acções" style="width: 140px; text-align: center">
            <template #body="{ data }">
              <div class="action-buttons">
                <Button icon="pi pi-pencil"
                  v-if="user.getPermition('role_permition.update')"
                  class="p-button-text p-button-rounded p-button-warning action-btn"
                  @click="openEditDialog(data)" />
                <Button icon="pi pi-trash"
                  v-if="user.getPermition('role_permition.delete')"
                  class="p-button-text p-button-rounded p-button-danger action-btn"
                  @click="confirmDelete(data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <RolePermitionDialog
      v-model:visible="isDialogVisible"
      :isEditing="isEditing"
      :initialData="selectedItem"
      :isLoading="permitionRoleStore.isLoading"
      :fieldErrors="fieldErrors"
      @save="handleSave"
    />

    <RolePermitionDialog
      v-model:visible="isConfirmDeleteVisible"
      :isDeleteDialog="true"
      :itemToDelete="itemToDelete"
      :isLoading="permitionRoleStore.isLoading"
      @delete="executeDelete"
    />
  </section>
</template>

<style scoped>
@import '../../assets/crud.css'; 
@import '../../assets/mobile.css'; 
</style>