# Troubleshooting Login Issues

If you're being redirected back to the login page, follow these steps:

## 1. Check if Backend Server is Running

The most common issue is that the backend API server is not running.

**Start the backend:**
```bash
cd server
npm run dev
```

You should see:
```
🚀 ThesisBridge API server running on port 5000
✅ MongoDB Connected: ...
📍 Location: Nijmegen, Netherlands
```

## 2. Check MongoDB is Running

The backend needs MongoDB to be running.

**macOS:**
```bash
brew services start mongodb-community

# Verify it's running
mongosh
```

## 3. Verify API is Accessible

Open your browser and go to: http://localhost:5000/api/health

You should see:
```json
{
  "status": "ok",
  "message": "ThesisBridge API is running"
}
```

## 4. Check Browser Console

1. Open browser DevTools (F12 or Cmd+Option+I)
2. Go to Console tab
3. Try to login again
4. Look for errors:
   - ❌ "Cannot connect to server" = Backend not running
   - ❌ "NetworkError" = Backend not accessible
   - ❌ "Invalid credentials" = Wrong email/password

## 5. Test with Sample Credentials

After running `npm run seed`, use:

**Student Account:**
- Email: `sophie.vandenberg@student.ru.nl`
- Password: `password123`

**Company Account:**
- Email: `tom@techinnovate.nl`
- Password: `password123`

## 6. Clear Browser Data

If all else fails:
1. Open DevTools (F12)
2. Go to Application tab
3. Clear Storage → Clear site data
4. Refresh page
5. Try logging in again

## 7. Check for CORS Issues

If you see CORS errors in console:
- Make sure backend is running on port 5000
- Check `server/.env` has correct `FRONTEND_URL`
- Restart the backend server

## Common Error Messages

| Error | Solution |
|-------|----------|
| "Cannot connect to server" | Start backend: `cd server && npm run dev` |
| "Invalid credentials" | Use seeded credentials or sign up new account |
| "MongoDB connection failed" | Start MongoDB: `brew services start mongodb-community` |
| Redirects to login immediately | Check browser console for specific error |

## Quick Fix Checklist

- [ ] MongoDB is running
- [ ] Backend server is running (`cd server && npm run dev`)
- [ ] Can access http://localhost:5000/api/health
- [ ] Using correct credentials
- [ ] Browser console shows no errors
- [ ] LocalStorage is not blocked by browser

## Still Having Issues?

Check the browser console logs - they now include detailed debugging information showing exactly where the login process is failing.
