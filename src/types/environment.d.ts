declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DATABASE_URL: string;
			NEXTAUTH_SECRET: string;
			NEXT_PUBLIC_URL: string;
			ATLASSIAN_USERNAME: string;
			ATLASSIAN_API_KEY: string;
			LEAD_ACCT_ID: string;
			DOMAIN: string;
			PROJECT_KEY: string;
			PROJECT_NAME: string;
			// VERIFICATION_URL: string;
			// AUTH_RESEND_KEY: string;
			// RESEND_EMAIL_FROM: string;
			// VERIFICATION_SUBJECT: string;
			// AUTH_LOGIN_REDIRECT: string;
			// OTP_SUBJECT: string;
			// RESET_PASSWORD_URL: string;
			// RESET_PASSWORD_SUBJECT: string;
		}
	}
}
export type {};
