---
title: Why Weighted RRF beat naive score fusion for us
date: 2026-03-15
category: project
tags: [Retrieval, Multimodal]
excerpt: Combining OCR, ASR, and embedding scores by summing them looked reasonable and performed badly. Rank fusion fixed it, and here is why.
draft: false
---

## The setup

KPTER retrieves video moments from natural-language descriptions. Evidence arrives from
four places: OCR on frames, ASR on audio, semantic embeddings, and open-vocabulary object
detection. Each returns a ranked list with its own score.

## What went wrong with score fusion

Summing raw scores assumes they share a scale. They do not. OCR confidence and cosine
similarity mean different things, and their distributions differ in both spread and shape.
Normalising per query helped a little, then broke on queries where one modality returned
nothing — the normaliser amplified noise into confident-looking evidence.

## Rank fusion

Reciprocal Rank Fusion sidesteps the problem by discarding scores and keeping only
positions. A document's fused score is the sum over lists of `1 / (k + rank)`. Scale
mismatch disappears because rank has no scale.

Weighting the per-list contribution recovers what plain RRF throws away — the knowledge
that some modalities are more reliable than others for a given query type.

## What we would check next

The weights are currently fixed. Learning them per query type is the obvious next step,
and the obvious risk is overfitting to the competition distribution.
