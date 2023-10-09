<script setup lang="ts">
import { ref } from 'vue'
import { useUtilisateursStore, Utilisateur } from '@/store/utilisateurs'
import { SubmitEventPromise } from 'vuetify/lib/framework.mjs'
import { useRouter } from 'vue-router'

// La page d'inscription

const routeur = useRouter()
const storeUtilisateur = useUtilisateursStore()

function construireUtilisateurParDefaut() {
    return {
        identifiant: '',
        motDePasse: '',
        nom: '',
        prenom: '',
        email: '',
        dateDeNaissance: '1900-01-01',
    }
}

const utilisateur = ref<Utilisateur>(construireUtilisateurParDefaut())

/**
 * Lorsque le formulaire est envoyé
 * 
 * @param evenement Il s'agit d'un objet "technique" fourni par "Vuetify", qui nous permet de valider que le formulaire est bien valide,
 * par rapport aux règles de validations que l'on a données.
 */
async function envoyer(evenement: SubmitEventPromise) {
    if (!(await evenement).valid) {
        // Le formulaire n'est pas valide, on réinitialise les valeurs
        return
    }

    // On enregistre l'utilisateur dans le store
    // Dans la vraie vie, on enverrait ça à une "API", c'est à dire à un logiciel sur un serveur, qui se chargerait d'enregistrer l'utilisateur dans une base de données
    // et probablement d'envoyer un e-mail de confirmation.
    storeUtilisateur.enregistrerUtilisateur(utilisateur.value)
    routeur.push('/')
}

/**
 * Réinitialise les valeurs du formulaire
 */
function reinitialiser() {
    utilisateur.value = construireUtilisateurParDefaut()
}

// Règles de validation

/**
 * Règle de validation qui indique une erreur si la valeur passée en entrée est vide
 */
function regleRequis(valeur: string) {
    if (valeur === '') {
        return 'Ce champ est obligatoire'
    }
    return true
}

/**
 * Règle de validation sur le champ nom qui indique une erreur si l'identifiant est déjà utilisé
 */
function regleIdentifiantUnique(identifiant: string) {
    if (storeUtilisateur.utilisateurExiste(identifiant)) {
        return 'Cet identifiant est déjà utilisé'
    }
    return true
}

/**
 * Règle de validation sur le champ nom qui indique une erreur si le nom n'est pas écrit en majuscule
 */
function regleNom(nom: string) {
    if (nom.toUpperCase() !== nom) {
        return 'Le nom doit être en majuscules'
    }
    return true
}

/**
 * Règle de validation sur le champ prénom qui indique une erreur si le prénom n'est pas écrit en minuscules, sauf la première lettre
 */
function reglePrenom(prenom: string) {
    if (prenom[0].toUpperCase() !== prenom[0]) {
        return 'Le prénom doit commencer par une majuscule'
    }
    if (prenom.slice(1).toLowerCase() !== prenom.slice(1)) {
        return 'Le prénom doit être en minuscules, sauf la première lettre'
    }
    return true
}

/**
 * Règle de validation sur le champ mot de passe qui indique une erreur si le mot de passe ne respecte pas les règles de validation
 */
function regleMotPasse(motDePasse: string) {
    // Validation de la longueur du mot de passe
    if (motDePasse.length < 8) {
        return 'Le mot de passe doit faire au moins 8 caractères'
    }
    if(motDePasse.length >= 10) {
        return 'Le mot de passe doit faire moins de 10 caractères'
    }

    const motDePasseMinuscule = motDePasse.toLowerCase();

    // Calcul de la liste des mots interdits
    const motsInterdits = [utilisateur.value.nom.toLowerCase(), utilisateur.value.prenom.toLowerCase(), utilisateur.value.identifiant.toLowerCase(), 'movinetum']
    for (const motInterdit of motsInterdits) {
        if (motDePasseMinuscule.includes(motInterdit)) {
            return 'Le mot de passe ne doit pas contenir votre nom, prénom, identifiant ou "Movinetum"'
        }
    }

    // Vérification de si le mot de passe contient au moins un chiffre, une lettre et un caractère spécial
    let contientNombre = false
    let contientLettre = false
    let contientCaractereSpecial = false
    const caractereUtilises: string[] = []
    for (const caractere of motDePasseMinuscule) {
        if(caractereUtilises.includes(caractere)) {
            return 'Le mot de passe ne doit pas contenir deux fois le même caractère'
        }

        if (caractere >= '0' && caractere <= '9') {
            contientNombre = true
        } else if (caractere >= 'a' && caractere <= 'z') {
            contientLettre = true
        } else {
            contientCaractereSpecial = true
        }
    }

    if (!contientNombre) {
        return 'Le mot de passe doit contenir au moins un chiffre'
    }
    if (!contientLettre) {
        return 'Le mot de passe doit contenir au moins une lettre'
    }
    if (!contientCaractereSpecial) {
        return 'Le mot de passe doit contenir au moins un caractère spécial'
    }
    return true
}

/**
 * Règle de validation sur le champ email qui indique une erreur si la valeur passée en entrée
 * n'a pas le bon format
 */
function regleEmail(email: string) {
    // Valide que l'e-mail est bien au format xxx@xxx.xxx
    if(email.match(/^[^@]+@[^@]+\.[^@]+$/) === null) {
        return 'Le format de l\'email est incorrect'
    }
    return true
}

/**
 * Règle de validation sur le champ date de naissance qui indique une erreur si la valeur passée en entrée
 * n'a pas le bon format
 */
function regleDateDeNaissance(dateDeNaissance: string) {
    if(dateDeNaissance.match(/^\d{4}-\d{2}-\d{2}$/) === null) {
        return 'La date de naissance doit être au format AAAA-MM-JJ'
    }
    return true
}
</script>
<template>
    <v-container>
        <h1>Inscription</h1>
        <v-form @submit="envoyer" validate-on="submit">
            <v-text-field
                v-model="utilisateur.identifiant"
                label="Identifiant"
                required
                :rules="[regleRequis, regleIdentifiantUnique]" />
            <v-text-field
                v-model="utilisateur.motDePasse"
                label="Mot de passe"
                type="password"
                required
                :rules="[regleMotPasse]" />
            <v-text-field
                v-model="utilisateur.nom"
                label="Nom"
                required
                :rules="[regleRequis, regleNom]" />
            <v-text-field
                v-model="utilisateur.prenom"
                label="Prénom"
                required
                :rules="[regleRequis, reglePrenom]" />
            <v-text-field
                v-model="utilisateur.email"
                label="Email"
                type="email"
                required
                :rules="[regleRequis, regleEmail]" />
            <v-text-field
                v-model="utilisateur.dateDeNaissance"
                label="Date de naissance"
                required
                :rules="[regleDateDeNaissance]" />
            <div class="d-flex justify-end">
                <v-btn type="submit" class="ma-2" color="primary">S'inscrire</v-btn>
                <v-btn @click="reinitialiser" class="ma-2" color="primary">Réinitialiser</v-btn>
            </div>
        </v-form>
    </v-container>
</template>