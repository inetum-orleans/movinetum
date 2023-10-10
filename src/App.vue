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
      <template v-slot:prepend>
        <router-link to="/" class="h-100 d-flex justify-center">
          <v-img
            width="150"
            class="mr-2"
            @click="recherche = ''"
            alt="Logo Movinetum"
            src="/logo_movinetum.svg"
          />
        </router-link>
      </template>
      <v-text-field
        label="Rechercher un film"
        append-inner-icon="mdi-magnify"
        single-line
        hide-details
        class="ma-2"
        v-model="recherche"
        @click:append-inner="search"
        @keyup.enter="search"
      />
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
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
      <v-btn icon="mdi-star" to="/favoris/1" />
      <v-btn v-if="storeUtilisateur.utilisateurConnecte" icon="mdi-eye" to="/aVoir/1" />
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