<script setup lang="ts">
// La vue qui affiche le détail d'un film
// Correspond à l'URL /film/<id du film>

// Récupère la route actuelle, c'est à dire toutes les informations sur l'URL actuelle récupérées par Vue Router
// La route contient des informations intéressantes, notamment les paramètres de l'URL, comme le numéro de page
import { useRoute } from 'vue-router'
import { computed, inject, ref, watch } from 'vue'
import { symboleTmdb } from '@/types/symboles'
import { AppendToResponseMovieKey, Movie, MovieDetails, TMDB } from 'tmdb-ts'
import { useFavorisStore } from '@/store/favoris'


// L'URL de base des images de films
import { useUtilisateursStore } from '@/store/utilisateurs'
import { AppendToResponse } from 'tmdb-ts/dist/types'

const urlBaseImage = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2'
// L'URL de base des images de films pour les arrière-plans
const urlBackgroundImage = 'https://image.tmdb.org/t/p/w1920_and_h800_multi_faces'
// L'URL de base des images de films pour les crédits
const urlCreditImage = 'https://image.tmdb.org/t/p/w138_and_h175_face'
// L'URL de base des images de films
const urlAimerImage = 'https://image.tmdb.org/t/p/w533_and_h300_bestv2'

// On récupère le client TMDB depuis le conteneur d'injection de dépendances (voir la ligne "app.provide" dans src/main.ts)
const tmdb: TMDB = inject(symboleTmdb)!

const route = useRoute()

const storeUtilisateur = useUtilisateursStore()
const storeFavoris = useFavorisStore()

const infosAdditionnelles: ['images', 'videos', 'credits', 'recommendations', 'reviews', 'changes', 'similar', 'lists', 'release_dates', 'alternative_titles', 'external_ids', 'translations', 'watch/providers', 'keywords'] = ['images', 'videos', 'credits', 'recommendations', 'reviews', 'changes', 'similar', 'lists', 'release_dates', 'alternative_titles', 'external_ids', 'translations', 'watch/providers', 'keywords']
type DetailFilm = AppendToResponse<MovieDetails, typeof infosAdditionnelles, 'movie'>


// Le numéro de page actuel, récupéré depuis la route
const identifiantFilm = computed<number>(() => route.params.id ? Number(route.params.id as string) : 1)

const film = ref<DetailFilm | null>(null)

watch(identifiantFilm, async () => {
  const data = await tmdb.movies.details(identifiantFilm.value, infosAdditionnelles)
  film.value = data
}, { immediate: true })

function tempsConvertiEnHeureMinute (runtime: number | null | undefined): string {
  if (!runtime!) return ''
  const heure = Math.floor(runtime / 60)
  const minutes = runtime % 60
  return `${heure}h${minutes}`
}

// On calcule la date de sortie du film, en format français (ex: 20/12/2020)
const dateSortieFilm = computed(() => {
  return new Date().toLocaleDateString('fr-FR')
})

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

const crewDetails = computed(() => {
  if (!film.value) return null
  const crew = film.value.credits.crew

  const filteredJobs = ['Director', 'Screenplay', 'Story', 'Writer', 'Characters', 'Novel']
  const importantJobs = crew.filter(member => filteredJobs.includes(member.job))
  const mergedJobs = importantJobs.reduce((acc, member) => {
    const existingMember = acc.find(m => m.id === member.id)
    if (existingMember) {
      existingMember.job = `${existingMember.job},${member.job}`
    } else {
      acc.push({
        id: member.id,
        name: member.name,
        job: member.job
      })
    }
    return acc
  }, [] as {id: number, name: string, job: string }[])

  return mergedJobs
})

/**
 * Bascule le film entre les favoris et les non-favoris
 */
function basculerFavori () {
  if (!storeUtilisateur.utilisateurConnecte || !infosGeneralesFilm.value) {
    return
  }
  if (storeFavoris.estFavori(infosGeneralesFilm.value)) {
    storeFavoris.retirerFavori(infosGeneralesFilm.value)
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
  <div v-if="!!film">
    <v-parallax class="tototo" :src="urlBackgroundImage + film?.backdrop_path">
      <v-container class="d-flex justify-center align-center h-100">
        <v-row>
          <v-col cols="6">
            <div class="d-flex flex-column fill-height justify-center text-white">
              <h1 class="text-h4 font-weight-bold">{{ film?.title }}</h1>
              <p class="mb-2 my-2 d-flex align-center">
                <span class="ma-2 ml-0">{{ dateSortieFilm }} (FR)</span>
                <span class="text-h5">•</span>
                  <span class="ma-2">{{film.genres.map(genre => genre.name).join(', ')}}</span>
                <span class="text-h5">•</span>
                <span class="ma-2">{{ tempsConvertiEnHeureMinute(film?.runtime) }}</span>
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
                         class="ma-2 bg-primary"
                         size="x-large">
                    <v-icon v-bind="proprietesIconeAVoir" class="mr-2"/>
                    Ajouter à la watchlist
                  </v-btn>
                </div>
              </div>
              <p class="text-xl-h5 font-weight-bold mb-2">Synopsis</p>
              <p class="subheading">
                {{ film?.overview }}
              </p>
              <div class="mt-5">
                <p v-for="membre in crewDetails"
                     :key="membre.id">
                  {{ membre.name }} - {{ membre.job }}
                </p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-parallax>

    <v-container class="mt-16">
      <h2>Distribution</h2>
      <v-slide-group
          center-active
          show-arrows
      >
        <v-slide-group-item
            v-for="(value, index) in film.credits.cast"
            :key="index"
            v-slot="{ isSelected, toggle }"
        >
          <v-card
              class="ma-4"
              height="301"
              width="167"
              @click="toggle"
          >
            <v-img
                class="align-end text-white"
                :src="urlCreditImage + value?.profile_path"
                cover
            >
            </v-img>
            <v-card-text>
              <h3>{{ value.name }}</h3>
              <div>{{ value.original_name }}</div>
            </v-card-text>

          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-container>

    <v-container class="mt-16">
      <h2>Vous pourrier aimer</h2>
      <v-slide-group
          center-active
          show-arrows
      >
        <v-slide-group-item
            v-for="(value, index) in film.recommendations.results"
            :key="index"
            v-slot="{ isSelected, toggle }"
        >
          <v-card
              class="ma-4"
              width="393"
              @click="toggle"
          >
            <v-img
                class="align-end text-white"
                :src="urlAimerImage + value?.backdrop_path"
                cover
            >
              <v-card-title>
                <v-chip class="bg-secondary font-weight-bold rounded pa-1">
                  {{ value?.vote_average.toFixed(1) }}/10
                </v-chip>
              </v-card-title>
            </v-img>
            <v-card-text>
              <span class="text-primary">{{new Date(value.release_date).getFullYear()}} / </span>
              <h3>{{ value.title }}</h3>
            </v-card-text>

          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-container>
  </div>
</template>

<style scoped>

.v-parallax:deep(.v-responsive__content) {
  background: rgb(17, 17, 17);
  background: linear-gradient(95deg, rgba(var(--v-theme-background), 1) 10%, rgba(255, 255, 255, 0) 100%);

}
</style>
