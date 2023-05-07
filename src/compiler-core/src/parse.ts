import { NodeType } from "./ast"

const enum TagType {
  Start,
  End
}

export function baseParse(content: string){
  const context = createParserContext(content)

  return createRoot(parseChildren(context))
}

function parseChildren(context){
  const nodes: any = []

  let node
  const s = context.source
  if(s.startsWith('{{')){
    node = parseInterpolation(context)
  } else if(s[0] === '<'){
    if(/[a-z]/i.test(context.source[1])){
      node = parseElement(context)
    }
  }

  if(!node){
    node = parseText(context)
  }

  nodes.push(node)
  return nodes
}

function parseText(context: any){
  const content = context.source.slice(0, context.source.length)
  advanceBy(context, content.length)
  return {
    type: NodeType.TEXT,
    content
  }
}

function parseTag(context: any, type: TagType){
  const match: any = /^<\/?([a-z]*)/i.exec(context.source)
  const tag = match[1]
  advanceBy(context, match[0].length)
  advanceBy(context, 1)

  if(type === TagType.End) return
  return {
    type: NodeType.ELEMENT,
    tag
  }
}
function parseElement(context: any){
  const element =  parseTag(context, TagType.Start)
  parseTag(context, TagType.End)
  return element
}

function parseInterpolation(context){
  const openDelimiter = "{{"
  const closeDelimiter = "}}"

  const closeIndex = context.source.indexOf(closeDelimiter, closeDelimiter.length)
  
  advanceBy(context, openDelimiter.length) //推进，删除已匹配的
  // context.source = context.source.slice(openDelimiter.length)

  const rawContentLength = closeIndex - openDelimiter.length
  const rawContent = context.source.slice(0, rawContentLength)//模板里面的字符串
  const content = rawContent.trim() //去掉空格

  advanceBy(context, rawContentLength + closeDelimiter.length)
  // context.source = context.source.slice(rawContentLength + closeDelimiter.length) //删除已经匹配的模板


  return {
    type: NodeType.INTERPOLATION,
    content: {
      type: NodeType.SIMPLE_EXPRESSION,
      content: content
    }
  }
}

function advanceBy(context: any, length: number){
  context.source = context.source.slice(length)
}

function createRoot(children){
  return {
    children
  }
}

function createParserContext(content: string): any{
  return {
    source: content
  }
}