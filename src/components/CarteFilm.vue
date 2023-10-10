<script setup lang="ts">
// Le composant qui affiche une carte de film (pour une liste de films)
import { Movie } from 'tmdb-ts'
import { computed } from 'vue'

import { useUtilisateursStore } from '@/store/utilisateurs'
import { useFavorisStore } from '@/store/favoris'

// Les dimensions d'une image de film, en pixels
// Ces valeur ne sort pas de nulle part. Elle vient d'une des largeurs possibles de "poster_sizes"
// issue de la requête https://api.themoviedb.org/3/configuration (documentation : https://developer.themoviedb.org/reference/configuration-details)
const largeurImagePixels = 154
const hauteurImagePixels = 231
// L'URL de base des images de films
const urlBaseImage = 'https://image.tmdb.org/t/p/w' + largeurImagePixels

// Définition des "propriétés" que l'on peut passer sur le composant personnalisé "<carte-film />"
const props = defineProps<{
    film: Movie // Il est obligatoire d'avoir la propriété "film"
}>()

const storeUtilisateur = useUtilisateursStore()
const storeFavoris = useFavorisStore()

// On calcule la date de sortie du film, en format français (ex: 20/12/2020)
const dateSortieFilm = computed(() => {
    return new Date().toLocaleDateString('fr-FR');
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
    <v-col cols="6" sm="4" md="3" lg="2">
        <v-card
            :to="{ name: 'DetailFilm', params: { id: film.id }}"
            class="carte-film flex-column h-100"
            >
            <v-img :src="urlBaseImage + film.poster_path" alt="Affiche du film" :height="hauteurImagePixels" cover>
            </v-img>
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
            <div class="mt-2 pa-2">
                <p class="text-subtitle-1 font-weight-bold">
                    {{ film.title }}
                </p>
                <p class="text-caption">
                    {{ dateSortieFilm }}
                </p>
            </div>
        </v-card>
    </v-col>
</template>

<style scoped>
.carte-film {
    transition: all 0.2s ease-in-out;
}

.carte-film:hover {
    transform: scale(1.05);
}

.actions-carte {
    position: absolute;
    z-index: 1;
    transform: translate(0, -50%);
}
</style>