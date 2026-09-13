---
title: Vietnamese Legal GraphRAG
role: AI / Full-stack Engineer
period: Apr 2026 – Present
summary: A GraphRAG system that maps Vietnamese legal text into a knowledge graph and answers questions with transparent citations.
repo: https://github.com/ductai05/VietLegalGraphRAG
tags: [GraphRAG, LLM, OCR, Neo4j, FastAPI]
metrics:
  - value: 7.4M
    label: legal articles indexed
  - value: 350K
    label: document chunks
featured: true
order: 1
---

## Problem

Vietnamese legal text is dense, cross-referential, and written for lawyers. A citizen
asking a plain question gets either an unusable wall of statute or a confident answer
with no provenance.

## Approach

The pipeline maps statutes into a knowledge graph, so retrieval follows the citation
structure rather than guessing from surface similarity. Domain jargon is resolved with
`vietlegal-harrier` embeddings, and an LLM adapts the register of the answer to the
reader's role.

A separate module handles scanned contracts: PaddleOCR extracts the text, and the same
retrieval stack assesses legal risk against it.

## Results

Over 7.4 million legal articles and 350K document chunks are indexed. Answers are served
through FastAPI microservices and carry citations back to the source statute.
