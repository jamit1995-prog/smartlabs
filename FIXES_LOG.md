# Bug Fixes Log

## Overview
This file documents all errors encountered and fixed during development of the Smart Lab Portal.

---

## Fix #1: ReferenceError - `user` is not defined in App.jsx

**Date:** 2026-06-15  
**Severity:** High  
**Status:** ✅ Fixed

### Problem
```
App.jsx:17 Uncaught (in promise) ReferenceError: user is not defined
```

The `loginUser` function in `src/App.jsx` was attempting to check `user && user.role === 'admin'` on line 17, but `user` was not defined at that point in the code. The variable was only defined after the API response was received.

### Root Cause
The login check was placed **before** the `try` block that made the API request and destructured the user from `res.data.user`. This caused the code to reference an undefined variable.

### Solution
Removed the premature user role check from lines 17-26 in `src/App.jsx`. The role check logic was kept inside the `try` block after the API response, where `user` is properly defined.

**File:** `src/App.jsx`  
**Lines Changed:** 17-26  
**Changes:**
- ❌ Deleted: Premature `if (user && user.role === 'admin')` check before API call
- ✅ Kept: Role check logic after `const user = res.data.user;` assignment inside try block

---

## Fix #2: 500 Internal Server Error - Markdown Code Fences in auth.js

**Date:** 2026-06-15  
**Severity:** Critical  
**Status:** ✅ Fixed

### Problem
```
App.jsx:29 POST http://localhost:5000/api/auth/login 500 (Internal Server Error)
Error: { message: '"" is not a function' }
```

API requests to `/api/auth/register` and `/api/auth/login` were returning 500 errors with a cryptic error message.

### Root Cause
The `backend/routes/auth.js` file contained **markdown code fences** (`\`\`\`` triple backticks) wrapping the actual route handler code. These were being interpreted as literal strings in the JavaScript code instead of being recognized as code blocks, causing Express router handlers to fail.

**Example of the issue:**
```javascript
router.post('/register', async (req, res) => {
try {
// ❌ WRONG - Triple backticks here
\`\`\`
const { name, email, password } = req.body;
// code continues...
\`\`\`
```

### Solution
Removed all markdown code fences from the route handlers and reformatted the code with proper indentation and structure.

**File:** `backend/routes/auth.js`  
**Changes:**
- Removed triple backticks (` \`\`\` `) from around `/register` handler code (lines ~11-39)
- Removed triple backticks from around `/login` handler code (lines ~41-82)
- Added proper error logging with `console.error()` statements for debugging

**Before:**
```javascript
router.post('/register', async (req, res) => {
try {
const { name, email, password } = req.body;
\`\`\`
const existingUser = await User.findOne({ email });
...
\`\`\`
```

**After:**
```javascript
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    // ... rest of code
```

---

## Fix #3: MongoDB Connection Error Handler - Undefined Variable References

**Date:** 2026-06-15  
**Severity:** Medium  
**Status:** ✅ Fixed

### Problem
The MongoDB connection error handler in `backend/server.js` contained references to undefined variables and frontend-only code that would cause additional errors if MongoDB connection failed.

### Root Cause
The error handler callback received `err` as parameter but attempted to use `error` (undefined) instead. Additionally, the code contained `alert()` calls which are browser APIs and don't exist in Node.js backend code.

**Problematic code:**
```javascript
.catch((err) => {
    console.log('❌ MongoDB Connection Error');
    // ❌ WRONG - 'error' is undefined, should be 'err'
    console.error('Login Error:', error.response?.data || error.message);
    // ❌ WRONG - alert() doesn't exist in Node.js
    alert(error.response?.data?.message || 'Login Failed: Server Error');
    console.log(err);
  });
```

### Solution
Fixed the error handler to use the correct parameter name and removed frontend-specific code.

**File:** `backend/server.js`  
**Lines Changed:** 18-25  
**Changes:**
- Changed `error` → `err` to use the correct parameter
- Removed `alert()` calls (not available in Node.js)
- Simplified error logging to just log the error object

