export function Explorer() {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary-500/20 rounded-lg">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Explorer</h2>
            <p className="text-dark-400">
              Navegador de arquivos - Em desenvolvimento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}