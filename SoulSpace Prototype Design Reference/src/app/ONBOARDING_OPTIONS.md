# SoulSpace - Onboarding Options

## Available Onboarding Flows

SoulSpace now has **two onboarding experiences** to choose from:

---

## Option 1: Original Onboarding (3 Slides)
**File:** `/components/Onboarding.tsx`

### Features
- 3 swipeable slides with gesture support
- Quick intro to core concepts
- Minimal interaction required
- Fast onboarding (~15-20 seconds)

### Slides
1. **No names. No faces.** (👻)
   - "Just you."
   - Explains anonymous posting

2. **Post anything.** (🕐)
   - "It vanishes in 24h."
   - Explains ephemeral content

3. **Ready to be truly yourself?** (👻)
   - Final motivational slide
   - "Get Started" button

### Navigation
- Swipe left/right to navigate
- "Skip" button on all slides
- "Get Started" on final slide
- Both actions → HomeFeed

### User Input
- ❌ No username creation
- ❌ No code setup
- ❌ No mood selection
- → Users jump straight to main app

---

## Option 2: New Onboarding (4 Steps)
**File:** `/components/OnboardingNew.tsx`

### Features
- 4-step interactive setup
- User account creation
- Mood-based personalization
- Detailed onboarding (~30-45 seconds)

### Steps
1. **Welcome Screen** (���)
   - Select mood: Calm, Hopeful, Reflective, Joyful
   - Sets user's starting emotional state

2. **Username Creation** (👤)
   - Auto-generated suggestions (3 options)
   - Custom username option (3-15 chars)
   - Format: [Mood][Word][Number]
   - Example: HopefulStar67

3. **Code Setup** (🔒)
   - Create 3-6 character code
   - Alphanumeric validation
   - Used for returning login

4. **Browse Intro** (😊)
   - Welcome message with username
   - 3 sample posts preview
   - "Browse Stories" → HomeFeed

### User Input
- ✅ Username creation
- ✅ Code setup
- ✅ Mood selection
- → Users have personalized account

---

## Comparison

| Feature | Original | New |
|---------|----------|-----|
| **Duration** | 15-20s | 30-45s |
| **Slides/Steps** | 3 slides | 4 steps |
| **Interaction** | Swipe + Skip | Form inputs |
| **User Account** | No | Yes (username + code) |
| **Mood Selection** | No | Yes (4 options) |
| **Personalization** | No | Yes |
| **Returning Users** | N/A | Login support ready |
| **Sample Content** | No | Yes (3 posts) |
| **Gestures** | Swipe gestures | Tap buttons |
| **Setup Complexity** | Simple | Detailed |

---

## How to Switch

### Currently Active
```typescript
// App.tsx (line 28)
case 'onboarding-new':
  return <OnboardingNew navigateTo={navigateTo} />;
```

### To Use Original Onboarding

**Step 1:** Update App.tsx import
```typescript
// Change:
import OnboardingNew from './components/OnboardingNew';

// To:
import Onboarding from './components/Onboarding';
```

**Step 2:** Update renderScreen switch
```typescript
// Change:
case 'onboarding-new':
  return <OnboardingNew navigateTo={navigateTo} />;

// To:
case 'onboarding':
  return <Onboarding navigateTo={navigateTo} />;
```

**Step 3:** Update auto-transition
```typescript
// Change (line 23):
setTimeout(() => setCurrentScreen('onboarding-new'), 2000);

// To:
setTimeout(() => setCurrentScreen('onboarding'), 2000);
```

### To Use New Onboarding
✅ **Already active!** No changes needed.

---

## Recommended Use Cases

### Use Original Onboarding When:
- ✅ You want fastest time-to-value
- ✅ User retention is critical (minimize friction)
- ✅ Account creation handled elsewhere
- ✅ Simple "what is this?" intro needed
- ✅ Users familiar with anonymous platforms

### Use New Onboarding When:
- ✅ You need user accounts (username + code)
- ✅ Personalization improves experience
- ✅ Mood tracking is core feature
- ✅ Returning user login required
- ✅ Want to showcase content upfront
- ✅ Building user profile from start

---

## Implementation Details

### Original Onboarding
```typescript
interface OnboardingProps {
  navigateTo: (screen: string) => void;
}

// State
const [currentSlide, setCurrentSlide] = useState(0);

// Features
- Swipe gestures (PanInfo from Motion)
- Progress dots
- Skip button
- Get Started CTA
```

### New Onboarding
```typescript
interface OnboardingNewProps {
  navigateTo: (screen: string, data?: any) => void;
}

// State
const [step, setStep] = useState(1);
const [selectedMood, setSelectedMood] = useState<string | null>(null);
const [username, setUsername] = useState('');
const [code, setCode] = useState('');

// Features
- Mood selection (4 options)
- Username generation + custom input
- Code validation
- Sample posts preview
```

---

## Design Consistency

Both onboarding flows maintain:
- ✅ Dark ethereal design (slate-900 → indigo-950)
- ✅ Purple/pink gradient CTAs
- ✅ Smooth animations (Motion/React)
- ✅ Mobile-first (max-w-[414px])
- ✅ Touch-friendly (44px buttons)
- ✅ Consistent typography

---

## Future Considerations

### If Using Original
**To Add:**
- Post-onboarding username creation modal
- Settings-based profile setup
- Optional mood selection after first post

### If Using New
**To Add:**
- Login screen for returning users
- "Forgot code" recovery flow
- Backend API for username validation
- User data persistence

---

## Hybrid Approach (Advanced)

You can offer both experiences:

```typescript
// App.tsx
const [onboardingType, setOnboardingType] = useState<'quick' | 'detailed'>('detailed');

// In splash screen, add choice:
// "Quick Start" → Original Onboarding
// "Set Up Account" → New Onboarding

case 'onboarding':
  return <Onboarding navigateTo={navigateTo} />;
case 'onboarding-new':
  return <OnboardingNew navigateTo={navigateTo} />;
```

Benefits:
- ✅ User choice reduces friction
- ✅ Power users get quick access
- ✅ New users get guided setup
- ✅ A/B testing ready

---

## Recommendation

**Current Setup (New Onboarding) is recommended if:**
- You plan to implement returning user login
- Personalization matters for your use case
- You want mood-based features
- Account management is needed

**Switch to Original if:**
- Speed is critical
- Anonymous = no accounts needed
- Simpler is better for your audience
- Post expiration (24h) is key message

---

## Quick Switch Commands

### Terminal (if you want to toggle)

**Use New:**
```bash
# Already active - no changes needed
```

**Use Original:**
```typescript
// App.tsx line 4 - Change import:
import Onboarding from './components/Onboarding';

// App.tsx line 23 - Change auto-transition:
setTimeout(() => setCurrentScreen('onboarding'), 2000);

// App.tsx line 38 - Change case:
case 'onboarding':
  return <Onboarding navigateTo={navigateTo} />;
```

---

## Summary

| | Original | New (Active) |
|---|---|---|
| **File** | Onboarding.tsx | OnboardingNew.tsx |
| **Steps** | 3 slides | 4 steps |
| **Time** | ~15s | ~35s |
| **Account** | No | Yes |
| **Best For** | Quick start | Full setup |

Both are production-ready. Choose based on your product goals!

---

**Status:** Both Available  
**Active:** New Onboarding  
**Last Updated:** January 2025
