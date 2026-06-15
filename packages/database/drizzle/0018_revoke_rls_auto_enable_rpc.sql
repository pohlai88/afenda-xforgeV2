-- Event trigger helpers are not PostgREST RPC endpoints.
REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;
