# WorkOS SSO Authentication Setup Guide

## Overview

This guide provides comprehensive instructions for setting up WorkOS SSO authentication with Google and Microsoft OAuth providers for the Job Flow platform.

## Table of Contents

- [Prerequisites](#prerequisites)
- [WorkOS Account Setup](#workos-account-setup)
- [Configuration](#configuration)
- [Google OAuth Setup](#google-oauth-setup)
- [Microsoft OAuth Setup](#microsoft-oauth-setup)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

---

## Prerequisites

Before setting up WorkOS authentication, ensure you have:

- A WorkOS account (sign up at https://workos.com)
- Node.js 18+ installed
- The Job Flow application cloned and dependencies installed
- Access to Google Cloud Console (for Google OAuth)
- Access to Azure Portal (for Microsoft OAuth)

---

## WorkOS Account Setup

### Step 1: Create a WorkOS Account

1. Go to https://workos.com and sign up for a free account
2. Verify your email address
3. Log in to the WorkOS Dashboard

### Step 2: Create an Environment

1. In the WorkOS Dashboard, click on "Environments"
2. Your default "Development" environment should already be created
3. Note: For production, you'll create a separate "Production" environment later

### Step 3: Get Your API Credentials

1. Navigate to "API Keys" in the sidebar
2. Copy your **API Key** (starts with `sk_test_` for development)
3. Copy your **Client ID** (starts with `client_`)
4. Save these securely - you'll need them later

---

## Configuration

### Update Environment Variables

1. Navigate to your Job Flow project directory:
   ```bash
   cd jobflow
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Open `.env` and add your WorkOS credentials:
   ```env
   # WorkOS SSO Authentication
   WORKOS_API_KEY=sk_test_your_actual_api_key_here
   WORKOS_CLIENT_ID=client_your_actual_client_id_here
   ```

---

## Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "Job Flow Auth")
4. Click "Create"

### Step 2: Enable Google OAuth API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" (unless you have a Google Workspace)
3. Click "Create"
4. Fill in the required information:
   - **App name**: Job Flow
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click "Save and Continue"
6. On the "Scopes" page, click "Add or Remove Scopes"
7. Add these scopes:
   - `userinfo.email`
   - `userinfo.profile`
   - `openid`
8. Click "Save and Continue"
9. On "Test users", add your email for testing
10. Click "Save and Continue"

### Step 4: Create OAuth Client ID

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Name it "Job Flow"
5. Under "Authorized redirect URIs", add:
   ```
   https://api.workos.com/sso/oauth/google/callback
   ```
6. Click "Create"
7. Copy the **Client ID** and **Client Secret**

### Step 5: Add Google OAuth to WorkOS

1. Go to your WorkOS Dashboard
2. Click "Authentication" → "OAuth Providers"
3. Click "Add Provider" → "Google OAuth"
4. Enter your Google OAuth credentials:
   - **Client ID**: Paste from Google
   - **Client Secret**: Paste from Google
5. Click "Save"

---

## Microsoft OAuth Setup

### Step 1: Register Application in Azure

1. Go to https://portal.azure.com
2. Search for and select "Azure Active Directory"
3. Click "App registrations" → "New registration"
4. Fill in the details:
   - **Name**: Job Flow
   - **Supported account types**: "Accounts in any organizational directory and personal Microsoft accounts"
   - **Redirect URI**: Web, `https://api.workos.com/sso/oauth/microsoft/callback`
5. Click "Register"

### Step 2: Create Client Secret

1. In your app registration, go to "Certificates & secrets"
2. Click "New client secret"
3. Add a description (e.g., "Job Flow Auth")
4. Select expiration (recommend 24 months)
5. Click "Add"
6. **Important**: Copy the **Value** immediately (you can't see it again!)

### Step 3: Configure API Permissions

1. Go to "API permissions"
2. Click "Add a permission"
3. Select "Microsoft Graph"
4. Choose "Delegated permissions"
5. Add these permissions:
   - `User.Read`
   - `email`
   - `openid`
   - `profile`
6. Click "Add permissions"
7. Click "Grant admin consent" (if available)

### Step 4: Add Microsoft OAuth to WorkOS

1. Go to your WorkOS Dashboard
2. Click "Authentication" → "OAuth Providers"
3. Click "Add Provider" → "Microsoft OAuth"
4. Enter your Microsoft OAuth credentials:
   - **Client ID**: Application (client) ID from Azure
   - **Client Secret**: The secret value you copied
5. Click "Save"

---

## Environment Variables

### Complete .env Configuration

Your final `.env` file should look like this:

```env
# Convex Backend
VITE_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk Authentication (Optional - Can coexist with WorkOS)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key

# WorkOS SSO Authentication
WORKOS_API_KEY=sk_test_1a2b3c4d5e6f7g8h9i0j
WORKOS_CLIENT_ID=client_abcdefghij123456

# OpenRouter AI (for resume generation)
OPENROUTER_API_KEY=sk-or-v1-your_key_here
```

### Convex Environment Variables

You also need to set WorkOS credentials in your Convex deployment:

1. Run Convex development:
   ```bash
   npx convex dev
   ```

2. In a separate terminal, set environment variables:
   ```bash
   npx convex env set WORKOS_API_KEY sk_test_your_actual_api_key
   npx convex env set WORKOS_CLIENT_ID client_your_actual_client_id
   ```

---

## Testing

### Test Google SSO

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:5173/login

3. Click "Continue with Google"

4. You should be redirected to Google's login page

5. Sign in with your Google account

6. After authentication, you should be redirected back to the dashboard

7. Verify your user was created:
   ```bash
   npx convex run users:list
   ```

### Test Microsoft SSO

1. Follow the same steps as Google SSO

2. Click "Continue with Microsoft" instead

3. Sign in with your Microsoft account

4. Verify authentication completes successfully

### Test Session Management

Check active sessions in Convex dashboard or by querying:

```bash
npx convex run authSessions:getUserSessions
```

---

## Troubleshooting

### Common Issues

#### "WorkOS API key not configured"

**Solution**: Ensure environment variables are set correctly in both `.env` and Convex:
```bash
npx convex env list
```

#### Google OAuth Error: "redirect_uri_mismatch"

**Solution**: Verify the redirect URI in Google Cloud Console exactly matches:
```
https://api.workos.com/sso/oauth/google/callback
```

#### Microsoft OAuth Error: "AADSTS50011"

**Solution**: Ensure the redirect URI in Azure portal includes the correct callback URL.

#### "Failed to create user session"

**Solution**:
1. Check Convex logs: `npx convex logs`
2. Verify database schema is up to date
3. Ensure `authSessions` table exists in schema

#### Session expires immediately

**Solution**: Check your system clock is synchronized. WorkOS tokens are time-sensitive.

### Debug Mode

Enable detailed logging by adding to `.env`:

```env
DEBUG=workos:*
NODE_ENV=development
```

---

## Security Best Practices

### 1. Environment Variables

- **Never commit** `.env` files to version control
- Use different API keys for development and production
- Rotate API keys regularly (every 90 days)

### 2. HTTPS Requirements

- WorkOS requires HTTPS for OAuth callbacks
- Use ngrok or similar for local HTTPS testing:
  ```bash
  ngrok http 5173
  ```

### 3. Session Management

- Sessions expire after 24 hours by default
- Implement refresh token rotation
- Revoke sessions on password change
- Monitor for suspicious session activity

### 4. User Data

- Only request necessary OAuth scopes
- Implement GDPR data export/deletion
- Encrypt sensitive user data at rest
- Use row-level security in Convex

### 5. Error Handling

- Don't expose internal errors to users
- Log authentication failures for monitoring
- Implement rate limiting on login attempts
- Use CAPTCHA for suspicious activity

---

## Production Deployment

### Before Going Live

1. **Create Production Environment in WorkOS**
   - Create new environment in WorkOS Dashboard
   - Get production API keys
   - Configure production redirect URIs

2. **Update OAuth Providers**
   - Update Google OAuth redirect URI to production domain
   - Update Microsoft OAuth redirect URI to production domain

3. **Environment Variables**
   ```env
   WORKOS_API_KEY=sk_live_your_production_key
   WORKOS_CLIENT_ID=client_your_production_id
   ```

4. **Set Convex Production Variables**
   ```bash
   npx convex deploy --prod
   npx convex env set WORKOS_API_KEY sk_live_key --prod
   npx convex env set WORKOS_CLIENT_ID client_id --prod
   ```

5. **Test Production Flow**
   - Test both Google and Microsoft SSO
   - Verify session management works
   - Test logout functionality
   - Verify user data is stored correctly

---

## Additional Resources

### Documentation

- [WorkOS Docs](https://workos.com/docs)
- [WorkOS SSO Guide](https://workos.com/docs/sso/guide)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)

### Support

- WorkOS Support: support@workos.com
- WorkOS Community: https://discord.gg/workos
- Job Flow Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

## Next Steps

After completing WorkOS SSO setup, consider implementing:

1. **US-AUTH-002**: User Registration Flow (with email/password option)
2. **US-AUTH-003**: Enhanced Session Management
3. **US-AUTH-004**: Password Reset Flow
4. **US-AUTH-005**: Two-Factor Authentication (2FA)
5. **US-AUTH-006**: Role-Based Access Control (RBAC)
6. **US-AUTH-007**: Row-Level Security
7. **US-AUTH-008**: Security Audit Logging

---

## Changelog

- **v1.0.0** (2025-11-13): Initial WorkOS SSO implementation with Google and Microsoft OAuth
- **Status**: ✅ US-AUTH-001 Complete

---

**Questions?** Open an issue or contact the development team.
