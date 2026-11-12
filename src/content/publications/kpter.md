---
title: 'KPTER: K-Pointer for Temporal Event Retrieval'
venue: SOICT 2025 · Springer CCIS vol. 2913, pp. 304–318
year: 2025
authors:
  - Duc Anh Khoa Dinh
  - Duc-Tai Dinh
  - Le Hoang Trung Nguyen
  - Thanh Nhan Nguyen
award: Best Presentation Award
abstract: A multimodal video retrieval system for KIS, VQA and TRAKE that fuses CLIP + BEiT-3 embeddings, OCR, ASR and open-vocabulary object detection with Weighted Reciprocal Rank Fusion, and finds time-ordered event sequences with a K-Pointer algorithm in O(KN).
pdf: https://doi.org/10.1007/978-981-92-2587-3_24
---

Authors contributed equally.

The extraction pipeline combines CLIP + BEiT-3, OCR (PaddleOCR, VietOCR, Qwen-2.5-VL),
ASR (Whisper) and object detection (YOLO-World). Vectors are indexed in Milvus and OCR/ASR
text in Elasticsearch. Results from the different sources are fused with WRRF, and the
K-Pointer algorithm finds time-ordered event sequences in O(KN) instead of K nested loops.

The same system placed in the top 12 of more than 80 teams at AI Challenge HCMC 2025, with
a preliminary score of 82/88. Read the [project write-up](/work/kpter).
