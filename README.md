# LMS Assignment: WebView, Notifications & Video Player

A premium Expo React Native application built with **Expo Router**, **Expo Video**, and **React Native Reusables**.

## 🚀 Features

### 1. WebView Integration
- Embeds the Apple website with high performance using `react-native-webview`.
- **Bonus:** Triggers an **"Apple website loaded 🍎"** notification automatically once the page is fully loaded.
- Premium UI with a full-screen edge-to-edge layout.

### 2. Notification System
- Two distinct manual notification triggers with configurable delays (2s and 5s):
    - **iPhone 16: Price Drop! 📉** (2s delay)
    - **iPhone 17: Now Live! 🚀** (5s delay)
- Buttons feature **interactive loading states** (ActivityIndicator) during the delay period.
- Uses `expo-notifications` with a custom global handler in `_layout.tsx` for reliable foreground visibility.
- **Bonus:** Tapping any notification automatically navigates the user to the Video Player page.

### 3. Advanced Video Player
- Plays HLS streams using the modern `expo-video` SDK.
- Full custom control suite:
    - **Play/Pause** with reactive state UI.
    - **Mute/Unmute** toggle.
    - **Seek Backward/Forward** (10s increments).
    - **Fullscreen** support via native API.
- **Bonus: Auto-Pause**: The video automatically pauses when you switch tabs or navigate away from the player.
- **Bonus: Stream Switcher**: Cycle through multiple high-quality HLS/MP4 streams.

### 4. UI/UX Excellence
- Styled with **NativeWind (Tailwind CSS)**.
- Uses **React Native Reusables** for high-quality, accessible components.
- Consistent theme support and polished layout with absolute overlays.

## 🛠 Tech Stack
- **Framework:** Expo (SDK 54)
- **Navigation:** Expo Router (File-based)
- **Video:** `expo-video` (Managed API)
- **Notifications:** `expo-notifications`
- **Styling:** NativeWind / Tailwind CSS
- **Components:** React Native Reusables (based on Radix UI / Shadcn patterns)

## 📦 Getting Started

### 1. Prerequisites
- Node.js installed on your machine.
- Expo Go app installed on your physical device.

### 2. Setup
```bash
# Install dependencies
npm install

# Start the development server (clearing cache is recommended)
npm run dev
```

### 3. Running the App
- When the QR code appears in your terminal, scan it with your phone's camera (iOS) or the Expo Go app (Android).
- Ensure your phone and computer are on the same Wi-Fi network.

## 📝 Implementation Choices
- **Expo Router:** Chosen for robust navigation and deep-linking capabilities.
- **Expo Video:** Migrated from `expo-av` to the newer `expo-video` SDK for better performance and future-proofing.
- **ActivityIndicator**: Used within buttons to provide visual feedback during notification delays.
- **Focus Listeners**: Used `@react-navigation/native` focus hooks to manage video playback state globally.

---
*Developed as part of the LMS React Native Assignment.*
