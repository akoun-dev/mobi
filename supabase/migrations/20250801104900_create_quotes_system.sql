-- Migration pour le système de devis
BEGIN;

-- Table des demandes de devis
CREATE TABLE public.quote_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Politiques RLS pour quote_requests
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients voient leurs demandes" 
ON public.quote_requests FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins voient toutes les demandes"
ON public.quote_requests FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Clients créent des demandes"
ON public.quote_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quote_timestamp
BEFORE UPDATE ON public.quote_requests
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

COMMIT;