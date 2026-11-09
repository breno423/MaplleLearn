::: {align="center"}
# 🔮 Maplle Learn

### Aprenda francês. Conecte-se. Evolua jogando.

Uma plataforma multiplayer de aprendizagem de idiomas que transforma a
prática de francês e inglês em uma experiência social, competitiva e
gamificada.

[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini-8E75B2?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![AWS CloudWatch
RUM](https://img.shields.io/badge/AWS-CloudWatch%20RUM-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com/cloudwatch/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

[Aplicação em produção](https://maplle-learn.vercel.app/) · [Arquitetura
(Draw.io)](docs/maplle-architecture.drawio)
:::✨ Sobre o projeto
O Maplle Learn é uma plataforma de aprendizagem de idiomas
construída em torno de partidas entre duas pessoas. Em vez de depender
apenas de exercícios individuais, os participantes praticam tradução,
recebem feedback e acompanham sua evolução em uma experiência
multiplayer.

O mascote Maplle, uma bola de cristal caracterizada, representa a
identidade do produto e atua como guia visual da experiência.

O projeto combina:
- aprendizagem de francês e inglês a partir de frases em português;
- partidas privadas para duas pessoas;
- geração e avaliação de desafios com IA;
- pontuação, tempo de resposta e feedback individual;
- autenticação, perfis, amizades e sincronização em tempo real;
- monitoramento de experiência real no frontend com AWS CloudWatch
  RUM.
🎯 Objetivos
- Tornar a prática de idiomas mais interativa e acessível.
- Incentivar a consistência por meio de partidas e gamificação.
- Promover aprendizagem colaborativa entre amigos.
- Usar IA para gerar desafios e oferecer feedback contextualizado.
- Manter uma arquitetura segura, observável e preparada para evoluir.
🚀 Funcionalidades
🔐 Autenticação e perfil
- Cadastro e login com e-mail e senha.
- Autenticação social com Google e GitHub.
- Gerenciamento de sessão com Supabase Auth.
- Perfil com nome de exibição, nome de usuário e avatar.
👥 Salas e amizades
- Criação de salas privadas para até duas pessoas.
- Código de sala para compartilhamento e entrada.
- Convites de amigos e gerenciamento de amizades.
- Estado de prontidão dos participantes.
- Configurações de partida definidas pelo anfitrião.
- Sincronização de participantes e estado da sala.
🎮 Partidas multiplayer
- Partidas com respostas simultâneas: cada jogador recebe seu próprio
  desafio.
- Frases de origem em português, com idioma-alvo escolhido pelo
  participante (francês ou inglês).
- Quantidade de rodadas e tempo de resposta configuráveis.
- Avaliação individual das respostas com IA.
- Pontuação de 0 a 10, correções, explicações gramaticais e traduções
  alternativas.
- Controle de tempo, tratamento de respostas expiradas e desistência.
- Resultado final com comparação das pontuações.
🤖 Inteligência artificial
- Geração de desafios com Google Gemini.
- Avaliação de respostas e feedback em português brasileiro.
- Orientações de correção e alternativas de tradução.
- Estrutura preparada para adaptação gradual da dificuldade.
🎨 Experiência visual
- Interface própria com identidade visual em tons de roxo.
- Layout responsivo.
- Mascote Maplle integrado à experiência.
- Ícones com Lucide React.
🧰 Tecnologias
  Tecnologia                          Responsabilidade
  React + TypeScript                  Interface e lógica do frontend

  Vite                                Desenvolvimento e build do frontend

  CSS                                 Estilização e identidade visual

  Supabase Auth                       Autenticação e sessões

  Supabase PostgreSQL                 Persistência dos dados

  Supabase RLS                        Controle de acesso aos dados

  Supabase Realtime                   Sincronização de salas e partidas

  Supabase Edge Functions             Operações de backend e integração
com IA

  Supabase RPC                        Operações transacionais e regras de
negócio no banco

  Google Gemini                       Geração de desafios e avaliação de
respostas

  AWS CloudWatch RUM                  Telemetria de experiência real no
frontend

  Amazon Cognito Identity Pool        Credenciais temporárias para envio
de eventos RUM

  Vercel                              Hospedagem e deploy do frontend
Lucide React                        Ícones da interface
🏗️ Arquitetura
O frontend é uma aplicação React/Vite hospedada na Vercel. O Supabase
fornece autenticação, banco de dados, políticas RLS, Realtime e Edge
Functions. As Edge Functions coordenam a geração e a avaliação dos
desafios com o Google Gemini.

O CloudWatch RUM é integrado diretamente ao frontend para coletar
telemetria de sessões reais. Ele monitora a experiência no navegador;
não centraliza automaticamente os logs internos do Supabase.
Diagrama de arquitetura
O diagrama abaixo mostra os principais componentes e o fluxo de uma
partida. O arquivo fonte pode ser aberto e editado no draw.io /
diagrams.net.

- [Abrir/editar o diagrama no
  Draw.io](docs/maplle-architecture.drawio)

Fluxo resumido de uma partida
1. O usuário acessa a aplicação hospedada na Vercel e autentica-se pelo
   Supabase Auth.
2. Os participantes criam ou entram em uma sala e ficam sincronizados
   pelo Supabase Realtime.
3. O anfitrião configura a partida e inicia quando os dois jogadores
   estão prontos.
4. As Edge Functions geram um desafio individual para cada jogador,
   usando o Gemini.
5. Cada participante envia sua tradução; a função de avaliação valida a
   partida e solicita a avaliação ao Gemini.
6. As respostas, pontuações e feedbacks são persistidos no Supabase e
   sincronizados entre os participantes.
7. Respostas expiradas são tratadas pelo fluxo de timeout; ao final, o
   resultado da partida é calculado.
📊 Observabilidade
AWS CloudWatch RUM --- implementado
O frontend do Maplle Learn utiliza o Amazon CloudWatch Real User
Monitoring (RUM) para acompanhar a experiência de usuários reais na
aplicação publicada na Vercel.

  Configuração            Estado
  App monitor             maplle-learn-prod
Região AWS              sa-east-1 --- São Paulo
Amostragem de sessões   20%
Performance telemetry   Ativada
JavaScript errors       Ativada
HTTP errors             Ativada
X-Ray tracing           Desativado
Cookies do RUM          Desativados
Autorização             Cognito Identity Pool com credenciais temporárias

O RUM permite observar sessões amostradas, visualizações de página,
indicadores de desempenho e erros capturados no navegador. A
configuração usa o pacote aws-rum-web.
Escopo atual: CloudWatch RUM monitora o frontend e as requisições
observadas pelo navegador. Logs de execução das Supabase Edge
Functions, Auth e banco de dados continuam disponíveis nos recursos de
observabilidade do próprio Supabase. A exportação desses logs para a
AWS não está configurada neste estágio.

Próximas evoluções de observabilidade
- AWS Budgets para alertas de custo.
- CloudWatch Synthetics para verificações automatizadas de
  disponibilidade e fluxos críticos.
- CloudTrail para auditoria das atividades da conta AWS.
- Avaliar integração de logs do Supabase com um destino AWS,
  considerando plano, custos e segurança.
- Avaliar rastreamento distribuído quando houver uma arquitetura
  compatível com X-Ray.
🗃️ Dados e segurança
Entre as principais estruturas do banco estão:
  Estrutura                           Finalidade
  profiles                          Dados públicos de perfil, como
nome, username e avatar

  rooms                             Salas, anfitrião, configurações e
estado

  room_members                      Participantes e estado de prontidão

  matches                           Estado e configurações das partidas

  match_rounds                      Desafios individuais de cada
participante

  match_answers                     Respostas, pontuações e feedbacks
match_round_keys                  Referências e guias usados na
avaliação, protegidos do acesso
comum do cliente
A aplicação utiliza:
- Row Level Security (RLS) para restringir o acesso aos dados.
- Supabase Auth para identificar os usuários.
- RPCs para executar operações sensíveis e transacionais.
- Edge Functions para operações de backend e chamadas à IA.
- Variáveis de ambiente para configuração do cliente.
- Credenciais temporárias do Cognito para envio de telemetria RUM.
Nunca exponha service_role, chaves privadas do Gemini, credenciais
IAM permanentes ou outros segredos no código do frontend, no repositório
ou em variáveis VITE_*.
⚙️ Executar localmente
Pré-requisitos
- Node.js (versão LTS recomendada)
- npm
- Git
- Projeto Supabase configurado e acessível
1. Clonar o repositório
git clone URL_DO_REPOSITORIO
cd maplle-learn
2. Instalar dependências
npm install
3. Configurar variáveis de ambiente
Crie um arquivo .env na raiz do projeto:
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_publica
Use a chave pública apropriada do Supabase no frontend. Nunca coloque a
chave service_role ou segredos de servidor em variáveis VITE_*.

As credenciais do Gemini e do Supabase usadas pelas Edge Functions devem
permanecer configuradas no ambiente seguro do Supabase, conforme a
implementação do projeto.
4. Iniciar o ambiente de desenvolvimento
npm run dev
O Vite exibirá o endereço local, normalmente http://localhost:5173.
5. Validar o build de produção
npm run build
☁️ Deploy
O frontend está publicado na Vercel:

https://maplle-learn.vercel.app/

O deploy é realizado a partir do repositório conectado à Vercel. As
variáveis de ambiente necessárias devem ser cadastradas nas
configurações do projeto na plataforma.

As Supabase Edge Functions e alterações de banco são implantadas e
gerenciadas no projeto Supabase.
🗺️ Roadmap
Implementado
- [x] Estrutura inicial com React, TypeScript e Vite.
- [x] Identidade visual e mascote Maplle.
- [x] Autenticação por e-mail e provedores sociais.
- [x] Perfis com avatar e username.
- [x] Criação e entrada em salas privadas.
- [x] Salas para dois participantes e estado de prontidão.
- [x] Configuração de rodadas e tempo de resposta.
- [x] Partidas com desafios individuais e respostas simultâneas.
- [x] Geração de desafios com Gemini.
- [x] Avaliação com pontuação e feedback.
- [x] Persistência e sincronização de progresso da partida.
- [x] Tratamento de timeout e desistência.
- [x] Sistema de amizades e convites.
- [x] Deploy do frontend na Vercel.
- [x] Integração do AWS CloudWatch RUM em sa-east-1.
Próximos passos
- [ ] Evoluir métricas e alertas de observabilidade.
- [ ] Configurar AWS Budgets.
- [ ] Adicionar testes sintéticos para disponibilidade e fluxos
  críticos.
- [ ] Avaliar exportação de logs do Supabase para uma plataforma
  externa.
- [ ] Desenvolver chat entre amigos.
- [ ] Criar desafios diários gerados por IA.
- [ ] Evoluir progressão, histórico e estatísticas dos jogadores.
- [ ] Avaliar rastreamento distribuído com AWS X-Ray conforme a
  arquitetura evoluir.
💡 Visão do projeto
O Maplle Learn nasceu da ideia de que aprender um idioma não precisa ser
uma atividade solitária ou repetitiva. Ao aproximar pessoas, desafios e
inteligência artificial, o projeto busca transformar a prática em uma
experiência compartilhada e motivadora.

A evolução técnica também faz parte da proposta: construir uma aplicação
com autenticação, regras de acesso, operações de backend, sincronização
em tempo real, deploy contínuo e observabilidade desde as etapas
iniciais.
::: {align="center"}
**Maplle Learn**

*Learn together. Grow together. Parlez français!*
:::