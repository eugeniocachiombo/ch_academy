<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import ProgressSpinner from 'primevue/progressspinner';
import { useAcademicYearStore } from '@/stores/academic_year.store';
import AcademicYearDialog from '@/views/AcademicYear/Dialog.vue';
import { useToast } from 'primevue/usetoast';


const academicYearStore = useAcademicYearStore();
const toast = useToast();

const isDialogVisible = ref(false);
const isEditing = ref(false);
const selectedItem = ref(null);

const isConfirmDeleteVisible = ref(false);
const itemToDelete = ref(null);

const rowsPerPage = ref(10);
const searchQuery = ref('');
const fieldErrors = ref({});

const filteredAcademicYears = computed(() => {
  let list = academicYearStore.academicYears || [];

  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const q = searchQuery.value.trim().toLowerCase();
    list = list.filter((item) => {
      const itemId = String(item.id || '');
      const itemName = String(item.name || '').toLowerCase();
      const itemStatus = String(item.status || '').toLowerCase();

      return (
        itemId.includes(q) ||
        itemName.includes(q) ||
        itemStatus.includes(q)
      );
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
    case 'activa': return 'success';
    case 'inactiva': return 'danger';
    default: return 'info';
  }
}

function openCreateDialog() {
  isEditing.value = false;
  selectedItem.value = null;
  fieldErrors.value = {};
  isDialogVisible.value = true;
}

function openEditDialog(academicYear) {
  isEditing.value = true;
  selectedItem.value = academicYear;
  fieldErrors.value = {};
  isDialogVisible.value = true;
}

async function handleSave(formPayload) {
  if (academicYearStore.isLoading) return;

  try {
    if (isEditing.value && selectedItem.value) {
      await academicYearStore.update(selectedItem.value.id, formPayload);
      isDialogVisible.value = false;
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Ano lectivo actualizado com sucesso.',
        life: 3500
      });
    } else {
      await academicYearStore.create(formPayload);
      isDialogVisible.value = false;
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Ano lectivo criado com sucesso.',
        life: 3500
      });
    }
    selectedItem.value = {data: null};
  } catch (error) {
    const responseData = error?.response?.data;
    if (responseData?.errors) {
      fieldErrors.value = { ...responseData.errors };
    }
    toast.add({
      severity: 'error',
      summary: 'Erro na Operação',
      detail: responseData?.message || 'Por favor, verifique os campos destacados e tente novamente.',
      life: 5000
    });
  }
}

function confirmDelete(academicYear) {
  itemToDelete.value = academicYear;
  isConfirmDeleteVisible.value = true;
}

async function executeDelete() {
  if (!itemToDelete.value || academicYearStore.isLoading) return;

  try {
    await academicYearStore.remove(itemToDelete.value.id);
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Ano lectivo eliminado com sucesso.',
      life: 3500
    });
    isConfirmDeleteVisible.value = false;
    itemToDelete.value = null;
  } catch (error) {
    const responseData = error?.response?.data;
    toast.add({
      severity: 'error',
      summary: 'Erro ao Eliminar',
      detail: responseData?.message || 'Não foi possível eliminar o ano lectivo.',
      life: 5000
    });
  }
}

async function reloadData() {
  try {
    await academicYearStore.list();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro de Carregamento',
      detail: 'Não foi possível carregar os dados dos anos lectivos.',
      life: 5000
    });
  }
}

onMounted(async () => {
  await reloadData();
});
</script>

