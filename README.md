# 🏟️ Smart Stadium Assistant

> **AI-powered venue intelligence — guiding 50,000+ fans in real time.**

A premium, hackathon-grade web application built with pure HTML, CSS, and JavaScript. Smart Stadium Assistant acts as an intelligent guide inside a stadium — providing real-time crowd predictions, personalized seat navigation, live stats, and an interactive AI chatbot — all without a single backend dependency.

---

## 🧩 Problem Statement

Modern stadiums host tens of thousands of fans simultaneously, yet most venues still rely on:
- Static printed signage that can't reflect real-time crowd conditions
- Long queues at information desks for basic queries
- No smart navigation for first-time or elderly visitors
- Zero crowd awareness tools during emergency evacuations

**Result:** Frustrated fans, missed experiences, and avoidable safety risks.

---

## 💡 Solution

**Smart Stadium Assistant** simulates a real-world AI-powered stadium intelligence system. It runs entirely in the browser and provides:

- Instant AI responses to fan queries via a floating chat panel
- Crowd density visualization on a live interactive stadium map
- Personalized seat-to-amenity route generation
- Emergency evacuation protocol with step-by-step guidance
- Predictive crowd forecasting with confidence scores

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 Floating AI Chat Panel | Glassmorphism chat panel with smooth scale + fade animation triggered by a FAB button |
| 🧠 Crowd Prediction Engine | Simulates AI-based crowd surge forecasts per gate with confidence % bars (auto-refreshes) |
| 🗺️ Live Stadium SVG Map | Color-coded interactive map — 🟢 low, 🟡 medium, 🔴 high crowd — with clickable gate tooltips |
| ⚡ Animated Pulse Rings | Pulsing SVG rings on overcrowded gates for instant visual alert |
| 🧭 Personalized Navigation | Enter your seat number → get a custom step-by-step route to your seat, food, and washroom |
| 🚨 Emergency Exit Protocol | Full-screen overlay with 4-step evacuation guide and live countdown timer |
| ⚡ Quick Action Grid | 6-button shortcut panel (Food, Washroom, Exit, Seat, Crowd, Ask AI) with live-updating badges |
| 🎙️ Voice Input | Web Speech API mic integration with animated waveform banner |
| 📊 Live Stats Dashboard | Capacity %, attendee count, food wait time, open gates — auto-updates every 6 seconds |
| 💡 Rotating AI Tips | 8 contextual stadium tips that rotate every 18 seconds with manual refresh |
| ⏱️ Live Match Timer | Real-time ticking match clock in the header |
| 🌓 Dark / Light Theme | Smooth toggle with slider animation, sun/moon icons, saved to localStorage |
| ✨ Particle Canvas Background | 90-particle connected-node animation engine — pure JavaScript, zero libraries |
| 💬 Typing Indicator | 3-dot bounce animation before every AI response |
| 📱 Fully Responsive | Works on desktop, tablet, and mobile |

---

## 🎯 AI Response Engine

The chatbot uses a keyword-matching intent engine covering **13 intent categories**:

| Intent | Trigger Keywords | Response |
|---|---|---|
| 🍔 Food | food, eat, hungry, snack, burger, pizza, stall | Gate 3 stall, ~5 min wait |
| 🚻 Washroom | toilet, washroom, bathroom, restroom, loo | Gate 2, clean & available |
| 🚪 Exit | exit, leave, gate, out, way out | Gate 4 (least crowded) |
| 💺 Seat | seat, section, row, direction, navigate | Enter seat for custom route |
| 👥 Crowd | crowd, busy, rush, traffic, congested | Gate 2 heavy → use Gate 4 |
| 🚗 Parking | parking, car, lot | Lot A (West) 40% full |
| 🏥 Medical | medical, first aid, ambulance, hurt | Gate 1 medical station |
| 👋 Greeting | hi, hello, hey | Welcome message |
| 🤖 Default | anything else | General assistant prompt |

---

## 🗺️ Stadium Map Guide

| Gate | Position | Crowd Level | Recommendation |
|---|---|---|---|
| Gate 1 | North | 🟢 Low | Safe to use — accessible entrance available |
| Gate 2 | East | 🔴 High | Avoid — heavy congestion detected |
| Gate 3 | South | 🟡 Medium | Moderate — 3 min wait estimated |
| Gate 4 | West | 🟢 Low | ✅ Recommended exit — least crowd |

---

## 🗂️ Project Structure

```
smart-stadium-assistant/
├── index.html    ← Full app layout, SVG map, overlay modals
├── style.css     ← Dark/light theme, glassmorphism, particle bg, all animations
├── script.js     ← AI engine, particle canvas, live data, voice input, all interactivity
```

---

## 🚀 How to Run

1. Clone the repository:
  https://github.com/aman-singh-ai/smart-stadium-assistant.git

2. Open the project folder:
   cd smart-stadium-assistant

3. Open index.html in your browser

OR

👉 Live Demo:
(https://smart-stadium-assistant.netlify.app/)
---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| **HTML5** | Semantic structure, accessible ARIA roles, SVG stadium map |
| **CSS3** | CSS custom properties, glassmorphism, keyframe animations, responsive grid |
| **Vanilla JavaScript** | AI engine, Canvas particle system, Web Speech API, localStorage, real-time simulation |

> **Total size: < 1 MB** — no frameworks, no libraries, no CDN dependencies (except Google Fonts).

---

## 🔮 Future Scope

| Feature | Description |
|---|---|
| 🌐 Live Sensor API | Connect to real IoT crowd sensors for true real-time gate data |
| 🤖 LLM Integration | Replace keyword engine with GPT-4 / Gemini for natural language understanding |
| 📲 PWA / Mobile App | Install as a Progressive Web App or wrap in React Native for kiosk deployment |
| 🗺️ AR Navigation | Augmented reality in-stadium turn-by-turn routing via phone camera |
| 🔔 Push Alerts | Notify fans about flash deals, crowd changes, or gate closures |
| 🌍 Multilingual Support | Serve international fans in their native language |
| 📊 Admin Dashboard | Venue managers get a real-time crowd heatmap and alert control panel |
| 🧾 Digital Ticketing | Integrate with ticket systems for seat validation and upgrades |

---

## 👨‍💻 Author

Built as a **smart stadium tech demo** showcasing AI-powered venue intelligence.
Hackathon-ready — premium UI, zero dependencies, under 1 MB.

---

*Smart Stadium Assistant © 2026 — Powered by AI-driven venue intelligence*
