# SoulSpace Oct 2025 - Screen Flow Map

## New User Journey (~30-45 seconds)

```
┌─────────────────────────────────────────────────────────────┐
│                     NEW USER ONBOARDING                      │
└─────────────────────────────────────────────────────────────┘

1. WELCOME SCREEN
   ┌──────────────────┐
   │      🌟          │  Animated star (rotating + scaling)
   │                  │
   │  Welcome to      │
   │  Soulspace!      │
   │                  │
   │  Share           │
   │  anonymously.    │
   │                  │
   │  ┌────┬────┐     │  How are you feeling?
   │  │🌊  │🌟  │     │  
   │  │Calm│Hope│     │  (4 mood buttons, 44x44px min)
   │  ├────┼────┤     │
   │  │🌙  │✨  │     │
   │  │Refl│Joy │     │
   │  └────┴────┘     │
   │                  │
   │  [Need Help?]    │
   └──────────────────┘
         │ tap mood
         ▼

2. USERNAME SCREEN
   ┌──────────────────┐
   │      🌟          │  Selected mood emoji
   │                  │
   │  You picked      │
   │  Hopeful!        │
   │                  │
   │  Pick a nickname │
   │  ┌────────────┐  │  Format: [Mood][Word][Number]
   │  │HopefulBreeze17│ e.g., HopefulBreeze17
   │  └────────────┘  │
   │                  │
   │  Suggestions:    │
   │  ┌────────────┐  │
   │  │HopefulStar67│ [Pick] ✨  
   │  └────────────┘  │
   │  ┌────────────┐  │
   │  │HopefulGlow23│ [Pick] ✨
   │  └────────────┘  │
   │  ┌────────────┐  │
   │  │HopefulEcho91│ [Pick] ✨
   │  └────────────┘  │
   │                  │
   │ [🔄 Try Another] │
   │ [Make My Own]    │  → Shows text input (3-15 chars)
   │                  │     Number added automatically
   │  [Need Help?]    │
   └──────────────────┘
         │ pick/create
         ▼

3. CODE SCREEN
   ┌──────────────────┐
   │      🔒          │  Pulsing lock icon
   │                  │
   │  Create Your     │
   │  Code            │
   │                  │
   │  ┌────────────┐  │  Your nickname:
   │  │HopefulStar17│  │
   │  └────────────┘  │
   │                  │
   │  Pick a code     │
   │  (3-6 letters/   │
   │   numbers)       │
   │                  │
   │  ┌────────────┐  │
   │  │  SUN123    │  │  Large, centered, tracked
   │  └────────────┘  │  6/6 characters
   │                  │
   │  ✨ No reset     │
   │  needed!         │
   │  Remember this   │
   │  code to log in. │
   │                  │
   │   [Continue]     │  (Disabled until 3+ chars)
   │                  │
   │  [Need Help?]    │
   └──────────────────┘
         │ valid code
         ▼

4. BROWSE INTRO SCREEN
   ┌──────────────────┐
   │      😊          │
   │                  │
   │  Hi              │
   │  HopefulStar17!  │
   │                  │
   │  Explore stories │
   │                  │
   │  Recent stories: │
   │  ┌────────────┐  │
   │  │🌟 Hopeful  │  │  "Today's looking
   │  │user:       │  │   brighter!"
   │  │"..."       │  │
   │  └────────────┘  │
   │  ┌────────────┐  │
   │  │🌙 Reflective│ │
   │  │user:       │  │
   │  │"..."       │  │
   │  └────────────┘  │
   │  ┌────────────┐  │
   │  │🌊 Calm user│  │
   │  │"..."       │  │
   │  └────────────┘  │
   │                  │
   │ [Browse Stories] │  → Main Feed
   │ [Browse Chats]   │  → Chat view
   │ [Share Story]    │  → Story creation
   │                  │
   │ [AdMob 300x50]   │
   │  [Need Help?]    │
   └──────────────────┘
```

---

## Returning User Journey (~5 seconds)

