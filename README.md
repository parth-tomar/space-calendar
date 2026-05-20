# Space Calendar

> *A real-time solar system clock — hover any planet to see what time it is there.*

![Solar System](https://img.shields.io/badge/planets-8-orange?style=flat-square&logo=nasa)
![Vanilla JS](https://img.shields.io/badge/vanilla-JS-yellow?style=flat-square&logo=javascript)
![No Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## Features

- **All 8 planets orbiting** the Sun at proportionally scaled speeds — Mercury races, Neptune crawls
- **Hover tooltips** revealing each planet's day length, year length, and a fun space fact
- **Live local time** — your Earth clock is scaled to each planet's day, showing what "time" it would be if you were standing there *right now*
- **Saturn's rings**, **Earth's Moon**, glowing sun corona with animated flares
- **Procedural starfield** with twinkling stars, cross-flares on bright stars, and nebula clouds
- Zero dependencies — pure HTML, CSS, and vanilla JavaScript

---

## File Structure

```
cosmos-calendar/
├── index.html   # Markup — planets, orbits, tooltip, header
├── style.css    # All styles — orbits, animations, tooltip, starfield layout
└── script.js    # Starfield canvas, live clock, planet time logic, tooltip
```

All three files must stay in the same directory — `index.html` links to the other two relatively.

---

## How Planet Time Works

Each planet has a known **solar day** (how long it takes to rotate once relative to the Sun):

| Planet  | Day Length        | Year Length       |
|---------|-------------------|-------------------|
| Mercury | 1,407.6 hours     | 88 Earth days     |
| Venus   | 5,832.5 hours     | 225 Earth days    |
| Earth   | 24 hours          | 365.25 days       |
| Mars    | 24 hrs 37 min     | 687 Earth days    |
| Jupiter | 9 hrs 56 min      | 11.86 Earth years |
| Saturn  | 10 hrs 42 min     | 29.5 Earth years  |
| Uranus  | 17 hrs 14 min     | 84 Earth years    |
| Neptune | 16 hrs 6 min      | 165 Earth years   |

The tooltip takes your **current Earth time**, scales it by the ratio of Earth's day to that planet's day, and displays the equivalent local time — updated live every second.

```js
const localHours = (earthHours / planet.dayHours) * 24;
```

---

## Planet Facts (hover to discover)

- **Mercury** — A year is shorter than its own day
- **Venus** — Rotates backwards; the sun rises in the west
- **Mars** — Home to Olympus Mons, the tallest volcano in the solar system
- **Jupiter** — The Great Red Spot storm has raged for over 350 years
- **Saturn** — Its rings are made of ice and rock, up to 1 km thick
- **Uranus** — Rotates on its side; its poles face the Sun
- **Neptune** — Winds reach 2,100 km/h, the fastest in the solar system

---

## Browser Support

Works in all modern browsers. No polyfills needed.

| Chrome | Firefox | Safari | Edge |
|--------|---------|--------|------|
| ✅     | ✅      | ✅     | ✅   |

---

## License

MIT — do whatever you want with it. A star ⭐ is appreciated.

---

<p align="center">Made with curiosity and a love for the space 🌌</p>
