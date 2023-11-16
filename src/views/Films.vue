<script setup lang="ts">
// La vue qui affiche la liste des films les mieux notés
// Correspond à l'URL /films/<numéro de page>

// Liste d'imports
import { symboleTmdb } from '@/types/symboles'
import { inject, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ListeFilms from '@/components/ListeFilms.vue'
import { ListeFilmsPaginee } from '@/types/interfaces'

// Le routeur, qui permet de naviguer vers une autre page via du code javascript
const routeur = useRouter()

// On récupère le client TMDB depuis le conteneur d'injection de dépendances (voir la ligne "app.provide" dans src/main.ts)
const tmdb = inject(symboleTmdb)!

// Les propriétés passées par le routeur (voir src/router/index.ts)
const props = defineProps<{
    page: number
}>();

// La liste des films à afficher. Initialisée à la valeur spéciale "null" pour indiquer que l'on est en cours de chargement.
// Une fois la liste chargée, la valeur est initialisée à la liste des films.
const listeFilms = ref<ListeFilmsPaginee|null>(null)

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
    routeur.push({ name: 'Films', params: { page: numPage }})
}
</script>

<template>
    <liste-films :films="listeFilms" @changementPage="changementPage" />
</template>
