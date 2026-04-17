# Color Palette Reference Guide

## 🎨 Complete Color System

### Primary Colors
```
Indigo (Primary)          #4f46e5  RGB(79, 70, 229)
├─ Hover State           #4338ca  RGB(67, 56, 202)
└─ Light Background      #f0f4ff  (91% opacity variant)

Cyan (Secondary)         #06b6d4  RGB(6, 182, 212)
├─ Light Background      #e0f2ff  (91% opacity variant)
└─ Used with: Primary for gradients
```

### Accent Colors
```
Soft Orange (Accent)     #f97316  RGB(249, 115, 22)
├─ Light Background      #fef3c7  (for warnings)
└─ Dark Text             #b45309  RGB(180, 83, 9)
```

---

## 📊 Status & Semantic Colors

### Success States
```
Primary:     #10b981  RGB(16, 185, 129)  [GREEN]
Light BG:    #dcfce7  RGB(220, 252, 231)
Dark Text:   #166534  RGB(22, 101, 52)
Use For:     Normal assessments, success messages, positive indicators
```

### Warning/Alert States
```
Primary:     #f59e0b  RGB(245, 158, 11)  [AMBER]
Light BG:    #fef3c7  RGB(254, 243, 199)
Dark Text:   #b45309  RGB(180, 83, 9)
Use For:     MAM cases, caution messages, moderate risk
```

### Critical/Error States
```
Primary:     #dc2626  RGB(220, 38, 38)   [RED]
Light BG:    #fee2e2  RGB(254, 226, 226)
Dark Text:   #991b1b  RGB(153, 27, 27)
Use For:     SAM cases, emergencies, critical alerts
```

### Info/Secondary States
```
Primary:     #06b6d4  RGB(6, 182, 212)   [CYAN]
Light BG:    #e0f2ff  RGB(224, 242, 255)
Dark Text:   #0369a1  RGB(3, 105, 161)
Use For:     Information, secondary actions, highlights
```

---

## 🎨 Gradients (Modern & Harmonious)

### Primary Gradient
```
linear-gradient(135deg, #4f46e5, #06b6d4)
Direction:  Top-left to bottom-right (135deg)
From:       Indigo (Primary)
To:         Cyan (Secondary)
Usage:      Main CTAs, headers, premium sections
```

### Emergency Gradient
```
linear-gradient(135deg, #dc2626, #b91c1c)
Direction:  Top-left to bottom-right
From:       Softer Red
To:         Darker Red
Usage:      Emergency sections, critical alerts
```

### Success Gradient
```
linear-gradient(135deg, #10b981, #059669)
Direction:  Top-left to bottom-right
From:       Soft Green
To:         Darker Green
Usage:      Success states, positive confirmations
```

---

## 🌈 Neutral Colors

### Background
```
Primary BG:         #f8fafc  RGB(248, 250, 252)  [ULTRA LIGHT BLUE-GRAY]
Secondary BG:       #f0f4ff  RGB(240, 244, 255)  [LIGHT INDIGO]
Light BG:           #fafafa  RGB(250, 250, 250)  [OFF-WHITE]
Surface:            #ffffff  RGB(255, 255, 255)  [PURE WHITE]
```

### Text
```
Primary Text:       #1e293b  RGB(30, 41, 59)     [DARK SLATE]
Secondary Text:     #64748b  RGB(100, 116, 139)  [SLATE]
Muted Text:         #94a3b8  RGB(148, 163, 184)  [LIGHT SLATE]
```

### Borders & Dividers
```
Primary Border:     #e2e8f0  RGB(226, 232, 240)  [SOFT BORDER]
Secondary Border:   #cbd5e1  RGB(203, 213, 225)  [SLIGHTLY DARKER]
Card Border:        #f1f5f9  RGB(241, 245, 249)  [VERY LIGHT]
```

---

## 💫 Shadow System

### Small Shadow (Cards, Small Elements)
```
box-shadow: 0px 1px 3px rgba(15, 23, 42, 0.06)
Purpose: Subtle depth for interactive elements
```

### Medium Shadow (Larger Cards, Modals)
```
box-shadow: 0px 4px 12px rgba(15, 23, 42, 0.08)
Purpose: Clear elevation for important content
```

