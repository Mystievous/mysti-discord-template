declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        TOKEN: string
        CLIENT_ID: string
        GUILD_ID: string
        HOST: string
        PORT: string
        DATABASE: string
        USER: string
        PASSWORD: string
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}