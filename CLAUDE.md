# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NTS-1 Web Controller is a Vue.js application that provides browser-based control for the KORG Nu:Tekt NTS-1 synthesizer via Web MIDI API. The app features real-time sound editing through virtual knobs, a virtual keyboard interface, and patch management with LocalStorage.

## Development Commands

- `npm run dev` - Start development server (localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint on Vue/JS/TS files in src/
- `npm run type-check` - Run TypeScript type checking without emitting files
- `npm run test:unit` - Run unit tests with Vitest
- `npm run gh-pages` - Build and copy to docs/ for GitHub Pages deployment

## Architecture

### Core Technologies
- **Vue 3** with Composition API and `<script setup>` syntax
- **Quasar Framework** for UI components and styling
- **WebMIDI.js** for MIDI communication with NTS-1 hardware
- **TypeScript** for type safety
- **Vite** as build tool

### Key Components Structure
- `src/App.vue` - Root component with Quasar layout
- `src/components/Main.vue` - Primary controller interface with all synthesizer parameters
- `src/components/Knob.vue` - Reusable knob control component
- `src/components/Keyboard.vue` - Virtual MIDI keyboard
- `src/components/StoreButton.vue` - Patch save/load buttons

### State Management
- Uses Vue 3 Composition API with reactive state
- No external state management library (Vuex/Pinia)
- Patch data stored in browser LocalStorage
- MIDI device state managed in Main.vue

### NTS-1 MIDI Implementation

NTS-1 MIDI Implementation details is [here](https://cdn.korg.com/jp/support/download/files/fc90397a1fbf692b1ba2f22c4079985a.pdf).

### MIDI Parameter Mapping
- `src/lib/params.ts` contains all NTS-1 MIDI CC mappings
- Parameters organized by synthesizer sections: OSC, Filter, EG, Modulation, Delay, Reverb, Arpeggiator
- Each parameter has min/max values, step size, display label, and MIDI CC number

### Type Definitions
- `src/types/components.ts` defines PatchData interface structure
- `src/lib/params.ts` exports parameter configuration interfaces
- Path alias `@/` maps to `src/` directory

### Build Configuration
- Vite config includes Quasar plugin and Vue setup
- Production builds use `/nts1-web-controller/` base path for GitHub Pages
- TypeScript config enables strict mode with bundler module resolution