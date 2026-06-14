-- ── Identity Gates & Multi-Wallet Support ──────────────────────────────────

-- 1. House gates — requirements builders must meet to apply
CREATE TABLE IF NOT EXISTS house_gates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  hacker_house_id uuid NOT NULL REFERENCES hacker_houses(id) ON DELETE CASCADE,
  gate_type text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 2. User wallets — additional read-only wallets for on-chain data import
CREATE TABLE IF NOT EXISTS user_wallets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  label text,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, wallet_address)
);

-- 3. Profile visibility — granular control over what data is shared
CREATE TABLE IF NOT EXISTS profile_visibility (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  show_socials boolean DEFAULT false,
  show_email boolean DEFAULT false,
  show_city boolean DEFAULT false,
  show_bio boolean DEFAULT true,
  show_nfts boolean DEFAULT false,
  show_chain_activity boolean DEFAULT false
);

-- 4. New columns on users for verification & matching
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS kernel_address text,
  ADD COLUMN IF NOT EXISTS seeking_skills text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS featured_poaps jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS human_passport_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS human_passport_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS worldid_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS worldid_verification_level text,
  ADD COLUMN IF NOT EXISTS worldid_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS nfts jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS chain_activity jsonb DEFAULT '{}'::jsonb;

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_house_gates_house ON house_gates(hacker_house_id);
CREATE INDEX IF NOT EXISTS idx_user_wallets_user ON user_wallets(user_id);
