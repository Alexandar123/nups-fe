// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  auth0: {
      domain: "nedovicm.eu.auth0.com",
      client_id: "F5AcvKlIkDbvUVjYNFCaglzkdKn76bs3",
      redirect_uri: `${window.location.origin}`,
  },
  baseApiUrl: 'http://185.119.89.37:8080/api/geo/'
};