```
┌─────────────────────────────────────────────────────────────┐
│                   RETURNING USER LOGIN                       │
└─────────────────────────────────────────────────────────────┘

LOGIN SCREEN
┌──────────────────┐
│      😊          │  Heartbeat animation
│                  │
│  Welcome back!   │
│                  │
│  Log in to       │
│  continue        │
│                  │
│  Your nickname   │
│  ┌────────────┐  │
│  │HopefulStar17│ │
│  └────────────┘  │
│                  │
│  Enter code:     │
│  ┌────────────┐  │
│  │  SUN123    │  │  Large, centered
│  └────────────┘  │  6/6 characters
│                  │
│   [Log In]       │
│                  │
│ [Forgot Code?    │  → Restarts onboarding
│  Create New      │     (Welcome Screen)
│  Nickname]       │
│                  │
│  💡 Don't        │
│  remember? You   │
│  can create new. │
│                  │
│  [Need Help?]    │
└──────────────────┘
      │ login
      ▼
   BROWSE FEED
   (with user's
    post history)
```

---

## Main Browse Feed

```
┌──────────────────────────────────────────────────────────────┐
│                        BROWSE FEED                            │
└──────────────────────────────────────────────────────────────┘

┌──────────────────┐
│ Stories     ⚙️   │  Settings icon
│ Welcome,         │
│ HopefulStar17    │
│                  │
│ ✨All 🌊Calm     │  Mood filters (horizontal scroll)
│ 🌟Hope 🌙Refl   │  Active = gradient bg
│ ✨Joy            │
├──────────────────┤
│                  │  ← Returning user sees this first
│ [Your post] 🟢   │
│ ┌────────────┐  │
│ │🌟 HopefulStar17│ Purple border highlight
│ │• 1d ago    │  │
│ │            │  │
│ │"Feeling calm"│ │
│ │            │  │
│ │❤️ 23  💬 7  │  │
│ └────────────┘  │
│                  │
│ ┌────────────┐  │  Regular posts
│ │🌟 HopefulBreeze23│
│ │• 2h ago    │  │
│ │            │  │
│ │"Finally found"│ │
│ │"courage..."│  │
│ │            │  │
│ │❤️ 47  💬 12 │  │  Like = heart fills + scales
│ └────────────┘  │
│                  │
│ ┌────────────┐  │
│ │🌙 ReflectiveMoon88│
│ │• 4h ago    │  │
│ │"..."       │  │
│ │❤️ 83  💬 24 │  │
│ └────────────┘  │
│                  │
│ [Infinite scroll]│
│        ┌───┐    │  FAB (floating)
│        │ ✏️ │    │  Bottom right
│        └───┘    │  Gradient + glow
│                  │
│ [AdMob 300x50]   │  Fixed bottom
└──────────────────┘

Actions:
- Tap post → Post detail (future)
- Tap heart → Like (fills + animates)
- Tap reply → Reply view (future)
- Filter mood → Filter posts
- FAB → Share Story
```

---

## Share Story

```
┌──────────────────────────────────────────────────────────────┐
│                        SHARE STORY                            │
└──────────────────────────────────────────────────────────────┘

┌──────────────────┐
│ ←  Share Story   │  Back button
│                  │
│  Posting as:     │
│  ┌────────────┐  │
│  │HopefulStar17│ │
│  └────────────┘  │
│                  │
│  How are you     │
│  feeling?        │
│  ┌────┬────┐     │
│  │🌊  │🌟  │     │  Mood selector
│  │Calm│Hope│     │  Selected = purple border
│  ├────┼────┤     │
│  │🌙  │✨  │     │
│  │Refl│Joy │     │
│  └────┴────┘     │
│                  │
│  Your story:     │
│  ┌────────────┐  │
│  │            │  │  Textarea
│  │Share what's│  │  Min: 200px height
│  │on your mind│  │  Max: 500 chars
│  │            │  │
│  │(text only) │  │
│  │            │  │
│  └────────────┘  │
│  Text only,      │  125/500
│  no images       │
│                  │
│   [Share Story]  │  Gradient button
│                  │  Disabled if empty
│                  │
│  ✨ Your story   │
│  will be shared  │
│  anonymously     │
│                  │
│  [Need Help?]    │
└──────────────────┘
      │ share
      ▼
   BROWSE FEED
   (returns)
```

---

## Help Screen

