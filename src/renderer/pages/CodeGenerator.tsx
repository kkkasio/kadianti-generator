interface GeneratorOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'formularios' | 'listagens';
}

const generatorOptions: GeneratorOption[] = [
  {
    id: 'form-cadastro',
    title: 'Formulário de cadastro',
    description: 'Gera formulário básico para cadastro de dados',
    category: 'formularios',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    id: 'form-consulta',
    title: 'Formulário de consulta',
    description: 'Gera formulário para consulta e filtros',
    category: 'formularios',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )
  },
  {
    id: 'form-cadastro-auxiliar',
    title: 'Formulário de cadastro auxiliar',
    description: 'Gera formulário auxiliar simplificado',
    category: 'formularios',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  {
    id: 'form-relatorio',
    title: 'Formulário relatório',
    description: 'Gera formulário para parâmetros de relatório',
    category: 'formularios',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    id: 'form-mestre-detalhe',
    title: 'Formulário mestre/detalhe',
    description: 'Gera formulário com estrutura mestre-detalhe',
    category: 'formularios',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  {
    id: 'form-mestre-detalhe-vetorial',
    title: 'Formulário mestre/detalhe vetorial',
    description: 'Gera formulário mestre-detalhe com arrays',
    category: 'formularios',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  {
    id: 'form-mestre-detalhe-consulta',
    title: 'Formulário mestre/detalhe consulta',
    description: 'Gera formulário mestre-detalhe para consultas',
    category: 'formularios',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  }
];

export function CodeGenerator() {
  const handleOptionClick = (option: GeneratorOption) => {
    // TODO: Implementar navegação para wizard de geração
    console.log('Selecionado:', option.title);
  };

  const formularios = generatorOptions.filter(opt => opt.category === 'formularios');
  const listagens = generatorOptions.filter(opt => opt.category === 'listagens');

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Code Generator</h1>
          <p className="text-dark-400">
            Selecione o tipo de código que deseja gerar para seu projeto Adianti
          </p>
        </div>

        {/* Seção Formulários */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-primary-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl font-semibold text-white">Formulários</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formularios.map((option) => (
              <div
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className="bg-dark-800/50 border border-dark-700 rounded-lg p-4 hover:bg-dark-700/50 hover:border-primary-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-500 group-hover:bg-primary-500/30 transition-colors">
                    {option.icon}
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-white font-medium group-hover:text-primary-400 transition-colors">
                      {option.title}
                    </h3>
                    <p className="text-dark-400 text-sm mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seção Listagens */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-primary-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <h2 className="text-xl font-semibold text-white">Listagens</h2>
          </div>
          
          <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-dark-700 rounded-lg">
                <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Em desenvolvimento</h3>
              <p className="text-dark-400">
                As opções de listagens serão adicionadas em breve
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}