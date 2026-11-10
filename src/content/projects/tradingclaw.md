---
title: TradingClaw
role: AI / Backend Engineer (Group Project)
period: Apr 2026 – Jul 2026
summary: A FastAPI trading backend with Binance Testnet sandbox orders, a gateway to ML services, a Gemini tutor, and per-request LLM cost logging.
repo: https://github.com/ductai05/TradingClaw
tags: [FastAPI, PostgreSQL, Binance Testnet, Gemini, FinBERT]
metrics: []
featured: true
order: 2
---

## Problem

Learning to trade on a live exchange puts real money at risk, and machine-learning
signals are hard to judge without somewhere safe to act on them.

## Approach

A FastAPI backend handles authentication and places sandbox orders through Binance
Testnet. A gateway fronts the ML services (FinBERT for sentiment, Kronos for price
prediction, Isolation Forest for anomaly detection) and keeps a history of their
results. Gemini powers the AI trading tutor.

## Results

Application data lives in Supabase PostgreSQL. Middleware logs the tokens and cost of
every LLM request, so model spend is visible per call.

## My role

AI / Backend Engineer (Group Project). This was built as part of a team, not solo.
