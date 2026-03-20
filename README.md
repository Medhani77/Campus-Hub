# CINEC Campus Hub - Complete Documentation

## 📋 Overview
A modern, comprehensive campus hub system for CINEC students with integrated features for library management, cafe orders, rewards system, marketplace, events, and facility booking.

## 🎨 Design Features
- **Consistent Design Language**: All pages follow the same color scheme and typography
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Professional transitions and hover effects
- **User-Friendly Navigation**: Easy to navigate between all sections

## 📁 File Structure

### Core Pages
1. **index.html** - Login page (your existing login system)
2. **home.html** - Main dashboard/hub (NEW - updated design)
3. **Register.html** - Student registration form (NEW)

### Feature Pages
4. **LIBRARY.html** - Digital library with book browsing and borrowing
5. **Cafe.html** - Campus cafe menu and online ordering
6. **REWARD.html** - Rewards system with points and redemptions
7. **Marketplace.html** - Student marketplace for buying/selling items
8. **Events.html** - Campus events calendar and RSVP system
9. **Booking.html** - Facility booking system for labs, rooms, equipment

## 🔗 Navigation Flow

```
index.html (Login)
    ↓
home.html (Dashboard)
    ├── LIBRARY.html
    ├── Cafe.html
    ├── REWARD.html
    ├── Marketplace.html
    ├── Events.html
    └── Booking.html
```

## 🎯 Key Features by Page

### 1. Home Page (home.html)
- Welcome message with student name
- Quick access cards to all features
- Latest announcements
- Upcoming events preview
- Campus resources grid
- Integrated search functionality

### 2. Digital Library (LIBRARY.html)
- Browse books by category
- Search functionality
- Book availability status
- Borrow books online
- Earns reward points (50 pts per book)

### 3. Campus Cafe (Cafe.html)
- Menu with categories (Hot Drinks, Cold Drinks, Food, Snacks)
- Add items to cart
- Shopping cart summary
- Online ordering system
- Earns reward points (25 pts per order)

### 4. Rewards System (REWARD.html)
- Points balance display
- Tier progress tracking (Bronze → Silver → Gold → Platinum)
- Redeemable rewards catalog
- Transaction history
- Multiple reward tiers with benefits

### 5. Student Marketplace (Marketplace.html)
- Buy and sell items within campus
- Categories: Textbooks, Electronics, Clothing, Other
- Contact sellers directly
- Post new listings
- View your active listings

### 6. Campus Events (Events.html)
- Upcoming events grid
- Event details (date, time, location, capacity)
- RSVP system
- Event categories and tags
- Rewards points for attendance

### 7. Facility Booking (Booking.html)
- Book computer labs, meeting rooms, sports facilities
- Available facilities grid
- Booking form with date/time selection
- Capacity information
- Instant confirmation

## 💾 Local Storage Features

The system uses browser localStorage to persist data:

```javascript
// Student Information
localStorage.setItem('student_name', 'Full Name');
localStorage.setItem('student_index_no', 'EG/2024/IT/XXXX');
localStorage.setItem('student_id', 'database_id');

// Rewards Points
localStorage.setItem('reward_points', '1250');
```

## 🎨 Color Scheme

```css
--primary-dark: #0a2540    (Navy Blue)
--primary-blue: #1e4d7b    (Medium Blue)
--accent-gold: #d4a574     (Gold)
--accent-coral: #e07856    (Coral)
--neutral-100: #ffffff     (White)
--neutral-200: #f5f7fa     (Light Gray)
```

## 🔧 Setup Instructions

1. **Place all HTML files in the same directory**
2. **Ensure your existing backend is running** (for login functionality)
3. **Open index.html to start** - Login with credentials
4. **After login**, you'll be redirected to home.html
5. **Navigate** using the top menu or quick access cards

## 🌐 Backend Integration Points

The system expects these backend endpoints:

```javascript
// Login
POST http://localhost:3000/login
Body: { indexNo, password }
Response: { success, user: { id, index_no, full_name, email } }

// Registration
POST http://localhost:3000/register
Body: { fullName, email, indexNo, password, ... }
Response: { success, message }
```

## 📱 Responsive Breakpoints

- Desktop: > 968px
- Tablet: 768px - 968px
- Mobile: < 768px

## ✨ Interactive Features

### Points System
- Library borrowing: +50 points
- Cafe orders: +25 points
- Event attendance: +100-200 points
- Marketplace sales: +25 points

### Redemptions
- Free Coffee: 150 points
- Library Extension: 200 points
- Event Pass: 300 points
- Cafe Meal: 500 points
- CINEC Merch: 750 points
- Gym Membership: 1000 points

## 🎓 Tier System

| Tier | Points Required | Benefits |
|------|----------------|----------|
| Bronze | 0 - 499 | Basic access |
| Silver | 500 - 999 | 5% cafe discount |
| Gold | 1000 - 1999 | 10% cafe discount, Priority library access |
| Platinum | 2000+ | 15% discount, Free event tickets, Premium benefits |

## 🔐 Security Notes

- Passwords are sent to backend for validation
- Session management via localStorage
- Logout clears all local data
- Form validation on all input fields

## 📞 Support

For issues or questions:
- Email: support@cinec.edu
- Phone: +94 11-2 413 000
- IT Help Desk available in footer links

## 🚀 Future Enhancements

Potential additions:
- Real-time chat system
- Mobile app version
- Push notifications
- Integration with academic systems
- Payment gateway for cafe/marketplace
- QR code check-ins
- Grade management
- Course enrollment

## 📝 License

© 2026 CINEC Campus Hub. All rights reserved.

---

**Note**: This is a frontend demonstration. For production use, implement proper backend authentication, database integration, and security measures.
