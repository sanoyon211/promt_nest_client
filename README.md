# PromptVerse Client 🚀

PromptVerse is a modern, premium web application designed for AI enthusiasts, creators, and developers to discover, share, and monetize high-quality AI prompts. 

## 🌐 Live URL
[https://promptverse.example.com](https://promptverse.example.com) *(Placeholder for production deployment)*

## 🎯 Purpose
With the rapid growth of AI tools like ChatGPT, Midjourney, and Gemini, crafting the perfect prompt has become a highly sought-after skill. PromptVerse serves as a centralized hub where users can:
- **Discover** top-tier prompts across various categories (Coding, Marketing, Design, etc.).
- **Create & Monetize** by offering Premium Prompts to paying subscribers.
- **Save & Copy** prompts to their personal dashboards for immediate use.
- **Review & Report** content to maintain a high-quality community ecosystem.

## ✨ Core Features
- **Role-Based Dashboards**: Distinct, highly functional dashboards tailored for Users, Creators, and Admins.
- **Premium Subscriptions**: Integrated Stripe checkout for one-time $5 Premium access to unlock exclusive, private prompts.
- **Robust Admin Moderation**: Complete moderation suite including User Management, Prompt Approvals/Rejections (with feedback), and a Reported Content resolution hub.
- **Dynamic Analytics**: Stunning, real-time data visualizations via Recharts for both Creators (earnings/growth) and Admins (platform metrics).
- **Dark/Light Mode Theme Integration**: A flawlessly executed toggle system with strictly enforced color palettes mapped seamlessly across Tailwind classes and SVG charts.

## 📦 NPM Packages Used
The frontend is built with Next.js 15 and utilizes the following powerful libraries:

- **Framework**: `next` (v15), `react`, `react-dom`
- **Styling**: `tailwindcss`, `postcss`, `autoprefixer`
- **Icons**: `lucide-react`
- **Animations**: `framer-motion`
- **Data Visualization**: `recharts`
- **Theming**: `next-themes`
- **Notifications**: `react-toastify`
- **Payments**: `@stripe/react-stripe-js`, `@stripe/stripe-js`

## 🛠️ Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---
*Built with Next.js App Router.*
