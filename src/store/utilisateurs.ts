import { defineStore } from 'pinia'
import { readonly, ref, watch } from 'vue'

/**
 * Store pour les utilisateurs.
 * 
 * Dans une vraie application, les données seraient stockées sur un serveur et non pas dans le navigateur directement.
 * Vu que nous n'avons pas de côté serveur (ou "backend"), nous allons stocker les données dans le navigateur, dans un
 * emplacement spécialement conçu pour stocker des données, qui vont être persistées entre les rechargements de page,
 * il s'agit du "localStorage".
 */
export const useUtilisateursStore = defineStore('utilisateurs', () => {
    // Récupère les utilisateurs et leurs informations depuis le localStorage.
    const utilisateurs = ref<Utilisateur[]>(JSON.parse(window.localStorage.getItem('utilisateurs') ?? '[]'))

    const utilisateurConnecte = ref<Utilisateur | null>(JSON.parse(window.sessionStorage.getItem('utilisateurConnecte') ?? 'null'))

    /**
     * Teste si un utilisateur existe déjà avec l'identifiant fourni
     *
     * @param identifiant L'identifiant à chercher
     * @returns Vrai (true) si l'utilisateur existe, faux (false) sinon.
     */
    function utilisateurExiste(identifiant: string) {
        return utilisateurs.value.some(utilisateur => utilisateur.identifiant === identifiant)
    }

    /**
     * Enregistrer un utilisateur, pour qu'il puisse se connecter par la suite avec l'identifiant et le mot de passe choisi.
     * @param utilisateur L'utilisateur à enregistrer.
     */
    function enregistrerUtilisateur(utilisateur: Utilisateur) {
        utilisateurs.value.push(utilisateur)
    }

    /**
     * Connecte un utilisateur avec l'identifiant et le mot de passe fourni.
     * 
     * NOTE: Ici, c'est une application de démonstration, donc la pseudo-authentification se fait
     * du côté du navigateur (frontend). Dans une vraie application, cela ne se passe jamais comme ça
     * et les identifiants sont transmis sur le réseau et validés par un serveur.
     * 
     * @returns L'utilisateur connecté si le couple identifiant/mot de passe fonctionne, null sinon.
     */
    function connecter(identifiant: string, motDePasse: string) {
        const utilisateur = utilisateurs.value.find(utilisateur => utilisateur.identifiant === identifiant && utilisateur.motDePasse === motDePasse)
        if (utilisateur) {
            utilisateurConnecte.value = utilisateur
            return utilisateur
        }

        return null
    }

    /**
     * Déconnecte l'utilisateur connecté.
     */
    function deconnecter() {
        utilisateurConnecte.value = null
    }

    watch(() => utilisateurs.value, () => {
        window.localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs.value))
    }, { deep: true })

    watch(utilisateurConnecte, () => {
        window.sessionStorage.setItem('utilisateurConnecte', JSON.stringify(utilisateurConnecte.value))
    })

    return {
        utilisateurConnecte: readonly(utilisateurConnecte),
        utilisateurExiste,
        enregistrerUtilisateur,
        connecter,
        deconnecter
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