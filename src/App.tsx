import React, { useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  Sparkles,
  Globe2,
} from 'lucide-react';
import './App.css';

function Maplle() {
  return (
    <svg
      className="maplle"
      viewBox="0 0 360 360"
      role="img"
      aria-label="Maplle, mascote do FrenchOS"
    >
      <defs>
        <radialGradient id="orb" cx="34%" cy="24%" r="75%">
          <stop stopColor="#e7d9ff" />
          <stop offset=".32" stopColor="#a98be8" />
          <stop offset=".72" stopColor="#65469d" />
          <stop offset="1" stopColor="#302044" />
        </radialGradient>
        <linearGradient id="coat" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#383044" />
          <stop offset="1" stopColor="#111019" />
        </linearGradient>
        <linearGradient id="hat" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#393044" />
          <stop offset="1" stopColor="#100d18" />
        </linearGradient>
      </defs>

      {/* Partículas de brilho */}
      <g fill="#d8c3ff">
        <path d="M42 105l5 13 13 5-13 5-5 13-5-13-13-5 13-5z" />
        <path d="M300 55l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
        <circle cx="300" cy="230" r="4" />
        <circle cx="64" cy="260" r="3" />
      </g>

      {/* Braços e Capa */}
      <path
        d="M103 235Q67 242 56 213Q48 195 64 185Q79 176 88 196L111 214M258 230Q295 236 306 205Q313 187 297 178Q281 170 273 190L251 211"
        fill="none"
        stroke="#17131f"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d="M58 184q-10-8-17 2q-5 8 3 15q9 8 18-1M298 177q10-8 17 2q5 8-3 15q-9 8-18-1"
        fill="#9c7bd4"
        stroke="#21172f"
        strokeWidth="5"
      />
      <path
        d="M111 222Q180 188 249 222L277 316Q180 345 83 316Z"
        fill="url(#coat)"
        stroke="#100d18"
        strokeWidth="5"
      />

      {/* Traje */}
      <path d="M153 215l27 23 27-23 16 100h-86z" fill="#eee8f8" />
      <path
        d="M164 233l16 11 16-11-7 22 7 55h-32l7-55z"
        fill="#b58ce9"
      />
      <circle cx="180" cy="246" r="7" fill="#f2c66d" />
      <circle cx="180" cy="278" r="5" fill="#f2c66d" />

      {/* Cabeça e Olhos */}
      <circle
        cx="180"
        cy="151"
        r="91"
        fill="url(#orb)"
        stroke="#241a35"
        strokeWidth="7"
      />
      <ellipse
        cx="148"
        cy="102"
        rx="25"
        ry="12"
        fill="#fff"
        opacity=".22"
        transform="rotate(-28 148 102)"
      />
      <path
        d="M143 150q12-13 25 0M193 150q12-13 25 0"
        fill="none"
        stroke="#21172f"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <ellipse cx="154" cy="161" rx="4" ry="6" fill="#21172f" />
      <ellipse cx="205" cy="161" rx="4" ry="6" fill="#21172f" />
      <path
        d="M166 180q14 13 28 0"
        fill="none"
        stroke="#21172f"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Chapéu */}
      <path
        d="M118 73Q180 48 242 73L232 93H128Z"
        fill="url(#hat)"
        stroke="#100d18"
        strokeWidth="5"
      />
      <path
        d="M144 68L151 19Q180 5 209 19L216 68Z"
        fill="url(#hat)"
        stroke="#100d18"
        strokeWidth="5"
      />
      <path d="M148 52H212L214 65H146Z" fill="#b58ce9" />
      <path
        d="M119 76Q180 61 241 76"
        fill="none"
        stroke="#f2c66d"
        strokeWidth="5"
      />
      <circle cx="180" cy="19" r="5" fill="#f2c66d" />
    </svg>
  );
}

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return setNotice('Digite um e-mail válido para continuar.');
    }

    if (password.length < 6) {
      return setNotice('Sua senha precisa ter pelo menos 6 caracteres.');
    }

    setNotice(
      'Interface pronta! A autenticação será conectada ao backend na próxima etapa.'
    );
  }

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {/* Topbar */}
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-mark">
            <Globe2 size={19} />
          </span>
          <span>
            French<span className="brand-accent">OS</span>
          </span>
        </a>
        <div className="topbar-note">
          <i /> SUA PRÓXIMA FASE COMEÇA AQUI
        </div>
      </header>

      {/* Seção Principal */}
      <section className="hero">
        {/* Lado Esquerdo - Apresentação */}
        <div className="intro">
          <div className="eyebrow">
            <Sparkles size={15} /> APRENDER PODE SER UMA AVENTURA
          </div>
          <h1>
            Seu próximo idioma.
            <br />
            <span>Sua próxima conquista.</span>
          </h1>
          <p className="intro-copy">
            Entre no FrenchOS e transforme cada aprendizado em um desafio. Pratique,
            evolua e descubra até onde você consegue chegar.
          </p>

          <div className="feature-row">
            <div className="feature-icon">
              <Globe2 size={19} />
            </div>
            <div>
              <strong>Aprenda no seu ritmo</strong>
              <span>Avance etapa por etapa, sem perder a diversão.</span>
            </div>
          </div>

          <div className="feature-row">
            <div className="feature-icon gold">
              <Sparkles size={19} />
            </div>
            <div>
              <strong>Jogue para evoluir</strong>
              <span>Desafios que transformam prática em progresso.</span>
            </div>
          </div>

          <div className="mascot-wrap">
            <div className="mascot-halo" />
            <Maplle />
            <span className="mascot-caption">
              Maplle <i>✦</i> seu guia nessa jornada
            </span>
          </div>
        </div>

        {/* Lado Direito - Card de Login/Cadastro */}
        <div className="login-side">
          <div className="login-card">
            <div className="card-kicker">BEM-VINDO AO FRENCHOS</div>
            <h2>{mode === 'login' ? 'Vamos começar?' : 'Crie sua conta'}</h2>
            <p className="card-subtitle">
              {mode === 'login'
                ? 'Entre na sua conta e continue de onde parou.'
                : 'Dê o primeiro passo na sua jornada.'}
            </p>

            <button
              className="google-button"
              type="button"
              onClick={() =>
                setNotice(
                  'O acesso com Google será habilitado quando conectarmos o serviço de autenticação.'
                )
              }
            >
              <b className="google-g">G</b> Continuar com Google
            </button>

            <div className="separator">
              <span />
              ou entre com seu e-mail
              <span />
            </div>

            <form onSubmit={submit}>
              <label htmlFor="email">E-mail</label>
              <div className="input-wrap">
                <Mail size={18} />
                <input
                  id="email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="password-label">
                <label htmlFor="password">Senha</label>
                <button
                  type="button"
                  className="forgot"
                  onClick={() =>
                    setNotice(
                      'A recuperação de senha será adicionada junto ao backend.'
                    )
                  }
                >
                  Esqueceu a senha?
                </button>
              </div>

              <div className="input-wrap">
                <LockKeyhole size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Pelo menos 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="eye-button"
                  type="button"
                  aria-label="Mostrar ou ocultar senha"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button className="submit-button" type="submit">
                {mode === 'login' ? 'Entrar na minha conta' : 'Criar minha conta'}{' '}
                <ArrowRight size={18} />
              </button>
            </form>

            {notice && (
              <div className="notice" role="status">
                {notice}
              </div>
            )}

            <p className="switch-mode">
              {mode === 'login'
                ? 'Ainda não tem uma conta?'
                : 'Já tem uma conta?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setNotice('');
                }}
              >
                {mode === 'login' ? 'Criar conta' : 'Fazer login'}
              </button>
            </p>

            <p className="terms">
              Ao continuar, você concorda com nossos{' '}
              <a href="#termos">Termos de uso</a> e{' '}
              <a href="#privacidade">Política de privacidade</a>.
            </p>
          </div>

          <div className="bottom-note">
            <span>✦</span> Aprender. Competir. Evoluir.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <span>© 2026 FrenchOS</span>
        <span>Feito para quem quer ir além.</span>
      </footer>
    </main>
  );
}