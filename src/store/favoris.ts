import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useUtilisateursStore } from './utilisateurs'
import { Movie } from 'tmdb-ts'

interface ListesFavorisUtilisateur {
    favoris: Movie[],
    aVoir: Movie[]
}

/**
 * Store pour gérer les favoris et la liste de films à voir de l'utilisateur actuellement connecté.
 */
export const useFavorisStore = defineStore('favoris', () => {
    const storeUtilisateur = useUtilisateursStore()

    const listesFavoris = ref<ListesFavorisUtilisateur | null>(null)

    const favoris = computed(() => listesFavoris.value?.favoris ?? [])
    const aVoir = computed(() => listesFavoris.value?.aVoir ?? [])

    function ajouterFavori(film: Movie) {
        if (!listesFavoris.value) {
            // L'utilisateur n'est pas connecté
            return
        }
        listesFavoris.value.favoris.push(film)
    }

    function retirerFavori(film: Movie) {
        if (!listesFavoris.value) {
            // L'utilisateur n'est pas connecté
            return
        }
        listesFavoris.value.favoris = listesFavoris.value.favoris.filter(f => f.id !== film.id)
    }

    function estFavori(film: Movie) {
        if (!listesFavoris.value) {
            // L'utilisateur n'est pas connecté
            return false
        }
        return listesFavoris.value.favoris.some(f => f.id === film.id)
    }

    function ajouterAVoir(film: Movie) {
        if (!listesFavoris.value) {
            // L'utilisateur n'est pas connecté
            return
        }
        listesFavoris.value.aVoir.push(film)
    }

    function retirerAVoir(film: Movie) {
        if (!listesFavoris.value) {
            // L'utilisateur n'est pas connecté
            return
        }
        listesFavoris.value.aVoir = listesFavoris.value.aVoir.filter(f => f.id !== film.id)
    }

    function estAVoir(film: Movie) {
        if (!listesFavoris.value) {
            // L'utilisateur n'est pas connecté
            return false
        }
        return listesFavoris.value.aVoir.some(f => f.id === film.id)
    }

    // Lorsque l'utilisateur connecté change, on charge sa liste de favoris
    watch(() => storeUtilisateur.utilisateurConnecte, (utilisateurConnecte) => {
        if (!utilisateurConnecte) {
            listesFavoris.value = null
            return
        }
        listesFavoris.value = JSON.parse(window.localStorage.getItem(`favoris-${utilisateurConnecte.identifiant}`) ?? 'null') ?? {
            favoris: [],
            aVoir: []
        }
    }, { immediate : true })

    // Lorsque l'on change les favoris, on met à jour la liste de favoris de l'utilisateur connecté
    watch(() => listesFavoris.value, (nouvellesListesFavoris) => {
        // Lorsque les favoris changent, on met à jour le localStorage pour les sauvegarder.
        if (!nouvellesListesFavoris || !storeUtilisateur.utilisateurConnecte) {
            // Cela signifie que l'on n'a pas d'utilisateur connecté, il n'y a rien à sauvegarder.
            return
        }
        window.localStorage.setItem(`favoris-${storeUtilisateur.utilisateurConnecte.identifiant}`, JSON.stringify(nouvellesListesFavoris))
    }, { deep: true })

    return {
        favoris,
        aVoir,
        ajouterFavori,
        retirerFavori,
        estFavori,
        ajouterAVoir,
        retirerAVoir,
        estAVoir
    }
})


/**
 * Définit le format d'un objet "utilisateur".
 */
export interface Utilisateur {
    identifiant: string,
    /**
     * Mot de passe de l'utilisateur.
     * Ici, c'est une application de démonstration, donc nous stockons le mot de passe en clair.
     * Dans une vraie application, le mot de passe serait chiffré.
     */
    motDePasse: string,
    nom: string,
    prenom: string,
    email: string,
    dateDeNaissance: string,
}