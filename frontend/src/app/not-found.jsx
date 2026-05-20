import Link from "next/link";

export const metadata = {
  title: "Page Not Found | 404",
  description: "The page you are looking for does not exist",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Number with Animation */}
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-bold bg-clip-text ">404</h1>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          The blog post or page you're looking for has been moved, renamed, or
          is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors duration-200"
          >
            Back to Home
          </Link>

          <Link
            href="/blogs"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg transition-colors duration-200"
          >
            Browse Blog
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-6">
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 ">
              <span className="font-semibold">Need help?</span> Go to our{" "}
              <Link
                href="/sitemap"
                className="text-red-500 hover:text-red-600 hover:underline"
              >
                Sitemap
              </Link>{" "}
              or{" "}
              <Link
                href="/contact"
                className="text-red-500 hover:text-red-600 hover:underline "
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
