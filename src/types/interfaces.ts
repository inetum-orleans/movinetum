/**
 * @fileoverview Ce fichier contient les "interfaces" pour typescript utilisées dans l'application.
 * 
 * Une interface en typescript décrit la forme d'un objet, c'est à dire les propriétés que l'on va pouvoir utiliser dessus.
 */

import { Movie } from "tmdb-ts";

/**
 * Interface pour décrire une page de la liste de films, telle qu'elle est renvoyée par l'API tmdb.
 */
export interface ListeFilmsPaginee {
    /**
     * La page actuelle de la liste.
     */
    page: number;
    /**
     * Les résultats à afficher à l'écran
     */
    results: Movie[];
    /**
     * Le nombre total de pages de la liste.
     */
    total_pages: number;
    /**
     * Le nombre total de résultats de la liste.
     */
    total_results: number;
}