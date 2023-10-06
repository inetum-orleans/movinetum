<script lang="ts" setup>
  // Le composant principal de l'application
  
  import { ref } from 'vue';
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const recherche = ref('')

  function search() {
    router.push({ name: 'Films', params: { page: 1 }, query: { recherche: recherche.value } })
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