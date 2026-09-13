---
title: 'KPTER: K-Pointer for Temporal Event Retrieval'
venue: SOICT 2025
year: 2025
authors:
  - Nguyen Le Hoang Trung
  - Team WATLERE
award: Best Presentation Award
abstract: A sequential re-ranking algorithm for temporal event retrieval, paired with Weighted Reciprocal Rank Fusion, evaluated within a zero-shot multimodal retrieval framework combining OCR, ASR, semantic embeddings, and open-vocabulary object detection.
code: https://github.com/htrung1105
---

KPTER addresses temporal alignment in video event retrieval: given a natural-language
description of an event, find not just the right video but the right moment in it.

The K-Pointer algorithm re-ranks candidates sequentially rather than scoring them
independently, and Weighted Reciprocal Rank Fusion (WRRF) combines evidence across
modalities without requiring a trained fusion model.

The surrounding pipeline is zero-shot end to end, integrating OCR, ASR, semantic
embeddings, and open-vocabulary object detection.

Presented at SOICT 2025, where it received the Best Presentation Award. The same system
placed in the top 12 of more than 80 teams at AI Challenge HCMC 2025.
