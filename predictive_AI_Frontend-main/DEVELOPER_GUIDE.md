# Color System Maintenance Guide

## 🚀 Quick Start for Developers

### Using CSS Variables

When styling new components, always use CSS variables defined in `App.css`:

```css
/* ✅ GOOD - Use CSS variables */
.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  padding: 12px 24px;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

/* ❌ AVOID - Hardcoded colors */
.btn-primary {
  background: #4f46e5;
  color: white;
}
```

---

## 📝 Available CSS Variables

### Core Colors
```css
--primary: #4f46e5;          /* Indigo - main CTA color */
--primary-hover: #4338ca;    /* Darker indigo - hover state */
--secondary: #06b6d4;        /* Cyan - secondary CTAs */
--accent: #f97316;           /* Orange - special attention */

--success: #10b981;          /* Green - success/normal state */
--warning: #f59e0b;          /* Amber - warning/moderate state */
--danger: #dc2626;           /* Red - critical/error state */
--info: #06b6d4;             /* Cyan - information */
```

### Backgrounds & Text
```css
--bg-color: #f8fafc;         /* Main page background */
--surface-color: #ffffff;    /* Card/surface background */
--text-main: #1e293b;        /* Primary text */
--text-muted: #64748b;       /* Secondary text */
--border-color: #e2e8f0;     /* Border color */
```

### Other Variables
```css
--icon-primary: #4f46e5;     /* Icon color */
--icon-secondary: #64748b;   /* Secondary icon */
--shadow-sm: ...             /* Small shadows */
--shadow-md: ...             /* Medium shadows */
--radius-btn: 8px;           /* Button border radius */
--radius-card: 12px;         /* Card border radius */
--transition: ...            /* Smooth transitions */
```

---

## 🎨 Adding New Components

### Status Badge
```jsx
// Normal Status
<span style={{
  background: '#dcfce7',      // Light green background
  color: '#166534',           // Dark green text
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 'bold'
}}>
  ✓ Normal
</span>

// Warning Status
<span style={{
  background: '#fef3c7',      // Light amber background
  color: '#b45309',           // Dark amber text
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 'bold'
}}>
  ⚠ Warning
</span>

// Critical Status
<span style={{
  background: '#fee2e2',      // Light red background
  color: '#991b1b',           // Dark red text
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 'bold'
}}>
  🔴 Critical
</span>
```

### Modern Button
```jsx
<button style={{
  background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
  color: 'white',
  padding: '12px 24px',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
}}>
  Modern Button
</button>
```

### Alert Box
```jsx
// Success
<div style={{
  background: '#dcfce7',
  border: '2px solid #10b981',
  color: '#166534',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '20px'
}}>
  ✓ Success message
</div>

// Error
<div style={{
  background: '#fee2e2',
  border: '2px solid #dc2626',
  color: '#991b1b',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '20px'
}}>
  ✗ Error message
</div>
```

---

## 🔄 Migrating Old Components

### Old Style (❌ DON'T USE)
```jsx
<div style={{
  background: '#f8f9fa',      // Old light gray
  color: '#666',              // Dull gray text
  borderLeft: '4px solid #667eea'  // Old purple
}}>
  Content
</div>
```

### New Style (✅ USE)
```jsx
<div style={{
  background: '#f0f4ff',              // New light indigo
  color: '#1e293b',                   // Professional dark slate
  borderLeft: '4px solid #4f46e5'     // New indigo
}}>
  Content
</div>
```

---

## 📊 Color Reference Quick Table

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary Button | Indigo | #4f46e5 | Main CTAs |
| Secondary Button | Cyan | #06b6d4 | Secondary CTAs |
| Success Badge | Green | #10b981 | Normal/OK status |
| Warning Badge | Orange | #f97316 | Warning/Caution |
| Error Badge | Red | #dc2626 | Critical/Error |
| Page Background | Blue-Gray | #f8fafc | Main pages |
| Card Background | White | #ffffff | Card content |
| Primary Text | Dark Slate | #1e293b | Main text |
| Secondary Text | Slate | #64748b | Subtitle/meta |
| Border | Light Border | #e2e8f0 | Dividers |

