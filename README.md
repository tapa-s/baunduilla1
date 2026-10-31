# Baunduilla - Travel & Tour Agency Web App

Official website and content management platform for **Baunduilla** (Sikkim, North Bengal, Assam, Meghalaya tours & homestay expeditions).

## Features
- **Interactive Destination Explorer**: Filter by Hill, Sea, Forest, and Desert across top regions (North Bengal, Sikkim, Assam, Meghalaya).
- **Tour Packages & Day-wise Itineraries**: Rich package details, pricing, highlights, and inclusions.
- **Admin Management Panel**: Real-time management of destinations, packages, team members, testimonials, travel gallery photos, and contact info.
- **Direct WhatsApp & Phone Bookings**: One-click inquiry system directly connected to official contact numbers.
- **Social Media Integration**: Verified links to Facebook, Instagram, and YouTube.
- **Fully Responsive**: Mobile-first design optimized for all screen sizes.

---

## Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `bun`

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/<YOUR-USERNAME>/baunduilla.git
   cd baunduilla
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) or the port indicated in your terminal.

4. Build for production:
   ```bash
   npm run build
   ```

---

## Deployment (Vercel / Netlify)

### Option 1: Deploy with Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.
2. Click **Add New Project** and import your `baunduilla` repository.
3. Keep default settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click **Deploy**. The included `vercel.json` ensures client-side routing works smoothly.

### Option 2: Deploy with Netlify
1. Go to [netlify.com](https://netlify.com) and sign in with GitHub.
2. Select **Import an existing project** and link your repository.
3. Build command: `npm run build`, Publish directory: `dist`.
4. Deploy site.
