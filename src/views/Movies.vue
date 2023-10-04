<template>
    <v-container>
        <h1>Les films les mieux notés</h1>
        <div v-if="loading">Chargement en cours...</div>
        <v-row v-else>
            <movie-card v-for="movie in movies" :key="movie.id" :movie="movie">
            </movie-card>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { tmdbSymbol } from '@/types/symbols'
import { inject, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Movie } from 'tmdb-ts'
import MovieCard from '@/components/MovieCard.vue'

const route = useRoute()

const tmdb = inject(tmdbSymbol)!
const loading = ref(true)

const page = ref(route.params.page ? parseInt(route.params.page as string) : 1)
const totalPages = ref(1)
const movies = ref<Movie[]>([])

watch(page, async () => {
    loading.value = true
    const results = await tmdb.movies.topRated({
        page: page.value,
        language: 'fr-FR',
        region: 'FR'
    })
    movies.value = results.results
    totalPages.value = results.total_pages
    loading.value = false
}, { immediate: true })
</script>