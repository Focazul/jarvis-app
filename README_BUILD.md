# Building and Installing Jarvis

This guide explains how to build the Android APK for Jarvis.

## Prerequisites

- Node.js and pnpm
- Java JDK 17+ (JDK 21 is used in this environment)
- Android SDK

## Build Steps

1.  **Install dependencies**:
    ```bash
    pnpm install
    ```

2.  **Generate Native Code**:
    ```bash
    npx expo prebuild --platform android
    ```

3.  **Build APK**:
    ```bash
    cd android
    ./gradlew assembleRelease
    ```

4.  **Locate APK**:
    After a successful build, the APK will be located at:
    `android/app/build/outputs/apk/release/app-release.apk`

    **Pre-built APK**: A pre-built version is available in the root directory as `jarvis-v1.1.0.apk`.

## Installation on Android

1.  Transfer the APK to your Android device.
2.  Open the APK file.
3.  If prompted, allow installation from unknown sources.
4.  Install and open the app.

## Features

- **Chat Interface**: Talk to Jarvis naturally.
- **Tasks**: Create, list, and delete tasks.
- **Alarms**: Set alarms with recurrence.
- **Voice Input**: Use the microphone to speak commands.
- **Settings**: Toggle dark mode, notifications, and sounds.
