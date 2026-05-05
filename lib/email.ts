import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, code: string) {
  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: email,
    subject: "Seu código de verificação",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0"
                  style="background:#111;border:1px solid #222;border-radius:16px;overflow:hidden;">
                  <tr>
                    <td style="padding:48px 40px 32px;text-align:center;">
                      <div style="width:56px;height:56px;background:#18181b;border:1px solid #27272a;
                        border-radius:14px;margin:0 auto 24px;display:flex;align-items:center;
                        justify-content:center;font-size:28px;line-height:56px;">🔐</div>
                      <h1 style="color:#fafafa;font-size:24px;font-weight:700;margin:0 0 8px;">
                        Código de verificação
                      </h1>
                      <p style="color:#71717a;font-size:15px;margin:0 0 40px;">
                        Use o código abaixo para acessar sua conta.
                      </p>
                      <div style="background:#0a0a0a;border:1px solid #27272a;border-radius:12px;
                        padding:28px;letter-spacing:16px;font-size:36px;font-weight:800;
                        color:#fafafa;font-family:monospace;margin-bottom:32px;">
                        ${code}
                      </div>
                      <p style="color:#52525b;font-size:13px;margin:0;">
                        Válido por <strong style="color:#71717a;">10 minutos</strong>.
                        Não compartilhe este código.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#0d0d0d;border-top:1px solid #1c1c1e;
                      padding:20px 40px;text-align:center;">
                      <p style="color:#3f3f46;font-size:12px;margin:0;">
                        Se você não solicitou este código, ignore este email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}