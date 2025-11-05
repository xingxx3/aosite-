# Dropdown Menu Location Guide

## 📍 Where the Dropdown Menu is Located

### 1. **Dropdown Menu List (Options)**
**Location:** `form-handler.js` - Lines 14-48

The dropdown menu options are defined in the `leaders` array:
```javascript
const leaders = [
  'AO Hiring Team',
  'AO Recruiting',
  'Aaron Edelman',
  'Abby Jones Pearson too',
  // ... more leaders
];
```

### 2. **Dropdown Menu Creation Code**
**Location:** `form-handler.js` - Lines 50-242

The `createDropdown()` function creates the dropdown menu dynamically.

**Key Elements:**
- **Container:** `<div id="ao-leader-dropdown-list" class="ao-leader-dropdown">`
- **Items:** Each leader becomes a `<div class="ao-leader-item">` element
- **Styling:** Lines 60-76 define the dropdown appearance
- **Item Creation:** Lines 78-221 create each dropdown item

---

## 🔍 How to Locate the Dropdown Menu in Browser DevTools

### Method 1: By ID
1. Open browser DevTools (F12)
2. Go to Elements/Inspector tab
3. Press Ctrl+F (or Cmd+F on Mac)
4. Search for: `ao-leader-dropdown-list`
5. The dropdown will appear when you click the button

### Method 2: By Class
1. In DevTools, search for: `.ao-leader-dropdown`
2. Or search for: `.ao-leader-item` (for individual items)

### Method 3: By Button Relationship
1. Find the button with `data-slot="trigger"` or `aria-haspopup="listbox"`
2. The dropdown menu is appended as a sibling/child of the button's container

---

## ✏️ How to Modify the Dropdown Menu

### To Add/Remove/Edit Leaders:
Edit the `leaders` array in `form-handler.js` (lines 14-48):

```javascript
const leaders = [
  'AO Hiring Team',
  'AO Recruiting',
  'Your New Leader Name',  // Add here
  // Remove or edit existing names
];
```

### To Change Dropdown Styling:
Edit the `createDropdown()` function in `form-handler.js`:
- **Container styles:** Lines 60-76
- **Item styles:** Lines 85-97

### To Change Dropdown Behavior:
- **Show/Hide:** `showDropdown()` (line 264) and `hideDropdown()` (line 292)
- **Positioning:** `positionDropdown()` (line 244)
- **Click handlers:** Lines 100-218

---

## 🎯 Quick Reference: Dropdown Structure

```
Button (Trigger)
  ↓
  └─ Click → Opens dropdown
      ↓
      Dropdown Menu (`<div id="ao-leader-dropdown-list">`)
        ├─ Item 1: "AO Hiring Team"
        ├─ Item 2: "AO Recruiting"
        ├─ Item 3: "Aaron Edelman"
        └─ ... (more items)
```

---

## 💡 Tips

1. **To see the dropdown in action:** Click the button that says "Select AO Leader"
2. **To inspect the dropdown:** Right-click on any dropdown item → Inspect Element
3. **To modify items:** Edit the `leaders` array, then refresh the page
4. **To debug:** Open browser console (F12) and look for logs starting with `===`

