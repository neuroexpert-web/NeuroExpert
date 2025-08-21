#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Утилита для сканирования API routes
function scanApiRoutes(dir, basePath = '') {
  const routes = [];
  
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Рекурсивно сканируем поддиректории
        routes.push(...scanApiRoutes(fullPath, path.join(basePath, file)));
      } else if (file === 'route.js' || file === 'route.ts') {
        // Нашли API route
        const routePath = basePath || '/';
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        
        // Извлекаем HTTP методы из файла
        const methods = [];
        if (fileContent.includes('export async function GET')) methods.push('GET');
        if (fileContent.includes('export async function POST')) methods.push('POST');
        if (fileContent.includes('export async function PUT')) methods.push('PUT');
        if (fileContent.includes('export async function DELETE')) methods.push('DELETE');
        if (fileContent.includes('export async function PATCH')) methods.push('PATCH');
        
        if (methods.length > 0) {
          routes.push({
            path: routePath,
            methods,
            file: fullPath
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }
  
  return routes;
}

// Генерация пути для OpenAPI
function generateOpenApiPath(route) {
  // Преобразуем Next.js dynamic routes в OpenAPI формат
  let apiPath = route.path
    .replace(/\[([^\]]+)\]/g, '{$1}')  // [id] -> {id}
    .replace(/\\/g, '/');               // Windows path fix
    
  return `/api${apiPath}`;
}

// Основная функция генерации
function generateOpenApiSpec() {
  console.log('🔍 Сканирование API routes...');
  
  const apiDir = path.join(process.cwd(), 'app', 'api');
  const routes = scanApiRoutes(apiDir);
  
  console.log(`✅ Найдено ${routes.length} API routes`);
  
  // Загружаем существующую спецификацию или создаем новую
  let spec;
  const specPath = path.join(process.cwd(), 'openapi.yaml');
  
  if (fs.existsSync(specPath)) {
    console.log('📄 Обновление существующей спецификации...');
    spec = yaml.load(fs.readFileSync(specPath, 'utf-8'));
  } else {
    console.log('📝 Создание новой спецификации...');
    spec = {
      openapi: '3.0.3',
      info: {
        title: 'NeuroExpert API',
        version: '1.0.0',
        description: 'Auto-generated API documentation'
      },
      servers: [
        {
          url: 'http://localhost:3000/api',
          description: 'Development server'
        }
      ],
      paths: {},
      components: {
        schemas: {},
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    };
  }
  
  // Добавляем найденные routes
  routes.forEach(route => {
    const apiPath = generateOpenApiPath(route);
    
    if (!spec.paths[apiPath]) {
      spec.paths[apiPath] = {};
    }
    
    route.methods.forEach(method => {
      const lowerMethod = method.toLowerCase();
      
      // Если метод уже документирован, пропускаем
      if (spec.paths[apiPath][lowerMethod]) {
        return;
      }
      
      // Генерируем базовую документацию
      spec.paths[apiPath][lowerMethod] = {
        summary: `${method} ${apiPath}`,
        description: `Auto-generated documentation for ${method} ${apiPath}`,
        operationId: `${lowerMethod}${apiPath.replace(/[^a-zA-Z0-9]/g, '')}`,
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object'
                }
              }
            }
          },
          '400': {
            description: 'Bad request'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      };
      
      // Добавляем параметры для dynamic routes
      const params = apiPath.match(/{([^}]+)}/g);
      if (params) {
        spec.paths[apiPath][lowerMethod].parameters = params.map(param => ({
          name: param.slice(1, -1),
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          }
        }));
      }
      
      // Добавляем тело запроса для POST/PUT/PATCH
      if (['post', 'put', 'patch'].includes(lowerMethod)) {
        spec.paths[apiPath][lowerMethod].requestBody = {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object'
              }
            }
          }
        };
      }
      
      // Добавляем безопасность для защищенных endpoints
      if (apiPath.includes('admin') || apiPath.includes('protected')) {
        spec.paths[apiPath][lowerMethod].security = [
          { bearerAuth: [] }
        ];
      }
    });
  });
  
  // Сохраняем спецификацию
  const yamlStr = yaml.dump(spec, { lineWidth: -1 });
  fs.writeFileSync(specPath, yamlStr);
  
  // Также сохраняем JSON версию
  const jsonPath = path.join(process.cwd(), 'swagger.json');
  fs.writeFileSync(jsonPath, JSON.stringify(spec, null, 2));
  
  console.log('✨ OpenAPI спецификация сгенерирована!');
  console.log(`   YAML: ${specPath}`);
  console.log(`   JSON: ${jsonPath}`);
  
  // Генерируем список routes для README
  console.log('\n📋 API Endpoints:');
  routes.forEach(route => {
    const apiPath = generateOpenApiPath(route);
    console.log(`   ${route.methods.join(', ')}: ${apiPath}`);
  });
}

// Запуск
if (require.main === module) {
  generateOpenApiSpec();
}

module.exports = { generateOpenApiSpec, scanApiRoutes };