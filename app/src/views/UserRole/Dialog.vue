<script setup>
import { computed, onMounted, reactive, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import {useUserStore} from '@/stores/user.store'
import {useRoleStore} from '@/stores/role.store'

const props = defineProps({
  visible: { type: Boolean, required: true },
  isEditing: { type: Boolean, default: false },
  initialData: { type: Object, default: null },
  isLoading: { type: Boolean, default: false },
  fieldErrors: { type: Object, default: () => ({}) },
  isDeleteDialog: { type: Boolean, default: false },
  itemToDelete: { type: Object, default: null }
});

const emit = defineEmits(['update:visible', 'save', 'delete']);

const form = reactive({
  user_id: '',
  role_id: ''
});

const roleStore = useRoleStore();
const role_idOptions = computed(()=>
  roleStore.roles.map((e)=> ({
    "label": e.name,
    "value": e.id
  }))
);

const userStore = useUserStore();
const user_idOptions = computed(()=>
  userStore.users.map((e)=> ({
    "label": e.name,
    "value": e.id
  }))
);

onMounted(async()=>{
  await userStore.list();
  await roleStore.list();
})

watch(
  () => props.initialData,
  (newValue) => {
    if (newValue && props.isEditing) {
      form.user_id = newValue.user_id || '';
      form.role_id = newValue.role_id || '';
    } else {
      form.user_id = '';
      form.role_id = '';
    }
  },
  { immediate: true }
);

function handleSave() {
  emit('save', { ...form });
}

function handleClose() {
  emit('update:visible', false);
}

function getErrorMessage(errorField) {
  if (!errorField) return '';
  return Array.isArray(errorField) ? errorField[0] : errorField;
}
</script>

<template>
  <Dialog
    v-if="!isDeleteDialog"
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="isEditing ? 'Editar Função Usuário' : 'Nova Função Usuário'"
    :modal="true"
    :dismissableMask="!isLoading"
    :closable="!isLoading"
    append-to="self"
    class="category-dialog theme-adapted-dialog"
    style="width: 100%; max-width: 500px"
  >
    <form @submit.prevent="handleSave" class="form-grid space-y-4" novalidate>
      <div class="field">
        <label for="userRole-user_id" class="required-label font-medium text-sm">Usuário</label>
        <Dropdown
          id="userRole-user_id"
          v-model="form.user_id"
          :options="user_idOptions"
          optionLabel="label"
          optionValue="value"
          filter
          showClear
          placeholder="Selecione o usuário"
          class="w-full theme-input"
          :class="{ 'p-invalid': !!fieldErrors.user_id }"
          :disabled="isLoading"
        />
         <small v-if="fieldErrors.user_id" class="p-error-message" role="alert"><i class="pi pi-exclamation-circle"></i><span>{{ getErrorMessage(fieldErrors.user_id) }}</span></small>
      </div>

      <div class="field">
        <label for="userRole-role_id" class="required-label font-medium text-sm">Função</label>
        <Dropdown
          id="userRole-role_id"
          v-model="form.role_id"
          :options="role_idOptions"
          optionLabel="label"
          optionValue="value"
          filter
          showClear
          placeholder="Selecione a função"
          class="w-full theme-input"
          :class="{ 'p-invalid': !!fieldErrors.role_id }"
          :disabled="isLoading"
        />
        <small v-if="fieldErrors.role_id" class="p-error-message" role="alert"><i class="pi pi-exclamation-circle"></i><span>{{ getErrorMessage(fieldErrors.role_id) }}</span></small>
      </div>

      <div class="dialog-footer flex justify-end gap-2 pt-2">
        <Button
          type="button"
          label="Cancelar"
          class="p-button-text p-button-secondary"
          :disabled="isLoading"
          @click="handleClose"
        />
        <Button
          type="submit"
          :label="isEditing ? 'Actualizar' : 'Guardar'"
          :icon="isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
          class="p-button-primary"
          :loading="isLoading"
        />
      </div>
    </form>
  </Dialog>

  <Dialog
    v-else
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    header="Confirmar Eliminação"
    :modal="true"
    :dismissableMask="!isLoading"
    :closable="!isLoading"
    append-to="self"
    class="theme-adapted-dialog"
    style="width: 100%; max-width: 450px"
  >
    <div class="flex items-start gap-4 py-2">
      <i class="pi pi-exclamation-triangle text-amber-500 text-3xl flex-shrink-0 mt-1"></i>
      <div class="space-y-1" v-if="itemToDelete">
        <p class="text-sm leading-relaxed">
          Tem a certeza que deseja eliminar o Função Usuário
          <strong>"{{ itemToDelete.name }}"</strong>?
        </p>
        <p class="text-xs text-red-400 font-medium pt-1">Esta acção é irreversível.</p>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <Button
          label="Cancelar"
          class="p-button-text p-button-secondary"
          :disabled="isLoading"
          @click="handleClose"
        />
        <Button
          label="Eliminar"
          icon="pi pi-trash"
          class="p-button-danger"
          :loading="isLoading"
          @click="$emit('delete')"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
@import '../../assets/crud.css'; 
@import '../../assets/mobile.css'; 
</style>