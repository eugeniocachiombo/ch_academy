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