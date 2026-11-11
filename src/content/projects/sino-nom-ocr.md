---
title: Sino-Nom Historical OCR
role: ML Engineer (team project)
period: Nov 2025 – Dec 2025
summary: Fine-tuned PP-OCRv5 text detection on historical Sino-Nom pages, lifting H-mean from 0.731 to 0.952 on the NomNaOCR test set.
repo: https://github.com/ductai05/NLP-ChineseOCR
tags: [OCR, PaddlePaddle, PP-OCRv5, Computer Vision]
metrics:
  - value: 0.731 → 0.952
    label: H-mean (+30.2% relative)
  - value: '0.966'
    label: precision
  - value: '0.937'
    label: recall
  - value: 3,411
    label: Sino-Nom pages
featured: true
order: 3
cover: ../../assets/banners/sinonom.svg
coverAlt: Vertical Sino-Nom text columns with detection boxes
---

## Overview

Sino-Nom documents are written in vertical columns on aged paper, and general-purpose
text detectors trained on modern print miss many of their characters. The work here was
to adapt a modern detector to these pages and measure the gain honestly on a held-out set.

## Highlights

- Fine-tuned and evaluated **PP-OCRv5** text detection (DB algorithm) on **3,411**
  Sino-Nom pages.
- H-mean rose from **0.731 to 0.952** (a 30.2% relative gain, +22.1 points), with
  precision **0.966** and recall **0.937** on the NomNaOCR test set.

## Stack

PaddlePaddle · PP-OCRv5