<template>
  <section class="category-page">
    <header class="page-heading">
      <div class="heading-content">
        <div class="title-with-badge">
          <h1>Anos Lectivos</h1>
          <Tag
            v-if="academicYearStore.academicYears"
            :value="academicYearStore.academicYears.length"
            severity="info"
            class="count-badge"
            aria-label="Total de anos lectivos"
          />
        </div>
        <p>Gerencie os anos lectivos do sistema académico.</p>
      </div>
      <div class="heading-actions">
        <Button
          label="Novo ano lectivo"
          icon="pi pi-plus"
          class="p-button-primary btn-add"
          :disabled="academicYearStore.isLoading"
          @click="openCreateDialog"
        />
      </div>
    </header>

    <div class="kpi-summary-grid">
      <div class="kpi-card">
        <div class="kpi-icon bg-primary-soft">
          <i class="pi pi-calendar"></i>
        </div>
        <div class="kpi-details">
          <span class="kpi-label">Total de Anos Lectivos</span>
          <span class="kpi-value">{{ academicYearStore.academicYears?.length || 0 }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon bg-info-soft">
          <i class="pi pi-list"></i>
        </div>
        <div class="kpi-details">
          <span class="kpi-label">Anos Exibidos</span>
          <span class="kpi-value">{{ filteredAcademicYears.length }} / {{ academicYearStore.academicYears?.length || 0 }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon bg-warning-soft">
          <i class="pi pi-filter"></i>
        </div>
        <div class="kpi-details">
          <span class="kpi-label">Filtros Activos</span>
          <span class="kpi-value">
            {{ activeFiltersCount > 0 ? `${activeFiltersCount} aplicado(s)` : 'Nenhum' }}
          </span>
        </div>
      </div>
    </div>

    <Card class="table-card border-none shadow-1">
      <template #content>
        <DataTable
          :value="filteredAcademicYears"
          :loading="academicYearStore.isLoading"
          responsiveLayout="scroll"
          paginator
          v-model:rows="rowsPerPage"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate="A mostrar {first} até {last} de {totalRecords} anos lectivos"
          class="custom-datatable p-datatable-sm"
          dataKey="id"
        >
          <template #header>
            <div class="table-header-wrapper table-header">
              <div class="filter-top-row">
                <div class="search-container">
                  <i class="pi pi-search search-icon" aria-hidden="true" />
                  <InputText
                    v-model="searchQuery"
                    placeholder="Pesquisar por ID, nome ou status..."
                    class="search-input theme-input"
                    aria-label="Pesquisar anos lectivos"
                  />
                  <Button
                    v-if="searchQuery"
                    icon="pi pi-times"
                    class="p-button-text p-button-rounded clear-search-btn"
                    aria-label="Limpar pesquisa"
                    @click="searchQuery = ''"
                  />
                </div>

                <div class="toolbar-actions">
                  <Button
                    icon="pi pi-refresh"
                    class="p-button-text p-button-secondary p-button-rounded refresh-btn"
                    v-tooltip.top="'Actualizar lista'"
                    aria-label="Actualizar lista de anos lectivos"
                    :loading="academicYearStore.isLoading"
                    @click="reloadData"
                  />
                </div>
              </div>

              <div v-if="activeFiltersCount > 0" class="active-chips-bar">
                <span class="chips-title">Filtros aplicados:</span>
                <Tag v-if="searchQuery" severity="info" class="filter-chip">
                  <span>Pesquisa: "{{ searchQuery }}"</span>
                  <i class="pi pi-times chip-remove" @click="searchQuery = ''"></i>
                </Tag>
              </div>
            </div>
          </template>

          <template #loading>
            <div class="table-loading-state">
              <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" />
              <span>A carregar anos lectivos...</span>
            </div>
          </template>

          <template #empty>
            <div class="empty-state">
              <div class="empty-icon-wrapper">
                <i :class="activeFiltersCount > 0 ? 'pi pi-filter-slash' : 'pi pi-calendar-times'"></i>
              </div>

              <template v-if="activeFiltersCount > 0">
                <p class="empty-title">Nenhum resultado encontrado</p>
                <p class="empty-subtitle">
                  Não encontramos nenhum ano lectivo correspondente aos filtros seleccionados.
                </p>
                <Button
                  label="Limpar Filtros"
                  icon="pi pi-filter-slash"
                  class="p-button-outlined p-button-sm mt-3"
                  @click="clearAllFilters"
                />
              </template>

              <template v-else>
                <p class="empty-title">Ainda não existem anos lectivos</p>
                <p class="empty-subtitle">
                  Comece por adicionar o seu primeiro ano lectivo ao sistema.
                </p>
                <Button
                  label="Criar Novo Ano Lectivo"
                  icon="pi pi-plus"
                  class="p-button-primary p-button-sm mt-3"
                  @click="openCreateDialog"
                />
              </template>
            </div>
          </template>

          <Column field="id" header="ID" style="width: 110px" sortable>
            <template #body="{ data }">
              <span class="id-badge">#{{ data.id }}</span>
            </template>
          </Column>

          <Column field="name" header="Nome do Ano Lectivo" sortable>
            <template #body="{ data }">
              <span class="category-name-cell font-medium">{{ data.name }}</span>
            </template>
          </Column>

          <Column field="status" header="Status" style="width: 150px" sortable>
            <template #body="{ data }">
              <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
            </template>
          </Column>

          <Column header="Acções" style="width: 140px; text-align: center">
            <template #body="{ data }">
              <div class="action-buttons">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-text p-button-rounded p-button-warning action-btn"
                  v-tooltip.top="'Editar'"
                  aria-label="Editar Ano Lectivo"
                  @click="openEditDialog(data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-text p-button-rounded p-button-danger action-btn"
                  v-tooltip.top="'Eliminar'"
                  aria-label="Eliminar Ano Lectivo"
                  @click="confirmDelete(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Componente do Diálogo Isolado -->
    <AcademicYearDialog
      v-model:visible="isDialogVisible"
      :isEditing="isEditing"
      :initialData="selectedItem"
      :isLoading="academicYearStore.isLoading"
      :fieldErrors="fieldErrors"
      @save="handleSave"
    />

    <!-- Componente do Diálogo de Exclusão -->
    <AcademicYearDialog
      v-model:visible="isConfirmDeleteVisible"
      :isDeleteDialog="true"
      :itemToDelete="itemToDelete"
      :isLoading="academicYearStore.isLoading"
      @delete="executeDelete"
    />
  </section>
</template>

<style scoped>
@import '../../assets/crud.css'; 
@import '../../assets/mobile.css'; 
</style>