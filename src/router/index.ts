// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/movies/1'
  },
  {
    path: '/movies/:page',
    name: 'Movies',
    component: () => import(/* webpackChunkName: "movies" */ '@/views/Movies.vue'),
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: () => import(/* webpackChunkName: "movie" */ '@/views/MovieDetail.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
