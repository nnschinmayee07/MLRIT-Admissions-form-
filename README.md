# 🎓 MLRIT Student Enrollment Form

> A premium, futuristic admissions enrollment form built with Next.js 14, Tailwind CSS, and Framer Motion — designed for MLRIT's QR-code-based admissions landing page.

![MLRIT Admissions](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-purple?logo=framer)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Preview

The form features:
- **Glassmorphism** — Frosted glass surfaces with backdrop blur
- **Bento Grid Layout** — Animated cards surrounding the central form
- **Orange + Green Neon Accents** — Premium college-tech aesthetic
- **Mobile-First Responsive** — Works beautifully on all devices
- **Staggered Animations** — Smooth fly-in reveals on load
- **Floating Labels** — Professional form UX with focus glow

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/nnschinmayee07/mlrit-admissions.git
cd mlrit-admissions

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
mlrit-admissions/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Home page (renders form)
│   │   └── globals.css         # Global styles + Tailwind
│   └── components/
│       └── MLRITEnrollmentForm.jsx  # Main form component ⭐
├── IMPLEMENTATION_GUIDE.md     # Detailed customization guide
├── INTEGRATION_EXAMPLES.md     # Backend integration examples
├── tailwind.config.js
├── next.config.mjs
├── tsconfig.json
├── package.json
└── .env.example
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary Orange | `#ff7a00` | CTAs, focus states, glow |
| Primary Green | `#00c16a` | Accents, success states |
| Dark Background | `#0b0b0b` | Base surface |
| Glass | `rgba(255,255,255,0.07)` | Card surfaces |

---

## 📋 Form Fields

| Field | Type | Required |
|-------|------|----------|
| Full Name | Text | ✓ |
| Email Address | Email | ✓ |
| Phone Number | Tel (10-digit) | ✓ |
| College/12th School | Text | ✓ |
| Percentage / GPA | Number | ✓ |
| Preferred Branch | Select | ✓ |
| City | Text | ✓ |
| State | Select | ✓ |
| LinkedIn Profile | URL | Optional |
| Why join MLRIT? | Textarea | ✓ |
| Resume Upload | File (PDF/DOC) | ✓ |
| Consent Checkbox | Boolean | ✓ |

### Branch Options
`CSE` · `CSE AI/ML` · `IT` · `ECE` · `EEE` · `Mechanical` · `Civil`

---

## 🔧 Bento Grid Cards (Placeholder)

The layout includes 4 animated placeholder cards:
- 🔗 **LinkedIn Portal**
- 📄 **Brochure**
- 🎬 **Pre-recorded Talks**
- 📍 **Campus Tour Video**

These are ready to be wired up to real content. See `IMPLEMENTATION_GUIDE.md`.

---

## 🏗️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14.2 | React framework |
| React | 18.3 | UI library |
| Tailwind CSS | 3.4 | Styling |
| Framer Motion | 11 | Animations |
| Lucide React | 0.417 | Icons |
| TypeScript | 5 | Type safety |

---

## 🔌 Backend Integration

The form is frontend-only by default. To integrate a backend:

1. **API Route** — Create `src/app/api/enrollment/route.ts`
2. **Email** — Use Nodemailer or Resend
3. **Database** — Prisma + PostgreSQL/MongoDB
4. **File Storage** — Firebase Storage or AWS S3

Full examples in `INTEGRATION_EXAMPLES.md`.

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| Mobile (< 768px) | Single column form, stacked cards |
| Tablet (768-1024px) | 2-3 column grid |
| Desktop (> 1024px) | Full 4-column Bento grid |

---

## ⚡ Performance

- GPU-accelerated CSS blur effects
- Optimized Framer Motion animations
- No heavy dependencies
- Tree-shakeable icon imports
- Production build < 200kb (gzipped)

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel deploy
```

### Self-hosted

```bash
npm run build
npm start
```

---

## 📄 License

MIT License — Free to use for educational and commercial purposes.

---

## 👨‍💻 Built by

Developed as part of MLRIT Admissions Tech Initiative.

**GitHub**: [@nnschinmayee07](https://github.com/nnschinmayee07)

---

> 💡 For questions, customization requests, or integration help — open an issue on this repository.
