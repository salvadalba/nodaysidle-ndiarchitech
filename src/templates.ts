export interface Template {
    id: string
    name: string
    stackId: string
    description: string
    input: string
}

export const TEMPLATES: Template[] = [
    // Modern Web App Templates
    {
        id: "saas-dashboard",
        name: "SaaS Dashboard",
        stackId: "modern-web",
        description: "Multi-tenant dashboard with user management",
        input: `A SaaS dashboard application with:
- User authentication (email/password + OAuth)
- Multi-tenant workspace support
- Role-based access control (Admin, Member, Viewer)
- Dashboard with analytics widgets
- Settings page for profile and billing
- Responsive design for mobile/tablet`
    },
    {
        id: "ecommerce",
        name: "E-commerce Store",
        stackId: "modern-web",
        description: "Online store with cart and checkout",
        input: `An e-commerce store with:
- Product catalog with categories and filters
- Product detail pages with images and reviews
- Shopping cart with quantity management
- Checkout flow with shipping and payment
- Order history and tracking
- Admin panel for inventory management`
    },

    // Content Platform Templates
    {
        id: "blog-platform",
        name: "Blog Platform",
        stackId: "content-platform",
        description: "Personal or team blog with CMS",
        input: `A modern blog platform with:
- Markdown-based article editor
- Categories and tags for organization
- Featured images and SEO metadata
- Author profiles and bios
- Comment system with moderation
- RSS feed generation
- Newsletter subscription`
    },
    {
        id: "documentation-site",
        name: "Documentation Site",
        stackId: "content-platform",
        description: "Technical docs with search",
        input: `A documentation website with:
- Sidebar navigation with nested sections
- Full-text search across all docs
- Code syntax highlighting
- Copy-to-clipboard for code blocks
- Version selector for multiple releases
- Dark/light theme toggle
- Edit on GitHub links`
    },

    // Tauri Local-First Templates  
    {
        id: "note-taking",
        name: "Note-Taking App",
        stackId: "tauri-localfirst",
        description: "Markdown notes with local storage",
        input: `A local-first note-taking app with:
- Markdown editor with live preview
- Folder/notebook organization
- Full-text search across all notes
- Tags and quick filters
- Dark theme by default
- Export to markdown files
- No cloud, all data stored locally in SQLite`
    },
    {
        id: "password-manager",
        name: "Password Manager",
        stackId: "tauri-localfirst",
        description: "Encrypted local password vault",
        input: `A local password manager with:
- Master password authentication
- Encrypted SQLite database
- Password generator with options
- Categories for organizing entries
- Search and quick copy
- Auto-lock after inactivity
- Import/export functionality
- No internet required, fully offline`
    },
    {
        id: "habit-tracker",
        name: "Habit Tracker",
        stackId: "tauri-localfirst",
        description: "Daily habits with streak calendar",
        input: `A habit tracking app with:
- Create daily/weekly habits
- Mark habits complete with one click
- Streak tracking and calendar view
- Statistics and completion rates
- Reminders (optional)
- Data stored locally in SQLite
- Simple, focused interface`
    },

    // ML Lite Templates
    {
        id: "recommendation-engine",
        name: "Recommendation Engine",
        stackId: "ml-lite",
        description: "Content-based recommendations",
        input: `A recommendation system with:
- User preference collection
- Content-based filtering algorithm
- Similar items API endpoint
- Personalized homepage feed
- "More like this" component
- A/B testing for algorithm variants
- Analytics on recommendation clicks`
    },

    // Realtime Collab Templates
    {
        id: "chat-app",
        name: "Chat Application",
        stackId: "realtime-collab",
        description: "Real-time messaging with channels",
        input: `A real-time chat application with:
- User authentication
- Public and private channels
- Direct messaging between users
- Real-time message delivery via WebSocket
- Online/offline presence indicators
- Message history with pagination
- Typing indicators
- File/image attachments`
    },
    {
        id: "collaborative-whiteboard",
        name: "Collaborative Whiteboard",
        stackId: "realtime-collab",
        description: "Multi-user drawing canvas",
        input: `A collaborative whiteboard with:
- Real-time drawing sync via WebSocket
- Multiple cursors showing other users
- Drawing tools (pen, shapes, text)
- Color picker and brush sizes
- Undo/redo support
- Export to image
- Room-based sessions with shareable links
- User presence indicators`
    }
]

export function getTemplatesForStack(stackId: string): Template[] {
    return TEMPLATES.filter(t => t.stackId === stackId)
}
