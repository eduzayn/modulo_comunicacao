module.exports = {
  presets: ['next/babel'],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    // Add a plugin to handle process.browser assignment
    function () {
      return {
        visitor: {
          AssignmentExpression(path) {
            // Check if we're trying to assign to process.browser
            if (
              path.node.left.type === 'MemberExpression' &&
              path.node.left.object.name === 'process' &&
              path.node.left.property.name === 'browser'
            ) {
              // Replace with a safe assignment that won't cause Babel errors
              path.replaceWith({
                type: 'CallExpression',
                callee: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'Object'
                  },
                  property: {
                    type: 'Identifier',
                    name: 'defineProperty'
                  }
                },
                arguments: [
                  {
                    type: 'Identifier',
                    name: 'process'
                  },
                  {
                    type: 'StringLiteral',
                    value: 'browser'
                  },
                  {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'ObjectProperty',
                        key: {
                          type: 'Identifier',
                          name: 'value'
                        },
                        value: {
                          type: 'BooleanLiteral',
                          value: true
                        }
                      },
                      {
                        type: 'ObjectProperty',
                        key: {
                          type: 'Identifier',
                          name: 'writable'
                        },
                        value: {
                          type: 'BooleanLiteral',
                          value: true
                        }
                      }
                    ]
                  }
                ]
              });
            }
          }
        }
      };
    }
  ]
};
