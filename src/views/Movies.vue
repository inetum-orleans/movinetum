<template>
    <v-container>
        <h1>Movies</h1>
        <!-- TODO: c'est juste l'initialisation du projet, débrouillez-vous avec ça !-->
        <div v-if="loading">Chargement en cours...</div>
        <ul v-else>
            <li v-for="movie in movies" :key="movie.id">
                {{ movie.title }}
            </li>
        </ul>
    </v-container>
</template>

<script setup lang="ts">
import { tmdbSymbol } from '@/types/symbols'
import { inject, ref, watch } from 'vue'
import { Movie } from 'tmdb-ts'

const tmdb = inject(tmdbSymbol)!
const loading = ref(true)
const page = ref(1)
const movies = ref<Movie[]>([])

watch(page, async () => {
    loading.value = true
    const results = await tmdb.movies.nowPlaying({
        page: page.value,
        language: 'fr-FR',
        region: 'FR'
    })
    movies.value = results.results
    loading.value = false
}, { immediate: true })
</script>