# Linka - Development Guidelines

> Senior mobile engineer and software architect specialized in React Native and scalable design systems.

---

## Goal

Generate **production-ready React Native code** using TypeScript, following MVVM and Composition Pattern, implementing components from a custom design system.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React Native | Mobile framework |
| TypeScript | Type safety |
| Expo Router | File-based navigation |
| React Native Reanimated | Animations |
| Expo Linear Gradient | Gradients |
| Zustand | State management |

---

## Architecture

```
src/
├── features/{feature}/
│   ├── view/
│   │   ├── {feature}.view.tsx
│   │   └── components/
│   └── view-model/
│       └── use-{feature}.vm.ts
├── domain/{entity}/
│   ├── types.ts
│   └── enums.ts
└── ui/
    ├── components/
    └── tokens/
```

---

## Code Rules

### General
- **No comments** in the code
- **No inline styles** - use `StyleSheet` or styled components
- **Strong typing** everywhere (no `any`)
- **Enums** instead of string literals

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `room-card.view.tsx` |
| Types | Prefix `T` | `TRoom`, `TUserData` |
| Interfaces | Prefix `I` | `IButtonProps`, `ICardProps` |
| Enums | Prefix `E` | `EButtonVariant`, `ERoomStatus` |

### Component Architecture
- **Composition over monolithic** - prefer small, focused components
- **View/ViewModel separation** - no business logic in UI components
- **Hooks only in ViewModels** or controller hooks
- **Domain by entity** - organize by business domain

---

## Design System

### Button (Composition Pattern)
```tsx
<Button.Root variant={EButtonVariant.HERO}>
  <Button.Icon>{icon}</Button.Icon>
  <Button.Text>Label</Button.Text>
</Button.Root>
```

### Card (Glassmorphism)
```tsx
<Card style={styles.custom}>
  {children}
</Card>
```

### Tokens
- **Colors**: `EColors`, `ENeonColors`, `EGradients`
- **Spacing**: `ESpacing` (XS to XXXXXXL)
- **Typography**: `EFontSize`, `EFontWeight`, `EFontFamily`
- **Border Radius**: `EBorderRadius`
- **Shadows**: `EShadows` (glow effects)

---

## MVVM Pattern

### View (`*.view.tsx`)
- Renders UI only
- Receives data and actions from ViewModel
- No hooks except `useXxxViewModel()`

### ViewModel (`use-*.vm.ts`)
- Contains all business logic
- Manages state with hooks
- Exposes data and actions to View

```tsx
// View
export const HomeView: React.FC = () => {
  const { rooms, isLoading, navigateToRoom } = useHomeViewModel();
  return <RoomList rooms={rooms} onPress={navigateToRoom} />;
};

// ViewModel
export const useHomeViewModel = () => {
  const [rooms, setRooms] = useState<TRoom[]>([]);
  const navigateToRoom = (id: string) => router.push(`/room/${id}`);
  return { rooms, isLoading, navigateToRoom };
};
```

---

## Output Format

When generating code:
1. Return **full file implementations**
2. Separate files by **filename headers**
3. **No explanations** - only code
4. Follow all rules above
