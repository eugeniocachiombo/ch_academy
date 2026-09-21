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

      <nav class="app-nav" id="app-nav">

        <span v-for="(item, i) in menuList">
            <RouterLink v-if="item.permition" :to="item.link" class="menu-item" @click="$emit('close')">
              <i :class="item.icon"></i>
              <span  class="span">{{item.label}}</span>
            </RouterLink>
        </span>
       
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-help">
          <i class="pi pi-info-circle"></i>
          <div>
            <strong>Dev.</strong>
            <small id="small">Eugénio Cachiombo</small>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import {useUserStore} from '@/stores/user.store.ts'

const user = useUserStore();
const menuList = ref([]);

function getList(){
  menuList.value = [
    {
      label: 'Dashboard',
      link: '/dashboard',
      icon: 'pi pi-home',
      permition: true,
    },
    {
      label: 'Ano Lectivo',
      link: '/anos-lectivos',
      icon: 'pi pi-book',
      permition: user.getPermition('academic_year.view'),
    },
    {
      label: 'Salas',
      link: '/salas',
      icon: 'pi pi-book',
      permition: user.getPermition('class_room.view'),
    },
    {
      label: 'Turmas',
      link: '/turmas',
      icon: 'pi pi-book',
      permition: user.getPermition('class_section.view'),
    },
    {
      label: 'Cursos',
      link: '/cursos',
      icon: 'pi pi-book',
      permition: user.getPermition('course.view'),
    },
    {
      label: 'Classes',
      link: '/classes',
      icon: 'pi pi-book',
      permition: user.getPermition('class.view'),
    },
    {
      label: 'Disciplinas',
      link: '/disciplinas',
      icon: 'pi pi-book',
      permition: user.getPermition('subject.view'),
    },
    {
      label: 'Funções',
      link: '/funções',
      icon: 'pi pi-book',
      permition: user.getPermition('role.view'),
    },
    {
      label: 'Permissões',
      link: '/permissões',
      icon: 'pi pi-book',
      permition: user.getPermition('permition.view'),
    },
    {
      label: 'Funções do Usuário',
      link: '/funcões-usuario',
      icon: 'pi pi-book',
      permition: user.getPermition('user_role.view'),
    },
    {
      label: 'Permissões de Funções',
      link: '/permissões-funcões',
      icon: 'pi pi-book',
      permition: user.getPermition('role_permition.view'),
    },
  ]; 
}

onMounted(async()=>{
  await user.initUser();
  getList();
})

defineProps({
  visible: Boolean
});

defineEmits(['close']);
</script>