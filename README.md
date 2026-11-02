# BookNook

**BookNook** is an online book management and borrowing platform where users can explore books, create accounts, and manage their borrowing activities.

🌐 **Live Website:** https://book-nook-client-psi.vercel.app/

## Features

- **User Authentication:** Sign up and log in using email and password.
- **Google Authentication:** Securely sign in using a Google account.
- **User Profile:** Create an account with a profile picture using a photo URL.
- **Browse Books:** Explore the available books in the collection.
- **Book Details:** View information about individual books.
- **Borrow Books:** Borrow books through the platform.
- **Private Routes:** Access protected pages after successful authentication.
- **Session Management:** Maintain authenticated user sessions.
- **Responsive Design:** Access the website from different screen sizes.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Better Auth
- MongoDB

## Book cover image uploads

Set `IMGBB_API_KEY` in your local `.env.local` file for development. In Vercel, add
`IMGBB_API_KEY` under **Project Settings → Environment Variables** for each environment
where uploads should work, then redeploy. Do not use the `NEXT_PUBLIC_` prefix; the key
is used only by the server-side upload route and should not be exposed in the browser.

Cover uploads accept image files up to 4 MB.
