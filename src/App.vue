<script lang="ts" setup>
  // Le composant principal de l'application

  import { ref } from 'vue';
  import { useRouter } from 'vue-router'
  import { useUtilisateursStore } from './store/utilisateurs'
  import FormulaireConnexion from './components/FormulaireConnexion.vue'

  const router = useRouter()
  const storeUtilisateur = useUtilisateursStore()
  const recherche = ref('')

  function search() {
    router.push({ name: 'Recherche', params: { page: 1 }, query: { recherche: recherche.value } })
  }
</script>

<template>
  <v-app theme="dark">
    <!-- La barre de navigation, qui apparaît en haut de l'écran-->
    <v-app-bar>
      <v-container class="d-flex py-0 h-100 align-center">
        <router-link to="/" class="h-100 d-flex mr-2">
          <v-img
            width="150"
            @click="recherche = ''"
            alt="Logo Movinetum"
            src="/logo_movinetum.svg"
          />
        </router-link>
        <v-text-field
          label="Rechercher un film"
          append-inner-icon="mdi-magnify"
          single-line
          hide-details
          class="ma-2"
          variant="underlined"
          density="compact"
          v-model="recherche"
          @click:append-inner="search"
          @keyup.enter="search"
        />
        <v-spacer />
        <v-btn prepend-icon="mdi-star" to="/favoris/1">Mes favoris</v-btn>
        <v-btn v-if="storeUtilisateur.utilisateurConnecte" prepend-icon="mdi-eye" to="/aVoir/1">À voir</v-btn>
        <v-btn prepend-icon="mdi-account">
          Mon compte
          <v-menu activator="parent" :close-on-content-click="false">
            <v-list v-if="storeUtilisateur.utilisateurConnecte">
              <v-list-item>
                <v-list-item-title>{{ storeUtilisateur.utilisateurConnecte.prenom + ' ' + storeUtilisateur.utilisateurConnecte.nom }}</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="storeUtilisateur.deconnecter">
                <v-list-item-title>Déconnexion</v-list-item-title>
              </v-list-item>
            </v-list>
            <v-card v-else class="pa-3">
              <formulaire-connexion />
            </v-card>
          </v-menu>
        </v-btn>
      </v-container>
    </v-app-bar>
    <v-main>
      <!--
        Dans la zone principale de l'application, on inclut un "router-view".
        Ce router-view fait appel au routeur, créé dans le fichier router/index.ts,
        pour afficher le composant correspondant à l'URL courante.
      -->
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
/* Ajouter des règles CSS ici */

</style>
