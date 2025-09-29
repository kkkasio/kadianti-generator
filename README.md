# Kadianti - Gerador de Códigos Adianti

Um aplicativo Electron para automatizar a geração de códigos para projetos desenvolvidos com o Adianti Framework.

## Características

- 🚀 Interface moderna e intuitiva
- 📁 Gerenciamento de múltiplos projetos Adianti
- 🔍 Detecção automática de estrutura de projetos
- 💾 Armazenamento local de configurações
- 🎨 Design responsivo com tema escuro

## Funcionalidades Implementadas

### Tela Inicial
- Visualização de todos os projetos adicionados
- Adicionar novos projetos Adianti através de seleção de pasta
- Remover projetos da lista
- Validação automática da estrutura do projeto Adianti
- Interface com cards para cada projeto

### Sistema de Armazenamento
- Salvamento automático dos projetos no sistema
- Persistência entre sessões
- Backup das configurações

## Como Usar

### 1. Executar o Aplicativo

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm start

# Construir para produção
npm run make
```

### 2. Adicionar um Projeto

1. Clique no botão "Adicionar Projeto"
2. Digite o nome do projeto
3. Clique em "Procurar" para selecionar a pasta do projeto
4. O sistema irá validar automaticamente se é um projeto Adianti válido
5. Clique em "Salvar Projeto"

### 3. Gerenciar Projetos

- **Abrir Projeto**: Clique no card do projeto para abri-lo
- **Remover Projeto**: Clique no ícone de lixeira no card do projeto

## Estrutura do Projeto

```
src/
├── main.ts                    # Processo principal do Electron
├── preload.ts                 # Script de preload
├── renderer.ts                # Lógica do frontend
├── index.css                  # Estilos da aplicação
├── types/
│   └── index.ts              # Definições de tipos TypeScript
└── main/
    └── services/
        ├── Storage.ts         # Sistema de armazenamento
        └── ProjectService.ts  # Serviços de projeto
```

## Tecnologias Utilizadas

- **Electron**: Framework para aplicações desktop
- **TypeScript**: Linguagem principal
- **Vite**: Build tool e dev server
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia (Inter)

## Validação de Projetos Adianti

O sistema verifica automaticamente se uma pasta contém:
- Diretório `app/`
- Diretório `lib/`
- Diretório `app/model/`
- Diretório `app/control/`

## Próximas Funcionalidades

- [ ] Workspace de projeto individual
- [ ] Leitura e análise de models PHP
- [ ] Geração de formulários
- [ ] Geração de listagens
- [ ] Geração de relatórios
- [ ] Sistema de templates
- [ ] Exportação de código

## Estrutura de Dados

### Projeto Adianti
```typescript
interface AdiantiProject {
  id: string;
  name: string;
  path: string;
  createdAt: string;
  lastAccessed?: string;
  models?: AdiantiModel[];
}
```

### Model Adianti
```typescript
interface AdiantiModel {
  name: string;
  table: string;
  fields: AdiantiField[];
  relationships: AdiantiRelationship[];
}
```

## Desenvolvimento

### Comandos Disponíveis

```bash
# Desenvolvimento
npm start

# Build
npm run package

# Linting
npm run lint

# Publicar
npm run publish
```

### Configuração do Ambiente

O projeto utiliza:
- Electron Forge para build e empacotamento
- Vite para bundling
- TypeScript para desenvolvimento
- ESLint para code quality

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Autor

**Kásio Eduardo**
- Email: kasioeduardo13@gmail.com