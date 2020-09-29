
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/social', component: () => import('pages/social/Social.vue') }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/auth/login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('pages/auth/register.vue')
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
