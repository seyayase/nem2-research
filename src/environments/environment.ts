// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAEVxyvpDvmB2myQJ54F0XXgI6LCauQMkA",
    authDomain: "tep-rnd-test.firebaseapp.com",
    databaseURL: "https://tep-rnd-test.firebaseio.com",
    projectId: "tep-rnd-test",
    storageBucket: "",
    messagingSenderId: "927013468551",
  },
  node: {
    url: 'https://catapult-test.opening-line.jp:3001',
    networkGenerationHash: '453052FDC4EB23BF0D7280C103F7797133A633B68A81986165B76FCE248AB235'
  },
  admin: {
    address: 'SDTNUHOGJU6EYUWPOLAYCBZBJONDDXEX72TDLXQ6',
    publicKey: 'A52AF8C768A864ED3A84DD27D51653C635C9D05A2644B69397BBC2A2DDAF8CAD',
    privateKey: '122DC034B6179BAD9D4F297079B1DB5ECDDD499A72B4230D33F89E3AD0D9F3A9'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
