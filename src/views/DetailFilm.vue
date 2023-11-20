<script setup lang="ts">
// La vue qui affiche le détail d'un film
// Correspond à l'URL /film/<id du film>

import {computed, inject, ref, watch} from 'vue'
import {symboleTmdb} from '@/types/symboles'
import {Movie, MovieDetails, TMDB} from 'tmdb-ts'
import {useFavorisStore} from '@/store/favoris'
import CarteFilm from '@/components/CarteFilm.vue'

import {useUtilisateursStore} from '@/store/utilisateurs'
import {AppendToResponse} from 'tmdb-ts/dist/types'

// L'URL de base des images de films pour les arrière-plans
const urlBackgroundImage = 'https://image.tmdb.org/t/p/w1920_and_h800_multi_faces'
// L'URL de base des images de films pour les crédits
const urlCreditImage = 'https://image.tmdb.org/t/p/w138_and_h175_face'

// On récupère le client TMDB depuis le conteneur d'injection de dépendances (voir la ligne "app.provide" dans src/main.ts)
const tmdb: TMDB = inject(symboleTmdb)!

const storeUtilisateur = useUtilisateursStore()
const storeFavoris = useFavorisStore()

const infosAdditionnelles: ['images', 'videos', 'credits', 'recommendations', 'reviews', 'changes', 'similar', 'lists', 'release_dates', 'alternative_titles', 'external_ids', 'translations', 'watch/providers', 'keywords'] = ['images', 'videos', 'credits', 'recommendations', 'reviews', 'changes', 'similar', 'lists', 'release_dates', 'alternative_titles', 'external_ids', 'translations', 'watch/providers', 'keywords']
type DetailFilm = AppendToResponse<MovieDetails, typeof infosAdditionnelles, 'movie'>

// Les propriétés passées par le routeur (voir src/router/index.ts)
const props = defineProps<{
    id: number
}>();

const film = ref<DetailFilm | null>(null)
const isLoading = ref(true)

// Regarde les changements dans le numéro de film et charge les détails du film depuis l'API TMDB
watch(() => props.id, async () => {
  isLoading.value = true
  try {
    film.value = await tmdb.movies.details(props.id, infosAdditionnelles, 'fr-FR')
  } catch (error) {
    // Gérer l'erreur (par exemple, afficher un message d'erreur)
    console.error(error)
  } finally {
    isLoading.value = false
  }
}, { immediate: true })

// Fonction qui permet de convertir la durée du film en heure et minute
const dureeHeureMinutes = computed(() => {
  if (!film.value?.runtime) return ''
  const dureeMinutes = film.value?.runtime
  const heures = Math.floor(dureeMinutes / 60)
  const minutes = dureeMinutes % 60
  return `${heures}h${minutes}`
})

// On calcule la date de sortie du film, en format français (ex: 20/12/2020)
const dateSortieFilm = computed(() => {
  return new Date().toLocaleDateString('fr-FR')
})

/**
 * Fonction qui permet de recuperer les informations sur le film pour garder le même type Movie
 */
const infosGeneralesFilm = computed<Movie | null>(() => {
  const valeurFilm = film?.value
  if (!valeurFilm) return null
  return {
    id: valeurFilm?.id,
    poster_path: valeurFilm?.poster_path ?? '',
    adult: valeurFilm?.adult,
    overview: valeurFilm?.overview,
    release_date: valeurFilm?.release_date,
    genre_ids: valeurFilm?.genres?.map(genre => genre.id),
    original_title: valeurFilm?.original_title,
    original_language: valeurFilm?.original_language,
    title: valeurFilm?.title,
    backdrop_path: valeurFilm?.backdrop_path,
    popularity: valeurFilm?.popularity,
    vote_count: valeurFilm?.vote_count,
    video: valeurFilm?.video,
    vote_average: valeurFilm?.vote_average
  }
})

/**
 * Les propriétés à appliquer sur le bouton "favori"
 */
