-- Migration pour les tables d'authentification
BEGIN;

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs (extension de auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Politiques RLS pour la table profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des profils" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Modification uniquement par le propriétaire"
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

COMMIT;