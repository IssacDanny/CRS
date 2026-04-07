const axios = require('axios');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const API_BASE_URL = 'http://localhost:8000/api';
const TOKEN_FILE_PATH = path.join(__dirname, '.token_storage');

// Setup the interface for input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask a question and wait for an answer
const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

// --- Token Management ---
function saveToken(token) {
  fs.writeFileSync(TOKEN_FILE_PATH, token);
  console.log('\n✅ Token saved! You are logged in.');
}

function loadToken() {
  return fs.existsSync(TOKEN_FILE_PATH) ? fs.readFileSync(TOKEN_FILE_PATH, 'utf-8') : null;
}

function getAuthHeaders() {
  const token = loadToken();
  if (!token) {
    console.log('\n❌ Error: Please log in first.');
    return null;
  }
  return { headers: { Authorization: `Bearer ${token}` } };
}

// --- Action Handlers ---
async function handleLogin() {
  const username = await ask('Username: ');
  const password = await ask('Password: ');
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
    saveToken(response.data.token);
  } catch (e) {
    console.log('\n❌ Login Failed:', e.response?.data?.message || e.message);
  }
}

async function handleViewCourses() {
  const headers = getAuthHeaders();
  if (!headers) return;
  try {
    const res = await axios.get(`${API_BASE_URL}/courses`, headers);
    console.log('\n--- Available Courses ---');
    console.table(res.data);
  } catch (e) {
    console.log('\n❌ Error:', e.response?.data?.message || e.message);
  }
}

async function handleRegister() {
  const headers = getAuthHeaders();
  if (!headers) return;
  const courseId = await ask('Enter Course ID to join: ');
  try {
    await axios.post(`${API_BASE_URL}/enrollments`, { courseId: parseInt(courseId) }, headers);
    console.log('\n✅ Registered successfully!');
  } catch (e) {
    console.log('\n❌ Failed:', e.response?.data?.message || e.message);
  }
}

async function handleCreateCourse() {
  const headers = getAuthHeaders();
  if (!headers) return;
  const courseCode = await ask('Course Code (e.g. CS101): ');
  const courseName = await ask('Course Name: ');
  const capacity = await ask('Capacity (default 50): ') || 50;
  const day_of_week = await ask('Day (MONDAY, TUESDAY, etc): ');
  
  try {
    await axios.post(`${API_BASE_URL}/courses`, { 
        courseCode, courseName, capacity: parseInt(capacity), day_of_week,
        startTime: "09:00:00", endTime: "10:30:00" 
    }, headers);
    console.log('\n✅ Course Created!');
  } catch (e) {
    console.log('\n❌ Failed:', e.response?.data?.message || e.message);
  }
}

// --- Main Menu ---
async function main() {
  while (true) {
    console.log('\n=== CRS MAIN MENU ===');
    console.log('1. Login');
    console.log('2. View All Courses');
    console.log('3. Register for Course (Student)');
    console.log('4. Create Course (Academic Office)');
    console.log('5. Exit');
    
    const choice = await ask('\nSelect an option (1-5): ');

    switch (choice) {
      case '1': await handleLogin(); break;
      case '2': await handleViewCourses(); break;
      case '3': await handleRegister(); break;
      case '4': await handleCreateCourse(); break;
      case '5': 
        console.log('Goodbye!');
        rl.close();
        return;
      default:
        console.log('Invalid choice, try again.');
    }
    await ask('\nPress Enter to continue...');
  }
}

console.log('Starting CLI...');
main();