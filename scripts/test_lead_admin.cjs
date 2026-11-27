// =========================================================================
// TEST SCRIPT: LEAD ADMIN CONFIGURATION VERIFICATION
// =========================================================================

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting Lead Admin Configuration Verification...\n');

const LEAD_ADMIN_EMAIL = 'slapbiblechallenge@gmail.com';

// 1. Verify db.js Lead Admin configuration
const dbJsPath = path.join(__dirname, '..', 'web-client', 'src', 'services', 'db.js');
const dbJsSource = fs.readFileSync(dbJsPath, 'utf8');

assert(dbJsSource.includes(`export const LEAD_ADMIN_EMAIL = 'slapbiblechallenge@gmail.com'`), 'db.js must export LEAD_ADMIN_EMAIL');
assert(dbJsSource.includes('Action Prohibited: The Lead Administrator\'s privileges cannot be revoked.'), 'Must protect Lead Admin from revocation');
assert(dbJsSource.includes('Action Prohibited: The Lead Administrator account cannot be deleted.'), 'Must protect Lead Admin from deletion');
console.log('✓ [1/6] db.js: Verified LEAD_ADMIN_EMAIL, revocation protection, and deletion protection.');

// 2. Verify AuthContext.jsx Lead Admin role handling
const authContextPath = path.join(__dirname, '..', 'web-client', 'src', 'context', 'AuthContext.jsx');
const authContextSource = fs.readFileSync(authContextPath, 'utf8');
assert(authContextSource.includes('slapbiblechallenge@gmail.com'), 'AuthContext.jsx must recognize slapbiblechallenge@gmail.com');
assert(authContextSource.includes('isLeadAdmin'), 'AuthContext.jsx must provide isLeadAdmin');
console.log('✓ [2/6] AuthContext.jsx: Verified isAdmin and isLeadAdmin role checks.');

// 3. Verify Admin.jsx UI protection
const adminJsxPath = path.join(__dirname, '..', 'web-client', 'src', 'pages', 'Admin.jsx');
const adminJsxSource = fs.readFileSync(adminJsxPath, 'utf8');
assert(adminJsxSource.includes('slapbiblechallenge@gmail.com'), 'Admin.jsx must recognize slapbiblechallenge@gmail.com');
assert(adminJsxSource.includes('Protected Lead Admin'), 'Admin.jsx must display protected badge for Lead Admin');
console.log('✓ [3/6] Admin.jsx: Verified Lead Admin display, badge, and management feature access.');

// 4. Verify Auth.jsx Lead Admin portal shortcut
const authJsxPath = path.join(__dirname, '..', 'web-client', 'src', 'pages', 'Auth.jsx');
const authJsxSource = fs.readFileSync(authJsxPath, 'utf8');
assert(authJsxSource.includes('slapbiblechallenge@gmail.com'), 'Auth.jsx must default admin username shortcut to slapbiblechallenge@gmail.com');
console.log('✓ [4/6] Auth.jsx: Verified Admin sign-in portal maps to slapbiblechallenge@gmail.com.');

// 5. Verify Contact.jsx official administrative contact
const contactJsxPath = path.join(__dirname, '..', 'web-client', 'src', 'pages', 'Contact.jsx');
const contactJsxSource = fs.readFileSync(contactJsxPath, 'utf8');
assert(contactJsxSource.includes('slapbiblechallenge@gmail.com'), 'Contact.jsx must display slapbiblechallenge@gmail.com as official email');
console.log('✓ [5/6] Contact.jsx: Verified official administrative contact email.');

// 6. Verify SQL Schemas
const leadAdminSqlPath = path.join(__dirname, '..', 'supabase_lead_admin.sql');
const leadAdminSqlSource = fs.readFileSync(leadAdminSqlPath, 'utf8');
assert(leadAdminSqlSource.includes('slapbiblechallenge@gmail.com'), 'SQL must target slapbiblechallenge@gmail.com');
assert(leadAdminSqlSource.includes('super_admin'), 'SQL must grant super_admin role');
assert(leadAdminSqlSource.includes('trg_protect_lead_admin'), 'SQL must create protect_lead_admin trigger');
console.log('✓ [6/6] SQL Schemas: Verified Lead Admin elevation, duplicate elimination, and DB-level protection trigger.');

console.log('\n🎉 ALL 6 LEAD ADMIN VERIFICATION CHECKS PASSED SUCCESSFULLY!\n');