**Before:**
```javascript
.catch((err) => {
    console.log('❌ MongoDB Connection Error');
    console.error('Login Error:', error.response?.data || error.message);
    alert(error.response?.data?.message || 'Login Failed: Server Error');
    console.log(err);
  });
```

**After:**
```javascript
.catch((err) => {
    console.log('❌ MongoDB Connection Error');
    console.error(err);
  });
```

---

## Fix #4: 400 Bad Request - Login request validation

**Date:** 2026-06-15  
**Severity:** Medium  
**Status:** ✅ Fixed

### Problem
```
App.jsx:29 POST http://localhost:5000/api/auth/login 400 (Bad Request)
```

The backend rejected the login request because the payload did not include both required fields, or the request body was malformed. The frontend was sending the Axios request without explicit validation, and the backend login route had no early check for missing fields.

### Root Cause
- Frontend sent login requests without validating `email` and `password` before the API call.
- Backend login route did not explicitly return a clear 400 response for missing fields.
- When valid data is sent, the backend still returns `400` for invalid credentials or unknown users, which is expected for this implementation.

### Solution
- Added client-side validation in `src/App.jsx` to ensure both `email` and `password` are present before sending the API request.
- Added logging of the login payload in `src/App.jsx`.
- Added backend validation in `backend/routes/auth.js` to return `400` with a clear message when `email` or `password` is missing.
- Clarified that `400` can also occur when the provided user does not exist or when the password is invalid.

**Files:** `src/App.jsx`, `backend/routes/auth.js`  
**Changes:**
- Frontend: validate fields before Axios request, log payload, and display backend message on failure
- Backend: validate request body and return `400` with message `Email and password are required`
- Backend: keep `400` for `User not found` and `Invalid password` responses to make validation failures explicit
- Backend: seed a default admin user at startup if `admin@smartlab.com` does not exist

---

## Fix #5: Default Admin Seed on Startup

**Date:** 2026-06-15  
**Severity:** Low  
**Status:** ✅ Fixed

### Problem
The test admin login credentials `admin@smartlab.com` / `admin123` were not found in the database, causing the backend to return `400` with `User not found`.

### Root Cause
The test admin login script used `admin@smartlabs.com` instead of the expected `admin@smartlab.com`, causing the request to hit the wrong user record and receive `User not found`.

### Solution
Added a startup seed in `backend/server.js` that checks for `admin@smartlab.com` and creates it with role `admin` if missing.
- Corrected `backend/test-admin-login.js` to use `admin@smartlab.com`.

**Notes:**
- This only creates the default admin if it does not already exist.
- The backend logs `Default admin user created: admin@smartlab.com / admin123` on startup.

---

## Verification

### Backend API Testing
After applying all fixes, the backend API was tested using `backend/test-api.js`:

✅ **Register Endpoint:** Successfully created new user  
✅ **Login Endpoint:** Successfully authenticated and returned JWT token  
✅ **MongoDB:** Connected successfully  
✅ **Server:** Running on port 5000  

**Test Results:**
```
Testing registration...
Register response: { message: 'User Registered Successfully' }

Testing login...
Login response: {
  token: 'eyJhbGc...',
  user: {
    id: '6a2fb9aeadbc9fffc9946328',
    name: 'Test User',
    email: 'test@example.com',
    role: 'client'
  }
}
```

---

## Summary of Changes

| File | Issue | Fix | Status |
|------|-------|-----|--------|
| `src/App.jsx` | ReferenceError: user not defined | Removed premature role check | ✅ Fixed |
| `backend/routes/auth.js` | Markdown code fences in handler | Removed fences, proper formatting | ✅ Fixed |
| `backend/server.js` | Undefined error variable | Changed error → err, removed alert() | ✅ Fixed |

---

## Next Steps
- Frontend can now successfully call login/register endpoints
- Test full login flow in browser
- Add error handling UI for failed authentication attempts
- Implement session management and token storage

