/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_VOTING_CONTRACT_ADDRESS: string
  readonly VITE_VOTING_ELECTION_ABI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
