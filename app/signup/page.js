import AuthForm from "../../components/AuthForm";

export const metadata = {
  title: "Criar conta — CHARMANDER SCRIPTS",
};

export default function SignupPage() {
  return (
    <>
      <header className="site-header">
        <a className="logo" href="/">
          CHARMANDER<span className="logo-suffix"> SCRIPTS</span>
        </a>
        <a className="btn btn-ghost" href="/">
          <span className="back-full">&larr; Voltar ao catálogo</span>
          <span className="back-short">&larr; Voltar</span>
        </a>
      </header>

      <main>
        <div className="wrap auth-wrap">
          <p className="eyebrow">Acesso</p>
          <h1 className="detail-title">Criar conta</h1>

          <AuthForm mode="signup" />

          <p className="auth-switch">
            Já tem conta? <a href="/login">Entrar</a>
          </p>
        </div>
      </main>

      <footer>
        <div className="wrap footer-inner">
          <span>&copy; 2026 CHARMANDER SCRIPTS.</span>
          <a className="detail-back" href="/">&larr; Voltar ao catálogo</a>
        </div>
      </footer>
    </>
  );
}
