BEGIN;

-- Trigger pour les nouvelles demandes de devis
CREATE OR REPLACE FUNCTION notify_new_quote()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := supabase_url() || '/functions/v1/notify-new-quote',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', current_setting('request.headers')::json->>'authorization'
    ),
    body := jsonb_build_object(
      'record', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_quote
AFTER INSERT ON public.quote_requests
FOR EACH ROW EXECUTE FUNCTION notify_new_quote();

-- Trigger pour les mises à jour de statut
CREATE OR REPLACE FUNCTION notify_quote_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM net.http_post(
      url := supabase_url() || '/functions/v1/quote-status-update',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', current_setting('request.headers')::json->>'authorization'
      ),
      body := jsonb_build_object(
        'record', to_jsonb(NEW),
        'old_record', to_jsonb(OLD)
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_quote_status_change
AFTER UPDATE ON public.quote_requests
FOR EACH ROW EXECUTE FUNCTION notify_quote_status_change();

COMMIT;