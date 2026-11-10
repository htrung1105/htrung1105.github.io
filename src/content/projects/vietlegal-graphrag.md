---
title: Vietnamese Legal GraphRAG
role: AI Engineer (Group Project)
period: Apr 2026 – Jul 2026
summary: A GraphRAG system that maps Vietnamese legal text into a knowledge graph and answers questions with transparent citations.
repo: https://github.com/ductai05/VietLegalGraphRAG
tags: [GraphRAG, LLM, OCR, Neo4j, FastAPI]
metrics:
  - value: 353,746
    label: legal documents
  - value: 7.48M
    label: text chunks
featured: true
order: 1
---

## Problem

Vietnamese legal text is dense, cross-referential, and written for lawyers. A citizen
asking a plain question gets either an unusable wall of statute or a confident answer
with no provenance.

## Approach

The pipeline maps statutes into a Neo4j knowledge graph, so multi-hop questions follow
the citation structure rather than guessing from surface similarity. Retrieval fuses BM25
with dense search over `darklethelong/vnlegal-lal` embeddings using Reciprocal Rank
Fusion, and a cross-encoder reranks the result. An LLM adapts the register of the answer
to the reader's role.

Scanned documents go through Google Cloud Vision OCR, and the extracted text feeds the
same retrieval stack.

## Results

The corpus is 353,746 legal documents split into about 7.48 million chunks, held in a
Neo4j graph of more than 7 million nodes and 20 million edges. Hybrid retrieval raised
NDCG@10 by 12% and Recall@10 by 20%. A FastAPI agentic-RAG service answers in under
5 seconds and carries citations back to the source statute.

## My role

AI Engineer (Group Project). This was built as part of a team, not solo.
