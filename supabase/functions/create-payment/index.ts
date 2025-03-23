
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
    const { scheduleId, quantity, description, specialInstructions, customerId } = await req.json();
    
    // Get schedule details to calculate total price
    const { data: schedule, error: scheduleError } = await supabase
      .from('driver_schedules')
      .select('*')
      .eq('id', scheduleId)
      .single();
    
    if (scheduleError || !schedule) {
      throw new Error(`Schedule not found: ${scheduleError?.message}`);
    }
    
    // Check if there's enough capacity
    if (schedule.available_capacity < quantity) {
      throw new Error(`Not enough capacity available. Only ${schedule.available_capacity} spots left.`);
    }
    
    // Calculate amount (in cents)
    const amount = quantity * 1000; // $10 per food box
    
    // Generate a payment ID (in a real system, this would be from a payment processor)
    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    // Store the order in pending status
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        schedule_id: scheduleId,
        quantity,
        description,
        special_instructions: specialInstructions,
        payment_id: paymentId,
        status: 'pending',
      })
      .select()
      .single();
    
    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`);
    }
    
    return new Response(
      JSON.stringify({
        paymentId: paymentId,
        orderId: order.id,
        amount: amount,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error creating payment:', error);
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
