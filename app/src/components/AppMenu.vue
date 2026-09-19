<template>
  <div>
    <div v-if="visible" class="menu-mask" @click="$emit('close')"></div>

    <aside class="app-sidebar" :class="{ 'is-open': visible }">
      <div class="brand">
        <div class="brand-logo">CH</div>
        <div>
          <strong>CH Academic</strong>
          <small>Gestão Escolar</small>
        </div>
      </div>

      <div class="menu-section">PRINCIPAL</div>

      <nav class="app-nav">
        <RouterLink to="/" class="menu-item" @click="$emit('close')">
          <i class="pi pi-home"></i>
          <span>Dashboard</span>
        </RouterLink>
        
        <RouterLink to="/anos-lectivos" class="menu-item" @click="$emit('close')">
          <i class="pi pi-book"></i>
          <span>Ano Lectivo</span>
        </RouterLink>

        <RouterLink to="/cursos" class="menu-item" @click="$emit('close')">
          <i class="pi pi-book"></i>
          <span>Cursos</span>
        </RouterLink>

        <RouterLink to="/classes" class="menu-item" @click="$emit('close')">
          <i class="pi pi-book"></i>
          <span>Classes</span>
        </RouterLink>

        <RouterLink to="/disciplinas" class="menu-item" @click="$emit('close')">
          <i class="pi pi-book"></i>
          <span>Disciplinas</span>
        </RouterLink>

        <RouterLink to="/funções" class="menu-item" @click="$emit('close')">
          <i class="pi pi-book"></i>
          <span>Funções</span>
        </RouterLink>

        <RouterLink to="/permissões" class="menu-item" @click="$emit('close')">
          <i class="pi pi-book"></i>
          <span>Permissões</span>
        </RouterLink>

        <RouterLink to="/funcões-usuario" class="menu-item" @click="$emit('close')">
          <i class="pi pi-book"></i>
          <span>Funções do Usuário</span>
        </RouterLink>

        <RouterLink to="/permissões-funcões" class="menu-item" @click="$emit('close')">
          <i class="pi pi-book"></i>
          <span>Permissões de Funções</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-help">
          <i class="pi pi-info-circle"></i>
          <div>
            <strong>Dev.</strong>
            <small>Eugénio Cachiombo</small>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean
});

defineEmits(['close']);
</script>