const proprietesIconeFavoris = computed(() => {
  if (!infosGeneralesFilm.value) return {
    icon: 'mdi-star-outline'
  }
  if (storeFavoris.estFavori(infosGeneralesFilm.value)) {
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
 * Permet de faciliter la récupération des jobs par acteur qui ont comme paramètre ['Director', 'Screenplay', 'Story', 'Writer', 'Characters', 'Novel']
 */
const detailsEquipage = computed(() => {
  if (!film.value) return null
  const crew = film.value.credits.crew

  const fonctionsAffichees = ['Director', 'Screenplay', 'Story', 'Writer', 'Characters', 'Novel']
  // La liste des personnes qui ont une fonction parmi la liste ci-dessus
  const personnesAvecFonctionAAfficher = crew.filter(membre => fonctionsAffichees.includes(membre.job))

  const resultatDetailsEquipage = [] as {id: number, nom: string, fonction: string }[]
  for (const membre of personnesAvecFonctionAAfficher) {
    // Cherche si ce membre fait déjà partie de la liste des résultats
    const membreExistent = resultatDetailsEquipage.find(m => m.id === membre.id)
    if (membreExistent) {
      // Si il fait déjà partie de la liste, on lui rajoute simplement une fonction
      membreExistent.fonction = `${membreExistent.fonction},${membre.job}`
    } else {
      // Sinon, on ajoute une nouvelle personne à la liste
      resultatDetailsEquipage.push({
        id: membre.id,
        nom: membre.name,
        fonction: membre.job
      })
    }
  }

  return resultatDetailsEquipage
})

/**
 * Bascule le film entre les favoris et les non-favoris
 */
function basculerFavori () {
  if (!storeUtilisateur.utilisateurConnecte || !infosGeneralesFilm.value) {
    return
  }
  if (storeFavoris.estFavori(infosGeneralesFilm.value)) {
    storeFavoris.ajouterFavori(infosGeneralesFilm.value)
  } else {
    storeFavoris.ajouterFavori(infosGeneralesFilm.value)
  }
}

/**
 * Bascule le film entre les à voir et les pas à voir
 */
function basculerAVoir () {
  if (!storeUtilisateur.utilisateurConnecte || !infosGeneralesFilm.value) {
    return
  }
  if (storeFavoris.estAVoir(infosGeneralesFilm.value)) {
    storeFavoris.retirerAVoir(infosGeneralesFilm.value)
  } else {
    storeFavoris.ajouterAVoir(infosGeneralesFilm.value)
  }
}

/**
 * Les propriétés à appliquer sur le bouton "à voir"
 */
const proprietesIconeAVoir = computed(() => {
  if (!infosGeneralesFilm.value) return null
  if (storeFavoris.estAVoir(infosGeneralesFilm.value)) {
    return {
      icon: 'mdi-check',
      color: 'black'
    }
  }
})


</script>
<template>
  <!--  On affiche un loader si le composant est en chargement -->
  <v-container v-if="isLoading" class="loader d-flex align-center justify-center h-100">
    <v-progress-circular
      v-if="isLoading"
      indeterminate
      size="150"
      width="7"
      color="primary"
    ></v-progress-circular>
  </v-container>
  <!--  Si le film est disponible, on affiche les détails du film  -->
  <div v-else-if="film && !isLoading">
    <v-parallax :src="urlBackgroundImage + film.backdrop_path">
      <v-container class="d-flex justify-center align-center h-100">
        <v-row class="my-16">
          <v-col cols="11" md="10" lg="8">
            <div class="d-flex flex-column fill-height justify-center text-white">
              <h1 class="text-h4 font-weight-bold">{{ film?.title }}</h1>
              <p class="mb-2 my-2 d-flex align-center">
                <span class="ma-2 ml-0">{{ dateSortieFilm }} (FR)</span>
                <span class="text-h5">•</span>
                <span class="ma-2">{{film.genres.map(genre => genre.name).join(', ')}}</span>
                <span class="text-h5">•</span>
                <span class="ma-2">{{ dureeHeureMinutes }}</span>
              </p>
              <div class="d-flex align-center justify-lg-space-between mb-4">
                <div class="ma-2 ml-0">
                  <v-chip class="bg-secondary font-weight-bold rounded me-2">
                    {{ film?.vote_average.toFixed(1) }}/10
                  </v-chip>
                  Note des utilisateurs
                </div>
                <div>
                  <v-btn v-if="storeUtilisateur.utilisateurConnecte" @click.prevent="basculerFavori" min-width="auto"
                         variant="text" size="50" class="ma-2">
                    <v-icon v-bind="proprietesIconeFavoris"/>
                  </v-btn>
                  <v-btn v-if="storeUtilisateur.utilisateurConnecte" @click.prevent="basculerAVoir"
                         class="ma-2"
                         color="primary"
                         size="x-large">
                    <v-icon v-bind="proprietesIconeAVoir" class="mr-2"/>
                    À voir
                  </v-btn>
                </div>
              </div>
              <p class="text-xl-h5 font-weight-bold mb-2">Synopsis</p>
              <p class="subheading">
                {{ film?.overview }}
              </p>
              <v-row class="mt-5">
                <v-col cols="3" class="membre" v-for="membre in detailsEquipage"
                     :key="membre.id">
                  <p>
                    <span class="font-weight-bold mb-2 d-block">{{ membre.nom }}</span>
                    {{ membre.fonction }}
                  </p>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-parallax>

    <!--  On affiche la distribution du films (les acteurs)  -->
    <v-container class="mt-16">
      <h2>Distribution</h2>
      <v-slide-group
        center-active
      >
        <!--  On boucle sur chacun des acteurs présents dans la distribution du film -->
        <v-slide-group-item
          v-for="acteur in film.credits.cast"
          :key="acteur.id"
          v-slot="{ toggle }"
        >
          <v-card
            class="ma-4"
            @click="toggle"
            width="138"
          >
            <!--  On affiche la photo de l'acteur  -->
            <v-img
              class="align-end text-white"
              :src="acteur?.profile_path ? urlCreditImage + acteur?.profile_path : 'https://placehold.co/138x175?text=❌'"
              width="138"
              height="175"
              cover
            >
            </v-img>
            <v-card-text>
              <!--  Nom de l'acteur  -->
              <h3>{{ acteur.name }}</h3>
              <!--  Nom du personnage joué par l'acteur  -->
              <div>{{ acteur.name }}</div>
            </v-card-text>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-container>
    <!--  On affiche les recommendations du films  -->
    <v-container class="mt-16">
      <h2>Vous pourriez aimer</h2>
      <v-slide-group
        center-active
      >
        <v-slide-group-item
          v-for="recommendation in film.recommendations.results"
          :key="recommendation.id"
        >
          <div class="pa-2" style="width:200px">
            <carte-film :film="(recommendation as Movie)" />
          </div>
        </v-slide-group-item>
      </v-slide-group>
    </v-container>
  </div>
  <div v-else>
    <!-- Gérez le cas où les données ne sont pas disponibles ou où une erreur s'est produite -->
    <p>Les détails du film ne sont pas disponibles.</p>
  </div>
</template>

<style scoped>
.membre {
  min-width: 180px;
}

.v-parallax:deep(.v-responsive__content) {
  background: rgb(17, 17, 17);
  background: linear-gradient(95deg, rgba(var(--v-theme-background), 0.9) 30vw, rgba(255, 255, 255, 0) 100%);
}
</style>
