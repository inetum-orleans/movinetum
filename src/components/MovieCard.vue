<template>
    <v-col cols="6" sm="4" md="3" lg="2">
        <v-card
            :to="{ name: 'MovieDetail', params: { id: movie.id }}"
            class="movie-card flex-column h-100"
            >
            <v-img :src="imageBasePath + movie.poster_path" alt="Affiche du film" cover>
            </v-img>
            <div class="card-actions">
                <div class="pa-2 bg-white rounded-circle d-inline-block">
                    <v-progress-circular :model-value="rating" :color="ratingColor">
                        {{ rating }}
                    </v-progress-circular>
                </div>
            </div>
            <div class="mt-2 pa-2">
                <p class="text-subtitle-1 font-weight-bold">
                    {{ movie.title }}
                </p>
                <p class="text-caption">
                    {{ movieReleaseDate }}
                </p>
            </div>
        </v-card>
    </v-col>
</template>

<script setup lang="ts">
import { Movie } from 'tmdb-ts';
import { computed } from 'vue';

const imageWidth = 154
const imageBasePath = 'https://image.tmdb.org/t/p/w' + imageWidth

const props = defineProps<{
    movie: Movie
}>()

const movieReleaseDate = computed(() => {
    return new Date(props.movie.release_date).toLocaleDateString('fr-FR');
})

const rating = computed(() => {
    return Math.round(props.movie.vote_average * 10)
})

const ratingColor = computed(() => {
    if (rating.value >= 70) {
        return 'success'
    } else if (rating.value >= 40) {
        return 'warning'
    } else {
        return 'error'
    }
})

</script>

<style scoped>
.movie-card {
    transition: all 0.2s ease-in-out;
}

.movie-card:hover {
    transform: scale(1.05);
}

.card-actions {
    position: absolute;
    z-index: 1;
    transform: translate(0, -50%);
}
</style>