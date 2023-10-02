import type { TMDB } from 'tmdb-ts'
import type { InjectionKey } from 'vue'

export const tmdbSymbol = Symbol() as InjectionKey<TMDB>;