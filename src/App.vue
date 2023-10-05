<script lang="ts" setup>
  // Le composant principal de l'application
</script>

<template>
  <v-app theme="dark">
    <!-- La barre de navigation, qui apparaît en haut de l'écran-->
    <v-app-bar color="primary">
      <v-app-bar-title>
        Movinetum
      </v-app-bar-title>
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