/**
 * Set test environment variables before any app modules are imported.
 * Call from Vitest setupFiles so dotenv does not need a real .env for tests.
 */
export function setupTestEnv(): void {
    process.env.NODE_ENV = 'test'
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-vitest'
    process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test'
    process.env.PORT = process.env.PORT || '3000'
    process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
    process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || 're_test_dummy_key'
    process.env.EMAIL_FROM = process.env.EMAIL_FROM || 'test@example.com'
    process.env.EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Test Clinical Histories'
    process.env.ARCJET_ENV = process.env.ARCJET_ENV || 'development'
    process.env.ARCJET_KEY = process.env.ARCJET_KEY || 'ajkey_test_dummy_key'
    process.env.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'test_cloud'
    process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || 'test_api_key'
    process.env.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || 'test_api_secret'
    process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'test_gemini_key'
}
