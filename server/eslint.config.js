import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  {
    // Archivos a procesar
    files: ['src/**/*.{js,ts}'],

    // Parser para TypeScript
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },

    // Plugins
    plugins: {
      '@typescript-eslint': tseslint
    },

    // Reglas base
    rules: {
      // JavaScript estándar
      ...js.configs.recommended.rules,

      // TypeScript recomendado
      ...tseslint.configs.recommended.rules,

      // === REGLAS PERSONALIZADAS PARA TV PERÚ ===

      // Calidad de código
      'no-console': 'off', // Permitimos console.log para logs
      'no-unused-vars': 'off', // Lo maneja TypeScript
      '@typescript-eslint/no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_'
      }],

      // Estilo de código
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'never'],

      // Nomenclatura
      '@typescript-eslint/naming-convention': [
        'error',
        {
          'selector': 'variableLike',
          'format': ['camelCase', 'UPPER_CASE']
        },
        {
          'selector': 'typeLike',
          'format': ['PascalCase']
        },
        {
          'selector': 'interface',
          'format': ['PascalCase'],
          'prefix': ['I']
        }
      ],

      // Mejores prácticas para APIs
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',

      // Seguridad para producción TV
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',

      // Consistencia de imports
      'sort-imports': ['error', {
        'ignoreDeclarationSort': true
      }],

      // Limpieza de código
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'max-len': ['warn', {
        'code': 100,
        'comments': 120
      }]
    }
  },

  // Ignorar archivos específicos
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '**/*.js', // Ignorar JS mientras migramos
      'public/**'
    ]
  }
];