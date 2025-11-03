export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row mx-auto">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-yellow-900/20 z-10" />
        <div className="relative z-20 flex flex-col justify-center items-center p-12 text-center">
          <div className="max-w-lg">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full mb-6 shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  <path d="M12.5 7H11v6l5.2 3.2.8-1.3-4.5-2.7z"/>
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Your Trusted <span className="text-amber-700">Gold Coin</span> Collection Platform
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Discover, track, and manage your precious coin investments with confidence and ease.
            </p>
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-3xl font-bold text-amber-700">500+</div>
                <div className="text-sm text-gray-700 mt-1">Coins Listed</div>
              </div>
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-3xl font-bold text-amber-700">98%</div>
                <div className="text-sm text-gray-700 mt-1">Satisfaction</div>
              </div>
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-3xl font-bold text-amber-700">24/7</div>
                <div className="text-sm text-gray-700 mt-1">Support</div>
              </div>
            </div>
          </div>
        </div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/napoleon-20-franc-gold-coin.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      {/* Right Side - Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white py-12">
        <div className="max-w-md w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