```
┌──────────────────────────────────────────────────────────────┐
│                      HELP & SUPPORT                           │
└──────────────────────────────────────────────────────────────┘

┌──────────────────┐
│ ←  Help & Support│
│                  │
│  We're here to   │
│  help! 💜        │
│                  │
│  Find answers or │
│  reach support   │
│                  │
│ ┌────────────┐   │
│ │ 🔵 Getting │   │  Help topics
│ │  Started   │   │  (tappable cards)
│ │  Learn how │   │
│ └────────────┘   │
│ ┌────────────┐   │
│ │ 🛡️ Privacy  │   │
│ │  & Safety  │   │
│ │  Your anon │   │
│ └────────────┘   │
│ ┌────────────┐   │
│ │ 📖 Guidelines│  │
│ │  Community │   │
│ │  rules     │   │
│ └────────────┘   │
│ ┌────────────┐   │
│ │ ✉️ Contact  │   │
│ │  Support   │   │
│ │  Get help  │   │
│ └────────────┘   │
│                  │
│  Quick Answers   │
│ ┌────────────┐   │
│ │What if I   │   │  FAQ expandable
│ │forget code?│   │
│ └────────────┘   │
│ ┌────────────┐   │
│ │Are posts   │   │
│ │anonymous?  │   │
│ └────────────┘   │
│ ┌────────────┐   │
│ │Can I share │   │
│ │images?     │   │
│ └────────────┘   │
│                  │
│ [Email Support]  │
└──────────────────┘
```

---

## Navigation Map

```
                    [SoulSpace Oct 2025]
                            │
              ┌─────────────┴─────────────┐
              │                           │
         NEW USER                   RETURNING USER
              │                           │
              ▼                           ▼
        ┌─────────┐                 ┌─────────┐
        │ Welcome │                 │  Login  │
        │  🌟     │                 │  😊     │
        │ [Moods] │                 │ [Code]  │
        └────┬────┘                 └────┬────┘
             │                           │
             ▼                           │
        ┌─────────┐                      │
        │Username │                      │
        │  Pick   │                      │
        │Nickname │                      │
        └────┬────┘                      │
             │                           │
             ▼                           │
        ┌─────────┐                      │
        │  Code   │                      │
        │ Create  │                      │
        │  🔒     │                      │
        └────┬────┘                      │
             │                           │
             ▼                           │
        ┌─────────┐                      │
        │ Browse  │                      │
        │  Intro  │                      │
        │  😊     │                      │
        └────┬────┘                      │
             │                           │
             └───────────┬───────────────┘
                         │
                         ▼
                   ┌──────────┐
                   │  BROWSE  │ ◄──────┐
                   │   FEED   │        │
                   │  📱      │        │
                   └────┬─────┘        │
                        │              │
         ┌──────────────┼──────────────┤
         │              │              │
         ▼              ▼              │
    ┌────────┐    ┌──────────┐        │
    │  Help  │    │  Share   │────────┘
    │  ❓    │    │  Story   │
    │        │    │  ✏️      │
    └────────┘    └──────────┘

    [Help accessible from all screens via button]
```

---

## Screen Sizes & Responsive Breakpoints

```
┌──────────────────────────────────────────────────┐
│              MOBILE-FIRST DESIGN                  │
└──────────────────────────────────────────────────┘

320px (iPhone SE)    ████████████████
375px (iPhone 12)    ███████████████████
414px (iPhone 14+)   █████████████████████

Max Width: 414px
All screens centered with max-w-[414px] mx-auto
```

---

## Touch Target Sizes

```
Minimum: 44x44px (WCAG AAA)

┌────────────────────────────────┐
│  44px  │  Mood buttons         │
│   ×    │  (grid items)         │
│  44px  │                       │
├────────┼───────────────────────┤
│  56px  │  FAB                  │
│   ×    │  (floating action)    │
│  56px  │                       │
├────────┼───────────────────────┤
│  44px  │  Input fields         │
│  min   │  (height)             │
├────────┼───────────────────────┤
│  88px+ │  Mood cards           │
│  grid  │  (in 2x2 layout)      │
└────────┴───────────────────────┘
```

---

**Design:** SoulSpace Ethereal Dark  
**Version:** October 2025 Update  
**Status:** Mobile Prototype (320-414px)
