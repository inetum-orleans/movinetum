<script setup lang="ts">
// La vue qui affiche le détail d'un film
// Correspond à l'URL /film/<id du film>

// L'URL de base des images de films
const urlBaseImage = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2'
// L'URL de base des images de films
const urlBackgroundImage = 'https://image.tmdb.org/t/p/'

// Récupère la route actuelle, c'est à dire toutes les informations sur l'URL actuelle récupérées par Vue Router
// La route contient des informations intéressantes, notamment les paramètres de l'URL, comme le numéro de page
import {useRoute} from 'vue-router'
import {computed, inject, ref} from 'vue'
import {symboleTmdb} from '@/types/symboles'
import {MovieDetails, TMDB} from 'tmdb-ts'

const route = useRoute()

// On récupère le client TMDB depuis le conteneur d'injection de dépendances (voir la ligne "app.provide" dans src/main.ts)
const tmdb: TMDB = inject(symboleTmdb)!

// Le numéro de page actuel, récupéré depuis la route
const page = computed<number>(() => route.params.id ? Number(route.params.id as string) : 1)

const film = ref<MovieDetails | null>()

const filmDetails = computed(async () => {
  return await tmdb.movies.details(page.value, ['credits', 'external_ids', 'images', 'keywords']).then((data) => {
    film.value = data
  })
})
</script>
<template>
  <div v-if="!!filmDetails">
    <v-parallax :src="urlBackgroundImage +'w1920_and_h800_multi_faces'+ film?.backdrop_path">
      <v-row class="d-flex justify-center align-center h-100">
        <v-col>
          <v-img :src="urlBaseImage + film?.poster_path" :height="300" alt="Affiche du film" cover></v-img>
        </v-col>
        <v-col cols="8">
      <div class="d-flex flex-column fill-height justify-center align-center text-white">
        <h1 class="text-h4 font-weight-thin mb-4">
          {{ film?.title }}
        </h1>
        <p class="subheading">
          {{ film?.overview }}
        </p>
      </div>
        </v-col>
      </v-row>
    </v-parallax>
  </div>
</template>

<style scoped>
.v-parallax:deep(img) {
  object-position: calc(20vw);
}

.v-parallax:deep(.v-responsive__content) {
  background-image: linear-gradient(to right,
  rgba(178.5, 115.5, 94.5, 1) calc((50vw - 170px) - 340px),
  rgba(178.5, 115.5, 94.5, 0.84) 50%,
  rgba(178.5, 115.5, 94.5, 0.84) 100%);
}
</style>
