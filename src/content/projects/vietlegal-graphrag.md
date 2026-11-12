---
title: Vietnamese Legal GraphRAG
role: AI / Backend Engineer (team project)
period: Apr 2026 – Jul 2026
summary: A legal Q&A chatbot that grounds every answer in a Neo4j knowledge graph of Vietnamese law, with hybrid retrieval, legal-effect checks and citations.
repo: https://github.com/ductai05/VietLegalGraphRAG
tags: [GraphRAG, LangGraph, Neo4j, Elasticsearch, FastAPI]
metrics:
  - value: 353K+
    label: legal documents
  - value: 7M+ / 20M+
    label: graph nodes / edges
  - value: +12%
    label: NDCG@10
  - value: +20%
    label: Recall@10
featured: true
order: 1
cover: ../../assets/banners/graphrag.svg
coverAlt: Abstract knowledge graph of linked legal documents
---

## Overview

Vietnamese legal text is dense and heavily cross-referenced: one decree amends another,
a circular guides a law, a later act repeals an article. A chatbot that answers from text
similarity alone can cite a provision that is no longer in force. This project grounds the
answers in a knowledge graph of those relations instead.

## Highlights

- **Chatbot:** a ReAct agent (LangGraph) that calls retrieval tools, checks a law's legal
  effect through the graph and finds source links. It runs on Open WebUI, answers with
  citations, refuses when evidence is missing, and responds in **under 5 s**.
- **Data pipeline:** I owned the knowledge-graph layer, loading **353K+** legal documents
  into Neo4j (**7M+ nodes, 20M+ edges**) with amendment, repeal, guidance and citation
  relations.
- **Retrieval & evaluation:** BM25 + dense kNN (`vnlegal-lal`) on Elasticsearch, fused by
  RRF and reranked with `bge-reranker-v2-m3`, raising **NDCG@10 by 12%** and
  **Recall@10 by 20%**.
- **Document processing:** integrated Google Cloud Vision OCR for scanned contracts so the
  LLM can flag risky clauses.
- **API & ops:** built the FastAPI service and its API contract for the frontend; set up
  CI/CD with Docker and GitHub Actions.

## Stack

Neo4j · Elasticsearch · LangGraph · FastAPI · Open WebUI · Docker · GitHub Actions
