// Error handling utility functions
const handleDatabaseError = (error) => {
    if (error.code === 'ENOENT') {
        return 'Database file not found. Please contact administrator.';
    }
    return 'An error occurred while accessing the database.';
};

const handleFileUploadError = (error) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
        return 'File size too large. Maximum size is 5MB.';
    }
    if (error.code === 'LIMIT_FILE_TYPE') {
        return 'Invalid file type. Only PDF files are allowed.';
    }
    return 'An error occurred while uploading the file.';
};

module.exports = {
    handleDatabaseError,
    handleFileUploadError
};