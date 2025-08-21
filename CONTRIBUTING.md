# Contributing to NeuroExpert 🤝

Thank you for your interest in contributing to NeuroExpert! We welcome contributions from the community and are grateful for any help you can provide.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful** - Treat everyone with respect and kindness
- **Be collaborative** - Work together to solve problems
- **Be inclusive** - Welcome newcomers and help them get started
- **Be professional** - Keep discussions focused and productive

## 🚀 Getting Started

1. **Fork the repository**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/neuroexpert.git
   cd neuroexpert
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original/neuroexpert.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment**
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

## 💻 Development Process

### 1. Create a branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
```

### 2. Make your changes

- Write clean, readable code
- Follow our coding standards
- Add tests for new functionality
- Update documentation as needed

### 3. Test your changes

```bash
# Run linting
npm run lint

# Run tests
npm test

# Run e2e tests
npm run test:e2e

# Build the project
npm run build
```

### 4. Commit your changes

Follow our commit message guidelines:

```bash
git add .
git commit -m "feat: add new awesome feature"
```

## 🔄 Pull Request Process

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Go to GitHub and create a PR from your fork
   - Fill out the PR template completely
   - Link any related issues
   - Add appropriate labels

4. **PR Requirements**
   - All tests must pass
   - Code must be properly formatted
   - Documentation must be updated
   - At least one approval required
   - No merge conflicts

5. **Code Review**
   - Respond to feedback promptly
   - Make requested changes
   - Be open to suggestions

## 📏 Coding Standards

### JavaScript/TypeScript

- Use TypeScript for new code when possible
- Follow ESLint configuration
- Use Prettier for formatting
- Prefer functional components in React
- Use hooks appropriately

```typescript
// Good example
export const MyComponent: React.FC<Props> = ({ title, onClick }) => {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
    onClick?.(count);
  }, [count, onClick]);
  
  return (
    <button onClick={handleClick}>
      {title}: {count}
    </button>
  );
};
```

### CSS/Styling

- Use CSS Modules for component styles
- Follow BEM naming convention
- Keep styles scoped to components
- Use CSS variables for theming

```css
/* Good example */
.button {
  padding: var(--spacing-md);
  background: var(--color-primary);
}

.button--large {
  padding: var(--spacing-lg);
}
```

### File Structure

```
components/
  MyComponent/
    index.tsx          # Component export
    MyComponent.tsx    # Component implementation
    MyComponent.test.tsx # Tests
    MyComponent.module.css # Styles
    README.md         # Component documentation
```

## 📝 Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions/changes
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes

### Examples
```bash
# Feature
feat(auth): add OAuth2 login support

# Bug fix
fix(api): handle null response in user endpoint

# Documentation
docs(readme): update installation instructions

# Performance
perf(images): implement lazy loading for gallery
```

## 🧪 Testing

### Writing Tests

- Write tests for all new features
- Maintain test coverage above 70%
- Use descriptive test names
- Test edge cases

```javascript
// Good test example
describe('ROICalculator', () => {
  it('should calculate ROI correctly with valid inputs', () => {
    const result = calculateROI(1000, 1500);
    expect(result).toBe(50);
  });
  
  it('should handle zero investment gracefully', () => {
    const result = calculateROI(0, 1000);
    expect(result).toBe(0);
  });
});
```

### Running Tests

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for functions
- Document complex logic
- Include examples when helpful

```typescript
/**
 * Calculates the return on investment
 * @param investment - Initial investment amount
 * @param returns - Total returns
 * @returns ROI percentage
 * @example
 * calculateROI(1000, 1500) // returns 50
 */
export function calculateROI(investment: number, returns: number): number {
  if (investment === 0) return 0;
  return ((returns - investment) / investment) * 100;
}
```

### README Updates

- Update README for new features
- Keep installation instructions current
- Add configuration examples
- Document breaking changes

## 👥 Community

### Getting Help

- 💬 [Discord Server](https://discord.gg/neuroexpert)
- 📧 [Email Support](mailto:support@neuroexpert.ai)
- 🐛 [Issue Tracker](https://github.com/your-org/neuroexpert/issues)

### Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, Node version)
- Error messages and stack traces
- Screenshots if applicable

### Feature Requests

We love feature requests! Please:
- Check existing issues first
- Clearly describe the feature
- Explain the use case
- Provide examples if possible

## 🎉 Recognition

Contributors will be:
- Listed in our Contributors section
- Mentioned in release notes
- Invited to contributor-only events
- Given special Discord roles

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to NeuroExpert! Together we're building something amazing. 🚀