### Large Shadow (Floating Elements)
```
box-shadow: 0 6px 20px rgba(79, 70, 229, 0.5)
Purpose: Prominent floating buttons and overlays
```

---

## 🎯 Usage Examples

### Dashboard Status Card (Normal)
```
Background:  #dcfce7  (Soft Green)
Border:      2px solid #10b981
Text Color:  #166534  (Dark Green)
Icon:        🟢
```

### Dashboard Status Card (Warning)
```
Background:  #fef3c7  (Soft Amber)
Border:      2px solid #f59e0b
Text Color:  #b45309  (Dark Amber)
Icon:        🟠
```

### Dashboard Status Card (Critical)
```
Background:  #fee2e2  (Soft Red)
Border:      2px solid #dc2626
Text Color:  #991b1b  (Dark Red)
Icon:        🔴
```

### Button (Primary CTA)
```
Background:   #4f46e5  (Indigo)
Hover:        #4338ca  (Darker Indigo)
Text:         white
Border-Radius: 8px
```

### Button (Secondary)
```
Background:   white
Border:       2px solid #4f46e5
Text:         #4f46e5
Hover BG:     #f0f4ff
```

---

## 📱 Responsive Color Adjustments

### Mobile Considerations
- Maintain same color values
- Increase contrast on smaller screens if needed
- Ensure touch targets have sufficient color distinction
- Test status colors on various screen brightness levels

### Dark Mode (Future Consideration)
```
Light Primary:  #4f46e5  →  Inverted #b5a4f8
Light BG:       #f8fafc  →  Inverted #0f172a
Light Text:     #1e293b  →  Inverted #f1f5f9
```

---

## ✨ Brand Color Psychology

### Indigo (#4f46e5)
- ✓ Professional & trustworthy
- ✓ Associated with healthcare
- ✓ Calming & stable
- ✓ Modern & innovative

### Cyan (#06b6d4)
- ✓ Fresh & clean
- ✓ Medical/healthcare association
- ✓ Friendly & approachable
- ✓ Energetic but not harsh

### Soft Red (#dc2626)
- ✓ Attention-grabbing but not aggressive
- ✓ Clearly indicates urgency
- ✓ Medical alert standard
- ✓ Less jarring than harsh #dc3545

### Soft Green (#10b981)
- ✓ Indicates health & wellness
- ✓ Positive & reassuring
- ✓ Easier on eyes than #28a745
- ✓ Professional appearance

---

## 🔄 Migration from Old Colors

### Old → New Mapping
```
#008080  (Teal)        → #4f46e5  (Indigo) + #06b6d4  (Cyan)
#FF6B6B  (Harsh Coral) → #f97316  (Soft Orange)
#007bff  (Bootstrap)   → #06b6d4  (Cyan)
#6f42c1  (Bootstrap)   → #4f46e5  (Indigo)
#28a745  (Bootstrap)   → #10b981  (Soft Green)
#dc3545  (Bootstrap)   → #dc2626  (Soft Red)
#fd7e14  (Bootstrap)   → #f97316  (Soft Orange)
#f8f9fa  (Bootstrap)   → #f8fafc  (Soft Gray-Blue)
#667eea  (Old Purple)  → #4f46e5  (Indigo)
#764ba2  (Old Purple)  → #06b6d4  (Cyan)
```

---

## 📋 Implementation Checklist

- [x] CSS Variables Updated (App.css)
- [x] Primary Color Changed
- [x] Background Colors Refined
- [x] Status Colors Softened
- [x] Gradients Modernized
- [x] Shadow System Improved
- [x] All Pages Updated
- [x] Documentation Created

---

## 🎯 Design Principles Applied

1. **Color Harmony** - Complementary Indigo-Cyan palette
2. **Professional** - Corporate-friendly colors
3. **Accessible** - WCAG contrast compliant
4. **Consistent** - Unified across all pages
5. **Healthcare-Aligned** - Colors suitable for medical apps
6. **Subtle** - Softer shades for reduced eye strain
7. **Clear Hierarchy** - Primary, secondary, accent distinction

---

**Color System Version:** 2.0 (Modern Health-Tech)  
**Last Updated:** 2026-04-17  
**Status:** ✅ Fully Implemented
