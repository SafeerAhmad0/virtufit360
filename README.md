# VirtuFit360 - Your Ultimate Fitness Companion

![VirtuFit360 Logo](/public/images/Logo1.png)

VirtuFit360 is a modern, full-stack fitness platform built with Next.js, React, and Supabase. It provides users with a comprehensive fitness tracking solution, workout plans, and personalized training experiences.

## 🚀 Features

- 🔐 User authentication and profile management
- 💪 Workout tracking and progress monitoring
- 📅 Training plan scheduling
- 🎯 Goal setting and achievement tracking
- 📊 Performance analytics and insights
- 🎨 Modern, responsive UI with smooth animations
- 🔄 Real-time data synchronization

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Emotion, Material-UI
- **Backend**: Supabase (Authentication, Database, Storage)
- **Animation**: Framer Motion
- **Form Handling**: React Hook Form
- **State Management**: React Context API
- **Notifications**: React Hot Toast, Sonner
- **Email**: EmailJS

## 📦 Prerequisites

- Node.js 18.0 or later
- npm or yarn
- Supabase account (for backend services)
- EmailJS account (for email functionality)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/virtufit360.git
   cd virtufit360
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Copy the `.env.example` file to `.env.local` and fill in your Supabase and EmailJS credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   EMAILJS_SERVICE_ID=your-emailjs-service-id
   EMAILJS_TEMPLATE_ID=your-emailjs-template-id
   EMAILJS_PUBLIC_KEY=your-emailjs-public-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 🏗 Project Structure

```
src/
├── app/                 # App router pages and layouts
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   └── layout/         # Layout components
├── context/            # React context providers
├── data/               # Static data and types
└── public/             # Static assets
    └── images/         # Image assets
```

## 🔧 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - Open Source Firebase Alternative
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Production-ready animation library for React

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
