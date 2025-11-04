# Security Setup Guide

## Initial Admin Account Setup

This guide explains how to securely set up the initial admin account for the Property Management System.

### CRITICAL SECURITY WARNINGS

1. **NEVER** commit `.env` files to version control
2. **NEVER** hardcode credentials in source code
3. **ALWAYS** change default passwords immediately after first login
4. **ALWAYS** use strong, unique passwords in production

---

## Setup Instructions

### Step 1: Configure Environment Variables

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and update with your secure values:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong, random secret key (at least 32 characters)
   - `ADMIN_EMAIL`: The email for the admin account
   - `ADMIN_PASSWORD`: A strong password (change this immediately after first login!)

### Step 2: Create Admin User

Run the seed script to create the admin user:

```bash
node seedAdmin.js
```

This will:
- Connect to your MongoDB database
- Check if an admin user already exists
- Create a new admin user with the credentials from your `.env` file
- Hash the password securely using bcrypt

### Step 3: Remove Admin Credentials from .env

**IMPORTANT**: After successfully creating the admin account, you should:

1. Remove or comment out the admin credentials from `.env`:
   ```bash
   # Remove these lines after initial setup:
   # ADMIN_EMAIL=
   # ADMIN_PASSWORD=
   # ADMIN_FIRST_NAME=
   # ADMIN_LAST_NAME=
   # ADMIN_COMPANY=
   # ADMIN_PHONE=
   ```

2. This prevents the credentials from being accidentally exposed.

### Step 4: First Login

1. Start the backend server:
   ```bash
   npm start
   # or
   node index.js
   ```

2. Login using the admin credentials you set up

3. **IMMEDIATELY** change your password to a new, strong password

---

## Production Security Checklist

Before deploying to production:

- [ ] Generate a strong, random JWT_SECRET (use a password generator)
- [ ] Use a strong admin password (minimum 12 characters, mix of letters, numbers, symbols)
- [ ] Remove admin credentials from .env after initial setup
- [ ] Ensure `.env` is in `.gitignore`
- [ ] Never commit `.env` files to version control
- [ ] Use environment variables in production (not .env files)
- [ ] Enable HTTPS/SSL in production
- [ ] Implement rate limiting on authentication endpoints
- [ ] Set up monitoring and alerts for failed login attempts
- [ ] Regularly rotate JWT secrets and passwords
- [ ] Use a secure password manager for credential storage

---

## Additional Security Recommendations

### Password Requirements

Implement strong password policies:
- Minimum 12 characters
- Mix of uppercase and lowercase letters
- Include numbers and special characters
- No common words or patterns
- No reuse of previous passwords

### JWT Token Security

- Keep JWT_SECRET extremely secure
- Never expose it in client-side code
- Rotate secrets periodically
- Use appropriate token expiration times
- Consider implementing refresh tokens

### Database Security

- Use connection strings with authentication
- Restrict database access by IP address
- Enable MongoDB authentication
- Regular backups
- Monitor for suspicious activity

### Application Security

- Keep all dependencies up to date
- Run security audits: `npm audit`
- Use HTTPS in production
- Implement CORS properly
- Validate and sanitize all inputs
- Use parameterized queries (prevents SQL/NoSQL injection)
- Implement rate limiting
- Enable security headers (helmet.js)

---

## Incident Response

If credentials are compromised:

1. Immediately change all affected passwords
2. Rotate JWT_SECRET (will invalidate all existing tokens)
3. Review access logs for suspicious activity
4. Notify affected users if necessary
5. Review and update security measures

---

## Questions or Issues?

If you encounter any security concerns or issues:

1. Do NOT post sensitive information in public issues
2. Contact the security team directly
3. Document the issue for internal review
