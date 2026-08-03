import { NextResponse } from "next/server";
import { getStripe } from "../../../../lib/stripe";
import { getSupabaseAdminClient } from "../../../../lib/supabase/admin";

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const supabase = getSupabaseAdminClient();
    await supabase.from("purchases").upsert(
      {
        user_id: session.client_reference_id,
        stripe_session_id: session.id,
      },
      { onConflict: "stripe_session_id" }
    );
  }

  return NextResponse.json({ received: true });
}
