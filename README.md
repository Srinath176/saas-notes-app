# Multi-Tenant SaaS Notes Application

A full-stack multi-tenant SaaS application built with React, Node.js, Express, and MongoDB. This application allows multiple tenants (companies) to securely manage their users and notes with role-based access control and subscription-based feature gating.

**Note:** check below for local setup, endpoints and pre-defined accounts.

## 🌟 Features

### Multi-Tenancy
- **Strict Tenant Isolation**: Complete data separation between tenants using shared schema with tenant ID approach
- **Pre-configured Tenants**: Acme and Globex organizations with separate user bases
- **Secure Architecture**: Zero data leakage between tenants guaranteed

### Authentication & Authorization
- **JWT-Based Authentication**: Secure token-based login system
- **Role-Based Access Control**:
  - **Admin**: Can invite users, upgrade tenant subscriptions, and manage all notes
  - **Member**: Can create, view, edit, and delete notes within their tenant

### Subscription Management
- **Free Plan**: Limited to 3 notes per tenant
- **Pro Plan**: Unlimited notes
- **One-Click Upgrade**: Admin users can upgrade their tenant instantly
- **Real-time Limit Enforcement**: Immediate application of subscription changes

### Notes Management (CRUD)
- **Create Notes**: Rich text note creation with title and content
- **View Notes**: Clean, organized note listing with metadata
- **Edit Notes**: Inline editing with save/cancel functionality
- **Delete Notes**: Secure note deletion with confirmation
- **Tenant Isolation**: Notes are strictly isolated per tenant

### Modern UI/UX
- **Responsive Design**: Works seamlessly across desktop and mobile
- **Professional Styling**: Clean, minimalist design with subtle animations
- **Real-time Feedback**: Toast notifications for all user actions
- **Intuitive Interface**: Easy-to-use forms and navigation

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests

### Deployment
- **Vercel** for both frontend and backend hosting
- **MongoDB Atlas** for database hosting (recommended)

## 🏗 Architecture

### Multi-Tenancy Approach: Shared Schema with Tenant ID

This application uses the **shared schema with tenant ID** approach for multi-tenancy:

- **Single Database**: All tenants share the same MongoDB database
- **Tenant Identification**: Each document contains a `tenantId` field for isolation
- **Query Filtering**: All database queries are automatically filtered by tenant ID
- **Cost Effective**: Minimal infrastructure overhead
- **Scalable**: Easy to add new tenants without schema changes

**Why This Approach?**
- **Simplicity**: Single codebase and database to maintain
- **Cost Efficiency**: Shared resources reduce operational costs
- **Performance**: Efficient queries with proper indexing
- **Security**: Strict middleware enforcement prevents cross-tenant access

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or Atlas)

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd saas-notes-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Variables**

   **Backend (.env):**
   ```env
   PORT=5000
   MONGO_DB_URI=mongodb://localhost:27017/saas-notes
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

   **Frontend (.env):**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Database Seeding**
   ```bash
   cd backend
   npm run seed
   ```

6. **Start Development Servers**

   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔐 Test Accounts

Use these pre-configured accounts for testing:

| Email | Password | Role | Tenant |
|-------|----------|------|---------|
| admin@acme.test | password | Admin | Acme |
| user@acme.test | password | Member | Acme |
| admin@globex.test | password | Admin | Globex |
| user@globex.test | password | Member | Globex |

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Health Check
- `GET /api/health` - Application health status

### Notes Management
- `GET /api/notes` - List all notes (tenant-filtered)
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Tenant Management
- `POST /api/tenants/:slug/upgrade` - Upgrade tenant to Pro (Admin only)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Tenant Isolation**: Middleware ensures strict data separation
- **Role-Based Access**: Endpoint-level permission checks
- **CORS Configuration**: Secure cross-origin request handling

## 📊 Subscription Plans

### Free Plan
- ✅ Up to 3 notes per tenant
- ✅ Full CRUD operations
- ✅ User management (Admin)
- ❌ Unlimited notes

### Pro Plan
- ✅ Unlimited notes
- ✅ All Free plan features
- ✅ Priority support (conceptual)

## 🚀 Deployment

### Vercel Deployment

1. **Backend Deployment**
   ```bash
   cd backend
   vercel --prod
   ```

2. **Frontend Deployment**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Environment Variables**
   - Configure production environment variables in Vercel dashboard
   - Update frontend `VITE_API_URL` to point to deployed backend

### Database Setup
- Use MongoDB Atlas for production
- Configure connection string in backend environment variables
- Run seed script against production database

## 🧪 Testing

The application includes comprehensive testing coverage:

- **Authentication Flow**: Login/logout functionality
- **Tenant Isolation**: Cross-tenant data access prevention
- **Role Permissions**: Admin vs Member access controls
- **Subscription Limits**: Free plan note limits and Pro upgrades
- **CRUD Operations**: Full notes management functionality

## 📝 Development Notes

### Key Design Decisions

1. **Shared Schema Multi-Tenancy**: Chosen for simplicity and cost-effectiveness
2. **JWT Authentication**: Stateless authentication for scalability
3. **React with TypeScript**: Type safety and better developer experience
4. **Tailwind CSS**: Utility-first CSS for rapid UI development
5. **Mongoose ODM**: Schema validation and easier MongoDB interactions

### Future Enhancements

- User invitation system
- Advanced note features (tags, categories, search)
- Audit logs for tenant activities
- Advanced subscription plans
- Real-time collaboration features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🐛 Troubleshooting

### Common Issues

**Frontend not connecting to backend:**
- Check if backend is running on correct port
- Verify `VITE_API_URL` environment variable
- Ensure CORS is properly configured

**Database connection issues:**
- Verify MongoDB URI in backend .env
- Check MongoDB service is running
- Ensure database credentials are correct

**Authentication issues:**
- Verify JWT_SECRET is set in backend
- Check token expiration settings
- Clear browser localStorage if needed

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

