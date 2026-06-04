# SoulSpace - Anonymous Emotional Sharing Platform

A mobile-first web application for authentic emotional expression through anonymous stories, designed as an ethereal sanctuary where users can share real emotions without names, faces, or judgment.

---

## 🌟 Current Status

**Version:** October 2025 Update (Integrated)  
**Active Onboarding:** New 4-Step Flow  
**Total Screens:** 18 (1 Splash + 1 Onboarding + 16 App Screens)

---

## 📱 Features

### New Onboarding Flow (Oct 2025)
- **Step 1:** Welcome + Mood Selection (🌊 Calm, 🌟 Hopeful, 🌙 Reflective, ✨ Joyful)
- **Step 2:** Username Creation (auto-generated or custom)
- **Step 3:** Code Setup (3-6 characters for login)
- **Step 4:** Browse Intro (sample posts preview)

### Core App Features
- **SoulFeed** - Anonymous emotional posts with 24h expiration
- **Post Creation** - Text + mood selection + optional voice/doodle
- **Soul Circles** - Topic-based communities (Late Night Thoughts, Healing Hearts, etc.)
- **Mood Pulse** - Visual dashboard of community emotions
- **Daily Unload** - Guided prompts for emotional expression
- **Ghost Mode** - Enhanced anonymity in profile settings
- **Empathy Reactions** - Beyond likes: Heard, Strength, Same, Gentle Hug

---

## 🎨 Design System

### Color Palette
```css
/* Background */
bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900

/* Primary Actions */
bg-gradient-to-r from-purple-500 to-pink-500

/* Mood Colors */
Calm:       from-blue-400 to-cyan-400
Hopeful:    from-emerald-400 to-teal-400
Reflective: from-purple-400 to-indigo-400
Joyful:     from-pink-400 to-rose-400
```

### Typography
- Headers: Default system
- Body: Default system
- No custom font-size/weight classes (uses globals.css)

### Spacing
- Mobile-first: 320-414px width
- Touch targets: 44x44px minimum (WCAG AAA)
- Padding: 24px standard (`px-6`, `py-8`)

---

## 📂 Project Structure

```
/
├── App.tsx                      # Main app with routing
├── components/
│   ├── SplashScreen.tsx         # Heartbeat animation (2s)
│   ├── OnboardingNew.tsx        # ⭐ New 4-step flow
│   ├── Onboarding.tsx           # Original 3-slide flow (alternative)
│   ├── HomeFeed.tsx             # Main feed with tabs
│   ├── PostCreation.tsx         # Create emotional posts
│   ├── PostDetail.tsx           # View single post
│   ├── ReplyScreen.tsx          # Reply to posts
│   ├── SoulCircles.tsx          # Browse circles
│   ├── CircleFeed.tsx           # Circle-specific feed
│   ├── Profile.tsx              # User profile + Ghost Mode
│   ├── MoodPulse.tsx            # Emotion visualization
│   ├── DailyUnload.tsx          # Guided prompts
│   ├── Settings.tsx             # Anonymity controls
│   ├── HelpSafety.tsx           # Support resources
│   ├── LegalPrivacy.tsx         # Legal info
│   └── ErrorScreen.tsx          # Error handling
├── styles/
│   └── globals.css              # Design tokens + typography
└── docs/
    ├── ONBOARDING_INTEGRATION.md
    ├── ONBOARDING_OPTIONS.md
    ├── SCREEN_FLOW_MAP.md
    └── SOULSPACE_OCT_2025_UPDATE.md
```

---

## 🚀 Getting Started

### Installation
```bash
npm install
npm run dev
```

### App Flow
1. **Splash Screen** (2 seconds) → Auto-advances
2. **Onboarding** (4 steps, ~35 seconds) → User setup
3. **HomeFeed** (Main app) → Full functionality

### Screen Navigation
```
Splash (2s)
    ↓
OnboardingNew
    ├─ Step 1: Mood Selection
    ├─ Step 2: Username
    ├─ Step 3: Code
    └─ Step 4: Browse Intro
         ↓
    HomeFeed (4 tabs)
    ├─ Feed
    ├─ Circles → SoulCircles → CircleFeed
    ├─ Pulse → MoodPulse
    └─ Profile → Settings, Help, Legal
         
    FAB → PostCreation → PostDetail → ReplyScreen
    
    Daily prompt → DailyUnload
```

---

## 🎯 Key Screens

### 1. OnboardingNew (New User Setup)
**Duration:** ~30-45 seconds  
**Steps:** 4  
**Outputs:** Username + Code + Selected Mood

**Features:**
- Auto-generated usernames (e.g., HopefulStar67)
- Custom username option (3-15 chars)
- Code validation (3-6 alphanumeric)
- Sample content preview

### 2. HomeFeed (Main Feed)
**Navigation:** 4 tabs (Feed | Circles | Pulse | Profile)

