# Study Timer Widget

A Notion-embeddable study timer dashboard hosted on GitHub Pages.

## Features

- Two study timers:
  - Orgo: 6 hours per week
  - Micro: 10 hours per week
- Circle progress visuals
- Start and pause stopwatch-style controls
- One active timer at a time
- Weekly reset every Monday at midnight
- Current week and previous week history
- Google Sheets storage through Apps Script
- Works across devices because the timer data is saved in Google Sheets

## File Structure

```text
Study-Timer-Widget/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   ├── api.js
│   ├── timer.js
│   └── ui.js
└── README.md
