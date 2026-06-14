---
layout: post.liquid
title: "How We Built The Lens: 10 Philosophies in 1 API Call"
date: 2026-06-14
category: Tech
tags: ["posts", "tech"]
description: "An under-the-hood look at building a wildly fast, zero-dependency philosophical AI tool using Vercel Edge Functions and Groq's Llama 3.3."
---

<img src="/images/screenshot.png" alt="Screenshot of The Lens homepage" style="max-width: 100%; border-radius: 8px; margin: 2rem 0; box-shadow: 0 4px 24px rgba(0,0,0,0.4);" />

## The Vision (Non-Technical)
Philosophy is often perceived as inaccessible, overly academic, and deeply Western-centric. When facing a difficult question—personal, ethical, or existential—most people only have access to one or two mental frameworks. This creates blind spots.

The Lens was built to remove that constraint. The core metaphor is simple: a single beam of light passing through a prism, splitting into distinct, coherent perspectives. One question in. Ten worldviews out.

## The Architecture (Technical Deep-Dive)
The Lens was designed to be incredibly fast, stateless, and completely free to run. We intentionally avoided heavy frontend frameworks like React or Next.js to prove that modern Vanilla Javascript is often more than enough.

### 1. The Frontend (Zero Dependencies)
The entire interface is built with raw HTML5, CSS3, and Vanilla JavaScript. By avoiding a build step and heavy framework bundles, the app loads almost instantly. All styling is done with CSS variables, allowing for dynamic accent colors for each of the 10 schools of philosophy without shipping any UI libraries.

### 2. The Backend (Vercel Edge Functions)
Instead of a traditional Node.js server, we used Vercel Edge Functions. This allows the API route (`/api/analyze`) to execute globally, close to the user, with virtually zero cold-start latency. It also handles our IP-based rate limiting (preventing abuse) before the request ever reaches the AI.

### 3. The AI Engine (Groq & Llama 3.3)
Originally planned with Anthropic's Claude API, we pivoted to **Groq** to leverage their custom LPU (Language Processing Unit) hardware. Running the `Llama-3.3-70b-versatile` open-source model on Groq yields text generation speeds exceeding 500 tokens per second. This is what allows The Lens to populate 10 distinct philosophical breakdowns almost simultaneously.

We strictly prompt the model to return a structured JSON object, which the Edge Function parses, validates, enriches with our internal color/school config, and sends to the client.

<img src="/images/json-screenshot.png" alt="Structured JSON response from the Groq API" style="max-width: 100%; border-radius: 8px; margin: 2rem 0; box-shadow: 0 4px 24px rgba(0,0,0,0.4);" />

## Testing & Results
As part of our commitment to quality and accessibility, we rigorously tested the application.

<img src="/images/lighthouse-screenshot.png" alt="Lighthouse audit showing 100 Accessibility, 100 Best Practices, and 100 SEO" style="max-width: 100%; border-radius: 8px; margin: 2rem 0; box-shadow: 0 4px 24px rgba(0,0,0,0.4);" />

<ul>
  <li><strong>Lighthouse Accessibility:</strong> 100 / 100 (WCAG AA Compliant)</li>
  <li><strong>Lighthouse Best Practices:</strong> 100 / 100</li>
  <li><strong>Lighthouse SEO:</strong> 100 / 100</li>
</ul>

The site respects `prefers-reduced-motion` to disable animations for users who request it, and is fully navigable via keyboard.

## Conclusion
The Lens proves that you can build deeply engaging, highly technical AI applications without complex state management or expensive infrastructure. By combining the speed of Groq, the global reach of Vercel Edge, and the simplicity of Vanilla JS, we created a tool that gets out of the way and lets the philosophy do the talking.

You can try it out yourself at [The Lens](https://the-lens-nine.vercel.app).
