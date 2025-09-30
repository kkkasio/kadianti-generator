export function DatabaseManager() {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary-500/20 rounded-lg">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Database Manager</h2>
            <p className="text-dark-400">
              Schema Editor - Em desenvolvimento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}