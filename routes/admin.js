const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const multer = require('multer');
const path = require('path');
const { isAuthenticated } = require('../utils/auth');
const { handleStudentEdit } = require('../utils/studentOperations');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Admin routes
router.get('/', (req, res) => {
    res.redirect('/admin/login');
});

router.get('/login', (req, res) => {
    res.render('admin/login', { error: null });
});

router.get('/dashboard', isAuthenticated, (req, res) => {
    try {
        const workbook = XLSX.readFile('students.xlsx');
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const students = XLSX.utils.sheet_to_json(worksheet);
        res.render('admin/dashboard', { students });
    } catch (error) {
        console.error('Error reading Excel file:', error);
        res.render('admin/dashboard', { students: [] });
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        req.session.isAuthenticated = true;
        res.redirect('/admin/dashboard');
    } else {
        res.render('admin/login', { error: 'Invalid credentials' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Edit student route
router.get('/edit/:registrationNumber', isAuthenticated, (req, res) => {
    try {
        const { registrationNumber } = req.params;
        const workbook = XLSX.readFile('students.xlsx');
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const students = XLSX.utils.sheet_to_json(worksheet);
        
        const student = students.find(s => s.registrationNumber === registrationNumber);
        
        if (!student) {
            return res.redirect('/admin/dashboard');
        }
        
        res.render('admin/edit-student', { student });
    } catch (error) {
        console.error('Error:', error);
        res.redirect('/admin/dashboard');
    }
});

router.post('/edit/:registrationNumber', isAuthenticated, upload.fields([
    { name: 'registrationCard', maxCount: 1 },
    { name: 'resultCard', maxCount: 1 }
]), async (req, res) => {
    try {
        const result = await handleStudentEdit(req);
        if (result.success) {
            res.redirect('/admin/dashboard');
        } else {
            res.render('admin/edit-student', { 
                student: req.body,
                error: result.message 
            });
        }
    } catch (error) {
        console.error('Error:', error);
        res.render('admin/edit-student', { 
            student: req.body,
            error: 'Failed to update student record' 
        });
    }
});

module.exports = router;