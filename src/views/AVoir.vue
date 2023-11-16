<script setup lang="ts">
// La vue qui affiche la liste des films stockés en favoris
// Correspond à l'URL /favoris/<numéro de page>

// Liste d'imports
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ListeFilms from '@/components/ListeFilms.vue'
import { ListeFilmsPaginee } from '@/types/interfaces'
import { useUtilisateursStore } from '@/store/utilisateurs'
import { useFavorisStore } from '@/store/favoris'

const filmsParPage = 20

// Le routeur, qui permet de naviguer vers une autre page via du code javascript
const routeur = useRouter()

const storeUtilisateur = useUtilisateursStore()
const storeFavoris = useFavorisStore()

// Les propriétés passées par le routeur (voir src/router/index.ts)
const props = defineProps<{
    page: number
}>();

// La liste des films à afficher. Initialisée à la valeur spéciale "null" pour indiquer que l'on est en cours de chargement.
// Une fois la liste chargée, la valeur est initialisée à la liste des films.
const listeFilms = ref<ListeFilmsPaginee|null>(null)

watch(() => [props.page, storeUtilisateur.utilisateurConnecte, ...storeFavoris.aVoir], async () => {
    // Lorsque l'on change de page ou que l'utilisateur se déconnecte ou que la liste des favoris change, on déclenche cette fonction de mise à jour.
    // Etant donné que j'ai marqué immediate:true, cette fonction est aussi appelée immédiatement au premier chargement.

    if(!storeUtilisateur.utilisateurConnecte) {
        routeur.push({ name: 'Accueil' })
        return
    }

    const films = storeFavoris.aVoir;
    listeFilms.value = {
        page: props.page,
        total_pages: Math.ceil(films.length / filmsParPage),
        total_results: films.length,
        results: films.slice((props.page - 1) * filmsParPage, props.page * filmsParPage)
    }
}, { immediate: true })

/**
 * Déclenche la "navigation" vers la page passée en paramètre
 * Cette fonction est appelée lorsqu'on change de page via le composant de pagination
 */
function changementPage(numPage: number) {
    routeur.push({ name: 'AVoir', params: { page: numPage }})
}
</script>

<template>
    <liste-films :films="listeFilms" @changementPage="changementPage" />
</template>
