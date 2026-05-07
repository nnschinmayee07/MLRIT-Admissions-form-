// app/admissions/page.tsx (Next.js 13+ App Router)
// or pages/admissions/index.tsx (Next.js 12 Pages Router)

'use client'; // If using App Router

import MLRITEnrollmentForm from '@/components/MLRITEnrollmentForm';

export default function AdmissionsPage() {
  return (
    <main className="w-full">
      {/* Navigation would go here if needed */}
      <MLRITEnrollmentForm />
      {/* Footer would go here if needed */}
    </main>
  );
}

---

// Example: With API Route Handler (app/api/enrollment/route.ts)

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const enrollmentData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      college: formData.get('college'),
      percentage: formData.get('percentage'),
      branch: formData.get('branch'),
      city: formData.get('city'),
      state: formData.get('state'),
      linkedin: formData.get('linkedin'),
      motivation: formData.get('motivation'),
      consent: formData.get('consent'),
      submittedAt: new Date(),
    };

    // 1. Save to Database
    // const result = await db.enrollments.create(enrollmentData);

    // 2. Handle Resume Upload
    const resumeFile = formData.get('resume');
    if (resumeFile) {
      // Upload to storage service (Firebase, AWS S3, etc.)
      // const resumeUrl = await uploadToStorage(resumeFile);
    }

    // 3. Send Confirmation Email to Student
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: enrollmentData.email,
      subject: 'Application Received - MLRIT Admissions',
      html: `
        <h2>Thank you for applying to MLRIT, ${enrollmentData.fullName}!</h2>
        <p>We've received your application and will review it shortly.</p>
        <p>Expected response: Within 5 business days</p>
        <hr/>
        <p><strong>Your Details:</strong></p>
        <ul>
          <li>Branch: ${enrollmentData.branch}</li>
          <li>Percentage: ${enrollmentData.percentage}</li>
          <li>Location: ${enrollmentData.city}, ${enrollmentData.state}</li>
        </ul>
        <p>Best regards,<br/>MLRIT Admissions Team</p>
      `,
    });

    // 4. Notify Admin
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Enrollment: ${enrollmentData.fullName} - ${enrollmentData.branch}`,
      html: `
        <p><strong>${enrollmentData.fullName}</strong> has applied for ${enrollmentData.branch}</p>
        <p>Email: ${enrollmentData.email}</p>
        <p>Phone: ${enrollmentData.phone}</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'Application submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

---

// Example: Updated Form Component to Use Backend
// Add this to handleSubmit in MLRITEnrollmentForm.jsx

const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validateForm();
  
  if (Object.keys(newErrors).length === 0) {
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'resume') {
          formDataToSend.append('resume', formData[key]);
        } else if (key === 'consent') {
          formDataToSend.append(key, formData[key].toString());
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch('/api/enrollment', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            college: '',
            percentage: '',
            branch: '',
            city: '',
            state: '',
            linkedin: '',
            motivation: '',
            resume: null,
            consent: false,
          });
        }, 3000);
      } else {
        setErrors({ submit: result.error || 'Failed to submit application' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    }
  } else {
    setErrors(newErrors);
  }
};

---

// Example: Database Schema (Prisma)
// prisma/schema.prisma

model Enrollment {
  id            String    @id @default(cuid())
  fullName      String
  email         String    @unique
  phone         String
  college       String
  percentage    Float
  branch        String
  city          String
  state         String
  linkedin      String?
  motivation    String    @db.Text
  resumeUrl     String?
  consent       Boolean
  status        String    @default("pending") // pending, reviewing, accepted, rejected
  submittedAt   DateTime  @default(now())
  reviewedAt    DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([email])
  @@index([branch])
  @@index([status])
}

---

// Example: Environment Variables (.env.local)
# For Email Notifications
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@mlrit.edu

# For File Upload (if using Firebase Storage)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# For Database (if using Prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/mlrit_admissions

---

// Example: File Upload Handler (using Firebase Storage)
// lib/uploadResume.ts

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function uploadResume(file: File): Promise<string> {
  const timestamp = Date.now();
  const storageRef = ref(storage, `resumes/${timestamp}-${file.name}`);
  
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  
  return url;
}

---

// Example: Send Email on Backend (API route with Resend)
// app/api/enrollment/route.ts

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // ... validation and database save ...

    // Send confirmation email
    await resend.emails.send({
      from: 'noreply@mlrit.edu',
      to: enrollmentData.email,
      subject: 'Application Received - MLRIT Admissions',
      html: confirmationEmailTemplate(enrollmentData),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

---

// Environment Setup Summary

// 1. Install dependencies
npm install framer-motion lucide-react nodemailer resend

// 2. Add to tailwind.config.js
content: [
  './app/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
]

// 3. Set up environment variables
// Create .env.local with email and database configs

// 4. Create API route
// app/api/enrollment/route.ts

// 5. Update form component to call API
// See handleSubmit example above

// 6. Set up database (optional)
// npx prisma init
// npx prisma migrate dev

// 7. Test in development
npm run dev
// Visit http://localhost:3000/admissions

---

// TESTING CHECKLIST

✓ Form validation works
✓ All fields are required
✓ Email format validation
✓ Phone number validation (10 digits)
✓ File upload works
✓ Success message displays
✓ Form resets after submission
✓ Responsive on mobile
✓ Animations are smooth
✓ Error messages display correctly
✓ Consent checkbox is required
✓ API integration works
✓ Email notifications send
✓ Database saves data correctly
✓ Admin receives notification

---

// PRODUCTION DEPLOYMENT

1. Build & Deploy to Vercel
   vercel deploy

2. Update environment variables in Vercel dashboard

3. Set up database
   vercel env pull
   npx prisma migrate deploy

4. Test in production
   - Fill form
   - Check email confirmation
   - Verify database entry
   - Check admin notification

5. Monitor errors
   - Check Vercel logs
   - Monitor email delivery
   - Track API responses
