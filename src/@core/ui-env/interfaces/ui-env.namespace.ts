/* eslint-disable @typescript-eslint/no-namespace */
export namespace UiEnvNamespace {
  export type ProjectNames = 'main_ui';

  export interface MainUi {
    production: boolean;
    name: string;
    baseApi: string;
    auth0: {
      clientId: string;
      domain: string;
    };
  }
}
