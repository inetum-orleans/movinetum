<script setup lang="ts">
// Le composant, utilisé dans plusieurs vues, qui affiche la liste des films les mieux notés

// Liste d'imports
import CarteFilm from '@/components/CarteFilm.vue'
import { ListeFilmsPaginee } from '@/types/interfaces'

// Définition des propriétés qui peuvent être passées à ce composant
const props = defineProps<{
    films: ListeFilmsPaginee | null
}>()

/**
 * Définition des événements que ce composant peut émettre
 */
const emit = defineEmits<{
    changementPage: [numPage: number]
}>()

/**
 * Déclenche la "navigation" vers la page passée en paramètre
 * Cette fonction est appelée lorsqu'on change de page via le composant de pagination
 */
function changementPage(numPage: number) {
    emit('changementPage', numPage)
}
</script>

<template>
    <v-container>
        <template v-if="props.films">
            <!-- Si on n'est pas en chargement, on affiche ce contenu-->
            <v-row>
                <v-col cols="6" sm="4" md="3" lg="2" v-for="film in props.films.results" :key="film.id">
                    <carte-film :film="film" />
                </v-col>
            </v-row>
            <v-pagination
                :model-value="props.films.page"
                @update:model-value="changementPage"
                :length="props.films.total_pages"
                class="pagination"
                ></v-pagination>
        </template>
        <div v-else>Chargement en cours...</div>
    </v-container>
</template>
