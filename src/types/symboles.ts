/**
 * @fileoverview Fichier contenant les symboles de l'application.
 * Un symbole, c'est un identifiant unique, qui peut être utilisé un peu partout dans l'application.
 */
import type { TMDB } from 'tmdb-ts'
import type { InjectionKey } from 'vue'

// Symbole pour l'API TMDB
export const symboleTmdb = Symbol() as InjectionKey<TMDB>;