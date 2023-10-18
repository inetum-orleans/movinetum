import { symboleTmdb } from '@/types/symboles'
import { defineStore } from 'pinia'
import { Configuration } from 'tmdb-ts'
import { inject, ref } from 'vue'

export const useTMDBConfigurationStore = defineStore('tmdb-configuration', () => {
    // On récupère le client TMDB depuis le conteneur d'injection de dépendances (voir la ligne "app.provide" dans src/main.ts)
    const tmdb = inject(symboleTmdb)!

    const genres = ref<Record<number, string>>({})
    const configuration = ref<Configuration | null>(null)

    async function chargerConfiguration() {
        // On récupère la configuration depuis l'API TMDB
        configuration.value = await tmdb.configuration.getCurrent()

        // On récupère les genres depuis l'API TMDB
        const genresFilms = await tmdb.genres.movies()
        const resultat: Record<number, string> = {}
        genresFilms.genres.forEach(genre => {
            resultat[genre.id] = genre.name
        })

        genres.value = resultat
    }

    chargerConfiguration()

    /**
     * En fonction d'un identifiant de genre, passé en paramètre, cette fonction retourne le nom du genre, comme "Comédie" ou "Thriller"
     */
    function traduireGenre(id: number) {
        return genres.value[id] ?? 'Inconnu'
    }

    /**
     * Renvoie un objet contenant les chemins vers l'image du poster, ainsi que son ratio.
     * On renvoie plusieurs formats d'image, pour que le navigateur puisse choisir le plus adapté, en fonction de la zone où sera placée l'image.
     * 
     * @param cheminPoster Le chemin relatif vers l'image du poster, tel que renvoyé par l'API TMDB.
     */
    function calculerCheminsImagePoster(cheminPoster: string | null | undefined) {
        if(!configuration.value || !cheminPoster) {
            // La page n'est pas encore bien chargée, ou le poster n'est pas disponible, affiche une image en erreur
            return {
                src: 'https://placehold.co/200x300?text=❌',
                aspect: 2/3
            }
        }

        const config = configuration.value

        return {
            src: `${config.images.secure_base_url}original${cheminPoster}`,
            srcset: config.images.poster_sizes.map(taille => {
                if(taille === 'original') {
                    return `${config.images.secure_base_url}${taille}${cheminPoster}`
                }
                const largeur = parseInt(taille.substring(1))
                return `${config.images.secure_base_url}${taille}${cheminPoster} ${largeur}w`
            }).join(','),
            aspect: 2/3
        }
    }

    return {
        traduireGenre,
        calculerCheminsImagePoster
    }
})