# Jarvis - Project TODO

## Core Features

### Phase 1: Setup & Infrastructure
- [x] Generate custom app logo and update branding
- [x] Setup data models (Task, Alarm schemas)
- [x] Configure local storage (AsyncStorage)
- [x] Setup navigation structure (Chat, Tasks, Alarms, Settings tabs)

### Phase 2: Chat Interface
- [x] Create Chat screen with message history
- [x] Implement message input field (text)
- [ ] Add microphone button for voice input
- [x] Create message bubble components (user/Jarvis)
- [x] Implement auto-scroll to latest message
- [x] Add loading/success/error feedback states

### Phase 3: Natural Language Processing
- [x] Parse date expressions (hoje, amanhã, sexta-feira, etc.)
- [x] Parse time expressions (7 da manhã, meio-dia, à noite, etc.)
- [x] Identify user intent (create task, create alarm, list, delete, etc.)
- [x] Extract entities (title, date, time, recurrence)
- [x] Handle missing information (ask user for clarification)
- [x] Generate Jarvis responses

### Phase 4: Task Management
- [x] Create Task data model and storage
- [x] Implement task creation via chat
- [x] Implement task listing (Today, Week, No date)
- [x] Implement mark task as complete
- [ ] Implement edit task
- [x] Implement delete task with confirmation
- [x] Create Tasks screen with tab navigation
- [ ] Create Task detail screen

### Phase 5: Alarm Management
- [x] Create Alarm data model and storage
- [x] Implement alarm creation via chat
- [x] Implement alarm listing
- [x] Implement alarm toggle (active/inactive)
- [x] Implement alarm recurrence (daily/weekly)
- [ ] Implement edit alarm
- [x] Implement delete alarm with confirmation
- [x] Create Alarms screen
- [ ] Create Alarm detail screen
- [x] Setup native alarm notifications

### Phase 6: Voice Features
- [ ] Integrate speech-to-text (expo-speech-recognition or similar)
- [ ] Capture microphone input
- [ ] Convert audio to text
- [ ] Send transcribed text to NLP processor
- [ ] Handle voice input errors

### Phase 7: Settings & Personalization
- [ ] Create Settings screen
- [ ] Implement theme toggle (light/dark)
- [ ] Implement notification preferences
- [ ] Implement sound selection for alarms
- [ ] Implement vibration toggle
- [ ] Persist user preferences

### Phase 8: Testing & Polish
- [ ] Test all chat commands
- [ ] Test task creation/editing/deletion flows
- [ ] Test alarm creation/editing/deletion flows
- [ ] Test voice input
- [ ] Test date/time parsing edge cases
- [ ] Test on iOS and Android
- [ ] Fix bugs and UI polish

### Phase 9: Delivery
- [ ] Create app logo and update branding
- [ ] Final checkpoint
- [ ] Prepare deployment instructions
