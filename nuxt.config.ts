// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["bootstrap/dist/css/bootstrap.min.css"],
  app: {
    baseURL: '/dm/'
  },
  modules: [
    "@vee-validate/nuxt",
    "@nuxt/icon",
    "@primevue/nuxt-module",
    "@pinia/nuxt"
  ],
  nitro: {
    preset: 'node-server',
    baseURL: '/dm',
  },
  primevue: {
    autoImport: false,
    components: {
      include: ['DatePicker',"Dropdown"]
    },
    options: {
      theme: {
        preset: Aura
      },
      locale: {
        dayNames: [
          "Neděle",
          "Pondělí",
          "Úterý",
          "Středa",
          "Čtvrtek",
          "Pátek",
          "Sobota"
        ],
        dayNamesShort: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
        dayNamesMin: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
        monthNames: [
          "Leden",
          "Únor",
          "Březen",
          "Duben",
          "Květen",
          "Červen",
          "Červenec",
          "Srpen",
          "Září",
          "Říjen",
          "Listopad",
          "Prosinec"
        ],
        monthNamesShort: [
          "Led",
          "Úno",
          "Bře",
          "Dub",
          "Kvě",
          "Čvn",
          "Čvc",
          "Srp",
          "Zář",
          "Říj",
          "Lis",
          "Pro"
        ],
        fileSizeTypes: ["B", "KB", "MB", "GB", "TB"]
      }
    }
  }
});