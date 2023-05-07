import { NodeType } from "./ast"

const enum TagType {
  Start,
  End
}

export function baseParse(content: string){
  const context = createParserContext(content)

  return createRoot(parseChildren(context, []))
}

function parseChildren(context, ancestors){
  const nodes: any = []

  while(!isEnd(context, ancestors)){
    let node
    const s = context.source
    if(s.startsWith('{{')){
      node = parseInterpolation(context)
    } else if(s[0] === '<'){
      if(/[a-z]/i.test(context.source[1])){
        node = parseElement(context, ancestors)
      }
    }
  
    if(!node){
      node = parseText(context)
    }
  
    nodes.push(node)
  }
  return nodes
}

function isEnd(context, ancestors){
  const s = context.source

  if(s.startsWith('</')){
    for(let i=ancestors.length-1; i>=0; i--){
      const tag = ancestors[i].tag
      if(s.slice(2,2+tag.length) === tag){
        return true
      }
    }
  }
  // if(parentTag && s.startsWith(`</${parentTag}>`)){
  //   return true
  // }

  return !s
}

function parseText(context: any){
  let endIndex = context.source.length
  let endTokens = ['<','{{']

  for(let i=0; i<endTokens.length; i++){
    const index = context.source.indexOf(endTokens[i])
    if(index !== -1 && endIndex > index){
      endIndex = index
    }
  }

  const content = context.source.slice(0, endIndex)
  console.log('content:------------', content)
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
function parseElement(context: any, ancestors){
  const element: any =  parseTag(context, TagType.Start)
  ancestors.push(element)
  element.children = parseChildren(context, ancestors)
  ancestors.pop()
  if(context.source.slice(2,2+element.tag.length) === element.tag){
    parseTag(context, TagType.End)
  } else {
    throw new Error(`缺少结束标签:${element.tag}`)
  }

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