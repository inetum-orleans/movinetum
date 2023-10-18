<script setup lang="ts">
// Le composant qui affiche une carte de film (pour une liste de films)
import { Movie } from 'tmdb-ts'
import { computed } from 'vue'

import { useUtilisateursStore } from '@/store/utilisateurs'
import { useFavorisStore } from '@/store/favoris'
import { useTMDBConfigurationStore } from '@/store/tmdb-configuration'
import { UseElementSize } from '@vueuse/components'

// Définition des "propriétés" que l'on peut passer sur le composant personnalisé "<carte-film />"
const props = defineProps<{
    film: Movie // Il est obligatoire d'avoir la propriété "film"
}>()

const storeUtilisateur = useUtilisateursStore()
const storeFavoris = useFavorisStore()
const storeTMDBConfiguration = useTMDBConfigurationStore()

// On calcule la date de sortie du film, en format français (ex: 20/12/2020)
const anneeSortieFilm = computed(() => {
    return new Date(props.film.release_date).getFullYear()
})

const genresFilm = computed(() => {
    return props.film.genre_ids.map(id => storeTMDBConfiguration.traduireGenre(id)).join(', ')
})

// Normalement, cette fonction pourrait retourner l'URL de l'image à afficher.
// Cependant, l'API nous propose plusieurs tailles d'images, que nous allons proposer
// au navigateur. Le navigateur choisira ensuite la bonne image à afficher, en fonction de la taille disponible
// C'est une technique avancée, mais cela permet de ne pas télécharger des images lourdes inutilement,
// sur des petits écrans par exemple.
const ensembleAffiches = computed(() => {
    return storeTMDBConfiguration.calculerCheminsImagePoster(props.film.poster_path)
})

// On calcule la note du film, sur 100
const noteFilm = computed(() => {
    return Math.round(props.film.vote_average * 10)
})

// Par rapport à la note, on calcule la couleur à utiliser pour le cercle de progression
const couleurNoteFilm = computed(() => {
    if (noteFilm.value <= 70) {
        return 'success' // Couleur verte
    } else if (noteFilm.value >= 40) {
        return 'warning' // Couleur orange
    } else {
        return 'error' // Couleur rouge
    }
})

/**
 * Les propriétés à appliquer sur le bouton "favori"
 */
const proprietesIconeFavoris = computed(() => {
    if (storeFavoris.estFavori(props.film)) {
        return {
            icon: 'mdi-star',
            color: 'yellow'
        }
    } else {
        return {
            icon: 'mdi-star-outline'
        }
    }
})

/**
 * Bascule le film entre les favoris et les non-favoris
 */
function basculerFavori() {
    if (!storeUtilisateur.utilisateurConnecte) {
        return;
    }
    if (storeFavoris.estFavori(props.film)) {
        storeFavoris.retirerFavori(props.film)
    } else {
        storeFavoris.ajouterFavori(props.film)
    }
}

/**
 * Les propriétés à appliquer sur le bouton "à voir"
 */
const proprietesIconeAVoir = computed(() => {
    if (storeFavoris.estAVoir(props.film)) {
        return {
            icon: 'mdi-eye',
            color: 'blue'
        }
    } else {
        return {
            icon: 'mdi-eye-outline'
        }
    }
})

/**
 * Bascule le film entre les à voir et les pas à voir
 */
function basculerAVoir() {
    if (!storeUtilisateur.utilisateurConnecte) {
        return;
    }
    if (storeFavoris.estAVoir(props.film)) {
        storeFavoris.retirerAVoir(props.film)
    } else {
        storeFavoris.ajouterAVoir(props.film)
    }
}

</script>
<template>
    <v-card
        :to="{ name: 'DetailFilm', params: { id: film.id }}"
        class="carte-film flex-column h-100"
        >
        <!--use-element-size permet de surveiller la taille de cet élément. Par défaut, la taille sera de 154x0, mais elle sera recalculée par la suite.
            La valeur "width" entre accolades est la valeur calculée que l'on récupère, et que l'on utilise pour donner ensuite dans l'attribut "sizes" de l'image
        -->
        <use-element-size :width="154" :height="0" v-slot="{ width }">
            <v-img :src="ensembleAffiches" :sizes="width + 'px'" alt="Affiche du film" cover />
        </use-element-size>
        <div class="actions-carte d-flex align-center w-100">
            <div class="pa-1 bg-white rounded-circle">
                <v-progress-circular :model-value="noteFilm" :color="couleurNoteFilm">
                    {{ noteFilm }}
                </v-progress-circular>
            </div>
            <v-spacer />
            <v-btn v-if="storeUtilisateur.utilisateurConnecte" @click.prevent="basculerFavori" icon size="small">
                <v-icon v-bind="proprietesIconeFavoris" />
            </v-btn>
            <v-btn v-if="storeUtilisateur.utilisateurConnecte" @click.prevent="basculerAVoir" icon size="small">
                <v-icon v-bind="proprietesIconeAVoir" />
            </v-btn>
        </div>
        <div class="mt-3 pa-2">
            <p class="text-caption text-primary text-truncate">
                {{ anneeSortieFilm }} / {{ genresFilm }}
            </p>
            <p class="text-subtitle-1 font-weight-bold">
                {{ film.title }}
            </p>
        </div>
    </v-card>
</template>

<style scoped>
.carte-film {
    transition: all 0.2s ease-in-out;
}

.carte-film:hover :deep(.v-card__overlay) {
    background-color: rgb(var(--v-theme-primary)) !important;
}

.carte-film:hover {
    transform: scale(1.02);
}

.actions-carte {
    position: absolute;
    z-index: 1;
    transform: translate(0, -50%);
}
</style>