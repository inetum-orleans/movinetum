import { createPinia } from 'pinia'

// Crée une instance de Pinia, qui va nous permettre de créer des "stores".
// Un store permet de rendre disponible des données dans toute l'application,
// car les données créées dans un composants sont uniquement disponibles dans ce composant
// et sont détruites lorsque l'on change de composant.
export default createPinia()
