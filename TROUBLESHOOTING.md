# JobFlow - Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "Failed to resolve import convex/_generated/api"

**Problem**: The Convex generated files don't exist yet.

**Solution**:
```bash
# Make sure you have convex.json
cd jobflow

# Run Convex in dev mode (it will generate the files)
npx convex dev
```

If you get "Cannot prompt for input in non-interactive terminals":
1. Open a new terminal/command prompt
2. Run `npx convex dev` there
3. Follow the login prompts
4. Create or select a project
5. The generated files will be created automatically

**Alternative**: The project includes pre-generated stub files in `convex/_generated/` that allow the app to compile before running Convex.

---

### Issue 2: Environment Variables Not Set

**Problem**: `VITE_CONVEX_URL` or `VITE_CLERK_PUBLISHABLE_KEY` is undefined.

**Solution**:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your actual values:
   ```
   VITE_CONVEX_URL=https://your-deployment.convex.cloud
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
   ```

3. Restart the dev server after changing .env files

---

### Issue 3: Convex Authentication Errors

**Problem**: "Unauthorized" errors when calling Convex functions.

**Solution**:
1. Make sure Clerk is properly configured
2. Verify `VITE_CLERK_PUBLISHABLE_KEY` is set
3. Check that you're logged in (sign up/sign in)
4. Convex needs to be linked with Clerk - this happens automatically when you run `npx convex dev`

---

### Issue 4: Module Not Found Errors

**Problem**: Cannot find module errors for various packages.

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or on Windows:
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

### Issue 5: TypeScript Errors

**Problem**: TypeScript compilation errors.

**Solution**:
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Make sure all types are installed
npm install --save-dev @types/node @types/react @types/react-dom
```

---

### Issue 6: Tailwind CSS Not Working

**Problem**: Styles not applying or Tailwind classes not working.

**Solution**:
1. Verify `tailwind.config.js` exists
2. Check `postcss.config.js` exists
3. Make sure `index.css` has Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
4. Restart dev server

---

### Issue 7: React Router Errors

**Problem**: "No routes matched" or routing not working.

**Solution**:
1. Check that `BrowserRouter` wraps the app in `main.tsx`
2. Verify routes are defined in `App.tsx`
3. Make sure paths start with `/`

---

### Issue 8: Clerk Authentication Not Working

**Problem**: Can't sign up or sign in.

**Solution**:
1. Verify `VITE_CLERK_PUBLISHABLE_KEY` is set in `.env`
2. Check Clerk dashboard:
   - Application exists
   - Social providers are enabled (Google, Microsoft)
   - Allowed origins include `http://localhost:5173`
3. Clear browser cache and cookies
4. Try incognito/private browsing

---

### Issue 9: Build Errors

**Problem**: `npm run build` fails.

**Solution**:
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check ESLint
npm run lint

# Clear cache and rebuild
rm -rf dist .vite node_modules/.vite
npm run build
```

---

### Issue 10: Port Already in Use

**Problem**: Port 5173 is already in use.

**Solution**:
```bash
# Find and kill the process (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3000
```

---

## Setup Checklist

Before running the app, ensure:

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file exists with proper values
- [ ] Convex account created
- [ ] Clerk account created
- [ ] `npx convex dev` has run at least once
- [ ] Both terminals running (`npm run dev` and `npm run convex:dev`)

---

## Quick Diagnostics

Run these commands to check your setup:

```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Check if .env exists
ls .env

# Check if dependencies are installed
npm list react convex @clerk/clerk-react

# Check if TypeScript compiles
npx tsc --noEmit

# Check if Convex config exists
ls convex.json

# Check if generated files exist
ls convex/_generated
```

---

## Getting Help

### Before Asking for Help

1. Check this troubleshooting guide
2. Review [SETUP.md](./SETUP.md)
3. Check the browser console for errors
4. Check the terminal for errors
5. Try clearing cache and restarting

### Error Information to Provide

When reporting issues, include:
- Error message (full text)
- Browser console errors
- Terminal output
- Steps to reproduce
- Your environment (OS, Node version, npm version)
- Relevant code snippets

### Resources

- **Convex Docs**: https://docs.convex.dev
- **Clerk Docs**: https://clerk.com/docs
- **Vite Docs**: https://vite.dev
- **React Docs**: https://react.dev

---

## Development Tips

### Hot Reload Not Working

If changes don't reflect:
1. Check terminal for compilation errors
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Clear browser cache
4. Restart dev server

### Slow Performance

If dev server is slow:
1. Close unnecessary browser tabs
2. Check system resources
3. Reduce number of open files in editor
4. Use `npm run build` and test production build

### Database Changes Not Reflecting

If schema changes don't work:
1. Stop `npx convex dev`
2. Delete `.convex` folder
3. Restart `npx convex dev`
4. Convex will regenerate everything

---

## Clean Slate Reset

If everything is broken, start fresh:

```bash
# 1. Delete all generated files
rm -rf node_modules
rm -rf .convex
rm -rf convex/_generated
rm -rf dist
rm package-lock.json

# 2. Reinstall
npm install

# 3. Restart Convex
npx convex dev

# 4. Restart dev server
npm run dev
```

---

Last updated: November 13, 2025
