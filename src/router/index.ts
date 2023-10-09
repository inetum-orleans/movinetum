/**
 * @fileoverview Fichier contenant la configuration des routes de l'application.
 * Lorsque l'on rentre une adresse dans la barre du navigateur, c'est ici que le composant "vue-router" va choisir quel composant afficher.
 */
import { createRouter, createWebHistory } from 'vue-router'

// Dans ce tableau, je déclare les différentes routes, c'est à dire pour un "path" donné, quel composant afficher
const routes = [
  {
    path: '/',// Ce chemin correspond à la racine du site. C'est ce qui est exécuté lorsque l'on arrive sur l'adresse du site (http://localhost:3000/).
    name: 'Accueil',// On donne un nom à la route, cela permet de l'utiliser plus facilement dans le code.
    redirect: '/films/1'// Cette route redirige vers la route "/films/1". C'est à dire que lorsque l'on arrive sur la racine du site, on est redirigé vers la première page de la liste des films.
  },
  {
    path: '/films/:page',// Ce chemin correspond à la liste des films. Le ":page" permet de récupérer le numéro de la page dans laquelle on se trouve. Par exemple, si on est sur l'url /films/3, le ":page" vaudra 3.
    name: 'Films',
    component: () => import('@/views/Films.vue'),// Le composant à afficher est le composant "Films" du dossier "views".
  },
  {
    path: '/film/:id',// Ici, on affiche le détail du film dont l'identifiant est passé dans l'url. Par exemple, si on est sur l'url /film/123, le ":id" vaudra 123.
    name: 'DetailFilm',
    component: () => import('@/views/DetailFilm.vue'),
  },
  {
    path: '/inscription',// La page pour créer un compte
    name: 'Inscription',
    component: () => import('@/views/Inscription.vue'),
  },
]

// Sauce interne pour créer le router, c'est à dire le composant qui va pouvoir afficher les différents composants en fonction de l'url.
// On lui donne les routes déclarées plus haut.
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
