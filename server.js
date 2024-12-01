const express = require('express');
const XLSX = require('xlsx');
const path = require('path');
const session = require('express-session');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Excel file operations
const EXCEL_FILE = 'students.xlsx';

function initializeExcelFile() {
  try {
    const workbook = XLSX.readFile(EXCEL_FILE);
  } catch (error) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, EXCEL_FILE);
  }
}

// Initialize Excel file on server start
initializeExcelFile();

// Routes
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/results', (req, res) => {
  res.render('results');
});


// Gallery Route 
app.get('/gallery', (req, res) => {
  res.render('gallery');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

// API Routes
app.post('/api/students', (req, res) => {
    try {
        const { registrationNumber, rollNumber, registrationCard, resultCard } = req.body;
        
        console.log('Received data:', {
            registrationNumber,
            rollNumber,
            registrationCard,
            resultCard
        });

        // Validate registration number and roll number
        if (!registrationNumber || !rollNumber) {
            return res.status(400).json({
                success: false,
                message: 'Registration number and roll number are required'
            });
        }

        // Clean and validate Google Drive links
        const cleanRegistrationCard = registrationCard.replace(/^@/, '').trim();
        const cleanResultCard = resultCard.replace(/^@/, '').trim();

        if (!isValidDriveLink(cleanRegistrationCard)) {
            return res.status(400).json({
                success: false,
                message: `Invalid Registration Card Drive link: ${cleanRegistrationCard}`
            });
        }

        if (!isValidDriveLink(cleanResultCard)) {
            return res.status(400).json({
                success: false,
                message: `Invalid Result Card Drive link: ${cleanResultCard}`
            });
        }

        const workbook = XLSX.readFile(EXCEL_FILE);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const students = XLSX.utils.sheet_to_json(worksheet);

        const newStudent = {
            registrationNumber,
            rollNumber,
            registrationCardPath: cleanRegistrationCard,
            resultCardPath: cleanResultCard
        };

        students.push(newStudent);
        const newWorksheet = XLSX.utils.json_to_sheet(students);
        workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
        XLSX.writeFile(workbook, EXCEL_FILE);

        res.json({ success: true, message: 'Student added successfully' });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ 
            success: false,
            message: 'An error occurred while adding the student'
        });
    }
});

// Add a helper function to validate Google Drive links
function isValidDriveLink(url) {
    try {
        // Log the URL for debugging
        console.log('Validating Drive URL:', url);
        
        // Remove any @ symbol if present at the start
        url = url.replace(/^@/, '');
        
        const driveUrl = new URL(url);
        console.log('Parsed URL:', {
            hostname: driveUrl.hostname,
            pathname: driveUrl.pathname
        });

        // Accept any Google Drive domain
        if (driveUrl.hostname === 'drive.google.com' || 
            driveUrl.hostname === 'docs.google.com') {
            
            // Accept any link that contains /file/d/ or /drive/ or /open
            if (driveUrl.pathname.includes('/file/d/') || 
                driveUrl.pathname.includes('/drive/') || 
                driveUrl.pathname.includes('/open')) {
                return true;
            }
        }
        
        console.log('URL validation failed');
        return false;
    } catch (error) {
        console.error('URL validation error:', error);
        return false;
    }
}

app.delete('/api/students/:registrationNumber', (req, res) => {
    try {
        const { registrationNumber } = req.params;
        
        // Log the deletion attempt
        console.log('Attempting to delete student:', registrationNumber);
        
        // Read the current data
        const workbook = XLSX.readFile(EXCEL_FILE);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let students = XLSX.utils.sheet_to_json(worksheet);
        
        // Find the student index
        const studentIndex = students.findIndex(s => s.registrationNumber === registrationNumber);
        
        if (studentIndex === -1) {
            console.log('Student not found:', registrationNumber);
            return res.status(404).json({ 
                success: false, 
                message: 'Student not found' 
            });
        }
        
        // Remove the student
        students.splice(studentIndex, 1);
        
        // Save the updated data
        const newWorksheet = XLSX.utils.json_to_sheet(students);
        workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
        XLSX.writeFile(workbook, EXCEL_FILE);
        
        console.log('Student deleted successfully:', registrationNumber);
        
        res.json({ 
            success: true, 
            message: 'Student deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred while deleting the student' 
        });
    }
});

app.get('/api/students/search', (req, res) => {
  try {
    const { registrationNumber, rollNumber } = req.query;
    const workbook = XLSX.readFile(EXCEL_FILE);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const students = XLSX.utils.sheet_to_json(worksheet);

    const student = students.find(s => 
      s.registrationNumber === registrationNumber && 
      s.rollNumber === rollNumber
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});