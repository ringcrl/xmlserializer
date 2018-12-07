const XMLSerializerCustom = require('../index.js');

describe('xmlserializer', () => {
    const parser = new DOMParser();
    const xmlSerializer = new XMLSerializerCustom();

    it('should return a valid XHTML document for empty input', function() {
        const doc = parser.parseFromString('', 'text/xml');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('');
    });

    it('should return a valid XHTML document for HTML', function () {
        const doc = parser.parseFromString('<html></html>', 'text/xml');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<html/>');
    });

    it('should serialize comments', function () {
        const doc = parser.parseFromString('<!-- this is a comment -->', 'text/html');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<!-- this is a comment --><html><head/><body/></html>');
    });

    it('should correctly serialize special characters in comments', function () {
        const doc = parser.parseFromString('<html><body><!-- &gt; -->', 'text/html');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<html><head/><body><!-- &gt; --></body></html>');
    });

    it('should quote dashes in comments', function () {
        const doc = parser.parseFromString('<html><body><!--- -- - - ---- --->', 'text/html');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<html><head/><body><!--&#45; &#45;&#45; &#45; &#45; &#45;&#45;&#45;&#45; &#45;--></body></html>');
    });

    it('should serialize attributes', function () {
        const doc = parser.parseFromString('<p class="myClass"> </p>', 'text/xml');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<p class="myClass"> </p>');
    });

    it('should serialize text', function () {
        const doc = parser.parseFromString('<p> this is text</p>', 'text/xml');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<p> this is text</p>');
    });

    it('should serialize HTML to lower case tag names', function () {
        const doc = parser.parseFromString('<P> </P>', 'text/html');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<html><head/><body><p> </p></body></html>');
    });

    it('should not change letter case in tag names for non HTML', function () {
        const doc = parser.parseFromString('<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient/></defs></svg>', 'text/xml');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient/></defs></svg>');
    });

    it('should serialize to lower case attribute names', function () {
        const doc = parser.parseFromString('<p Class="myClass"> </p>', 'text/xml');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<p class="myClass"> </p>');
    });

    it('should serialize HTML enties', function () {
        const doc = parser.parseFromString('&ndash;', 'text/html');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<html><head/><body>–</body></html>', 'text/xml');
    });

    it('should correctly quote ampersand', function () {
        const doc = parser.parseFromString('&amp;&amp;', 'text/html');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<html><head/><body>&amp;&amp;</body></html>');
    });

    it('should correctly quote lighter than', function () {
        const doc = parser.parseFromString('<<', 'text/html');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<html><head/><body>&lt;&lt;</body></html>');
    });

    it('should correctly quote greater than', function () {
        const doc = parser.parseFromString('>>', 'text/html');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<html><head/><body>&gt;&gt;</body></html>');
    });

    it('should correctly serialize special characters in attributes', function () {
        const doc = parser.parseFromString('<input value="&quot;&gt;&lt;&amp;&apos;"/>', 'text/xml');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<input value="&quot;&gt;&lt;&amp;&apos;"/>');
    });

    it('should serialize to self closing attribute', function () {
        const doc = parser.parseFromString('<br/>', 'text/xml');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<br/>');
    });

    it('should quote script content', function () {
        const doc = parser.parseFromString('<script>var a = 1 & 1;</script>', 'text/html');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<html><head><script>var a = 1 &amp; 1;</script></head><body/></html>');
    });

    it('should quote style content', function () {
        const doc = parser.parseFromString('<style>span:before { content: "<"; }</style>', 'text/html');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<html><head><style>span:before { content: \"&lt;\"; }</style></head><body/></html>');
    });

    it('should convert boolean attributes', function () {
        const doc = parser.parseFromString('<input type="checkbox" checked/>', 'text/html');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<html><head/><body><input type=\"checkbox\" checked=\"\"/></body></html>');
    });

    it('should prefer existing xmlns', function () {
        const doc = parser.parseFromString('<html xmlns="somenamespace"></html>', 'text/xml');
        const doc_str = xmlSerializer.serializeToString(doc);

        expect(doc_str).toEqual('<html xmlns=\"somenamespace\"/>');
    });

});