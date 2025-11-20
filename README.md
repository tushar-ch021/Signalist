# 📈 Signalist - Real-Time Stock Market Intelligence Platform

Signalist is a modern, AI-powered stock market intelligence platform that provides real-time market data, personalized stock recommendations, and intelligent news summaries to help investors make informed decisions.


## 🌟 Features

### 📊 Real-Time Market Data
- **Live Stock Prices**: Up-to-the-second updates on stock prices, indices, and commodities
- **Interactive Charts**: TradingView-powered charts with technical indicators
- **Market Heatmaps**: Visual representation of market movements
- **Stock Search**: Fast, intelligent stock symbol search with autocomplete

### 🤖 AI-Powered Intelligence
- **Personalized Welcome**: AI-generated personalized onboarding based on user preferences
- **Smart News Summaries**: Google Gemini AI summarizes market news into actionable insights
- **Daily Briefings**: Automated daily email summaries of relevant market news
- **Watchlist Recommendations**: Get news and updates for stocks you're tracking

### 📧 Email Notifications
- **Welcome Emails**: Personalized welcome messages for new users
- **Stock Recommendations**: Immediate market overview upon registration
- **Daily News Digest**: Scheduled daily summaries at 12:00 PM
- **Watchlist Alerts**: News updates for stocks in your watchlist

### 👤 User Features
- **Secure Authentication**: Email/password authentication with Better-Auth
- **Custom Watchlists**: Track your favorite stocks
- **User Profiles**: Personalized investment goals and risk tolerance settings
- **Responsive Design**: Seamless experience across desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15.5.5](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Charts**: [TradingView Widgets](https://www.tradingview.com/widget/)

### Backend
- **Runtime**: Node.js
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [Better-Auth](https://www.better-auth.com/)
- **Background Jobs**: [Inngest](https://www.inngest.com/)
- **Email Service**: [Nodemailer](https://nodemailer.com/)

### APIs & Services
- **Market Data**: [Finnhub API](https://finnhub.io/)
- **AI Processing**: [Google Gemini 1.5 Flash](https://ai.google.dev/)
- **Event Processing**: Inngest for serverless workflows

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **MongoDB** (local or cloud instance)

You'll also need API keys for:
- Finnhub API (free tier available)
- Google Gemini API
- Email service (Gmail, SendGrid, etc.)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/tushar-ch021/Signalist.git
cd Signalist/stock-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000

# Email Service
EMNODE_MAILER=your_email@gmail.com
NODE_MAILER_PASSWORD=your_app_password

# APIs
FINNHUB_API_KEY=your_finnhub_api_key
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key
GEMINI_API_KEY=your_gemini_api_key

# Inngest (optional for local development)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 5. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
stock-app/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/            # Main application pages
│   │   ├── stocks/        # Stock details pages
│   │   ├── watchlist/     # Watchlist management
│   │   └── page.tsx       # Home page
│   └── api/               # API routes
├── components/            # Reusable React components
│   ├── forms/            # Form components
│   └── ui/               # UI components (Radix UI)
├── lib/                   # Utility libraries
│   ├── actions/          # Server actions
│   ├── inngest/          # Inngest functions & prompts
│   ├── nodemailer/       # Email templates & config
│   └── better-auth/      # Authentication config
├── database/             # Database models
└── public/               # Static assets
```

## 🔑 Key Features Explained

### Watchlist Management
Users can search for stocks and add them to their personalized watchlist. The watchlist syncs across devices and provides quick access to tracked stocks.

### AI-Powered News Summaries
Using Google Gemini AI, Signalist processes raw market news and generates concise, actionable summaries tailored to each user's watchlist and preferences.

### Automated Email Workflows
Inngest handles background jobs for:
- Sending welcome emails with personalized intros
- Delivering daily news summaries
- Processing user-specific stock recommendations

### Real-Time Data Integration
Finnhub API provides:
- Real-time stock quotes
- Company profiles
- Market news
- Historical data

## 🔒 Security

- **Authentication**: Secure email/password authentication with Better-Auth
- **Environment Variables**: Sensitive data stored in `.env` (never committed)
- **Input Validation**: Server-side validation for all user inputs
- **HTTPS**: Production deployment uses HTTPS only

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Render

1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy!

## 📧 Email Configuration

For Gmail:
1. Enable 2-Factor Authentication
2. Generate an App Password
3. Use the app password in `NODE_MAILER_PASSWORD`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Tushar Chaudhary**
- GitHub: [@tushar-ch021](https://github.com/tushar-ch021)

## 🙏 Acknowledgments

- [Finnhub](https://finnhub.io/) for market data API
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [TradingView](https://www.tradingview.com/) for chart widgets
- [Inngest](https://www.inngest.com/) for event-driven workflows
- [Better-Auth](https://www.better-auth.com/) for authentication

## 📞 Support

For support, email tusharchaudhary02100@gmail.com or open an issue on GitHub.

---

**Made with ❤️ by Tushar Chaudhary**