---
title: Sino-Nom / Chinese OCR
role: ML Engineer (Group Project)
period: Nov 2025 – Dec 2025
summary: Fine-tuned PP-OCRv5 text detection on degraded historical Sino-Nom documents, lifting H-mean by 30.2% relative (0.731 → 0.952).
repo: https://github.com/ductai05/NLP-ChineseOCR
tags: [OCR, PaddlePaddle, Computer Vision, Go]
metrics:
  - value: +30.2%
    label: H-mean (0.731 → 0.952)
  - value: '0.966'
    label: precision
  - value: 3.4K
    label: document images
featured: true
order: 3
---

## Problem

Off-the-shelf detection fails on heavily degraded Sino-Nom characters. Historical scans
carry bleed-through, faded strokes, and irregular column layout that modern training
data never covers.

## Approach

A concurrent Go crawler collected and preprocessed the CWKB historical dataset — over
3.4K document images. PP-OCRv5 detection (PP-HGNetV2-B4 backbone, DB algorithm) was
fine-tuned on PaddlePaddle GPU, trained across 2× NVIDIA T4 with Cosine Annealing and an
optimised DBLoss.

## Results

H-mean improved by 30.2% relative, from 0.731 to 0.952, at 0.966 precision on the NomNaOCR
benchmark.

## My role

ML Engineer (Group Project). This was built as part of a team, not solo.
