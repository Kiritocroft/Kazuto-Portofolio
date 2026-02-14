# Kazuto Portfolio

A modern, interactive, and high-performance personal portfolio website built with Next.js 15, React, and Tailwind CSS.

![Project Preview](public/logo.png)

## 🚀 Features

- **Modern & Responsive Design**: Built with Tailwind CSS and shadcn/ui for a polished look on all devices.
- **Interactive UI**: Smooth animations powered by Framer Motion.
- **3D Elements**: Interactive 3D card component using React Three Fiber (Planned).
- **Real-time Chat**: Integrated chat widget using Firebase for direct communication.
- **Admin Dashboard**: Comprehensive admin panel to manage projects, certificates, and view analytics.
- **Dynamic Content**: Easy management of portfolio data.
- **Dark/Light Mode**: Fully supported theme switching.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend/Auth**: [Firebase](https://firebase.google.com/) (Auth, Firestore)
- **Deployment**: [Vercel](https://vercel.com/)

## 📂 Project Structure

```bash
kazuto-portofolio/
├── public/              # Static assets (images, icons)
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── admin/       # Admin Dashboard routes
│   │   ├── api/         # API Routes
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── components/
│   │   ├── layout/      # Layout components (Navbar, Footer)
│   │   ├── sections/    # Homepage sections (Hero, About, etc.)
│   │   └── ui/          # Reusable UI components
│   ├── data/            # Static data (portfolio items)
│   ├── lib/             # Utilities and configurations (Firebase, etc.)
│   └── types/           # TypeScript definitions
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # Tailwind configuration
└── package.json         # Dependencies and scripts
```

## 🚀 Getting Started

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Kiritocroft/Kazuto-Portofolio.git
    cd kazuto-portofolio
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables**

    Create a `.env.local` file in the root directory and add your Firebase credentials:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contribution

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📞 Contact

- **Name**: Muhammad Nabil Athaillah
- **Email**: nabilathaillah@gmail.com
- **LinkedIn**: [Muhammad Nabil Athaillah](https://www.linkedin.com/in/mnabilathaillah/)
- **GitHub**: [Kiritocroft](https://github.com/Kiritocroft)

---

&copy; 2024 Kazuto.dev. All Rights Reserved.
