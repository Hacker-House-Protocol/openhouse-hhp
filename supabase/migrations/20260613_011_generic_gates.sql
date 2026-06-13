-- ── Generic Gates: rename house_gates → gates ──────────────────────────────
-- Supports hacker_houses, communities, and hack_spaces

-- 1. Create the new generic table
CREATE TABLE IF NOT EXISTS gates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type text NOT NULL,  -- 'hacker_house' | 'community' | 'hack_space'
  entity_id uuid NOT NULL,
  gate_type text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 2. Migrate existing data from house_gates (if it exists)
INSERT INTO gates (id, entity_type, entity_id, gate_type, config, created_at)
SELECT id, 'hacker_house', hacker_house_id, gate_type, config, created_at
FROM house_gates
ON CONFLICT (id) DO NOTHING;

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_gates_entity ON gates(entity_type, entity_id);
