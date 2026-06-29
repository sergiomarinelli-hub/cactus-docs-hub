# Cactus Docs Hub

Site estático para centralizar documentações dos apps internos da Cactus Corp.

Apps documentados:

- Queue Hub
- Issue Action Hub

## Acesso local

Abra `docs-site/index.html` no navegador.

Credenciais iniciais:

- Login: `cactuscorp`
- Senha: `cactuscorp@&2026`

## Observação de segurança

Este login é apenas uma barreira visual em um site estático. Em GitHub Pages, qualquer pessoa com acesso ao código publicado consegue ver a senha no JavaScript. Para segurança real, use repositório privado, GitHub Pages privado/Enterprise ou uma camada com autenticação corporativa.

## Exportar PDF

Clique em `Exportar PDF` e escolha `Salvar como PDF` na impressão do navegador.

## Adicionar novos apps

O layout já está preparado para múltiplos apps. Para adicionar outro app:

1. Adicione um novo botão em `.app-nav` com um `data-app` único.
2. Cadastre título e placeholder em `APPS`, no arquivo `app.js`.
3. Crie um novo bloco `.app-hero` com `data-app-hero`.
4. Crie um novo bloco `.app-docs` com `data-docs-app` e cards `.searchable`.
