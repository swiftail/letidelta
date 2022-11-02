import {parse} from "mathjs";
import {FormulaDefinition} from "@/entities";

export function getFormulaDefinition(rawExp: string) {
  try {
    const n = parse(rawExp)
    const symbols = new Set()
    n.traverse(function (node, path, parent) {
      switch (node.type) {
        case 'FunctionNode':
          console.info(node)
        case 'OperatorNode':
        case 'ConstantNode':
        case 'ParenthesisNode':
          break
        case 'SymbolNode':
          if (parent.type === 'FunctionNode' && path === 'fn') {
            if (['sin', 'cos', 'tan', 'sqrt', 'cot', 'log', 'ln', 'cbrt', 'nthRoot', 'log10', 'pow', 'exp', 'asin', 'acos', 'atan', 'acot', 'abs'].includes(parent.name)) {
              break
            }
            throw Error('Invalid function invocation')
          }

          symbols.add(node.name)
          break
        default:
          throw Error('Invalid node: ' + node.type)
      }
    })
    const fn = n.compile()

    if (symbols.size === 0) {
      throw Error('No symbols')
    }

    return <FormulaDefinition>{
      raw: rawExp,
      node: n,
      fn,
      symbols
    }
  } catch (e) {
    console.error(e)
    return null
  }
}
