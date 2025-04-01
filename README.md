# Objetivo

Este projeto é focado na construção de um back-end para um serviço de leitura de imagens. O objetivo é criar uma API REST em Node.js com TypeScript, integrada à API do Google Gemini, para extrair medidas a partir de imagens de medidores de água e gás.

## Funcionalidades do Projeto
Receber e processar imagens

Endpoint POST /upload: Recebe uma imagem em Base64, envia para a API do Google Gemini e retorna a medida extraída, um link da imagem e um UUID.

Confirmar ou corrigir medidas

Endpoint PATCH /confirm: Permite que um valor lido pelo LLM seja confirmado ou corrigido pelo usuário.

Listar medições de um cliente

Endpoint GET /<customer_code>/list: Retorna todas as medições de um cliente, com a opção de filtrar por tipo (água ou gás).

## Como rodar
Use o docker-compose up
