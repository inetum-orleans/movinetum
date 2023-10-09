<script setup lang="ts">
// Le composant qui contient le formulaire de connexion

import { ref } from 'vue'
import { useUtilisateursStore } from '@/store/utilisateurs'

const identifiant = ref('')
const motDePasse = ref('')

const storeUtilisateur = useUtilisateursStore()

function connecter() {
    storeUtilisateur.connecter(identifiant.value, motDePasse.value)
}
</script>
<template>
    <v-form @submit.prevent="connecter">
        <v-text-field
            v-model="identifiant"
            label="Identifiant"
            required
            />
        <v-text-field
            v-model="motDePasse"
            label="Mot de passe"
            required
            type="password"
            />
        <div class="text-caption">Pas encore de compte ? <router-link :to="{ name: 'Inscription' }">S'inscrire</router-link></div>
        <v-btn type="submit" color="primary">Se connecter</v-btn>
    </v-form>
</template>