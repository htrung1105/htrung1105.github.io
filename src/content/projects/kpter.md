---
title: 'KPTER: K-Pointer for Temporal Event Retrieval'
role: Co-author, Team WATLERE
period: Jul 2024 – Nov 2025
summary: A multimodal video retrieval system for KIS, VQA and TRAKE, with WRRF fusion and a K-Pointer algorithm that finds time-ordered event sequences in O(KN). Published at SOICT 2025 (Springer CCIS).
paper: https://doi.org/10.1007/978-981-92-2587-3_24
tags: [Multimodal Retrieval, Video Retrieval, CLIP, Milvus, Elasticsearch]
metrics:
  - value: Best Presentation
    label: SOICT 2025
  - value: Top 12 / 80+
    label: AI Challenge HCMC 2025
  - value: 82/88
    label: preliminary score
featured: true
order: 0
cover: ../../assets/banners/kpter.svg
coverAlt: Video frames with three pointers marking an ordered event sequence
---

## Overview

Given a description of several events that happen one after another, the system has to
find the video moments that match them in the right order. KPTER is the team's system for
the KIS, VQA and TRAKE tasks, published in the SOICT 2025 proceedings (Springer CCIS
vol. 2913, pp. 304–318).

## Highlights

- **Multimodal extraction:** a pipeline with CLIP + BEiT-3, OCR (PaddleOCR, VietOCR,
  Qwen-2.5-VL), ASR (Whisper) and object detection (YOLO-World), indexing vectors into
  Milvus and OCR/ASR text into Elasticsearch.
- **Ranking:** fused multi-source results with Weighted Reciprocal Rank Fusion (WRRF).
- **K-Pointer:** finds time-ordered event sequences in **O(KN)** instead of K nested loops.
- **Recognition:** Best Presentation Award at SOICT 2025; **Top 12 of 80+** teams at AI
  Challenge HCMC 2025 with a preliminary score of **82/88**.

## Paper

Duc Anh Khoa Dinh, Duc-Tai Dinh, **Le Hoang Trung Nguyen**, Thanh Nhan Nguyen (equal
contribution). *KPTER: K-Pointer for Temporal Event Retrieval.* SOICT 2025, Springer CCIS
vol. 2913, pp. 304–318.
[doi:10.1007/978-981-92-2587-3_24](https://doi.org/10.1007/978-981-92-2587-3_24)
