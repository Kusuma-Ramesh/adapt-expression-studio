# AdaptFER: Personalized Facial Expression Recognition System

AdaptFER is an AI-powered personalized facial expression recognition system that improves the performance of a generic facial expression recognition model through lightweight user calibration. Unlike traditional facial expression recognition systems that use a single generic model for all users, AdaptFER adapts to an individual's unique facial expression patterns, resulting in more accurate and reliable recognition.

This repository contains the complete frontend prototype developed using **React, Vite, Tailwind CSS, and JavaScript**, integrated with a **FastAPI backend** that serves facial expression predictions and evaluation metrics.

---

## Project Overview

The system follows a complete personalized facial expression recognition workflow:

1. **Baseline Evaluation**
   - Generic DeepFER predicts one of seven facial expressions.
   - Baseline performance is recorded.

2. **User Calibration**
   - The user performs a short calibration session.
   - Personalized expression patterns are collected.

3. **AdaptFER Personalization**
   - The personalized model adapts to the user's facial characteristics.

4. **Evaluation**
   - Generic DeepFER and Personalized AdaptFER are compared using evaluation metrics.

5. **Interaction Lab**
   - Recognized facial expressions are mapped to hands-free application controls.

---

## Supported Facial Expressions

- Happy
- Sad
- Angry
- Fear
- Surprise
- Disgust
- Neutral

---

# Features

## Overview Dashboard

- Modern AI research-inspired interface
- Personalization workflow visualization
- System overview cards
- Responsive design

---

## Baseline Recognition

- Webcam interface
- Live prediction display
- Expression probability bars
- Confidence indicator
- Baseline expression testing

---

## Calibration Module

- Guided expression calibration
- Circular progress indicator
- Expression completion tracking
- Personalized dataset collection workflow

---

## Personalized AdaptFER

- Generic vs Personalized model toggle
- Real-time prediction display
- Confidence visualization
- Probability distribution for all seven expressions

---

## Evaluation Dashboard

Performance comparison between Generic DeepFER and Personalized AdaptFER including:

- Overall Accuracy
- Average Confidence
- Relative Error Reduction
- Per-expression Recall Comparison
- Expression Breakdown Table
- Confusion Matrix Placeholders

Evaluation metrics are dynamically loaded from the FastAPI backend.

---

## Interaction Lab

Demonstrates facial-expression-based hands-free interaction using customizable mappings.

Example controls:

| Expression | Action |
|------------|--------|
| Surprise | Next |
| Happy | Select |
| Angry | Back |
| Neutral | Idle |

---

# Technology Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS

### Backend

- FastAPI
- Python

### Machine Learning

- TensorFlow (planned for full model integration)
- Personalized AdaptFER pipeline

---

# Project Structure

```text
src/
├── api/
│   └── adaptferApi.js
├── components/
│   └── adaptfer/
├── hooks/
├── lib/
├── routes/
│   ├── overview.jsx
│   ├── baseline.jsx
│   ├── calibration.jsx
│   ├── adaptfer.jsx
│   ├── compare.jsx
│   └── lab.jsx
└── styles.css
```

---

# Backend Integration

The frontend communicates with a FastAPI backend through REST APIs.

Available endpoints include:

| Endpoint | Purpose |
|----------|----------|
| `/health` | Backend status |
| `/models/status` | Model availability |
| `/predict/generic` | Generic DeepFER prediction |
| `/predict/personalized` | Personalized AdaptFER prediction |
| `/results` | Evaluation metrics |
| `/comparison` | Model comparison statistics |

---

# Installation

Clone the repository

```bash
git clone https://github.com/Kusuma-Ramesh/adapt-expression-studio.git
```

Navigate into the project

```bash
cd adapt-expression-studio
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

---

# Deployment

The frontend is designed for deployment on **Vercel**.

The backend can be deployed separately using platforms such as Render or Railway.

---

# Future Enhancements

- TensorFlow personalized model integration
- Real-time webcam inference
- Dynamic confusion matrix visualization
- User profile management
- Calibration data persistence
- Continuous personalization

---

# Author

**Kusuma R**

Computer Science and Engineering

---

# License

This project is developed for educational and research purposes.
