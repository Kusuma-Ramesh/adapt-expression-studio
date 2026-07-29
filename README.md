# Adapt Expression Studio

Build a polished frontend prototype for a project called “AdaptFER”.

AdaptFER is a personalized facial expression recognition system. A generic DeepFER model recognizes 7 facial-expression classes (Happy, Sad, Angry, Fear, Surprise, Disgust, Neutral), then the user completes a short calibration process so the system can personalize recognition to their facial-expression patterns. Later, the real application will connect to a Python/TensorFlow backend.

For now, build ONLY the frontend experience using mock/demo data. Do not build a backend, database, authentication, AI API, or real ML inference.

TECH:

- React

- Vite

- Tailwind CSS

- JavaScript

- Must be responsive

- Must be easy to export to GitHub and deploy on Vercel

- Organize the code into reusable components

- Keep future API integration easy

DESIGN DIRECTION:

Create a premium AI research/product interface, not a typical college project dashboard.

Use a sophisticated dark interface with restrained accent colors, subtle gradients, soft glow, glass-like panels, clean typography and smooth micro-animations.

The visual identity should represent:

personalization, calibration, human + AI adaptation, facial signals and continuous learning.

Avoid:

- excessive emojis

- cartoon styling

- generic emotion-colored cards

- huge neon gradients everywhere

- clutter

- medical appearance

- chatbot appearance

- generic admin dashboard appearance

The product should feel like an experimental AI platform.

NAVIGATION:

Create a simple top navigation or compact sidebar containing:

Overview

Baseline

Calibration

AdaptFER

Compare

Interaction Lab

Include an AdaptFER logo/wordmark and a small system status indicator.

SCREEN 1 — OVERVIEW

Create a strong landing/dashboard screen.

Main heading:

“AI that adapts to the way you express.”

Supporting text:

“AdaptFER personalizes facial-expression recognition through lightweight user calibration.”

Primary button:

“Start Personalization”

Secondary button:

“Explore System”

Include a visual representation of the pipeline:

Generic DeepFER → Baseline → Calibration → Personalized AdaptFER → Interaction

Also show small cards for:

7 Expression Classes

Personal Calibration

Real-Time Recognition

Generic vs Personalized Evaluation

SCREEN 2 — BASELINE

This screen will eventually test the generic DeepFER model on the user.

Create a large webcam placeholder.

Beside it show:

Current Expression

Confidence

Live Signal

Show mock probability values for the seven classes using elegant horizontal bars.

Include:

“Begin Baseline Test”

During the mock test, show an instruction such as:

“Show: SURPRISE”

with progress:

Expression 3 of 7

Include a small confidence history visualization.

SCREEN 3 — CALIBRATION

Make this screen visually important.

Heading:

“Teach AdaptFER how you express.”

Show:

Expression being calibrated

Camera placeholder

Countdown

Capture progress

Calibration progress: e.g. 3 / 7

Use a circular or elegant progress visualization.

Example:

SURPRISE

“Show this expression naturally and hold.”

After capture, visually mark that expression as calibrated.

Show all seven expressions as small status indicators:

Happy

Sad

Angry

Fear

Surprise

Disgust

Neutral

SCREEN 4 — ADAPTFER LIVE

Create a real-time personalized recognition screen.

Large camera area.

Display:

Personalized Prediction

Confidence

Signal Stability

Calibration Active

Include a toggle:

Generic DeepFER | AdaptFER

Changing the toggle should update MOCK values so the interface demonstrates how comparison will eventually work.

Also display the seven-class probability distribution.

SCREEN 5 — COMPARE

Create a professional model-evaluation dashboard comparing:

Generic DeepFER

vs

Personalized AdaptFER

Use mock data.

Include:

Accuracy

Average Confidence

Prediction Stability

Expressions Improved

Add a comparison chart.

Create an expression-by-expression table:

Expression | Generic | AdaptFER | Change

Also include placeholders/cards for:

Generic Confusion Matrix

AdaptFER Confusion Matrix

The page should feel like a genuine ML experiment dashboard, not a business analytics dashboard.

SCREEN 6 — INTERACTION LAB

This demonstrates using personalized facial expressions for hands-free interaction.

Create four selectable cards:

Music

Photos

Notes

Relax

Show a panel:

Expression Controls

Surprise → Next

Happy → Select

Angry → Back

Neutral → Idle

These mappings are intentional interaction commands, not interpretations of what emotions naturally mean.

Simulate the interaction using mock controls so the UI can be demonstrated before ML integration.

Show:

Detected expression

Confidence

Hold progress

Current action

GENERAL UX:

Create smooth transitions between stages.

Use mock data everywhere that will later come from the backend.

Keep webcam sections as replaceable components so real webcam streams can be integrated later.

Create reusable components for:

CameraPanel

ExpressionProbabilityBars

ConfidenceIndicator

CalibrationProgress

MetricCard

Navigation

ModelToggle

ExpressionStatus

Do not implement unnecessary functionality.

Do not add login/signup.

Do not add Supabase.

Do not create a database.

Do not call external AI APIs.

Do not implement actual facial recognition yet.

The goal of this generation is a beautiful, functional FRONTEND PROTOTYPE of the complete AdaptFER user journey that we can later connect to our Python backend.

Make all navigation and mock interactions functional.

Ensure the project can run locally and be deployed as a frontend application on Vercel.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4728d2af-bb0b-4f6d-bc9a-b98326c93362).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
