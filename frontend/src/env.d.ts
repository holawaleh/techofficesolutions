// Minimal ambient declarations to satisfy editor/ts server in constrained workspace
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string;
    REPL_ID?: string;
  }
}

declare const process: { env: NodeJS.ProcessEnv };

declare module "@replit/vite-plugin-runtime-error-modal" {
  const mod: any;
  export default mod;
}

declare module "@replit/vite-plugin-cartographer" {
  const mod: any;
  export function cartographer(...args: any[]): any;
}

declare module "@replit/vite-plugin-dev-banner" {
  const mod: any;
  export function devBanner(...args: any[]): any;
}

// Minimal declarations for Vite and common plugins used in the project
declare module "vite" {
  const mod: any;
  export function defineConfig(cfg: any): any;
  export default mod;
}

declare module "@vitejs/plugin-react" {
  const plugin: any;
  export default function pluginReact(options?: any): any;
}

// Node built-ins used by the vite config
declare module "path" {
  const path: any;
  export default path;
}

declare module "url" {
  export function fileURLToPath(url: string): string;
}
