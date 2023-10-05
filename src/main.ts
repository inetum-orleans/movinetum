/**
 * @fileoverview Fichier contenant le point d'entrée de l'application.
 * 
 * C'est un fichier ".ts", c'est à dire que c'est un fichier TypeScript.
 * Lorsque l'on lance `npm run dev`, ce code "typescript" est compilé en "javascript",
 * qui est un langage très similaire mais plus simple et interprétable directement par les navigateurs.
 * 
 * Lorsque le fichier index.html est chargé, la balise `<script` indique au navigateur de charger ce fichier,
 * c'est donc le premier fichier qui va initialiser notre application vue.js.
 */

// Les directives "import" permettent de faire référence à d'autres fichiers de l'application.
// De cette façon on ne met pas tout dans le même fichier, et on peut réutiliser des bouts de code.
// Les imports sont placés en haut du fichier.

// Le composant principal de l'application vue.
import App from './App.vue'

// Importe des choses depuis la bibliothèque vue.
import { createApp } from 'vue'

// Importe la fonction "registerPlugins" depuis le fichier "index.ts" du dossier "plugins".
// Lorsque l'on importe un dossier, par convention, c'est le fichier "index.ts" qui est importé.
import { registerPlugins } from '@/plugins'

// Importe le "symbole" TMDB. C'est un identifiant unique, qui peut être utilisé un peu partout dans l'application.
import { symboleTmdb } from '@/types/symboles'

// Importe la classe "TMDB" depuis la bibliothèque "tmdb-ts".
// Une classe fournit des fonctionnalités à l'application.
// Cela va nous permettre de faire des appels à l'API TMDB.
import { TMDB } from 'tmdb-ts'

// Crée l'application vue, en utilisant le composant "App" comme composant principal.
const app = createApp(App)

// Enregistre les plugins de l'application.
registerPlugins(app)

// Initialisation de l'API TMDB
// import.meta.env permet d'avoir accès à toutes les variables d'environnement préfixées par VITE_
// déclarées dans le fichier ".env".
const tmdb = new TMDB(import.meta.env.VITE_TMDB_ACCESS_TOKEN);
app.provide(symboleTmdb, tmdb)// Rend disponible l'API TMDB dans toute l'application.

// Montre l'application vue dans la balise HTML qui a l'id "app".
app.mount('#app')
