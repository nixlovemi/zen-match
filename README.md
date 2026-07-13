# Zen Match (Mahjong-like Tile Matching Game)
### A vanilla JavaScript client-side puzzle game utilizing custom randomized matrix distribution engines, non-colliding layer spawning algorithms, and real-time DOM state orchestration.

---

## 📐 Architecture & Gameplay Overview
Zen Match is a lightweight Mahjong-inspired matching game built purely with vanilla web standards (HTML5, CSS3, ES6+). 

The game presents stacked multi-layered tiles that players must match in groups of three. Behind its clean user interface, the game operates a centralized state machine that continuously monitors collision layers, dynamic z-indexing hierarchy, and tile collection logic over a dedicated data array pipeline.

---

## 🚀 Game Engineering & Algorithmic Implementations

- **Weighted Shuffle & Solvability Engine:** Engineered a customized mathematical distribution pipeline (`generatePieces`) that guarantees game solvability. The algorithm calculates absolute 3-tile multiples, structures a 75/25 distribution weight favoring 6 core piece types, and executes a randomized shuffle vector to prevent unsolvable maps.
- **Dynamic 2D Spatial Collision Matrix:** Programmed an automated coordinate generation algorithm (`isColliding`) using multi-axis spatial delta verification (`Math.abs`). This engine guarantees non-overlapping stack boundaries across a variable canvas prior to runtime layout rendering.
- **Hierarchical Z-Index & Depth Buffering:** Designed a serverless depth layer management system that calculates real-time multi-level piece indexing. The system dynamically updates accessibility flags (`hidden` masks) and updates positional multi-axis translations (`top`/`left` offsets) as players clear structural tiles.
- **State Sorting & Execution Filters:** Optimized matching queues (`orderBottomBar`) via atomic array sorting mechanisms (`localeCompare`) synchronized with real-time UI element injection vectors.
- **Asset Redirection State:** Features an automated victory evaluation listener that securely tracks zero-tile boundaries on the global matrix map and gracefully updates browser route parameters upon condition fulfillment.

---

## 💻 Tech Stack & Architecture

- **Engine Runtime:** Vanilla JavaScript (ES6+ Native DOM manipulation)
- **Styling Architecture:** CSS3 (Absolute coordinate positioning, depth matrix translation layers)
- **Markup:** Semantic HTML5 Canvas Wrapper Container
- **Core Algorithms:** Multi-variable random interpolation, 2D proximity delta checks, programmatic sorting arrays
