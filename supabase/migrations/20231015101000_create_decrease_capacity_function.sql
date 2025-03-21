
CREATE OR REPLACE FUNCTION public.decrease_capacity(schedule_id UUID, quantity_requested INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.driver_schedules
  SET available_capacity = available_capacity - quantity_requested
  WHERE id = schedule_id
  AND available_capacity >= quantity_requested;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Failed to update capacity: either schedule not found or insufficient capacity';
  END IF;
END;
$$;
