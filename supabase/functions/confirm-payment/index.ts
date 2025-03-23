
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paymentId } = await req.json();
    
    // Get the order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_id', paymentId)
      .single();
    
    if (orderError || !order) {
      throw new Error(`Order not found: ${orderError?.message}`);
    }
    
    // Update the order status to confirmed
    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({ status: 'confirmed' })
      .eq('id', order.id);
    
    if (updateOrderError) {
      throw new Error(`Failed to update order: ${updateOrderError.message}`);
    }
    
    // Update available capacity on the schedule
    const { error: updateScheduleError } = await supabase.rpc('decrease_capacity', {
      schedule_id: order.schedule_id,
      quantity_requested: order.quantity
    });
    
    if (updateScheduleError) {
      throw new Error(`Failed to update schedule capacity: ${updateScheduleError.message}`);
    }
    
    return new Response(
      JSON.stringify({ success: true, order: order }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error confirming payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
