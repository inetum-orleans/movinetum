<template>
    <v-container>
        <div v-if="loading">Chargement en cours...</div>
        <div>
        <v-row>
            <movie-card v-for="movie in movies" :key="movie.id" :movie="movie">
            </movie-card>
        </v-row>
        <v-pagination
            :model-value="page"
            @update:model-value="changePage"
            :length="totalPages"
            ></v-pagination>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { tmdbSymbol } from '@/types/symbols'
import { inject, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Movie } from 'tmdb-ts'
import MovieCard from '@/components/MovieCard.vue'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const tmdb = inject(tmdbSymbol)!
const loading = ref(true)

const page = computed(() => route.params.page ? parseInt(route.params.page as string) : 1)
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

function changePage(pageNumber: number) {
    router.push({ name: 'Movies', params: { page: pageNumber } })
}
</script>