<script setup lang="ts">
// La vue qui affiche la liste des films les mieux notés
// Correspond à l'URL /films/<numéro de page>

// Liste d'imports
import { symboleTmdb } from '@/types/symboles'
import { inject, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Movie } from 'tmdb-ts'
import CarteFilm from '@/components/CarteFilm.vue'
import { computed } from 'vue'

// Récupère la route actuelle, c'est à dire toutes les informations sur l'URL actuelle récupérées par Vue Router
// La route contient des informations intéressantes, notamment les paramètres de l'URL, comme le numéro de page
const route = useRoute()
// Le routeur, qui permet de naviguer vers une autre page via du code javascript
const routeur = useRouter()

// On récupère le client TMDB depuis le conteneur d'injection de dépendances (voir la ligne "app.provide" dans src/main.ts)
const tmdb = inject(symboleTmdb)!

// On récupère le texte à rechercher depuis la route, si jamais il y en a un
const recherche = computed(() => route.query.recherche as string)

// Indique si la page est en cours de chargement.
const chargement = ref(true)
// Le numéro de page actuel, récupéré depuis la route
const page = computed(() => route.params.page ? parseInt(route.params.page as string) : 1)
// Le nombre total de pages de films. Initialisé à 1, mais on le mettra à jour lors du chargement des films
const nbPagesTotal = ref(1)
// La liste des films à afficher. Initialisée à une liste vide, mais on la mettra à jour lors du chargement des films
const films = ref<Movie[]>([])

// La fonction watch permet de surveiller les changements de la variable page
watch(() => [page.value, recherche.value], async () => {
    // Lorsque l'on change de page, on déclenche cette fonction de mise à jour.
    // Etant donné que j'ai marqué immediate:true, cette fonction est aussi appelée immédiatement au premier chargement.
    chargement.value = true // Affiche le message de chargement

    if (recherche.value) {
        // On récupère la liste des films les mieux notés depuis l'API TMDB
        const resultats = await tmdb.search.movies({
            language: 'fr-FR',
            query: recherche.value,
            page: page.value,
        })

        // On initialise les valeurs de la liste des films et du nombre total de pages
        films.value = resultats.results
        nbPagesTotal.value = resultats.total_pages
    } else {
        // On récupère la liste des films les mieux notés depuis l'API TMDB
        const resultats = await tmdb.movies.topRated({
            page: page.value,
            language: 'fr-FR',
            region: 'FR'
        })

        // On initialise les valeurs de la liste des films et du nombre total de pages
        films.value = resultats.results
        nbPagesTotal.value = resultats.total_pages
    }

    chargement.value = false // Masque le message de chargement
}, { immediate: true })

/**
 * Déclenche la "navigation" vers la page passée en paramètre
 * Cette fonction est appelée lorsqu'on change de page via le composant de pagination
 */
function changementPage(numPage: number) {
    routeur.push({ name: 'Films', params: { page: numPage }, query: { recherche: recherche.value }})
}
</script>

<template>
    <v-container>
        <div v-if="chargement">Chargement en cours...</div>
        <template v-else>
            <!-- Si on n'est pas en chargement, on affiche ce contenu-->
            <v-row>
                <carte-film v-for="film in films" :key="film.id" :film="film">
                </carte-film>
            </v-row>
            <v-pagination
                :model-value="page"
                @update:model-value="changementPage"
                :length="nbPagesTotal"
                ></v-pagination>
        </template>
    </v-container>
</template>