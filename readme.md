# Student Management System (SMS)

A web-based student management system that allows students to access their academic documents (registration cards and result cards) through Google Drive links, and administrators to manage student records.

## 🚀 Features

### For Students
- Search for academic documents using registration number and roll number
- View and download registration cards
- View and download result cards
- Mobile-responsive interface

### For Administrators
- Secure admin login
- Add new student records
- Edit existing student information
- Delete student records
- Manage Google Drive links for documents
- View all student records in a dashboard

## 🛠️ Technologies Used

- **Backend:**
  - Node.js
  - Express.js
  - XLSX (for Excel file handling)
  - Express-session (for authentication)
  - EJS (templating engine)

- **Frontend:**
  - HTML5
  - Tailwind CSS
  - JavaScript
  - Font Awesome Icons

- **Data Storage:**
  - Excel (.xlsx)
  - Google Drive (for document storage)

## 📋 Prerequisites

Before running this project, make sure you have:
- Node.js installed (v14 or higher)
- npm (Node Package Manager)
- A modern web browser
- Google Drive account (for document storage)

## ⚙️ Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/student-management-system.git
```

2. Navigate to the project directory:

```bash
cd student-management-system
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory:

```env
PORT=3000
SESSION_SECRET=your_secret_key
```

5. Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## 📁 Project Structure

```
student-management-system/
├── public/
├── routes/
│   └── admin.js
├── utils/
│   ├── auth.js
│   ├── errorHandler.js
│   └── studentOperations.js
├── views/
│   ├── admin/
│   │   ├── dashboard.ejs
│   │   ├── edit-student.ejs
│   │   └── login.ejs
│   ├── partials/
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   ├── about.ejs
│   ├── contact.ejs
│   ├── error.ejs
│   ├── gallery.ejs
│   ├── index.ejs
│   └── results.ejs
├── .env
├── package.json
├── server.js
└── students.xlsx
```

## 🔒 Security Features

- Session-based authentication
- Protected admin routes
- Input validation
- Google Drive link validation
- Secure password handling

## 💻 Usage

### Student Access
1. Visit the homepage
2. Click on "Search Results"
3. Enter registration number and roll number
4. View/download academic documents

### Admin Access
1. Navigate to `/admin`
2. Login with admin credentials
3. Manage student records:
   - Add new students
   - Edit existing records
   - Delete records
   - View all records

## 🔗 Google Drive Integration

To add student documents:
1. Upload documents to Google Drive
2. Set file permissions to "Anyone with the link can view"
3. Copy the sharing link
4. Paste the link in the admin dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## ⚠️ Important Notes

- Keep the `students.xlsx` file secure
- Regularly backup the Excel file
- Ensure proper Google Drive link permissions
- Don't share admin credentials

## 🐛 Known Issues

- Excel file needs to be closed while making changes
- Google Drive links must be in the correct format

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

Developed by [IH-TUSHAR](https://ih-tushar.github.io/portfolio/)

## 🙏 Acknowledgments

- TailwindCSS for the UI components
- Google Drive for document storage
- Express.js community
- Node.js community

## 📞 Support

For support, email [your-email@example.com] or create an issue in the repository.
```

</rewritten_file>
