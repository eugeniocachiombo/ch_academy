import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user.store";

const routes = [
  {
    path: "/",
    redirect: '/login'
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { requiresGuest: true }
  },
  {
    path: "/cadastro",
    name: "signup",
    component: () => import("@/views/auth/SignupView.vue"),
    meta: { requiresGuest: true }
  },
  {
    path: "/",
    component: () => import("@/layout/AppLayout.vue"),
    meta: { requiresAuth: true }, // Aplica autenticação a todas as rotas filhas
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("@/views/DashboardView.vue"),
      },
      {
        path: "anos-lectivos",
        name: "academic_year",
        component: () => import("@/views/AcademicYear/Index.vue"),
        meta: { permition: 'academic_year.view' },
      },
      {
        path: "cursos",
        name: "course",
        component: () => import("@/views/Course/Index.vue"),
        meta: { permition: 'course.view' },
      },
      {
        path: "classes",
        name: "class",
        component: () => import("@/views/Class/Index.vue"),
        meta: { permition: 'class.view' },
      },
      {
        path: "disciplinas",
        name: "subject",
        component: () => import("@/views/Subject/Index.vue"),
        meta: { permition: 'subject.view' },
      },
      {
        path: "Funções",
        name: "role",
        component: () => import("@/views/Role/Index.vue"),
        meta: { permition: 'role.view' },
      },
      {
        path: "Permissões",
        name: "permition",
        component: () => import("@/views/Permition/Index.vue"),
        meta: { permition: 'permition.view' },
      },
      {
        path: "funcões-usuario",
        name: "user_role",
        component: () => import("@/views/UserRole/Index.vue"),
        meta: { permition: 'user_role.view' },
      },
      {
        path: "permissões-funcões",
        name: "role_permition",
        component: () => import("@/views/RolePermition/Index.vue"),
        meta: { permition: 'role_permition.view' },
      },
      {
        path: "salas",
        name: "class_room",
        component: () => import("@/views/ClassRoom/Index.vue"),
        meta: { permition: 'class_room.view' },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/dashboard"
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

// Middleware Global (Navigation Guard)
router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore();

  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");

  // Só está autenticado se possuir TOKEN e USER_ID
  const isAuthenticated =
    (userStore.isAuthenticated || !!token) && !!userID;

  // Rota requer autenticação e o utilizador não está autenticado
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    return next({
      name: "login",
      query: {
        redirect: to.fullPath,
      },
    });
  }

  // Rota exclusiva para visitantes e o utilizador já está autenticado
  if (
    to.matched.some((record) => record.meta.requiresGuest) &&
    isAuthenticated
  ) {
    return next({ name: "dashboard" });
  }


  // ---- obs: posteriormente ser eliminado
   if(isAuthenticated){

      await userStore.initUser();
      if (to.name != '/dashboard' && to.meta.permition) {
        if ( !userStore.getPermition(to.meta.permition)) {
          return next({name: 'dashboard'})
        }
      }

    }
    // ------

  next();
});

export default router;