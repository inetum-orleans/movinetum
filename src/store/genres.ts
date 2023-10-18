import { symboleTmdb } from '@/types/symboles'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'

export const useGenresStore = defineStore('genres', () => {
    // On récupère le client TMDB depuis le conteneur d'injection de dépendances (voir la ligne "app.provide" dans src/main.ts)
    const tmdb = inject(symboleTmdb)!

    const genres = ref<Record<number, string>>({})

    // On récupère les genres depuis l'API TMDB
    async function chargerGenres() {
        const genresFilms = await tmdb.genres.movies()
        const resultat: Record<number, string> = {}
        genresFilms.genres.forEach(genre => {
            resultat[genre.id] = genre.name
        })

        genres.value = resultat
    }

    chargerGenres()

    
    function traduireGenre(id: number) {
        return genres.value[id] ?? 'Inconnu'
    }

    return {
        traduireGenre
    }
})