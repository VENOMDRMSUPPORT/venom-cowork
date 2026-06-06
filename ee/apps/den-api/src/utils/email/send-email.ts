import { EmailSendError, sendEmail as sendSharedEmail, type EmailTemplate, type SendEmailInput } from "@venom-cowork/email"
import { env } from "../../env.js"

export { EmailSendError as DenEmailSendError }

export function sendEmail<Template extends EmailTemplate>(
  input: Omit<SendEmailInput<Template>, "config">,
) {
  return sendSharedEmail({
    ...input,
    config: {
      devMode: env.devMode,
      from: env.email.from,
      resendApiKey: env.resend.apiKey,
      smtp: env.smtp,
    },
  })
}