**Features:**
- Scrollable anonymous posts
- 24h expiration countdown
- Empathy reactions (❤️ Heard, 💪 Strength, etc.)
- Mood filters
- FAB for quick posting

### 3. PostCreation
**Inputs:** Text + Mood + Optional Voice/Doodle

**Features:**
- Mood selector (4 options)
- Character counter (500 max)
- Preview before posting
- Voice recording option
- Simple doodle canvas

### 4. SoulCircles (Communities)
**Categories:** Late Night Thoughts, Healing Hearts, Creative Souls, etc.

**Features:**
- Browse by topic
- Join/leave circles
- Circle-specific feeds
- Community stats

### 5. Profile
**Modes:** Standard / Ghost Mode

**Features:**
- Anonymous stats (posts, reactions received)
- Ghost Mode toggle (extra privacy)
- Activity summary
- Settings access

---

## ⚙️ Configuration

### Switch Onboarding Type

**Current:** New Onboarding (OnboardingNew.tsx)

**To use Original Onboarding:**
```typescript
// App.tsx - Update 3 locations:

// 1. Import (line 4)
import Onboarding from './components/Onboarding';

// 2. Auto-transition (line 23)
setTimeout(() => setCurrentScreen('onboarding'), 2000);

// 3. RenderScreen (line 38)
case 'onboarding':
  return <Onboarding navigateTo={navigateTo} />;
```

See `ONBOARDING_OPTIONS.md` for detailed comparison.

---

## 🎨 Design Principles

1. **Emotional Resonance**
   - Soft, calming dark mode
   - Ethereal gradients
   - Gentle animations

2. **Anonymity First**
   - No personal data collection
   - Ghost Mode for extra privacy
   - Ephemeral content (24h)

3. **Accessibility**
   - WCAG AA compliant
   - 44px touch targets
   - Screen reader support
   - High contrast text

4. **Mobile-First**
   - 320-414px optimized
   - Touch-friendly gestures
   - Responsive layouts

---

## 📊 User Flow Metrics

### Onboarding
- **Original:** ~15-20s, 3 interactions
- **New:** ~30-45s, 8-12 interactions

### Time to First Post
- After onboarding: ~10-15s
- FAB → PostCreation → Submit

### Retention Points
- Daily Unload prompts
- Circle notifications
- Mood Pulse insights
- Empathy reactions received

---

## 🔒 Privacy & Safety

### Anonymous by Design
- No real names required
- Auto-generated usernames
- Optional Ghost Mode
- No profile photos

### Content Moderation
- Community guidelines
- Report functionality
- Help & safety resources
- Crisis support links

### Data Handling
- No PII collection
- Code-based login (no email)
- 24h post expiration
- No tracking/analytics

---

## 🛠️ Tech Stack

- **Framework:** React 18+
- **Styling:** Tailwind CSS 4.0
- **Animations:** Motion/React (Framer Motion)
- **Icons:** Lucide React
- **UI Components:** Shadcn/ui
- **Typography:** System defaults
- **Build:** Vite/Create React App

---

## 📖 Documentation

- **ONBOARDING_INTEGRATION.md** - How new onboarding was integrated
- **ONBOARDING_OPTIONS.md** - Compare Original vs. New flows
- **SCREEN_FLOW_MAP.md** - Visual screen maps and navigation
- **SOULSPACE_OCT_2025_UPDATE.md** - Full Oct 2025 update details
- **SCREENS_SUMMARY.md** - Overview of all 18 screens

---

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ New onboarding flow
- ✅ 18 complete screens
- ✅ Design system
- ✅ Mobile-first responsive

### Phase 2 (Next)
- [ ] Backend API integration
- [ ] User authentication
- [ ] Post persistence
- [ ] Real-time updates
- [ ] Push notifications

### Phase 3 (Future)
- [ ] Returning user login
- [ ] Post analytics
- [ ] Mood insights
- [ ] Community moderation
- [ ] Accessibility audit

---

## 🐛 Known Issues

- Username/code validation is client-side only (needs backend)
- Posts not persisted (in-memory only)
- No returning user login flow yet
- Sample data for circles/pulse

---

## 📝 Contributing

### Code Style
- Tailwind utility classes
- No custom font sizing
- Motion for all animations
- 44px min touch targets
- Mobile-first approach

### Component Guidelines
- One component per file
- Props interface at top
- Use Shadcn/ui when possible
- Preserve design system

---

## 📄 License

[Your License Here]

---

## 🙏 Acknowledgments

- Design inspiration: Calm, Headspace, Whisper
- Icons: Lucide React
- UI Components: Shadcn/ui
- Animation: Motion (Framer Motion team)

---

## 📞 Support

For questions or issues:
- Check `HelpSafety.tsx` screen
- Review documentation in `/docs`
- File an issue (if repo)

---

**Built with 💜 for authentic emotional expression**

*SoulSpace - Where vulnerability meets community*
