const XLSX = require('xlsx');

async function handleStudentEdit(req) {
    try {
        const { registrationNumber: oldRegNumber } = req.params;
        const { 
            registrationNumber: newRegNumber, 
            rollNumber,
            registrationCard,
            resultCard 
        } = req.body;
        
        // Validate Google Drive links if provided
        if (registrationCard && !isValidDriveLink(registrationCard)) {
            return {
                success: false,
                message: 'Invalid Registration Card Drive link'
            };
        }
        if (resultCard && !isValidDriveLink(resultCard)) {
            return {
                success: false,
                message: 'Invalid Result Card Drive link'
            };
        }
        
        const workbook = XLSX.readFile('students.xlsx');
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const students = XLSX.utils.sheet_to_json(worksheet);
        
        // Find and update the student
        const studentIndex = students.findIndex(s => s.registrationNumber === oldRegNumber);
        if (studentIndex === -1) {
            return {
                success: false,
                message: 'Student not found'
            };
        }
        
        // Update student data
        students[studentIndex] = {
            ...students[studentIndex],
            registrationNumber: newRegNumber,
            rollNumber: rollNumber,
            registrationCardPath: registrationCard || students[studentIndex].registrationCardPath,
            resultCardPath: resultCard || students[studentIndex].resultCardPath
        };
        
        // Save to Excel
        const newWorksheet = XLSX.utils.json_to_sheet(students);
        workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
        XLSX.writeFile(workbook, 'students.xlsx');
        
        return {
            success: true,
            message: 'Student updated successfully'
        };
    } catch (error) {
        console.error('Error in handleStudentEdit:', error);
        return {
            success: false,
            message: 'Failed to update student'
        };
    }
}

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

module.exports = {
    handleStudentEdit,
    isValidDriveLink
};