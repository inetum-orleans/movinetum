<script setup lang="ts">
// La vue qui affiche la liste des films les mieux notés
// Correspond à l'URL /films/<numéro de page>

// Liste d'imports
import { symboleTmdb } from '@/types/symboles'
import { inject, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ListeFilms from '@/components/ListeFilms.vue'
import { ListeFilmsPaginee } from '@/types/interfaces'
import { useTMDBConfigurationStore } from '@/store/tmdb-configuration'
import { computed } from 'vue'

// Le routeur, qui permet de naviguer vers une autre page via du code javascript
const routeur = useRouter()

const storeTMDBConfiguration = useTMDBConfigurationStore()

// On récupère le client TMDB depuis le conteneur d'injection de dépendances (voir la ligne "app.provide" dans src/main.ts)
const tmdb = inject(symboleTmdb)!

// Les propriétés passées par le routeur (voir src/router/index.ts)
const props = defineProps<{
    page: number
}>();

// La liste des films à afficher. Initialisée à la valeur spéciale "null" pour indiquer que l'on est en cours de chargement.
// Une fois la liste chargée, la valeur est initialisée à la liste des films.
const listeFilms = ref<ListeFilmsPaginee | null>(null)

// 2.6 Stocker le résultat des clicks sur les boutons
// La liste des genres sélectionnés par l'utilisateur
const listeGenresFiltres = ref<number[]>([])

// La fonction watch permet de surveiller les changements de la variable page
watch(() => props.page, async () => {
    // Lorsque l'on change de page, on déclenche cette fonction de mise à jour.
    // Etant donné que j'ai marqué immediate:true, cette fonction est aussi appelée immédiatement au premier chargement.

    // On récupère la liste des films les mieux notés depuis l'API TMDB
    listeFilms.value = await tmdb.movies.topRated({
        page: props.page,
        language: 'fr-FR',
        region: 'FR'
    })
}, { immediate: true })

/**
 * Déclenche la "navigation" vers la page passée en paramètre
 * Cette fonction est appelée lorsqu'on change de page via le composant de pagination
 */
function changementPage(numPage: number) {
    routeur.push({ name: 'Films', params: { page: numPage } })
}

// 2.6 Stocker le résultat des clicks sur les boutons
function majListeGenresFiltres(id: number) {
    if (listeGenresFiltres.value.includes(id)) {
        listeGenresFiltres.value = listeGenresFiltres.value.filter(x => x !== id)
    } else {
        listeGenresFiltres.value.push(id);
    }
}

// 2.7 Filtrer les films en fonction de la liste des genres sélectionnés
const listeFilmsFiltres = computed(() => {
    if (listeFilms.value === null || listeGenresFiltres.value.length === 0) return listeFilms.value

    const genresFiltres = listeGenresFiltres.value.map(Number)
    const toReturn: ListeFilmsPaginee = JSON.parse(JSON.stringify(listeFilms.value))

    // Retourner les films qui contiennent tous les genres de la liste "genresFiltres"
    toReturn.results = toReturn.results.filter(film => genresFiltres.every(genre => film.genre_ids.includes(genre)))

    return toReturn
})
</script>

<template>
    <v-row>
        <!-- 2.1 Séparer la page en 2 colonnes -->
        <!-- <v-col :cols="2">
            Ici seront les filtres, cette phrase est suffisament longue pour être sur 2 lignes sans passer par dessus les affiches des films
        </v-col>
        <v-col :cols="10">
            <liste-films :films="listeFilms" @changementPage="changementPage" />
        </v-col> -->

        <!-- 2.2 Ajouter un cadre -->
        <!-- <v-col :cols="2">
            <v-card :minHeight="600" class="ml-4 mt-4">
                <v-card-title class="mt-2 mb-4">
                    Filtrer
                </v-card-title>
                <v-card-text>
                    Ici seront les filtres
                </v-card-text>
            </v-card>
        </v-col>
        <v-col :cols="10">
            <liste-films :films="listeFilms" @changementPage="changementPage" />
        </v-col>-->

        <!-- 2.3 Ajouter une icône -->
        <!-- <v-col :cols="2">
            <v-card :minHeight="600" class="ml-4 mt-4">
                <v-card-title class="mt-2 mb-4">
                    <v-icon>mdi-filter-outline</v-icon>
                    Filtrer
                </v-card-title>
                <v-card-text>
                    Ici seront les filtres
                </v-card-text>
            </v-card>
        </v-col>
        <v-col :cols="10">
            <liste-films :films="listeFilms" @changementPage="changementPage" />
        </v-col>-->

        <!-- 2.4 Ajouter les boutons pour filtrer -->
        <!-- <v-col :cols="2">
            <v-card :minHeight="600" class="ml-4 mt-4">
                <v-card-title class="mt-2 mb-4">
                    <v-icon>mdi-filter-outline</v-icon>
                    Filtrer
                </v-card-title>
                <v-card-text>
                    <v-btn v-for="i in 24" class="mx-1 my-1 prop-button px-2" elevation="2">
                        Prop {{ i }}
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col :cols="10">
            <liste-films :films="listeFilms" @changementPage="changementPage" />
        </v-col> -->

        <!-- 2.5 Afficher les genres depuis l'API -->
        <!-- <v-col :cols="2">
        <v-card class="ml-4 mt-4">
          <v-card-title class="mt-2 mb-4">
            <v-icon>mdi-filter-outline</v-icon>
            Filtrer
          </v-card-title>
          <v-card-subtitle>
            Genres
          </v-card-subtitle>
          <v-card-text>
            <v-btn v-for="genre in storeTMDBConfiguration.genres" class="mx-1 my-1 prop-button px-2"
                   elevation="2">
              {{ genre }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="10">
        <liste-films :films="listeFilms" @changementPage="changementPage" />
      </v-col> -->

        <!-- 2.6 Stocker le résultat des clicks sur les boutons -->
<!--        <v-col :cols="2">
            <v-card class="ml-4 mt-4">
                <v-card-title class="mt-2 mb-4">
                    <v-icon>mdi-filter-outline</v-icon>
                    Filtrer
                </v-card-title>
                <v-card-subtitle>
                    Genres
                </v-card-subtitle>
                <v-card-text>
                    <v-btn v-for="(genre, index) in storeTMDBConfiguration.genres" class="mx-1 my-1 prop-button px-2"
                        elevation="2" @click="majListeGenresFiltres(index)"
                        :color="listeGenresFiltres.includes(index) ? 'primary' : ''">
                        {{ genre }}
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col :cols="10">
            <liste-films :films="listeFilms" @changementPage="changementPage" />
        </v-col>-->

        <!-- 2.7.	Filtrer les films en fonction de la liste des genres sélectionnés -->
        <v-col :cols="2">
            <v-card class="ml-4 mt-4">
                <v-card-title class="mt-2 mb-4">
                    <v-icon>mdi-filter-outline</v-icon>
                    Filtrer
                </v-card-title>
                <v-card-subtitle>
                    Genres
                </v-card-subtitle>
                <v-card-text>
                    <v-btn v-for="(genre, index) in storeTMDBConfiguration.genres" class="mx-1 my-1 prop-button px-2"
                        elevation="2" @click="majListeGenresFiltres(index)"
                        :color="listeGenresFiltres.includes(index) ? 'primary' : ''">
                        {{ genre }}
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col :cols="10">
            <liste-films :films="listeFilmsFiltres" @changementPage="changementPage" />
        </v-col>
    </v-row>

    <!-- letter-spacing à enlever sur les v-btn-->
</template>

<!-- 2.4 Ajouter les boutons pour filtrer -->
<style>
.prop-button {
    border: thin solid #CCCCCC;
}
</style>
