<template>
  <section class="p-6 space-y-6">
    <!-- Cabeçalho da Página -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-[var(--text-color)]">Dashboard Académica</h1>
        <p class="text-sm mt-1 text-[var(--text-color-secondary)]">Visão geral do sistema, estatísticas de alunos e registos.</p>
      </div>
      <div class="flex items-center gap-3">
        <Button label="Gerar Relatório" icon="pi pi-download" severity="secondary" outlined />
      </div>
    </div>

    <!-- Cards de Estatísticas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card class="dashboard-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <span class="text-sm font-medium text-[var(--text-color-secondary)]">Total de Alunos</span>
              <h3 class="text-2xl font-bold mt-1 text-[var(--text-color)]">1,248</h3>
            </div>
            <div class="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <i class="pi pi-users text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="dashboard-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <span class="text-sm font-medium text-[var(--text-color-secondary)]">Professores Activos</span>
              <h3 class="text-2xl font-bold mt-1 text-[var(--text-color)]">84</h3>
            </div>
            <div class="p-3 rounded-xl bg-purple-500/10 text-purple-500">
              <i class="pi pi-id-card text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="dashboard-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <span class="text-sm font-medium text-[var(--text-color-secondary)]">Cursos Disponíveis</span>
              <h3 class="text-2xl font-bold mt-1 text-[var(--text-color)]">16</h3>
            </div>
            <div class="p-3 rounded-xl bg-amber-500/10 text-amber-500">
              <i class="pi pi-book text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="dashboard-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <span class="text-sm font-medium text-[var(--text-color-secondary)]">Matrículas Activas</span>
              <h3 class="text-2xl font-bold mt-1 text-[var(--text-color)]">1,192</h3>
            </div>
            <div class="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
              <i class="pi pi-file-check text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Tabela -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card class="dashboard-card lg:col-span-3">
        <template #title>
          <span class="font-bold text-base text-[var(--text-color)]">Últimos Registos Académicos</span>
        </template>
        <template #content>
          <DataTable :value="recentRegisters" responsiveLayout="scroll">
            <Column field="num" header="Nº Registo"></Column>
            <Column field="studentName" header="Estudante"></Column>
            <Column field="course" header="Curso"></Column>
            <Column field="className" header="Turma"></Column>
            <Column field="classRoom" header="Sala"></Column>
            <Column field="status" header="Status">
              <template #body="{ data }">
                <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'

const recentRegisters = ref([
  { id: 1, num: '849201', studentName: 'Ana Sofia Martins', course: 'Engenharia Informática', className: 'INF-3A', classRoom: '1', status: 'activo' },
  { id: 2, num: '849202', studentName: 'Carlos Miguel Costa', course: 'Direito', className: 'DIR-1B', classRoom: '2', status: 'condicionado' },
  { id: 3, num: '849203', studentName: 'Beatriz Luísa Ramos', course: 'Gestão de Empresas', className: 'GES-2C', classRoom: '4', status: 'activo' },
])

const getStatusSeverity = (status) => {
  switch (status) {
    case 'activo': return 'success'
    case 'condicionado': return 'warn'
    case 'bloqueado': return 'danger'
    default: return 'info'
  }
}
</script>

<style scoped>
@import url('@/assets/dashboard.css');
</style>