class XMLSerializerCustom {
    constructor() { }
  
    serializeToString(node) {
      return this.removeInvalidCharacters(
        this.nodeTreeToXHTML(node, { rootNode: true }),
      );
    }
  
    nodeTreeToXHTML(node, options = undefined) {
      const isRootNode = options && options.rootNode;
  
      if (
        node.nodeName === '#document' ||
        node.nodeName === '#document-fragment'
      ) {
        return this.serializeChildren(node);
      }
  
      if (node.tagName) {
        return this.serializeTag(node, isRootNode);
      }
  
      if (node.nodeName === '#text') {
        return this.serializeText(node);
      }
  
      if (node.nodeName === '#comment') {
        return `<!--${node.data.replace(/-/g, '&#45;')}-->`;
      }
    }
  
    serializeChildren(node) {
      return Array.from(node.childNodes).map((childNode) => {
        return this.nodeTreeToXHTML(childNode);
      }).join('');
    }
  
    serializeTag(node, isRootNode) {
      let output = '<';
      output += this.getTagName(node);
      output += this.serializeNamespace(node, isRootNode);
  
      Array.from(node.attributes).forEach((attr) => {
        output += this.serializeAttribute(attr);
      });
  
      if (node.childNodes && node.childNodes.length > 0) {
        output += '>';
        output += this.serializeChildren(node);
        output += `</${this.getTagName(node)}>`;
        return output;
      }
  
      // 没有子节点就直接结束了，不用区分 div 和 img 之类的
      return `${output}/>`;
    }
  
    getTagName(node) {
      let tagName = node.tagName;
  
      // 帮助序列化原始 HTML 文档
      if (node.namespaceURI === 'http://www.w3.org/1999/xhtml') {
        tagName = tagName.toLowerCase();
      }
  
      return tagName;
    }
  
    serializeNamespace(node, isRootNode) {
      const nodeHasXmlnsAttr = Array.from(node.attributes).map((attr) => {
        return attr.name;
      }).includes('xmlns');
  
      // 当元素没有 xmlns 属性：
      // 如果是根元素，或者继承的 namespace 不匹配该元素的 namespace 的时候
      // 给它设置一个 xmlns
      if (
        !nodeHasXmlnsAttr &&
        (
          isRootNode ||
          node.namespaceURI != (node.parenNode && node.parenNode.namespaceURI) // null 或者 undefined
        )
      ) {
        // TODO: 了解更多信息
        // return ` xmlns="${node.namespaceURI}"`;
      }
  
      return '';
    }
  
    serializeAttribute(attr) {
      return ` ${attr.name.toLowerCase()}="${this.serializeAttributeValue(attr.value)}"`;
    }
  
    serializeAttributeValue(value) {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    }
  
    serializeText(node) {
      const text = node.nodeValue || '';
      return this.serializeTextContent(text);
    }
  
    serializeTextContent(content) {
      return content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  
    removeInvalidCharacters(content) {
      // http://www.w3.org/TR/xml/#NT-Char for valid XML 1.0 characters
      return content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
    }
  }

  module.exports = XMLSerializerCustom;