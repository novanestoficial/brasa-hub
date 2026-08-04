import "./globals.css";
import Embers from "../components/Embers";
import { getSupabaseServerClient } from "../lib/supabase/server";

export const metadata = {
  title: "CHARMANDER SCRIPTS",
  description: "Scripts que eu uso para gravar os vídeos",
};

export default async function RootLayout({ children }) {
  const supabase = await getSupabaseServerClient();
  await supabase.rpc("log_site_visit");

  return (
    <html lang="pt-BR">
      <body>
        <div className="scales" aria-hidden="true"></div>
        <div className="embers" id="embers" aria-hidden="true"></div>
        <Embers />
        {children}
        <div id="copy-announce" className="sr-only" role="status" aria-live="polite"></div>
      </body>
    </html>
  );
}
