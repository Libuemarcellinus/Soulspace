# SoulSpace - Complete Screen Navigation Map

## Total Screens: 17 Frames

### 1. **Splash Screen** (`splash`)
- Animated ghost logo with heartbeat effect (pulsing glow)
- SoulSpace title with fade animation
- Tagline: "Your sanctuary for authentic emotions"
- **Auto-transitions to Onboarding after 2 seconds**

### 2-4. **Onboarding Flow** (`onboarding`)
**Slide 1:**
- Ghost icon (floating animation)
- Title: "No names. No faces. Just you."
- Description: Anonymous sharing
- Swipe gesture support

**Slide 2:**
- Animated 24h timer with rotating ring
- Title: "Post anything. It vanishes in 24h."
- Description: Ephemeral posts
- Swipe gesture support

**Slide 3:**
- Pulsing ghost icon
- Title: "Ready to be truly yourself?"
- Description: Join community
- **CTA Button: "Enter as a Ghost"** → navigates to Home Feed

### 5. **Home Feed (SoulFeed)** (`home`)
- Infinite scroll post cards
- Each post shows:
  - Anonymous ghost icon with mood badge
  - Post content
  - Expiration timer (24h countdown bar)
  - Empathy (heart) and Reply (message) counts
- Daily Unload banner at top
- Floating Action Button (FAB) for creating posts
- **Bottom Nav (4 tabs):** Feed | Circles | Pulse | Profile

### 6. **Post Creation** (`create`)
- Mood picker (6 moods: Anxious, Hopeful, Overwhelmed, Grateful, Lonely, Just Existing)
- Input mode toggle: Text | Voice | Doodle
- Text area with placeholder
- Voice recording UI (pulsing microphone)
- Doodle canvas placeholder
- Post/Cancel buttons
- Privacy note about 24h expiration

### 7. **Post Detail** (`post-detail`)
- Full post view with larger text
- Expiration timer
- Reply section ("Echoes")
- List of anonymous replies
- Action buttons: Empathy, Reply, Share, Flag
- "Add your echo" CTA

### 8. **Reply Screen** (`reply`)
- Original post preview (collapsed)
- Reply text area
- Send/Cancel buttons
- Kind guidelines reminder
- Voice/text toggle option

### 9. **Soul Circles Hub** (`circles`)
- "Trending Now" featured circle
- Grid of 6+ circles:
  - Anxiety & Peace (Brain icon, purple)
  - Heartbreak Haven (Heart icon, pink) - **Trending**
  - Night Thoughts (Moon icon, indigo)
  - New Beginnings (Sunrise icon, emerald)
  - Lost & Found (Compass icon, blue)
  - Self-Discovery (User icon, violet)
- Each shows: member count, active users
- **Bottom Nav (4 tabs):** Feed | Circles | Pulse | Profile

### 10. **Circle Feed** (`circle-feed`)
- Circle header with icon and description
- Member stats and active count
- Filtered posts from that circle only
- Same post card design as Home Feed
- FAB for creating posts
- **Bottom Nav (4 tabs):** Feed | Circles | Pulse | Profile

