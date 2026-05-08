import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import nodemailer from "nodemailer";

function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function appendToSheet(data: Record<string, string>) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const row = [
    new Date().toISOString(),
    data.name,
    data.email,
    data.phone,
    data.college,
    data.pct,
    data.branch,
    data.city,
    data.state,
    data.excites,
    data.goals || "",
    (data.chips || "").toString(),
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "Sheet1!A:L",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

async function sendWelcomeMail(data: Record<string, string>) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_APP_PASSWORD!,
    },
  });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#F6F2E8;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F6F2E8;padding:36px 16px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

    <!-- ORANGE HERO -->
    <tr>
      <td style="background:linear-gradient(155deg,#F08A35 0%,#E97724 50%,#C45A1A 100%);border-radius:14px 14px 0 0;padding:44px 40px 36px;text-align:center;">
        <p style="margin:0 0 16px;color:rgba(255,255,255,0.7);font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;">Admissions 2026–27</p>
        <h1 style="margin:0 0 8px;color:#fff;font-size:34px;font-weight:800;letter-spacing:-0.6px;line-height:1.1;">Welcome, ${data.name}! 🎉</h1>
        <p style="margin:0;color:rgba(255,255,255,0.85);font-size:15px;">MLR Institute of Technology is glad to hear from you.</p>
        <div style="margin:24px auto 0;width:80px;border-top:2px dotted rgba(255,255,255,0.4);"></div>
      </td>
    </tr>

    <!-- WARM INTRO -->
    <tr>
      <td style="background:#FFFFFF;padding:36px 40px 28px;border-left:1px solid #E8E3D8;border-right:1px solid #E8E3D8;">
        <p style="margin:0 0 18px;color:#1A2A3A;font-size:16px;line-height:1.75;">
          Dear <strong style="color:#E97724;">${data.name}</strong>,
        </p>
        <p style="margin:0 0 16px;color:#4A5A6A;font-size:14.5px;line-height:1.8;">
          We've received your enrollment inquiry and we're thrilled by your interest in joining the MLRIT family. Our admissions team will be in touch within <strong style="color:#2E7D32;">2–3 working days</strong> to personally guide you through the next steps.
        </p>
        <p style="margin:0;color:#4A5A6A;font-size:14.5px;line-height:1.8;">
          Until then, here's a quick look at what you shared with us.
        </p>
      </td>
    </tr>

    <!-- DOTTED SEPARATOR -->
    <tr>
      <td style="background:#FFFFFF;padding:0 40px;border-left:1px solid #E8E3D8;border-right:1px solid #E8E3D8;">
        <div style="border-top:2px dotted #E97724;"></div>
      </td>
    </tr>

    <!-- QUOTE CARD -->
    <tr>
      <td style="background:#FFFFFF;padding:28px 40px;border-left:1px solid #E8E3D8;border-right:1px solid #E8E3D8;">
        <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
          <tr>
            <td style="background:#1F5C24;border-radius:6px;padding:5px 14px;">
              <p style="margin:0;color:#fff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">What excites you</p>
            </td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#FBF9F4;border-radius:10px;border:1px solid #E8E3D8;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 4px;color:#9CA8B6;font-size:30px;line-height:1;font-family:Georgia,serif;">&ldquo;</p>
              <p style="margin:-8px 0 0;color:#2D3D4D;font-size:14.5px;line-height:1.8;font-style:italic;">${data.excites}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- DOTTED SEPARATOR -->
    <tr>
      <td style="background:#FFFFFF;padding:0 40px;border-left:1px solid #E8E3D8;border-right:1px solid #E8E3D8;">
        <div style="border-top:2px dotted #4FAF3D;"></div>
      </td>
    </tr>

    <!-- DETAILS: two-col -->
    <tr>
      <td style="background:#FFFFFF;padding:28px 40px;border-left:1px solid #E8E3D8;border-right:1px solid #E8E3D8;">
        <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
          <tr>
            <td style="background:#E97724;border-radius:6px;padding:5px 14px;">
              <p style="margin:0;color:#fff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Your submission</p>
            </td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%" style="padding:0 12px 0 0;vertical-align:top;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:8px 0;border-bottom:1px solid #EEF1F5;">
                  <p style="margin:0;color:#9CA8B6;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Name</p>
                  <p style="margin:3px 0 0;color:#1A2A3A;font-size:13.5px;font-weight:600;">${data.name}</p>
                </td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #EEF1F5;">
                  <p style="margin:0;color:#9CA8B6;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Phone</p>
                  <p style="margin:3px 0 0;color:#1A2A3A;font-size:13.5px;font-weight:600;">${data.phone}</p>
                </td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #EEF1F5;">
                  <p style="margin:0;color:#9CA8B6;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Location</p>
                  <p style="margin:3px 0 0;color:#1A2A3A;font-size:13.5px;font-weight:600;">${data.city}, ${data.state}</p>
                </td></tr>
                <tr><td style="padding:8px 0;">
                  <p style="margin:0;color:#9CA8B6;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">PCT %</p>
                  <p style="margin:3px 0 0;color:#1A2A3A;font-size:13.5px;font-weight:600;">${data.pct}%</p>
                </td></tr>
              </table>
            </td>
            <td width="50%" style="padding:0 0 0 12px;border-left:1px solid #EEF1F5;vertical-align:top;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:8px 0;border-bottom:1px solid #EEF1F5;">
                  <p style="margin:0;color:#9CA8B6;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Email</p>
                  <p style="margin:3px 0 0;color:#1A2A3A;font-size:13.5px;font-weight:600;">${data.email}</p>
                </td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #EEF1F5;">
                  <p style="margin:0;color:#9CA8B6;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Branch</p>
                  <p style="margin:3px 0 0;color:#1A2A3A;font-size:13.5px;font-weight:600;">${data.branch}</p>
                </td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #EEF1F5;">
                  <p style="margin:0;color:#9CA8B6;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Current College</p>
                  <p style="margin:3px 0 0;color:#1A2A3A;font-size:13.5px;font-weight:600;">${data.college}</p>
                </td></tr>
                ${data.chips ? `<tr><td style="padding:8px 0;"><p style="margin:0;color:#9CA8B6;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Interests</p><p style="margin:3px 0 0;color:#1A2A3A;font-size:13.5px;font-weight:600;">${data.chips}</p></td></tr>` : ""}
                ${data.goals ? `<tr><td style="padding:8px 0;"><p style="margin:0;color:#9CA8B6;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Goals</p><p style="margin:3px 0 0;color:#1A2A3A;font-size:13.5px;font-weight:600;">${data.goals}</p></td></tr>` : ""}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- DOTTED SEPARATOR -->
    <tr>
      <td style="background:#FFFFFF;padding:0 40px;border-left:1px solid #E8E3D8;border-right:1px solid #E8E3D8;">
        <div style="border-top:2px dotted #E97724;"></div>
      </td>
    </tr>

    <!-- HIGHLIGHTS: 2x2 cards -->
    <tr>
      <td style="background:#FFFFFF;padding:28px 40px;border-left:1px solid #E8E3D8;border-right:1px solid #E8E3D8;">
        <p style="margin:0 0 16px;color:#1A2A3A;font-size:13px;font-weight:700;">Why MLRIT stands out</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%" style="padding:0 6px 10px 0;">
              <table cellpadding="0" cellspacing="0" style="background:#EFF7EB;border:1px solid #DDEFD3;border-radius:8px;width:100%;">
                <tr><td style="padding:12px 14px;">
                  <p style="margin:0;font-size:18px;line-height:1;">🏛️</p>
                  <p style="margin:6px 0 2px;color:#1F5C24;font-size:12px;font-weight:700;">NBA Accredited</p>
                  <p style="margin:0;color:#4A5A6A;font-size:11.5px;">Multiple departments certified</p>
                </td></tr>
              </table>
            </td>
            <td width="50%" style="padding:0 0 10px 6px;">
              <table cellpadding="0" cellspacing="0" style="background:#FFF8F1;border:1px solid #FFE0C7;border-radius:8px;width:100%;">
                <tr><td style="padding:12px 14px;">
                  <p style="margin:0;font-size:18px;line-height:1;">💼</p>
                  <p style="margin:6px 0 2px;color:#C45A1A;font-size:12px;font-weight:700;">Strong Placements</p>
                  <p style="margin:0;color:#4A5A6A;font-size:11.5px;">Top MNCs recruit from campus</p>
                </td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td width="50%" style="padding:0 6px 0 0;">
              <table cellpadding="0" cellspacing="0" style="background:#EFF7EB;border:1px solid #DDEFD3;border-radius:8px;width:100%;">
                <tr><td style="padding:12px 14px;">
                  <p style="margin:0;font-size:18px;line-height:1;">🔬</p>
                  <p style="margin:6px 0 2px;color:#1F5C24;font-size:12px;font-weight:700;">Modern Labs</p>
                  <p style="margin:0;color:#4A5A6A;font-size:11.5px;">State-of-the-art facilities</p>
                </td></tr>
              </table>
            </td>
            <td width="50%" style="padding:0 0 0 6px;">
              <table cellpadding="0" cellspacing="0" style="background:#FFF8F1;border:1px solid #FFE0C7;border-radius:8px;width:100%;">
                <tr><td style="padding:12px 14px;">
                  <p style="margin:0;font-size:18px;line-height:1;">🎓</p>
                  <p style="margin:6px 0 2px;color:#C45A1A;font-size:12px;font-weight:700;">JNTUH Affiliated</p>
                  <p style="margin:0;color:#4A5A6A;font-size:11.5px;">Recognised & trusted university</p>
                </td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- CLOSING -->
    <tr>
      <td style="background:#FBF9F4;padding:28px 40px;border:1px solid #E8E3D8;border-top:none;">
        <p style="margin:0 0 16px;color:#4A5A6A;font-size:14px;line-height:1.8;">We look forward to speaking with you soon. This is the beginning of something great.</p>
        <p style="margin:0;color:#4A5A6A;font-size:14px;">With warm regards,<br><strong style="color:#1A2A3A;">The MLRIT Admissions Team</strong></p>
      </td>
    </tr>

    <!-- FOOTER: split green / orange -->
    <tr>
      <td style="border-radius:0 0 14px 14px;overflow:hidden;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%" style="background:#2E7D32;padding:18px 24px;border-radius:0 0 0 14px;">
              <p style="margin:0;color:rgba(255,255,255,0.9);font-size:12px;font-weight:700;">MLR Institute of Technology</p>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.55);font-size:11px;">Dundigal, Hyderabad — 500043</p>
            </td>
            <td width="50%" style="background:#C45A1A;padding:18px 24px;text-align:right;border-radius:0 0 14px 0;">
              <p style="margin:0;color:rgba(255,255,255,0.9);font-size:12px;font-weight:700;">info@mlrit.ac.in</p>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.55);font-size:11px;">+91 96522 26061</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"MLRIT Admissions" <${process.env.GMAIL_USER}>`,
    replyTo: "info@mlrit.ac.in",
    to: data.email,
    subject: `Welcome to MLRIT, ${data.name}! 🎓`,
    html,
  });
}

async function sendAdminNotification(data: Record<string, string>) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_APP_PASSWORD!,
    },
  });

  await transporter.sendMail({
    from: `"MLRIT Form Bot" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || "info@mlrit.ac.in",
    subject: `New Enrollment: ${data.name} — ${data.branch}`,
    text: `New form submission:\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nCollege: ${data.college}\nBranch: ${data.branch}\n%: ${data.pct}\nCity: ${data.city}, ${data.state}\nInterests: ${data.chips}\n\nExcites:\n${data.excites}\n\nGoals:\n${data.goals}`,
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const required = ["name", "email", "phone", "college", "pct", "branch", "city", "state", "excites"];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing: ${field}` }, { status: 400 });
      }
    }

    await Promise.all([
      appendToSheet(data),
      sendWelcomeMail(data),
      sendAdminNotification(data),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Enroll API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