---

## 🎯 Common Patterns

### Alert Card Pattern
```jsx
const AlertCard = ({ severity = 'info', children }) => {
  const styles = {
    info: {
      bg: '#e0f2ff',
      border: '#06b6d4',
      text: '#0369a1',
      icon: 'ℹ️'
    },
    success: {
      bg: '#dcfce7',
      border: '#10b981',
      text: '#166534',
      icon: '✓'
    },
    warning: {
      bg: '#fef3c7',
      border: '#f59e0b',
      text: '#b45309',
      icon: '⚠'
    },
    error: {
      bg: '#fee2e2',
      border: '#dc2626',
      text: '#991b1b',
      icon: '✗'
    }
  };
  
  const style = styles[severity];
  
  return (
    <div style={{
      background: style.bg,
      border: `2px solid ${style.border}`,
      color: style.text,
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <span style={{ marginRight: '10px' }}>{style.icon}</span>
      {children}
    </div>
  );
};
```

### Status Indicator Pattern
```jsx
const getSeverityStyle = (severity) => {
  const styles = {
    'SAM': {
      color: '#dc2626',      // Red
      bg: '#fee2e2',
      label: '🔴 SAM'
    },
    'MAM': {
      color: '#f97316',      // Orange
      bg: '#fef3c7',
      label: '🟠 MAM'
    },
    'NORMAL': {
      color: '#10b981',      // Green
      bg: '#dcfce7',
      label: '🟢 Normal'
    }
  };
  return styles[severity];
};
```

---

## 🚫 What NOT to Do

### ❌ DON'T
```jsx
// Using old Bootstrap colors
background: '#28a745'  // Old green
background: '#dc3545'  // Old red
background: '#007bff'  // Old blue

// Mixing gradients
background: 'linear-gradient(135deg, #667eea, #764ba2)'  // Old

// Hardcoded dark backgrounds
background: '#333'
background: '#555'

// Harsh colors
color: '#FF6B6B'  // Harsh coral
border: '1px solid #ddd'  // Too light
```

### ✅ DO
```jsx
// Use new colors from the palette
background: '#10b981'   // New green
background: '#dc2626'   // New red
background: '#06b6d4'   // New blue

// Use modern gradients
background: 'linear-gradient(135deg, #4f46e5, #06b6d4)'

// Use refined backgrounds
background: '#f0f4ff'
background: '#f8fafc'

// Use harmonious colors
color: '#f97316'    // Soft orange
border: '1px solid #e2e8f0'  // Subtle border
```

---

## 🧪 Testing Your Changes

### Visual Testing Checklist
- [ ] Colors render correctly on light backgrounds
- [ ] Text has sufficient contrast (WCAG AA minimum)
- [ ] Status colors are easily distinguishable
- [ ] Gradients display smoothly
- [ ] Shadows add appropriate depth
- [ ] Colors work on mobile screens
- [ ] No color bleeding or aliasing issues
- [ ] Hover states are visible

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Chrome Android

---

## 📞 Questions?

### Color Not Available?
Check if it's already defined in `/src/App.css` under `:root`. If not:
1. Propose the new color in a code review
2. Add it to the CSS variables
3. Document its purpose
4. Update this guide

### Component Looks Wrong?
1. Verify you're using correct CSS variable or hex code
2. Check for typos in color values
3. Test in different browsers
4. Compare with similar components
5. Report if inconsistent with design system

---

## 📚 Additional Resources

- **Main Documentation:** [UI_UX_IMPROVEMENTS_SUMMARY.md](./UI_UX_IMPROVEMENTS_SUMMARY.md)
- **Color Palette Reference:** [COLOR_PALETTE_REFERENCE.md](./COLOR_PALETTE_REFERENCE.md)
- **CSS Variables Location:** [src/App.css](./src/App.css) (lines 1-40)

---

**Last Updated:** 2026-04-17  
**Version:** 1.0  
**Maintained By:** Design System Team