### 11. **Ghost Profile** (`profile`)
- Anonymous Soul ID (#7429)
- "Ghost Mode Active" badge
- Current Streak display (42 days with flame icon)
- Progress bar to next milestone
- Stats grid:
  - Souls Touched (847)
  - Echoes Shared (234)
  - Days Active (42)
- Achievements/Badges (6 total, 3 earned):
  - Kind Soul 💜 (earned)
  - Night Owl 🌙 (earned)
  - Listener 👂 (earned)
  - Vulnerable 🌸 (locked)
  - Circle Leader ⭐ (locked)
  - Healer ✨ (locked)
- Mood Journey insights
- Settings button in header
- **Bottom Nav (4 tabs):** Feed | Circles | Pulse | Profile

### 12. **Mood Pulse** (`mood-pulse`)
- "Live Pulse" indicator with active user count
- Dominant emotion display (Hopeful)
- Current Distribution chart:
  - Hopeful: 32% (up)
  - Anxious: 24% (down)
  - Grateful: 18% (up)
  - Overwhelmed: 15% (same)
  - Lonely: 11% (down)
- 24-Hour Emotional Wave graph
  - Stacked bar chart showing Hope/Anxiety/Lonely across 8 time periods
  - Color-coded legend
- Community insight message
- **Bottom Nav (4 tabs):** Feed | Circles | Pulse | Profile

### 13. **Daily Unload** (`daily-unload`)
- Sparkles icon header
- Today's prompt card with refresh button
- 7 rotating prompts:
  - "What's weighing on your soul today?"
  - "If you could tell the world one thing without judgment..."
  - "What emotion are you tired of carrying?"
  - etc.
- Large text area for response
- Two buttons: "Save Privately" | "Share with Souls"
- Streak indicator (7 days)
- Privacy reminder

### 14. **Settings** (`settings`)
**Privacy & Anonymity:**
- Ghost Mode toggle (ON)
- Blur Previews toggle

**Notifications:**
- Push Notifications toggle

**Appearance:**
- Dark Mode toggle (ON)
- Sound Effects toggle

**Support & Legal:**
- Help & Safety → link
- Privacy & Terms → link

**Account Actions:**
- Sign Out button (red)
- Version number at bottom

### 15. **Help & Safety** (`help`)
- Crisis Alert banner (red/orange) with "Call 988 Now"
- Crisis Resources cards:
  - National Suicide Prevention Lifeline (988)
  - Crisis Text Line (741741)
  - IASP resources
- Community Guidelines:
  - Be Kind & Compassionate
  - Respect Anonymity
  - No Harmful Content
- Report Content button
- Professional care disclaimer

### 16. **Legal & Privacy** (`legal`)
**Two tabs:**

**Privacy Policy Tab:**
- Privacy Commitment banner
- What We Collect section
- Data Protection measures
- Your Rights list

**Terms of Service Tab:**
- User Responsibilities
- Content Policy
- Important Disclaimer
- Changes to Terms

Last updated: October 21, 2025

### 17. **404 / Error Screen** (`error`)
- Floating sad ghost (fading animation)
- "404" heading
- "Lost in the Void"
- Message: "This soul seems to have vanished..."
- Two action buttons:
  - Return Home (purple gradient)
  - Refresh Page (outline)
- Encouragement message

---

## Navigation Flow

```
Splash (2s auto) → Onboarding (3 slides) → Home Feed
                                              ↓
                    ┌────────────────────────┼────────────────────────┐
                    ↓                        ↓                        ↓
              Soul Circles              Mood Pulse                Profile
                    ↓                                                  ↓
              Circle Feed                                         Settings
                                                                       ↓
                                                                  Help/Legal
```

**Bottom Navigation (Always visible on main screens):**
- 🏠 Feed → Home Feed
- 🧭 Circles → Soul Circles
- 📈 Pulse → Mood Pulse
- 👤 Ghost → Profile

**Floating Action Button (FAB):**
- Visible on: Home Feed, Circle Feed
- Action: Opens Post Creation modal

**Common Actions:**
- Tap post → Post Detail
- Tap reply → Reply Screen
- Tap Daily Unload banner → Daily Unload
- Tap circle → Circle Feed
- Tap settings icon → Settings

---

## Design System Preserved

### Colors
- Background gradient: `from-slate-900 via-indigo-950 to-slate-900`
- Primary accents: `purple-500`, `pink-500` (gradients)
- Text: `slate-100` (headings), `slate-300` (body), `slate-400`/`slate-500` (muted)
- Mood colors: `purple-400`, `emerald-400`, `pink-400`, `blue-400`, `indigo-400`

### Typography
- Preserved default system typography (no custom font-size classes)
- Consistent hierarchy maintained

### Components
- Rounded corners: `rounded-2xl`, `rounded-3xl`, `rounded-full`
- Glassmorphism: `bg-slate-800/40 backdrop-blur-sm`
- Borders: `border-slate-700/50`
- Shadows: `shadow-lg shadow-purple-500/50`

### Animations
- Heartbeat pulse (splash)
- Fade in/out (screen transitions)
- Float (ghost icons)
- Scale on hover/tap
- Progress bars (smooth width transitions)
- Rotating 24h timer (onboarding)

### Accessibility
- High contrast mode ready
- Clear focus states
- Semantic HTML
- ARIA-friendly structure
