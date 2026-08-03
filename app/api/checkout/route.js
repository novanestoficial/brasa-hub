import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase/server";
import { getStripe } from "../../../lib/stripe";

export async function GET(request) {
  const { origin, searchParams } = new URL(request.url);
  const next = searchParams.get("next") || "/";

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    client_reference_id: user.id,
    customer_email: user.email,
    allow_promotion_codes: true,
    success_url: `${origin}${next}?compra=ok`,
    cancel_url: `${origin}${next}`,
  });

  return NextResponse.redirect(session.url, 303);
}
