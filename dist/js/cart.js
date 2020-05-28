/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/page/cart/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/hogan.js/lib/compiler.js":
/*!***********************************************!*\
  !*** ./node_modules/hogan.js/lib/compiler.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

(function (Hogan) {
  // Setup regex  assignments
  // remove whitespace according to Mustache spec
  var rIsWhitespace = /\S/,
      rQuot = /\"/g,
      rNewline =  /\n/g,
      rCr = /\r/g,
      rSlash = /\\/g,
      rLineSep = /\u2028/,
      rParagraphSep = /\u2029/;

  Hogan.tags = {
    '#': 1, '^': 2, '<': 3, '$': 4,
    '/': 5, '!': 6, '>': 7, '=': 8, '_v': 9,
    '{': 10, '&': 11, '_t': 12
  };

  Hogan.scan = function scan(text, delimiters) {
    var len = text.length,
        IN_TEXT = 0,
        IN_TAG_TYPE = 1,
        IN_TAG = 2,
        state = IN_TEXT,
        tagType = null,
        tag = null,
        buf = '',
        tokens = [],
        seenTag = false,
        i = 0,
        lineStart = 0,
        otag = '{{',
        ctag = '}}';

    function addBuf() {
      if (buf.length > 0) {
        tokens.push({tag: '_t', text: new String(buf)});
        buf = '';
      }
    }

    function lineIsWhitespace() {
      var isAllWhitespace = true;
      for (var j = lineStart; j < tokens.length; j++) {
        isAllWhitespace =
          (Hogan.tags[tokens[j].tag] < Hogan.tags['_v']) ||
          (tokens[j].tag == '_t' && tokens[j].text.match(rIsWhitespace) === null);
        if (!isAllWhitespace) {
          return false;
        }
      }

      return isAllWhitespace;
    }

    function filterLine(haveSeenTag, noNewLine) {
      addBuf();

      if (haveSeenTag && lineIsWhitespace()) {
        for (var j = lineStart, next; j < tokens.length; j++) {
          if (tokens[j].text) {
            if ((next = tokens[j+1]) && next.tag == '>') {
              // set indent to token value
              next.indent = tokens[j].text.toString()
            }
            tokens.splice(j, 1);
          }
        }
      } else if (!noNewLine) {
        tokens.push({tag:'\n'});
      }

      seenTag = false;
      lineStart = tokens.length;
    }

    function changeDelimiters(text, index) {
      var close = '=' + ctag,
          closeIndex = text.indexOf(close, index),
          delimiters = trim(
            text.substring(text.indexOf('=', index) + 1, closeIndex)
          ).split(' ');

      otag = delimiters[0];
      ctag = delimiters[delimiters.length - 1];

      return closeIndex + close.length - 1;
    }

    if (delimiters) {
      delimiters = delimiters.split(' ');
      otag = delimiters[0];
      ctag = delimiters[1];
    }

    for (i = 0; i < len; i++) {
      if (state == IN_TEXT) {
        if (tagChange(otag, text, i)) {
          --i;
          addBuf();
          state = IN_TAG_TYPE;
        } else {
          if (text.charAt(i) == '\n') {
            filterLine(seenTag);
          } else {
            buf += text.charAt(i);
          }
        }
      } else if (state == IN_TAG_TYPE) {
        i += otag.length - 1;
        tag = Hogan.tags[text.charAt(i + 1)];
        tagType = tag ? text.charAt(i + 1) : '_v';
        if (tagType == '=') {
          i = changeDelimiters(text, i);
          state = IN_TEXT;
        } else {
          if (tag) {
            i++;
          }
          state = IN_TAG;
        }
        seenTag = i;
      } else {
        if (tagChange(ctag, text, i)) {
          tokens.push({tag: tagType, n: trim(buf), otag: otag, ctag: ctag,
                       i: (tagType == '/') ? seenTag - otag.length : i + ctag.length});
          buf = '';
          i += ctag.length - 1;
          state = IN_TEXT;
          if (tagType == '{') {
            if (ctag == '}}') {
              i++;
            } else {
              cleanTripleStache(tokens[tokens.length - 1]);
            }
          }
        } else {
          buf += text.charAt(i);
        }
      }
    }

    filterLine(seenTag, true);

    return tokens;
  }

  function cleanTripleStache(token) {
    if (token.n.substr(token.n.length - 1) === '}') {
      token.n = token.n.substring(0, token.n.length - 1);
    }
  }

  function trim(s) {
    if (s.trim) {
      return s.trim();
    }

    return s.replace(/^\s*|\s*$/g, '');
  }

  function tagChange(tag, text, index) {
    if (text.charAt(index) != tag.charAt(0)) {
      return false;
    }

    for (var i = 1, l = tag.length; i < l; i++) {
      if (text.charAt(index + i) != tag.charAt(i)) {
        return false;
      }
    }

    return true;
  }

  // the tags allowed inside super templates
  var allowedInSuper = {'_t': true, '\n': true, '$': true, '/': true};

  function buildTree(tokens, kind, stack, customTags) {
    var instructions = [],
        opener = null,
        tail = null,
        token = null;

    tail = stack[stack.length - 1];

    while (tokens.length > 0) {
      token = tokens.shift();

      if (tail && tail.tag == '<' && !(token.tag in allowedInSuper)) {
        throw new Error('Illegal content in < super tag.');
      }

      if (Hogan.tags[token.tag] <= Hogan.tags['$'] || isOpener(token, customTags)) {
        stack.push(token);
        token.nodes = buildTree(tokens, token.tag, stack, customTags);
      } else if (token.tag == '/') {
        if (stack.length === 0) {
          throw new Error('Closing tag without opener: /' + token.n);
        }
        opener = stack.pop();
        if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
          throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);
        }
        opener.end = token.i;
        return instructions;
      } else if (token.tag == '\n') {
        token.last = (tokens.length == 0) || (tokens[0].tag == '\n');
      }

      instructions.push(token);
    }

    if (stack.length > 0) {
      throw new Error('missing closing tag: ' + stack.pop().n);
    }

    return instructions;
  }

  function isOpener(token, tags) {
    for (var i = 0, l = tags.length; i < l; i++) {
      if (tags[i].o == token.n) {
        token.tag = '#';
        return true;
      }
    }
  }

  function isCloser(close, open, tags) {
    for (var i = 0, l = tags.length; i < l; i++) {
      if (tags[i].c == close && tags[i].o == open) {
        return true;
      }
    }
  }

  function stringifySubstitutions(obj) {
    var items = [];
    for (var key in obj) {
      items.push('"' + esc(key) + '": function(c,p,t,i) {' + obj[key] + '}');
    }
    return "{ " + items.join(",") + " }";
  }

  function stringifyPartials(codeObj) {
    var partials = [];
    for (var key in codeObj.partials) {
      partials.push('"' + esc(key) + '":{name:"' + esc(codeObj.partials[key].name) + '", ' + stringifyPartials(codeObj.partials[key]) + "}");
    }
    return "partials: {" + partials.join(",") + "}, subs: " + stringifySubstitutions(codeObj.subs);
  }

  Hogan.stringify = function(codeObj, text, options) {
    return "{code: function (c,p,i) { " + Hogan.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) +  "}";
  }

  var serialNo = 0;
  Hogan.generate = function(tree, text, options) {
    serialNo = 0;
    var context = { code: '', subs: {}, partials: {} };
    Hogan.walk(tree, context);

    if (options.asString) {
      return this.stringify(context, text, options);
    }

    return this.makeTemplate(context, text, options);
  }

  Hogan.wrapMain = function(code) {
    return 'var t=this;t.b(i=i||"");' + code + 'return t.fl();';
  }

  Hogan.template = Hogan.Template;

  Hogan.makeTemplate = function(codeObj, text, options) {
    var template = this.makePartials(codeObj);
    template.code = new Function('c', 'p', 'i', this.wrapMain(codeObj.code));
    return new this.template(template, text, this, options);
  }

  Hogan.makePartials = function(codeObj) {
    var key, template = {subs: {}, partials: codeObj.partials, name: codeObj.name};
    for (key in template.partials) {
      template.partials[key] = this.makePartials(template.partials[key]);
    }
    for (key in codeObj.subs) {
      template.subs[key] = new Function('c', 'p', 't', 'i', codeObj.subs[key]);
    }
    return template;
  }

  function esc(s) {
    return s.replace(rSlash, '\\\\')
            .replace(rQuot, '\\\"')
            .replace(rNewline, '\\n')
            .replace(rCr, '\\r')
            .replace(rLineSep, '\\u2028')
            .replace(rParagraphSep, '\\u2029');
  }

  function chooseMethod(s) {
    return (~s.indexOf('.')) ? 'd' : 'f';
  }

  function createPartial(node, context) {
    var prefix = "<" + (context.prefix || "");
    var sym = prefix + node.n + serialNo++;
    context.partials[sym] = {name: node.n, partials: {}};
    context.code += 't.b(t.rp("' +  esc(sym) + '",c,p,"' + (node.indent || '') + '"));';
    return sym;
  }

  Hogan.codegen = {
    '#': function(node, context) {
      context.code += 'if(t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),' +
                      'c,p,0,' + node.i + ',' + node.end + ',"' + node.otag + " " + node.ctag + '")){' +
                      't.rs(c,p,' + 'function(c,p,t){';
      Hogan.walk(node.nodes, context);
      context.code += '});c.pop();}';
    },

    '^': function(node, context) {
      context.code += 'if(!t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,1,0,0,"")){';
      Hogan.walk(node.nodes, context);
      context.code += '};';
    },

    '>': createPartial,
    '<': function(node, context) {
      var ctx = {partials: {}, code: '', subs: {}, inPartial: true};
      Hogan.walk(node.nodes, ctx);
      var template = context.partials[createPartial(node, context)];
      template.subs = ctx.subs;
      template.partials = ctx.partials;
    },

    '$': function(node, context) {
      var ctx = {subs: {}, code: '', partials: context.partials, prefix: node.n};
      Hogan.walk(node.nodes, ctx);
      context.subs[node.n] = ctx.code;
      if (!context.inPartial) {
        context.code += 't.sub("' + esc(node.n) + '",c,p,i);';
      }
    },

    '\n': function(node, context) {
      context.code += write('"\\n"' + (node.last ? '' : ' + i'));
    },

    '_v': function(node, context) {
      context.code += 't.b(t.v(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
    },

    '_t': function(node, context) {
      context.code += write('"' + esc(node.text) + '"');
    },

    '{': tripleStache,

    '&': tripleStache
  }

  function tripleStache(node, context) {
    context.code += 't.b(t.t(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
  }

  function write(s) {
    return 't.b(' + s + ');';
  }

  Hogan.walk = function(nodelist, context) {
    var func;
    for (var i = 0, l = nodelist.length; i < l; i++) {
      func = Hogan.codegen[nodelist[i].tag];
      func && func(nodelist[i], context);
    }
    return context;
  }

  Hogan.parse = function(tokens, text, options) {
    options = options || {};
    return buildTree(tokens, '', [], options.sectionTags || []);
  }

  Hogan.cache = {};

  Hogan.cacheKey = function(text, options) {
    return [text, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join('||');
  }

  Hogan.compile = function(text, options) {
    options = options || {};
    var key = Hogan.cacheKey(text, options);
    var template = this.cache[key];

    if (template) {
      var partials = template.partials;
      for (var name in partials) {
        delete partials[name].instance;
      }
      return template;
    }

    template = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
    return this.cache[key] = template;
  }
})( true ? exports : undefined);


/***/ }),

/***/ "./node_modules/hogan.js/lib/hogan.js":
/*!********************************************!*\
  !*** ./node_modules/hogan.js/lib/hogan.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

// This file is for use with Node.js. See dist/ for browser files.

var Hogan = __webpack_require__(/*! ./compiler */ "./node_modules/hogan.js/lib/compiler.js");
Hogan.Template = __webpack_require__(/*! ./template */ "./node_modules/hogan.js/lib/template.js").Template;
Hogan.template = Hogan.Template;
module.exports = Hogan;


/***/ }),

/***/ "./node_modules/hogan.js/lib/template.js":
/*!***********************************************!*\
  !*** ./node_modules/hogan.js/lib/template.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var Hogan = {};

(function (Hogan) {
  Hogan.Template = function (codeObj, text, compiler, options) {
    codeObj = codeObj || {};
    this.r = codeObj.code || this.r;
    this.c = compiler;
    this.options = options || {};
    this.text = text || '';
    this.partials = codeObj.partials || {};
    this.subs = codeObj.subs || {};
    this.buf = '';
  }

  Hogan.Template.prototype = {
    // render: replaced by generated code.
    r: function (context, partials, indent) { return ''; },

    // variable escaping
    v: hoganEscape,

    // triple stache
    t: coerceToString,

    render: function render(context, partials, indent) {
      return this.ri([context], partials || {}, indent);
    },

    // render internal -- a hook for overrides that catches partials too
    ri: function (context, partials, indent) {
      return this.r(context, partials, indent);
    },

    // ensurePartial
    ep: function(symbol, partials) {
      var partial = this.partials[symbol];

      // check to see that if we've instantiated this partial before
      var template = partials[partial.name];
      if (partial.instance && partial.base == template) {
        return partial.instance;
      }

      if (typeof template == 'string') {
        if (!this.c) {
          throw new Error("No compiler available.");
        }
        template = this.c.compile(template, this.options);
      }

      if (!template) {
        return null;
      }

      // We use this to check whether the partials dictionary has changed
      this.partials[symbol].base = template;

      if (partial.subs) {
        // Make sure we consider parent template now
        if (!partials.stackText) partials.stackText = {};
        for (key in partial.subs) {
          if (!partials.stackText[key]) {
            partials.stackText[key] = (this.activeSub !== undefined && partials.stackText[this.activeSub]) ? partials.stackText[this.activeSub] : this.text;
          }
        }
        template = createSpecializedPartial(template, partial.subs, partial.partials,
          this.stackSubs, this.stackPartials, partials.stackText);
      }
      this.partials[symbol].instance = template;

      return template;
    },

    // tries to find a partial in the current scope and render it
    rp: function(symbol, context, partials, indent) {
      var partial = this.ep(symbol, partials);
      if (!partial) {
        return '';
      }

      return partial.ri(context, partials, indent);
    },

    // render a section
    rs: function(context, partials, section) {
      var tail = context[context.length - 1];

      if (!isArray(tail)) {
        section(context, partials, this);
        return;
      }

      for (var i = 0; i < tail.length; i++) {
        context.push(tail[i]);
        section(context, partials, this);
        context.pop();
      }
    },

    // maybe start a section
    s: function(val, ctx, partials, inverted, start, end, tags) {
      var pass;

      if (isArray(val) && val.length === 0) {
        return false;
      }

      if (typeof val == 'function') {
        val = this.ms(val, ctx, partials, inverted, start, end, tags);
      }

      pass = !!val;

      if (!inverted && pass && ctx) {
        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
      }

      return pass;
    },

    // find values with dotted names
    d: function(key, ctx, partials, returnFound) {
      var found,
          names = key.split('.'),
          val = this.f(names[0], ctx, partials, returnFound),
          doModelGet = this.options.modelGet,
          cx = null;

      if (key === '.' && isArray(ctx[ctx.length - 2])) {
        val = ctx[ctx.length - 1];
      } else {
        for (var i = 1; i < names.length; i++) {
          found = findInScope(names[i], val, doModelGet);
          if (found !== undefined) {
            cx = val;
            val = found;
          } else {
            val = '';
          }
        }
      }

      if (returnFound && !val) {
        return false;
      }

      if (!returnFound && typeof val == 'function') {
        ctx.push(cx);
        val = this.mv(val, ctx, partials);
        ctx.pop();
      }

      return val;
    },

    // find values with normal names
    f: function(key, ctx, partials, returnFound) {
      var val = false,
          v = null,
          found = false,
          doModelGet = this.options.modelGet;

      for (var i = ctx.length - 1; i >= 0; i--) {
        v = ctx[i];
        val = findInScope(key, v, doModelGet);
        if (val !== undefined) {
          found = true;
          break;
        }
      }

      if (!found) {
        return (returnFound) ? false : "";
      }

      if (!returnFound && typeof val == 'function') {
        val = this.mv(val, ctx, partials);
      }

      return val;
    },

    // higher order templates
    ls: function(func, cx, partials, text, tags) {
      var oldTags = this.options.delimiters;

      this.options.delimiters = tags;
      this.b(this.ct(coerceToString(func.call(cx, text)), cx, partials));
      this.options.delimiters = oldTags;

      return false;
    },

    // compile text
    ct: function(text, cx, partials) {
      if (this.options.disableLambda) {
        throw new Error('Lambda features disabled.');
      }
      return this.c.compile(text, this.options).render(cx, partials);
    },

    // template result buffering
    b: function(s) { this.buf += s; },

    fl: function() { var r = this.buf; this.buf = ''; return r; },

    // method replace section
    ms: function(func, ctx, partials, inverted, start, end, tags) {
      var textSource,
          cx = ctx[ctx.length - 1],
          result = func.call(cx);

      if (typeof result == 'function') {
        if (inverted) {
          return true;
        } else {
          textSource = (this.activeSub && this.subsText && this.subsText[this.activeSub]) ? this.subsText[this.activeSub] : this.text;
          return this.ls(result, cx, partials, textSource.substring(start, end), tags);
        }
      }

      return result;
    },

    // method replace variable
    mv: function(func, ctx, partials) {
      var cx = ctx[ctx.length - 1];
      var result = func.call(cx);

      if (typeof result == 'function') {
        return this.ct(coerceToString(result.call(cx)), cx, partials);
      }

      return result;
    },

    sub: function(name, context, partials, indent) {
      var f = this.subs[name];
      if (f) {
        this.activeSub = name;
        f(context, partials, this, indent);
        this.activeSub = false;
      }
    }

  };

  //Find a key in an object
  function findInScope(key, scope, doModelGet) {
    var val;

    if (scope && typeof scope == 'object') {

      if (scope[key] !== undefined) {
        val = scope[key];

      // try lookup with get for backbone or similar model data
      } else if (doModelGet && scope.get && typeof scope.get == 'function') {
        val = scope.get(key);
      }
    }

    return val;
  }

  function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {
    function PartialTemplate() {};
    PartialTemplate.prototype = instance;
    function Substitutions() {};
    Substitutions.prototype = instance.subs;
    var key;
    var partial = new PartialTemplate();
    partial.subs = new Substitutions();
    partial.subsText = {};  //hehe. substext.
    partial.buf = '';

    stackSubs = stackSubs || {};
    partial.stackSubs = stackSubs;
    partial.subsText = stackText;
    for (key in subs) {
      if (!stackSubs[key]) stackSubs[key] = subs[key];
    }
    for (key in stackSubs) {
      partial.subs[key] = stackSubs[key];
    }

    stackPartials = stackPartials || {};
    partial.stackPartials = stackPartials;
    for (key in partials) {
      if (!stackPartials[key]) stackPartials[key] = partials[key];
    }
    for (key in stackPartials) {
      partial.partials[key] = stackPartials[key];
    }

    return partial;
  }

  var rAmp = /&/g,
      rLt = /</g,
      rGt = />/g,
      rApos = /\'/g,
      rQuot = /\"/g,
      hChars = /[&<>\"\']/;

  function coerceToString(val) {
    return String((val === null || val === undefined) ? '' : val);
  }

  function hoganEscape(str) {
    str = coerceToString(str);
    return hChars.test(str) ?
      str
        .replace(rAmp, '&amp;')
        .replace(rLt, '&lt;')
        .replace(rGt, '&gt;')
        .replace(rApos, '&#39;')
        .replace(rQuot, '&quot;') :
      str;
  }

  var isArray = Array.isArray || function(a) {
    return Object.prototype.toString.call(a) === '[object Array]';
  };

})( true ? exports : undefined);


/***/ }),

/***/ "./src/page/cart/index.css":
/*!*********************************!*\
  !*** ./src/page/cart/index.css ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/page/cart/index.js":
/*!********************************!*\
  !*** ./src/page/cart/index.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
* @Author: 青
* @Date:   2020-04-18 11:17:01
* @Last Modified by:   青
* @Last Modified time: 2020-04-27 11:00:04
*/
__webpack_require__(/*! ./index.css */ "./src/page/cart/index.css");
__webpack_require__(/*! page/common/header/index.js */ "./src/page/common/header/index.js");
var nav = __webpack_require__(/*! page/common/nav/index.js */ "./src/page/common/nav/index.js");
var _mm = __webpack_require__(/*! util/mm.js */ "./src/util/mm.js");
var _cart = __webpack_require__(/*! service/cart-service.js */ "./src/service/cart-service.js");
var templateIndex = __webpack_require__(/*! ./index.string */ "./src/page/cart/index.string");

var page = {
	data: {
		
	},
	init: function() {
		this.onLoad();
		this.bindEvent();
	},
	onLoad: function() {
		this.loadCart();
	},
	bindEvent: function() {
		var _this = this;
		// 商品的选择 / 取消选择
		$(document).on('click', '.cart-select', function() {
			var $this = $(this),
				productId = $this.parents('.cart-table').data('product-id');

			// 选中
			if($this.is(':checked')) {
				_cart.selectProduct(productId, function(res) {
					_this.renderCart(res);
				}, function(errMsg) {
					_this.showCartError();
				});
			}
			// 取消选中
			else {
				_cart.unselectProduct(productId, function(res) {
					_this.renderCart(res);
				}, function(errMsg) {
					_this.showCartError();
				});
			}
		});		
		// 商品的全选 / 取消全选
		$(document).on('click', '.cart-select-all', function() {
			var $this = $(this);
			// 选中
			if($this.is(':checked')) {
				_cart.selectAllProduct(function(res) {
					_this.renderCart(res);
				}, function(errMsg) {
					_this.showCartError();
				});
			}
			// 取消选中
			else {
				_cart.unselectAllProduct(function(res) {
					_this.renderCart(res);
				}, function(errMsg) {
					_this.showCartError();
				});
			}
		});
		// 商品数量的变化
		$(document).on('click', '.count-btn', function() {
			var $this = $(this),
				$pCount = $this.siblings('.count-input'),
				currCount = parseInt($pCount.val()),
				type = $this.hasClass('plus') ? 'plus' : 'minus',
				productId = $this.parents('.cart-table').data('product-id'),
				minCount = 1,
				maxCount = parseInt($pCount.data('max')),
				newCount = 0;
			if(type === 'plus'){
				if(currCount >= maxCount){
					_mm.errorTips('该商品数量已达到上限');
					return;
				}
				newCount = currCount + 1;
			}else if(type === 'minus') {
				if(currCount <= minCount) {
					return;
				}
				newCount = currCount - 1;
			}
			// 更新购物车商品数量
			_cart.updateProduct({
				productId: productId,
				count: newCount
			}, function(res) {
				_this.renderCart(res);
			}, function(errMsg) {
				_this.showCartError();
			});
		});
		// 删除单个商品
		$(document).on('click', '.cart-delete', function() {
			if(window.confirm('确认要删除该商品？')){
				var productId = $(this).parents('.cart-table')
					.data('product-id');
				_this.deleteCartProduct(productId);
			}
		});
		// 删除选中商品
		$(document).on('click', '.delete-selected', function() {
			if(window.confirm('确认要删除选中的商品？')){
				var arrProductIds = [],
					$selectedItem = $('.cart-select:checked');
				// 循环查找选中的productIds
				for(var i=0,iLength=$selectedItem.length; i<iLength; i++) {
					arrProductIds
						.push($($selectedItem[i]).parents('.cart-table').data('product-id'));
				}
				if(arrProductIds.length){
					_this.deleteCartProduct(arrProductIds.join(','));
				}
				else {
					_mm.errorTips('您还没有选中要删除的商品');
				}
			}
		});
		// 提交购物车
		$(document).on('click', '.btn-submit', function() {
			// 总价大于0，进行提交
			if(_this.data.cartInfo && _this.data.cartInfo.cartTotalPrice > 0) {
				window.location.href = './order-confirm.html';
			}else {
				_mm.errorTips('请选择商品后再提交');
			}
		});
	},
	// 加载购物车信息
	loadCart: function() {
		var _this = this;
		// 获取购物车列表
		_cart.getCartList(function(res) {
			_this.renderCart(res);
		}, function(errMsg) {
			_this.showCartError();
		});
	},
	// 渲染购物车
	renderCart: function(data) {
		this.filter(data);
		// 缓存购物车信息
		this.data.cartInfo = data;
		// 生成HTML
		var cartHtml = _mm.renderHtml(templateIndex, data);
		// 插入HTML
		$('.page-wrap').html(cartHtml);
		// 通知导航的购物车更新数量(增加/删除商品时更新导航nav)
		nav.loadCartCount();
	},
	// 删除指定商品，支持批量，productId用逗号分割
	deleteCartProduct: function(productIds) {
		var _this = this;
		_cart.deleteProduct(productIds, function(res) {
			_this.renderCart(res);
		}, function(errMsg) {
			_this.showCartError();
		});
	},
	// 数据匹配
	filter: function(data) {
		data.notEmpty = !!data.cartProductVoList.length;
	},
	// 显示错误信息
	showCartError:function() {
		$('.page-wrap').html('<p class="err-tip">哪里不对了，刷新下试试吧。</p>')
	}
}

$(function() {
	page.init();
})

/***/ }),

/***/ "./src/page/cart/index.string":
/*!************************************!*\
  !*** ./src/page/cart/index.string ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "{{#notEmpty}}\r\n<div class=\"cart-header\">\r\n\t<table class=\"cart-table\">\r\n\t\t<tr>\r\n\t\t\t<th class=\"cart-cell cell-check\">\r\n\t\t\t\t<label class=\"cart-label\">\r\n\t\t\t\t\t{{#allChecked}}\r\n\t\t\t\t\t<input type=\"checkbox\" class=\"cart-select-all\" checked />\r\n\t\t\t\t\t{{/allChecked}}\r\n\t\t\t\t\t{{^allChecked}}\r\n\t\t\t\t\t<input type=\"checkbox\" class=\"cart-select-all\" />\r\n\t\t\t\t\t{{/allChecked}}\r\n\t\t\t\t\t<span>全选</span>\r\n\t\t\t\t</label>\r\n\t\t\t</th>\r\n\t\t\t<th class=\"cart-cell cell-info\">商品信息</th>\r\n\t\t\t<th class=\"cart-cell cell-price\">单价</th>\r\n\t\t\t<th class=\"cart-cell cell-count\">数量</th>\r\n\t\t\t<th class=\"cart-cell cell-total\">合计</th>\r\n\t\t\t<th class=\"cart-cell cell-opear\">操作</th>\r\n\t\t</tr>\r\n\t</table>\r\n</div>\r\n<div class=\"cart-list\">\r\n\t{{#cartProductVoList}}\r\n\t<table class=\"cart-table\" data-product-id=\"{{productId}}\">\r\n\t\t<tr>\r\n\t\t\t<td class=\"cart-cell cell-check\">\r\n\t\t\t\t<label class=\"cart-label\">\r\n\t\t\t\t\t{{#productChecked}}\r\n\t\t\t\t\t<input type=\"checkbox\" class=\"cart-select\" checked />\r\n\t\t\t\t\t{{/productChecked}}\r\n\t\t\t\t\t{{^productChecked}}\r\n\t\t\t\t\t<input type=\"checkbox\" class=\"cart-select\" />\r\n\t\t\t\t\t{{/productChecked}}\r\n\t\t\t\t</label>\r\n\t\t\t</td>\r\n\t\t\t<td class=\"cart-cell cell-img\">\r\n\t\t\t\t<a class=\"link\" href=\"./detail.html?productId={{productId}}\">\r\n\t\t\t\t\t<img class=\"p-img\" src=\"{{imageHost}}{{productMainImage}}\" alt=\"{{productName}}\" />\r\n\t\t\t\t</a>\r\n\t\t\t</td>\r\n\t\t\t<td class=\"cart-cell cell-info\">\r\n\t\t\t\t<a class=\"link\" href=\"./detail.html?productId={{productId}}\">{{productName}}</a>\r\n\t\t\t</td>\r\n\t\t\t<td class=\"cart-cell cell-price\">￥{{productPrice}}</td>\r\n\t\t\t<td class=\"cart-cell cell-count\">\r\n\t\t\t\t<span class=\"count-btn minus\">-</span>\r\n\t\t\t\t<input class=\"count-input\" value=\"{{quantity}}\" data-max=\"{{productStock}}\" />\r\n\t\t\t\t<span class=\"count-btn plus\">+</span>\r\n\t\t\t</td>\r\n\t\t\t<td class=\"cart-cell cell-total\">￥{{productTotalPrice}}</td>\r\n\t\t\t<td class=\"cart-cell cell-opear\">\r\n\t\t\t\t<span class=\"link cart-delete\">删除</span>\r\n\t\t\t</td>\r\n\t\t</tr>\r\n\t</table>\r\n\t{{/cartProductVoList}}\r\n</div>\r\n<div class=\"cart-footer\">\r\n\t<div class=\"select-con\">\r\n\t\t<label>\r\n\t\t\t{{#allChecked}}\r\n\t\t\t<input type=\"checkbox\" class=\"cart-select-all\" checked />\r\n\t\t\t{{/allChecked}}\r\n\t\t\t{{^allChecked}}\r\n\t\t\t<input type=\"checkbox\" class=\"cart-select-all\" />\r\n\t\t\t{{/allChecked}}\r\n\t\t\t<span>全选</span>\r\n\t\t</label>\r\n\t</div>\r\n\t<div class=\"delete-con\">\r\n\t\t<span class=\"link delete-selected\">\r\n\t\t\t<i class=\"fa fa-trash-alt\"></i>\r\n\t\t\t<span>删除选中</span>\r\n\t\t</span>\r\n\t</div>\r\n\t<div class=\"submit-con\">\r\n\t\t<span>总价：</span>\r\n\t\t<span class=\"submit-total\">￥{{cartTotalPrice}}</span>\r\n\t\t<span class=\"btn btn-submit\">去结算</span>\r\n\t</div>\r\n</div>\r\n{{/notEmpty}}\r\n{{^notEmpty}}\r\n<p class=\"err-tip\">\r\n\t<span>您的购物车空空如也，</span>\r\n\t<a href=\"./index.html\">立即去购物</a>\r\n</p>\r\n{{/notEmpty}}";

/***/ }),

/***/ "./src/page/common/header/index.css":
/*!******************************************!*\
  !*** ./src/page/common/header/index.css ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/page/common/header/index.js":
/*!*****************************************!*\
  !*** ./src/page/common/header/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
* @Author: 青
* @Date:   2020-03-15 10:10:27
* @Last Modified by:   青
* @Last Modified time: 2020-04-10 15:41:51
*/
__webpack_require__(/*! ./index.css */ "./src/page/common/header/index.css");
var _mm = __webpack_require__(/*! util/mm.js */ "./src/util/mm.js");

// 通用页面头部
var header = {
	init: function() {
		this.onLoad();
		this.bindEvent();
	},
	onLoad: function() {
		console.log('onLoad');

		var keyword = _mm.getUrlParam('keyword');
		// keyword存在，，则回填输入框
		if(keyword){
			$('#search-input').val(keyword);
		};
	},
	bindEvent: function() {
		var _this = this;
		// 点击搜索按钮以后 ，做搜索提交
		$('#search-btn').click(function() {
			_this.searchSubmit();
		});
		$('#search-input').keyup(function(e) {
			// 原生的js键盘码
			if(e.keyCode === 13){
				_this.searchSubmit();
			}
		})
	},
	// 搜索的提交
	searchSubmit: function() {
		var keyword = $.trim($('#search-input').val());
		// 如果提交的时候有keyword，正常跳转到list页
		if(keyword) {
			window.location.href = './list.html?keyword=' + keyword;
		}
		// 如果keyword为空，直接返回首页
		else {
			_mm.doHome();
		}
		console.log(keyword);	
	}
}

header.init();

/***/ }),

/***/ "./src/page/common/nav/index.css":
/*!***************************************!*\
  !*** ./src/page/common/nav/index.css ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/page/common/nav/index.js":
/*!**************************************!*\
  !*** ./src/page/common/nav/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
* @Author: 青
* @Date:   2020-03-14 17:38:47
* @Last Modified by:   青
* @Last Modified time: 2020-04-24 22:16:54
*/
__webpack_require__(/*! ./index.css */ "./src/page/common/nav/index.css");
var _mm = __webpack_require__(/*! util/mm.js */ "./src/util/mm.js");
var _user = __webpack_require__(/*! service/user-service.js */ "./src/service/user-service.js");
var _cart = __webpack_require__(/*! service/cart-service.js */ "./src/service/cart-service.js");

// 导航
var nav = {
	init: function() {
		this.bindEvent();
		this.loadUserInfo();
		this.loadCartCount();
		return this;
	},
	bindEvent: function() {
		// 登录点击事件
		$('.js-login').click(function(){
			_mm.doLogin();
		});
		// 注册点击事件
		$('.js-register').click(function(){
			window.location.href = './user-register.html';
		});
		// 退出点击事件
		$('.js-logout').click(function(){
			_user.logout(function(res){
				window.location.reload();
			}, function(errMsg){
				_mm.errorTips(errMsg);
			})
		});

	},
	// 加载用户信息
	loadUserInfo: function() {
		// console.log('123312312');
		_user.checkLogin(function(res){
			// console.log('登录成功')
			$('.user.not-login').hide().siblings('.user.login').show().find('.username').text(res.username);
		}, function(errMsg) {
			// do nothing
		});
	},
	// 加载购物车数量
	loadCartCount: function(){
		_cart.getCartCount(function(res) {
			$('.nav .cart-count').text(res || 0);
		}, function(errMsg) {
			$('.nav .cart-count').text(0);
		});
	}
};

module.exports = nav.init();

/***/ }),

/***/ "./src/service/cart-service.js":
/*!*************************************!*\
  !*** ./src/service/cart-service.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
* @Author: 青
* @Date:   2020-04-16 17:56:13
* @Last Modified by:   青
* @Last Modified time: 2020-04-24 22:16:38
*/
/*
* @Author: 青
* @Date:   2020-04-10 15:33:18
* @Last Modified by:   青
* @Last Modified time: 2020-04-14 17:59:04
*/
var _mm = __webpack_require__(/*! util/mm.js */ "./src/util/mm.js");

var _cart = {
	// 获取购物车数量
	getCartCount: function(resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/get_cart_product_count.do'),
			success: resolve,
			error: reject
		});
	},
	// 添加到购物车
	addToCart: function(productInfo, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/add.do'),
			data: productInfo,
			success: resolve,
			error: reject
		})
	},
	// 获取购物车列表
	getCartList: function(resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/list.do'),
			success: resolve,
			error: reject
		})
	},
	// 选择购物车商品
	selectProduct:  function(productId, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/select.do'),
			data: {
				productId: productId
			},
			success: resolve,
			error: reject
		})
	},
	// 取消选择购物车商品
	unselectProduct:  function(productId, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/un_select.do'),
			data: {
				productId: productId
			},
			success: resolve,
			error: reject
		})
	},
	// 选中全部商品
	selectAllProduct:  function(resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/select_all.do'),
			success: resolve,
			error: reject
		})
	},
	// 取消选中全部商品
	unselectAllProduct:  function(resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/un_select_all.do'),
			success: resolve,
			error: reject
		})
	},
	// 更新购物车商品数量
	updateProduct: function(productInfo, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/update.do'),
			data: productInfo,
			success: resolve,
			error: reject
		})
	},
	// 删除指定商品
	deleteProduct: function(productIds, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/delete_product.do'),
			data: {
				productIds: productIds
			},
			success: resolve,
			error: reject
		})
	}
}
module.exports = _cart;

/***/ }),

/***/ "./src/service/user-service.js":
/*!*************************************!*\
  !*** ./src/service/user-service.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
* @Author: 青
* @Date:   2020-03-27 09:43:24
* @Last Modified by:   青
* @Last Modified time: 2020-04-17 14:35:08
*/
var _mm = __webpack_require__(/*! util/mm.js */ "./src/util/mm.js");

var _user = {
	// 用户登录
	login: function(userInfo, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/user/login.do'),
			data: userInfo,
			method: 'POST',
			success: resolve,
			error: reject
		})
	},
	// 检查用户名
	checkUsername: function(username, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/user/check_valid.do'),
			data: {
				type: 'username',
				str: username
			},
			method: 'POST',
			success: resolve,
			error: reject
		})
	},
	// 用户注册
	register: function(userInfo, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/user/register.do'),
			data: userInfo,
			method: 'POST',
			success: resolve,
			error: reject
		})
	},
	// 检查登录状态
	checkLogin: function(resolve, reject){
		_mm.request({
			url: _mm.getServerUrl('/user/get_user_info.do'),
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 获取用户密码提示问题
	getQuestion: function(username, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/user/forget_get_question.do'),
			data: {
				username: username
			},
			method: 'POST',
			success: resolve,
			error: reject
		})
	},
	// 检查密码提示问题答案
	checkAnswer: function(userInfo, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/user/forget_check_answer.do'),
			data: userInfo,
			method: 'POST',
			success: resolve,
			error: reject
		})
	},
	// 重置密码
	resetPassword: function(userInfo, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/user/forget_reset_password.do'),
			data: userInfo,
			method: 'POST',
			success: resolve,
			error: reject
		})
	},
	// 获取用户信息
	getUserInfo: function(resolve, reject){
		_mm.request({
			url: _mm.getServerUrl('/user/get_information.do'),
			method: 'POST',
			success: resolve,
			error: reject
		})
	},
	// 更新个人信息
	updateUserInfo: function(userInfo, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/user/update_information.do'),
			data: userInfo,
			method: 'POST',
			success: resolve,
			error: reject
		})
	},
	// 登录状态下更新密码
	updatePassword: function(userInfo, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/user/reset_password.do'),
			data: userInfo,
			method: 'POST',
			success: resolve,
			error: reject
		})
	},
	// 登出
	logout: function(resolve, reject){
		_mm.request({
			url: _mm.getServerUrl('/user/logout.do'),
			method: 'POST',
			success: resolve,
			error: reject
		})
	}
}
module.exports = _user;

/***/ }),

/***/ "./src/util/mm.js":
/*!************************!*\
  !*** ./src/util/mm.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
* @Author: 青
* @Date:   2020-03-09 15:01:01
* @Last Modified by:   青
* @Last Modified time: 2020-04-10 16:20:57
*/
var conf = {
	serverHost: '/api'
}

var Hogan = __webpack_require__(/*! hogan.js */ "./node_modules/hogan.js/lib/hogan.js");

var _mm = {
	// 网络请求
	request: function(param) {
		var _this = this;
		$.ajax({
			type: param.method || 'get',
			url: param.url || '',
			dataType: param.type || 'json',
			data: param.data || '',
			success: function(res) {
				// 请求成功
				if(res.status === 0) {
					typeof param.success === 'function' && param.success(res.data, res.msg);
				}
				// 没有登录状态，需要强制登录
				else if(res.status === 10) {
					_this.doLogin();
				}
				// 请求数据错误
				else if(res.status === 1) {
					typeof param.error === 'function' && param.error(res.msg);
				}
			},
			error: function(err) {
				typeof param.error === 'function' && param.error(err.statusText);
			}
		})
	},
	// 获取服务器地址
	getServerUrl: function(path) {
		return conf.serverHost + path;
	},
	// 获取url参数
	getUrlParam: function(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
		var result = window.location.search.substr(1).match(reg);
		return result ? decodeURIComponent(result[2]) : null;
		// /(^|&)test=([^&]*)(&|$)/
		// return result;
	},
	// 渲染html模板
	renderHtml: function(htmlTemplate, data) {
		var template = Hogan.compile(htmlTemplate),
			result = template.render(data);
		return result;
	},
	// 成功提示
	successTips: function(msg) {
		alert(msg || '操作成功！');
	},
	// 错误提示
	errorTips: function(msg) {
		alert(msg || '错误提示');
	},
	// 字段的验证、支持非空、手机、凹陷处的判断
	validate: function(value , type) {
		var value = $.trim(value);
		// 非空验证
		if('require' === type) {
			return !!value;
		}
		// 手机号验证
		if('phone' === type) {
			return /^1\d{10}$/.test(value);
		}
		// 邮箱格式验证
		if('email' === type) {
			return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value);
		}
	},
	// 统一登录处理
	doLogin: function() {
		window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
	},
	doHome: function() {
		window.location.href = './index.html';
	}
};

module.exports = _mm;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2hvZ2FuLmpzL2xpYi9jb21waWxlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaG9nYW4uanMvbGliL2hvZ2FuLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ob2dhbi5qcy9saWIvdGVtcGxhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2UvY2FydC9pbmRleC5jc3M/MDQ4ZSIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZS9jYXJ0L2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlL2NhcnQvaW5kZXguc3RyaW5nIiwid2VicGFjazovLy8uL3NyYy9wYWdlL2NvbW1vbi9oZWFkZXIvaW5kZXguY3NzPzhlMjgiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2UvY29tbW9uL2hlYWRlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZS9jb21tb24vbmF2L2luZGV4LmNzcz8xMDIxIiwid2VicGFjazovLy8uL3NyYy9wYWdlL2NvbW1vbi9uYXYvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2UvY2FydC1zZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlL3VzZXItc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC9tbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFp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QTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLHVCOzs7Ozs7Ozs7OztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLG1CQUFPLENBQUMsb0NBQVk7O0FBRTlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSx1Qjs7Ozs7Ozs7Ozs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFlBQVksbUJBQU8sQ0FBQyxzREFBVTs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixHQUFHO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLGdFQUFnRSxJQUFJO0FBQ3BFO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQiIsImZpbGUiOiIuL2pzL2NhcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9wYWdlL2NhcnQvaW5kZXguanNcIik7XG4iLCIvKlxuICogIENvcHlyaWdodCAyMDExIFR3aXR0ZXIsIEluYy5cbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbiAoSG9nYW4pIHtcbiAgLy8gU2V0dXAgcmVnZXggIGFzc2lnbm1lbnRzXG4gIC8vIHJlbW92ZSB3aGl0ZXNwYWNlIGFjY29yZGluZyB0byBNdXN0YWNoZSBzcGVjXG4gIHZhciBySXNXaGl0ZXNwYWNlID0gL1xcUy8sXG4gICAgICByUXVvdCA9IC9cXFwiL2csXG4gICAgICByTmV3bGluZSA9ICAvXFxuL2csXG4gICAgICByQ3IgPSAvXFxyL2csXG4gICAgICByU2xhc2ggPSAvXFxcXC9nLFxuICAgICAgckxpbmVTZXAgPSAvXFx1MjAyOC8sXG4gICAgICByUGFyYWdyYXBoU2VwID0gL1xcdTIwMjkvO1xuXG4gIEhvZ2FuLnRhZ3MgPSB7XG4gICAgJyMnOiAxLCAnXic6IDIsICc8JzogMywgJyQnOiA0LFxuICAgICcvJzogNSwgJyEnOiA2LCAnPic6IDcsICc9JzogOCwgJ192JzogOSxcbiAgICAneyc6IDEwLCAnJic6IDExLCAnX3QnOiAxMlxuICB9O1xuXG4gIEhvZ2FuLnNjYW4gPSBmdW5jdGlvbiBzY2FuKHRleHQsIGRlbGltaXRlcnMpIHtcbiAgICB2YXIgbGVuID0gdGV4dC5sZW5ndGgsXG4gICAgICAgIElOX1RFWFQgPSAwLFxuICAgICAgICBJTl9UQUdfVFlQRSA9IDEsXG4gICAgICAgIElOX1RBRyA9IDIsXG4gICAgICAgIHN0YXRlID0gSU5fVEVYVCxcbiAgICAgICAgdGFnVHlwZSA9IG51bGwsXG4gICAgICAgIHRhZyA9IG51bGwsXG4gICAgICAgIGJ1ZiA9ICcnLFxuICAgICAgICB0b2tlbnMgPSBbXSxcbiAgICAgICAgc2VlblRhZyA9IGZhbHNlLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGluZVN0YXJ0ID0gMCxcbiAgICAgICAgb3RhZyA9ICd7eycsXG4gICAgICAgIGN0YWcgPSAnfX0nO1xuXG4gICAgZnVuY3Rpb24gYWRkQnVmKCkge1xuICAgICAgaWYgKGJ1Zi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRva2Vucy5wdXNoKHt0YWc6ICdfdCcsIHRleHQ6IG5ldyBTdHJpbmcoYnVmKX0pO1xuICAgICAgICBidWYgPSAnJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5lSXNXaGl0ZXNwYWNlKCkge1xuICAgICAgdmFyIGlzQWxsV2hpdGVzcGFjZSA9IHRydWU7XG4gICAgICBmb3IgKHZhciBqID0gbGluZVN0YXJ0OyBqIDwgdG9rZW5zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlzQWxsV2hpdGVzcGFjZSA9XG4gICAgICAgICAgKEhvZ2FuLnRhZ3NbdG9rZW5zW2pdLnRhZ10gPCBIb2dhbi50YWdzWydfdiddKSB8fFxuICAgICAgICAgICh0b2tlbnNbal0udGFnID09ICdfdCcgJiYgdG9rZW5zW2pdLnRleHQubWF0Y2gocklzV2hpdGVzcGFjZSkgPT09IG51bGwpO1xuICAgICAgICBpZiAoIWlzQWxsV2hpdGVzcGFjZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXNBbGxXaGl0ZXNwYWNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckxpbmUoaGF2ZVNlZW5UYWcsIG5vTmV3TGluZSkge1xuICAgICAgYWRkQnVmKCk7XG5cbiAgICAgIGlmIChoYXZlU2VlblRhZyAmJiBsaW5lSXNXaGl0ZXNwYWNlKCkpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IGxpbmVTdGFydCwgbmV4dDsgaiA8IHRva2Vucy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGlmICh0b2tlbnNbal0udGV4dCkge1xuICAgICAgICAgICAgaWYgKChuZXh0ID0gdG9rZW5zW2orMV0pICYmIG5leHQudGFnID09ICc+Jykge1xuICAgICAgICAgICAgICAvLyBzZXQgaW5kZW50IHRvIHRva2VuIHZhbHVlXG4gICAgICAgICAgICAgIG5leHQuaW5kZW50ID0gdG9rZW5zW2pdLnRleHQudG9TdHJpbmcoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9rZW5zLnNwbGljZShqLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIW5vTmV3TGluZSkge1xuICAgICAgICB0b2tlbnMucHVzaCh7dGFnOidcXG4nfSk7XG4gICAgICB9XG5cbiAgICAgIHNlZW5UYWcgPSBmYWxzZTtcbiAgICAgIGxpbmVTdGFydCA9IHRva2Vucy5sZW5ndGg7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hhbmdlRGVsaW1pdGVycyh0ZXh0LCBpbmRleCkge1xuICAgICAgdmFyIGNsb3NlID0gJz0nICsgY3RhZyxcbiAgICAgICAgICBjbG9zZUluZGV4ID0gdGV4dC5pbmRleE9mKGNsb3NlLCBpbmRleCksXG4gICAgICAgICAgZGVsaW1pdGVycyA9IHRyaW0oXG4gICAgICAgICAgICB0ZXh0LnN1YnN0cmluZyh0ZXh0LmluZGV4T2YoJz0nLCBpbmRleCkgKyAxLCBjbG9zZUluZGV4KVxuICAgICAgICAgICkuc3BsaXQoJyAnKTtcblxuICAgICAgb3RhZyA9IGRlbGltaXRlcnNbMF07XG4gICAgICBjdGFnID0gZGVsaW1pdGVyc1tkZWxpbWl0ZXJzLmxlbmd0aCAtIDFdO1xuXG4gICAgICByZXR1cm4gY2xvc2VJbmRleCArIGNsb3NlLmxlbmd0aCAtIDE7XG4gICAgfVxuXG4gICAgaWYgKGRlbGltaXRlcnMpIHtcbiAgICAgIGRlbGltaXRlcnMgPSBkZWxpbWl0ZXJzLnNwbGl0KCcgJyk7XG4gICAgICBvdGFnID0gZGVsaW1pdGVyc1swXTtcbiAgICAgIGN0YWcgPSBkZWxpbWl0ZXJzWzFdO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHN0YXRlID09IElOX1RFWFQpIHtcbiAgICAgICAgaWYgKHRhZ0NoYW5nZShvdGFnLCB0ZXh0LCBpKSkge1xuICAgICAgICAgIC0taTtcbiAgICAgICAgICBhZGRCdWYoKTtcbiAgICAgICAgICBzdGF0ZSA9IElOX1RBR19UWVBFO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0ZXh0LmNoYXJBdChpKSA9PSAnXFxuJykge1xuICAgICAgICAgICAgZmlsdGVyTGluZShzZWVuVGFnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnVmICs9IHRleHQuY2hhckF0KGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PSBJTl9UQUdfVFlQRSkge1xuICAgICAgICBpICs9IG90YWcubGVuZ3RoIC0gMTtcbiAgICAgICAgdGFnID0gSG9nYW4udGFnc1t0ZXh0LmNoYXJBdChpICsgMSldO1xuICAgICAgICB0YWdUeXBlID0gdGFnID8gdGV4dC5jaGFyQXQoaSArIDEpIDogJ192JztcbiAgICAgICAgaWYgKHRhZ1R5cGUgPT0gJz0nKSB7XG4gICAgICAgICAgaSA9IGNoYW5nZURlbGltaXRlcnModGV4dCwgaSk7XG4gICAgICAgICAgc3RhdGUgPSBJTl9URVhUO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0YWcpIHtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RhdGUgPSBJTl9UQUc7XG4gICAgICAgIH1cbiAgICAgICAgc2VlblRhZyA9IGk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGFnQ2hhbmdlKGN0YWcsIHRleHQsIGkpKSB7XG4gICAgICAgICAgdG9rZW5zLnB1c2goe3RhZzogdGFnVHlwZSwgbjogdHJpbShidWYpLCBvdGFnOiBvdGFnLCBjdGFnOiBjdGFnLFxuICAgICAgICAgICAgICAgICAgICAgICBpOiAodGFnVHlwZSA9PSAnLycpID8gc2VlblRhZyAtIG90YWcubGVuZ3RoIDogaSArIGN0YWcubGVuZ3RofSk7XG4gICAgICAgICAgYnVmID0gJyc7XG4gICAgICAgICAgaSArPSBjdGFnLmxlbmd0aCAtIDE7XG4gICAgICAgICAgc3RhdGUgPSBJTl9URVhUO1xuICAgICAgICAgIGlmICh0YWdUeXBlID09ICd7Jykge1xuICAgICAgICAgICAgaWYgKGN0YWcgPT0gJ319Jykge1xuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjbGVhblRyaXBsZVN0YWNoZSh0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnVmICs9IHRleHQuY2hhckF0KGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZmlsdGVyTGluZShzZWVuVGFnLCB0cnVlKTtcblxuICAgIHJldHVybiB0b2tlbnM7XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhblRyaXBsZVN0YWNoZSh0b2tlbikge1xuICAgIGlmICh0b2tlbi5uLnN1YnN0cih0b2tlbi5uLmxlbmd0aCAtIDEpID09PSAnfScpIHtcbiAgICAgIHRva2VuLm4gPSB0b2tlbi5uLnN1YnN0cmluZygwLCB0b2tlbi5uLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRyaW0ocykge1xuICAgIGlmIChzLnRyaW0pIHtcbiAgICAgIHJldHVybiBzLnRyaW0oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcy5yZXBsYWNlKC9eXFxzKnxcXHMqJC9nLCAnJyk7XG4gIH1cblxuICBmdW5jdGlvbiB0YWdDaGFuZ2UodGFnLCB0ZXh0LCBpbmRleCkge1xuICAgIGlmICh0ZXh0LmNoYXJBdChpbmRleCkgIT0gdGFnLmNoYXJBdCgwKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAxLCBsID0gdGFnLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKHRleHQuY2hhckF0KGluZGV4ICsgaSkgIT0gdGFnLmNoYXJBdChpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyB0aGUgdGFncyBhbGxvd2VkIGluc2lkZSBzdXBlciB0ZW1wbGF0ZXNcbiAgdmFyIGFsbG93ZWRJblN1cGVyID0geydfdCc6IHRydWUsICdcXG4nOiB0cnVlLCAnJCc6IHRydWUsICcvJzogdHJ1ZX07XG5cbiAgZnVuY3Rpb24gYnVpbGRUcmVlKHRva2Vucywga2luZCwgc3RhY2ssIGN1c3RvbVRhZ3MpIHtcbiAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gW10sXG4gICAgICAgIG9wZW5lciA9IG51bGwsXG4gICAgICAgIHRhaWwgPSBudWxsLFxuICAgICAgICB0b2tlbiA9IG51bGw7XG5cbiAgICB0YWlsID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cbiAgICB3aGlsZSAodG9rZW5zLmxlbmd0aCA+IDApIHtcbiAgICAgIHRva2VuID0gdG9rZW5zLnNoaWZ0KCk7XG5cbiAgICAgIGlmICh0YWlsICYmIHRhaWwudGFnID09ICc8JyAmJiAhKHRva2VuLnRhZyBpbiBhbGxvd2VkSW5TdXBlcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbGxlZ2FsIGNvbnRlbnQgaW4gPCBzdXBlciB0YWcuJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChIb2dhbi50YWdzW3Rva2VuLnRhZ10gPD0gSG9nYW4udGFnc1snJCddIHx8IGlzT3BlbmVyKHRva2VuLCBjdXN0b21UYWdzKSkge1xuICAgICAgICBzdGFjay5wdXNoKHRva2VuKTtcbiAgICAgICAgdG9rZW4ubm9kZXMgPSBidWlsZFRyZWUodG9rZW5zLCB0b2tlbi50YWcsIHN0YWNrLCBjdXN0b21UYWdzKTtcbiAgICAgIH0gZWxzZSBpZiAodG9rZW4udGFnID09ICcvJykge1xuICAgICAgICBpZiAoc3RhY2subGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDbG9zaW5nIHRhZyB3aXRob3V0IG9wZW5lcjogLycgKyB0b2tlbi5uKTtcbiAgICAgICAgfVxuICAgICAgICBvcGVuZXIgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgaWYgKHRva2VuLm4gIT0gb3BlbmVyLm4gJiYgIWlzQ2xvc2VyKHRva2VuLm4sIG9wZW5lci5uLCBjdXN0b21UYWdzKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTmVzdGluZyBlcnJvcjogJyArIG9wZW5lci5uICsgJyB2cy4gJyArIHRva2VuLm4pO1xuICAgICAgICB9XG4gICAgICAgIG9wZW5lci5lbmQgPSB0b2tlbi5pO1xuICAgICAgICByZXR1cm4gaW5zdHJ1Y3Rpb25zO1xuICAgICAgfSBlbHNlIGlmICh0b2tlbi50YWcgPT0gJ1xcbicpIHtcbiAgICAgICAgdG9rZW4ubGFzdCA9ICh0b2tlbnMubGVuZ3RoID09IDApIHx8ICh0b2tlbnNbMF0udGFnID09ICdcXG4nKTtcbiAgICAgIH1cblxuICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2godG9rZW4pO1xuICAgIH1cblxuICAgIGlmIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21pc3NpbmcgY2xvc2luZyB0YWc6ICcgKyBzdGFjay5wb3AoKS5uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5zdHJ1Y3Rpb25zO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNPcGVuZXIodG9rZW4sIHRhZ3MpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRhZ3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodGFnc1tpXS5vID09IHRva2VuLm4pIHtcbiAgICAgICAgdG9rZW4udGFnID0gJyMnO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc0Nsb3NlcihjbG9zZSwgb3BlbiwgdGFncykge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGFncy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICh0YWdzW2ldLmMgPT0gY2xvc2UgJiYgdGFnc1tpXS5vID09IG9wZW4pIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc3RyaW5naWZ5U3Vic3RpdHV0aW9ucyhvYmopIHtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpdGVtcy5wdXNoKCdcIicgKyBlc2Moa2V5KSArICdcIjogZnVuY3Rpb24oYyxwLHQsaSkgeycgKyBvYmpba2V5XSArICd9Jyk7XG4gICAgfVxuICAgIHJldHVybiBcInsgXCIgKyBpdGVtcy5qb2luKFwiLFwiKSArIFwiIH1cIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0cmluZ2lmeVBhcnRpYWxzKGNvZGVPYmopIHtcbiAgICB2YXIgcGFydGlhbHMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gY29kZU9iai5wYXJ0aWFscykge1xuICAgICAgcGFydGlhbHMucHVzaCgnXCInICsgZXNjKGtleSkgKyAnXCI6e25hbWU6XCInICsgZXNjKGNvZGVPYmoucGFydGlhbHNba2V5XS5uYW1lKSArICdcIiwgJyArIHN0cmluZ2lmeVBhcnRpYWxzKGNvZGVPYmoucGFydGlhbHNba2V5XSkgKyBcIn1cIik7XG4gICAgfVxuICAgIHJldHVybiBcInBhcnRpYWxzOiB7XCIgKyBwYXJ0aWFscy5qb2luKFwiLFwiKSArIFwifSwgc3ViczogXCIgKyBzdHJpbmdpZnlTdWJzdGl0dXRpb25zKGNvZGVPYmouc3Vicyk7XG4gIH1cblxuICBIb2dhbi5zdHJpbmdpZnkgPSBmdW5jdGlvbihjb2RlT2JqLCB0ZXh0LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIFwie2NvZGU6IGZ1bmN0aW9uIChjLHAsaSkgeyBcIiArIEhvZ2FuLndyYXBNYWluKGNvZGVPYmouY29kZSkgKyBcIiB9LFwiICsgc3RyaW5naWZ5UGFydGlhbHMoY29kZU9iaikgKyAgXCJ9XCI7XG4gIH1cblxuICB2YXIgc2VyaWFsTm8gPSAwO1xuICBIb2dhbi5nZW5lcmF0ZSA9IGZ1bmN0aW9uKHRyZWUsIHRleHQsIG9wdGlvbnMpIHtcbiAgICBzZXJpYWxObyA9IDA7XG4gICAgdmFyIGNvbnRleHQgPSB7IGNvZGU6ICcnLCBzdWJzOiB7fSwgcGFydGlhbHM6IHt9IH07XG4gICAgSG9nYW4ud2Fsayh0cmVlLCBjb250ZXh0KTtcblxuICAgIGlmIChvcHRpb25zLmFzU3RyaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdHJpbmdpZnkoY29udGV4dCwgdGV4dCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubWFrZVRlbXBsYXRlKGNvbnRleHQsIHRleHQsIG9wdGlvbnMpO1xuICB9XG5cbiAgSG9nYW4ud3JhcE1haW4gPSBmdW5jdGlvbihjb2RlKSB7XG4gICAgcmV0dXJuICd2YXIgdD10aGlzO3QuYihpPWl8fFwiXCIpOycgKyBjb2RlICsgJ3JldHVybiB0LmZsKCk7JztcbiAgfVxuXG4gIEhvZ2FuLnRlbXBsYXRlID0gSG9nYW4uVGVtcGxhdGU7XG5cbiAgSG9nYW4ubWFrZVRlbXBsYXRlID0gZnVuY3Rpb24oY29kZU9iaiwgdGV4dCwgb3B0aW9ucykge1xuICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMubWFrZVBhcnRpYWxzKGNvZGVPYmopO1xuICAgIHRlbXBsYXRlLmNvZGUgPSBuZXcgRnVuY3Rpb24oJ2MnLCAncCcsICdpJywgdGhpcy53cmFwTWFpbihjb2RlT2JqLmNvZGUpKTtcbiAgICByZXR1cm4gbmV3IHRoaXMudGVtcGxhdGUodGVtcGxhdGUsIHRleHQsIHRoaXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgSG9nYW4ubWFrZVBhcnRpYWxzID0gZnVuY3Rpb24oY29kZU9iaikge1xuICAgIHZhciBrZXksIHRlbXBsYXRlID0ge3N1YnM6IHt9LCBwYXJ0aWFsczogY29kZU9iai5wYXJ0aWFscywgbmFtZTogY29kZU9iai5uYW1lfTtcbiAgICBmb3IgKGtleSBpbiB0ZW1wbGF0ZS5wYXJ0aWFscykge1xuICAgICAgdGVtcGxhdGUucGFydGlhbHNba2V5XSA9IHRoaXMubWFrZVBhcnRpYWxzKHRlbXBsYXRlLnBhcnRpYWxzW2tleV0pO1xuICAgIH1cbiAgICBmb3IgKGtleSBpbiBjb2RlT2JqLnN1YnMpIHtcbiAgICAgIHRlbXBsYXRlLnN1YnNba2V5XSA9IG5ldyBGdW5jdGlvbignYycsICdwJywgJ3QnLCAnaScsIGNvZGVPYmouc3Vic1trZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG5cbiAgZnVuY3Rpb24gZXNjKHMpIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKHJTbGFzaCwgJ1xcXFxcXFxcJylcbiAgICAgICAgICAgIC5yZXBsYWNlKHJRdW90LCAnXFxcXFxcXCInKVxuICAgICAgICAgICAgLnJlcGxhY2Uock5ld2xpbmUsICdcXFxcbicpXG4gICAgICAgICAgICAucmVwbGFjZShyQ3IsICdcXFxccicpXG4gICAgICAgICAgICAucmVwbGFjZShyTGluZVNlcCwgJ1xcXFx1MjAyOCcpXG4gICAgICAgICAgICAucmVwbGFjZShyUGFyYWdyYXBoU2VwLCAnXFxcXHUyMDI5Jyk7XG4gIH1cblxuICBmdW5jdGlvbiBjaG9vc2VNZXRob2Qocykge1xuICAgIHJldHVybiAofnMuaW5kZXhPZignLicpKSA/ICdkJyA6ICdmJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVBhcnRpYWwobm9kZSwgY29udGV4dCkge1xuICAgIHZhciBwcmVmaXggPSBcIjxcIiArIChjb250ZXh0LnByZWZpeCB8fCBcIlwiKTtcbiAgICB2YXIgc3ltID0gcHJlZml4ICsgbm9kZS5uICsgc2VyaWFsTm8rKztcbiAgICBjb250ZXh0LnBhcnRpYWxzW3N5bV0gPSB7bmFtZTogbm9kZS5uLCBwYXJ0aWFsczoge319O1xuICAgIGNvbnRleHQuY29kZSArPSAndC5iKHQucnAoXCInICsgIGVzYyhzeW0pICsgJ1wiLGMscCxcIicgKyAobm9kZS5pbmRlbnQgfHwgJycpICsgJ1wiKSk7JztcbiAgICByZXR1cm4gc3ltO1xuICB9XG5cbiAgSG9nYW4uY29kZWdlbiA9IHtcbiAgICAnIyc6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQuY29kZSArPSAnaWYodC5zKHQuJyArIGNob29zZU1ldGhvZChub2RlLm4pICsgJyhcIicgKyBlc2Mobm9kZS5uKSArICdcIixjLHAsMSksJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ2MscCwwLCcgKyBub2RlLmkgKyAnLCcgKyBub2RlLmVuZCArICcsXCInICsgbm9kZS5vdGFnICsgXCIgXCIgKyBub2RlLmN0YWcgKyAnXCIpKXsnICtcbiAgICAgICAgICAgICAgICAgICAgICAndC5ycyhjLHAsJyArICdmdW5jdGlvbihjLHAsdCl7JztcbiAgICAgIEhvZ2FuLndhbGsobm9kZS5ub2RlcywgY29udGV4dCk7XG4gICAgICBjb250ZXh0LmNvZGUgKz0gJ30pO2MucG9wKCk7fSc7XG4gICAgfSxcblxuICAgICdeJzogZnVuY3Rpb24obm9kZSwgY29udGV4dCkge1xuICAgICAgY29udGV4dC5jb2RlICs9ICdpZighdC5zKHQuJyArIGNob29zZU1ldGhvZChub2RlLm4pICsgJyhcIicgKyBlc2Mobm9kZS5uKSArICdcIixjLHAsMSksYyxwLDEsMCwwLFwiXCIpKXsnO1xuICAgICAgSG9nYW4ud2Fsayhub2RlLm5vZGVzLCBjb250ZXh0KTtcbiAgICAgIGNvbnRleHQuY29kZSArPSAnfTsnO1xuICAgIH0sXG5cbiAgICAnPic6IGNyZWF0ZVBhcnRpYWwsXG4gICAgJzwnOiBmdW5jdGlvbihub2RlLCBjb250ZXh0KSB7XG4gICAgICB2YXIgY3R4ID0ge3BhcnRpYWxzOiB7fSwgY29kZTogJycsIHN1YnM6IHt9LCBpblBhcnRpYWw6IHRydWV9O1xuICAgICAgSG9nYW4ud2Fsayhub2RlLm5vZGVzLCBjdHgpO1xuICAgICAgdmFyIHRlbXBsYXRlID0gY29udGV4dC5wYXJ0aWFsc1tjcmVhdGVQYXJ0aWFsKG5vZGUsIGNvbnRleHQpXTtcbiAgICAgIHRlbXBsYXRlLnN1YnMgPSBjdHguc3VicztcbiAgICAgIHRlbXBsYXRlLnBhcnRpYWxzID0gY3R4LnBhcnRpYWxzO1xuICAgIH0sXG5cbiAgICAnJCc6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIHZhciBjdHggPSB7c3Viczoge30sIGNvZGU6ICcnLCBwYXJ0aWFsczogY29udGV4dC5wYXJ0aWFscywgcHJlZml4OiBub2RlLm59O1xuICAgICAgSG9nYW4ud2Fsayhub2RlLm5vZGVzLCBjdHgpO1xuICAgICAgY29udGV4dC5zdWJzW25vZGUubl0gPSBjdHguY29kZTtcbiAgICAgIGlmICghY29udGV4dC5pblBhcnRpYWwpIHtcbiAgICAgICAgY29udGV4dC5jb2RlICs9ICd0LnN1YihcIicgKyBlc2Mobm9kZS5uKSArICdcIixjLHAsaSk7JztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJ1xcbic6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQuY29kZSArPSB3cml0ZSgnXCJcXFxcblwiJyArIChub2RlLmxhc3QgPyAnJyA6ICcgKyBpJykpO1xuICAgIH0sXG5cbiAgICAnX3YnOiBmdW5jdGlvbihub2RlLCBjb250ZXh0KSB7XG4gICAgICBjb250ZXh0LmNvZGUgKz0gJ3QuYih0LnYodC4nICsgY2hvb3NlTWV0aG9kKG5vZGUubikgKyAnKFwiJyArIGVzYyhub2RlLm4pICsgJ1wiLGMscCwwKSkpOyc7XG4gICAgfSxcblxuICAgICdfdCc6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQuY29kZSArPSB3cml0ZSgnXCInICsgZXNjKG5vZGUudGV4dCkgKyAnXCInKTtcbiAgICB9LFxuXG4gICAgJ3snOiB0cmlwbGVTdGFjaGUsXG5cbiAgICAnJic6IHRyaXBsZVN0YWNoZVxuICB9XG5cbiAgZnVuY3Rpb24gdHJpcGxlU3RhY2hlKG5vZGUsIGNvbnRleHQpIHtcbiAgICBjb250ZXh0LmNvZGUgKz0gJ3QuYih0LnQodC4nICsgY2hvb3NlTWV0aG9kKG5vZGUubikgKyAnKFwiJyArIGVzYyhub2RlLm4pICsgJ1wiLGMscCwwKSkpOyc7XG4gIH1cblxuICBmdW5jdGlvbiB3cml0ZShzKSB7XG4gICAgcmV0dXJuICd0LmIoJyArIHMgKyAnKTsnO1xuICB9XG5cbiAgSG9nYW4ud2FsayA9IGZ1bmN0aW9uKG5vZGVsaXN0LCBjb250ZXh0KSB7XG4gICAgdmFyIGZ1bmM7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBub2RlbGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGZ1bmMgPSBIb2dhbi5jb2RlZ2VuW25vZGVsaXN0W2ldLnRhZ107XG4gICAgICBmdW5jICYmIGZ1bmMobm9kZWxpc3RbaV0sIGNvbnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuXG4gIEhvZ2FuLnBhcnNlID0gZnVuY3Rpb24odG9rZW5zLCB0ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgcmV0dXJuIGJ1aWxkVHJlZSh0b2tlbnMsICcnLCBbXSwgb3B0aW9ucy5zZWN0aW9uVGFncyB8fCBbXSk7XG4gIH1cblxuICBIb2dhbi5jYWNoZSA9IHt9O1xuXG4gIEhvZ2FuLmNhY2hlS2V5ID0gZnVuY3Rpb24odGV4dCwgb3B0aW9ucykge1xuICAgIHJldHVybiBbdGV4dCwgISFvcHRpb25zLmFzU3RyaW5nLCAhIW9wdGlvbnMuZGlzYWJsZUxhbWJkYSwgb3B0aW9ucy5kZWxpbWl0ZXJzLCAhIW9wdGlvbnMubW9kZWxHZXRdLmpvaW4oJ3x8Jyk7XG4gIH1cblxuICBIb2dhbi5jb21waWxlID0gZnVuY3Rpb24odGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBrZXkgPSBIb2dhbi5jYWNoZUtleSh0ZXh0LCBvcHRpb25zKTtcbiAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLmNhY2hlW2tleV07XG5cbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgIHZhciBwYXJ0aWFscyA9IHRlbXBsYXRlLnBhcnRpYWxzO1xuICAgICAgZm9yICh2YXIgbmFtZSBpbiBwYXJ0aWFscykge1xuICAgICAgICBkZWxldGUgcGFydGlhbHNbbmFtZV0uaW5zdGFuY2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgdGVtcGxhdGUgPSB0aGlzLmdlbmVyYXRlKHRoaXMucGFyc2UodGhpcy5zY2FuKHRleHQsIG9wdGlvbnMuZGVsaW1pdGVycyksIHRleHQsIG9wdGlvbnMpLCB0ZXh0LCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5jYWNoZVtrZXldID0gdGVtcGxhdGU7XG4gIH1cbn0pKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyA/IGV4cG9ydHMgOiBIb2dhbik7XG4iLCIvKlxuICogIENvcHlyaWdodCAyMDExIFR3aXR0ZXIsIEluYy5cbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8vIFRoaXMgZmlsZSBpcyBmb3IgdXNlIHdpdGggTm9kZS5qcy4gU2VlIGRpc3QvIGZvciBicm93c2VyIGZpbGVzLlxuXG52YXIgSG9nYW4gPSByZXF1aXJlKCcuL2NvbXBpbGVyJyk7XG5Ib2dhbi5UZW1wbGF0ZSA9IHJlcXVpcmUoJy4vdGVtcGxhdGUnKS5UZW1wbGF0ZTtcbkhvZ2FuLnRlbXBsYXRlID0gSG9nYW4uVGVtcGxhdGU7XG5tb2R1bGUuZXhwb3J0cyA9IEhvZ2FuO1xuIiwiLypcbiAqICBDb3B5cmlnaHQgMjAxMSBUd2l0dGVyLCBJbmMuXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG52YXIgSG9nYW4gPSB7fTtcblxuKGZ1bmN0aW9uIChIb2dhbikge1xuICBIb2dhbi5UZW1wbGF0ZSA9IGZ1bmN0aW9uIChjb2RlT2JqLCB0ZXh0LCBjb21waWxlciwgb3B0aW9ucykge1xuICAgIGNvZGVPYmogPSBjb2RlT2JqIHx8IHt9O1xuICAgIHRoaXMuciA9IGNvZGVPYmouY29kZSB8fCB0aGlzLnI7XG4gICAgdGhpcy5jID0gY29tcGlsZXI7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnRleHQgPSB0ZXh0IHx8ICcnO1xuICAgIHRoaXMucGFydGlhbHMgPSBjb2RlT2JqLnBhcnRpYWxzIHx8IHt9O1xuICAgIHRoaXMuc3VicyA9IGNvZGVPYmouc3VicyB8fCB7fTtcbiAgICB0aGlzLmJ1ZiA9ICcnO1xuICB9XG5cbiAgSG9nYW4uVGVtcGxhdGUucHJvdG90eXBlID0ge1xuICAgIC8vIHJlbmRlcjogcmVwbGFjZWQgYnkgZ2VuZXJhdGVkIGNvZGUuXG4gICAgcjogZnVuY3Rpb24gKGNvbnRleHQsIHBhcnRpYWxzLCBpbmRlbnQpIHsgcmV0dXJuICcnOyB9LFxuXG4gICAgLy8gdmFyaWFibGUgZXNjYXBpbmdcbiAgICB2OiBob2dhbkVzY2FwZSxcblxuICAgIC8vIHRyaXBsZSBzdGFjaGVcbiAgICB0OiBjb2VyY2VUb1N0cmluZyxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGNvbnRleHQsIHBhcnRpYWxzLCBpbmRlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJpKFtjb250ZXh0XSwgcGFydGlhbHMgfHwge30sIGluZGVudCk7XG4gICAgfSxcblxuICAgIC8vIHJlbmRlciBpbnRlcm5hbCAtLSBhIGhvb2sgZm9yIG92ZXJyaWRlcyB0aGF0IGNhdGNoZXMgcGFydGlhbHMgdG9vXG4gICAgcmk6IGZ1bmN0aW9uIChjb250ZXh0LCBwYXJ0aWFscywgaW5kZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5yKGNvbnRleHQsIHBhcnRpYWxzLCBpbmRlbnQpO1xuICAgIH0sXG5cbiAgICAvLyBlbnN1cmVQYXJ0aWFsXG4gICAgZXA6IGZ1bmN0aW9uKHN5bWJvbCwgcGFydGlhbHMpIHtcbiAgICAgIHZhciBwYXJ0aWFsID0gdGhpcy5wYXJ0aWFsc1tzeW1ib2xdO1xuXG4gICAgICAvLyBjaGVjayB0byBzZWUgdGhhdCBpZiB3ZSd2ZSBpbnN0YW50aWF0ZWQgdGhpcyBwYXJ0aWFsIGJlZm9yZVxuICAgICAgdmFyIHRlbXBsYXRlID0gcGFydGlhbHNbcGFydGlhbC5uYW1lXTtcbiAgICAgIGlmIChwYXJ0aWFsLmluc3RhbmNlICYmIHBhcnRpYWwuYmFzZSA9PSB0ZW1wbGF0ZSkge1xuICAgICAgICByZXR1cm4gcGFydGlhbC5pbnN0YW5jZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoIXRoaXMuYykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGNvbXBpbGVyIGF2YWlsYWJsZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgdGVtcGxhdGUgPSB0aGlzLmMuY29tcGlsZSh0ZW1wbGF0ZSwgdGhpcy5vcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0ZW1wbGF0ZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gV2UgdXNlIHRoaXMgdG8gY2hlY2sgd2hldGhlciB0aGUgcGFydGlhbHMgZGljdGlvbmFyeSBoYXMgY2hhbmdlZFxuICAgICAgdGhpcy5wYXJ0aWFsc1tzeW1ib2xdLmJhc2UgPSB0ZW1wbGF0ZTtcblxuICAgICAgaWYgKHBhcnRpYWwuc3Vicykge1xuICAgICAgICAvLyBNYWtlIHN1cmUgd2UgY29uc2lkZXIgcGFyZW50IHRlbXBsYXRlIG5vd1xuICAgICAgICBpZiAoIXBhcnRpYWxzLnN0YWNrVGV4dCkgcGFydGlhbHMuc3RhY2tUZXh0ID0ge307XG4gICAgICAgIGZvciAoa2V5IGluIHBhcnRpYWwuc3Vicykge1xuICAgICAgICAgIGlmICghcGFydGlhbHMuc3RhY2tUZXh0W2tleV0pIHtcbiAgICAgICAgICAgIHBhcnRpYWxzLnN0YWNrVGV4dFtrZXldID0gKHRoaXMuYWN0aXZlU3ViICE9PSB1bmRlZmluZWQgJiYgcGFydGlhbHMuc3RhY2tUZXh0W3RoaXMuYWN0aXZlU3ViXSkgPyBwYXJ0aWFscy5zdGFja1RleHRbdGhpcy5hY3RpdmVTdWJdIDogdGhpcy50ZXh0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wbGF0ZSA9IGNyZWF0ZVNwZWNpYWxpemVkUGFydGlhbCh0ZW1wbGF0ZSwgcGFydGlhbC5zdWJzLCBwYXJ0aWFsLnBhcnRpYWxzLFxuICAgICAgICAgIHRoaXMuc3RhY2tTdWJzLCB0aGlzLnN0YWNrUGFydGlhbHMsIHBhcnRpYWxzLnN0YWNrVGV4dCk7XG4gICAgICB9XG4gICAgICB0aGlzLnBhcnRpYWxzW3N5bWJvbF0uaW5zdGFuY2UgPSB0ZW1wbGF0ZTtcblxuICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH0sXG5cbiAgICAvLyB0cmllcyB0byBmaW5kIGEgcGFydGlhbCBpbiB0aGUgY3VycmVudCBzY29wZSBhbmQgcmVuZGVyIGl0XG4gICAgcnA6IGZ1bmN0aW9uKHN5bWJvbCwgY29udGV4dCwgcGFydGlhbHMsIGluZGVudCkge1xuICAgICAgdmFyIHBhcnRpYWwgPSB0aGlzLmVwKHN5bWJvbCwgcGFydGlhbHMpO1xuICAgICAgaWYgKCFwYXJ0aWFsKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhcnRpYWwucmkoY29udGV4dCwgcGFydGlhbHMsIGluZGVudCk7XG4gICAgfSxcblxuICAgIC8vIHJlbmRlciBhIHNlY3Rpb25cbiAgICByczogZnVuY3Rpb24oY29udGV4dCwgcGFydGlhbHMsIHNlY3Rpb24pIHtcbiAgICAgIHZhciB0YWlsID0gY29udGV4dFtjb250ZXh0Lmxlbmd0aCAtIDFdO1xuXG4gICAgICBpZiAoIWlzQXJyYXkodGFpbCkpIHtcbiAgICAgICAgc2VjdGlvbihjb250ZXh0LCBwYXJ0aWFscywgdGhpcyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWlsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnRleHQucHVzaCh0YWlsW2ldKTtcbiAgICAgICAgc2VjdGlvbihjb250ZXh0LCBwYXJ0aWFscywgdGhpcyk7XG4gICAgICAgIGNvbnRleHQucG9wKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIG1heWJlIHN0YXJ0IGEgc2VjdGlvblxuICAgIHM6IGZ1bmN0aW9uKHZhbCwgY3R4LCBwYXJ0aWFscywgaW52ZXJ0ZWQsIHN0YXJ0LCBlbmQsIHRhZ3MpIHtcbiAgICAgIHZhciBwYXNzO1xuXG4gICAgICBpZiAoaXNBcnJheSh2YWwpICYmIHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbCA9IHRoaXMubXModmFsLCBjdHgsIHBhcnRpYWxzLCBpbnZlcnRlZCwgc3RhcnQsIGVuZCwgdGFncyk7XG4gICAgICB9XG5cbiAgICAgIHBhc3MgPSAhIXZhbDtcblxuICAgICAgaWYgKCFpbnZlcnRlZCAmJiBwYXNzICYmIGN0eCkge1xuICAgICAgICBjdHgucHVzaCgodHlwZW9mIHZhbCA9PSAnb2JqZWN0JykgPyB2YWwgOiBjdHhbY3R4Lmxlbmd0aCAtIDFdKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhc3M7XG4gICAgfSxcblxuICAgIC8vIGZpbmQgdmFsdWVzIHdpdGggZG90dGVkIG5hbWVzXG4gICAgZDogZnVuY3Rpb24oa2V5LCBjdHgsIHBhcnRpYWxzLCByZXR1cm5Gb3VuZCkge1xuICAgICAgdmFyIGZvdW5kLFxuICAgICAgICAgIG5hbWVzID0ga2V5LnNwbGl0KCcuJyksXG4gICAgICAgICAgdmFsID0gdGhpcy5mKG5hbWVzWzBdLCBjdHgsIHBhcnRpYWxzLCByZXR1cm5Gb3VuZCksXG4gICAgICAgICAgZG9Nb2RlbEdldCA9IHRoaXMub3B0aW9ucy5tb2RlbEdldCxcbiAgICAgICAgICBjeCA9IG51bGw7XG5cbiAgICAgIGlmIChrZXkgPT09ICcuJyAmJiBpc0FycmF5KGN0eFtjdHgubGVuZ3RoIC0gMl0pKSB7XG4gICAgICAgIHZhbCA9IGN0eFtjdHgubGVuZ3RoIC0gMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZm91bmQgPSBmaW5kSW5TY29wZShuYW1lc1tpXSwgdmFsLCBkb01vZGVsR2V0KTtcbiAgICAgICAgICBpZiAoZm91bmQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY3ggPSB2YWw7XG4gICAgICAgICAgICB2YWwgPSBmb3VuZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsID0gJyc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXR1cm5Gb3VuZCAmJiAhdmFsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZXR1cm5Gb3VuZCAmJiB0eXBlb2YgdmFsID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY3R4LnB1c2goY3gpO1xuICAgICAgICB2YWwgPSB0aGlzLm12KHZhbCwgY3R4LCBwYXJ0aWFscyk7XG4gICAgICAgIGN0eC5wb3AoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9LFxuXG4gICAgLy8gZmluZCB2YWx1ZXMgd2l0aCBub3JtYWwgbmFtZXNcbiAgICBmOiBmdW5jdGlvbihrZXksIGN0eCwgcGFydGlhbHMsIHJldHVybkZvdW5kKSB7XG4gICAgICB2YXIgdmFsID0gZmFsc2UsXG4gICAgICAgICAgdiA9IG51bGwsXG4gICAgICAgICAgZm91bmQgPSBmYWxzZSxcbiAgICAgICAgICBkb01vZGVsR2V0ID0gdGhpcy5vcHRpb25zLm1vZGVsR2V0O1xuXG4gICAgICBmb3IgKHZhciBpID0gY3R4Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHYgPSBjdHhbaV07XG4gICAgICAgIHZhbCA9IGZpbmRJblNjb3BlKGtleSwgdiwgZG9Nb2RlbEdldCk7XG4gICAgICAgIGlmICh2YWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgIHJldHVybiAocmV0dXJuRm91bmQpID8gZmFsc2UgOiBcIlwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJldHVybkZvdW5kICYmIHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YWwgPSB0aGlzLm12KHZhbCwgY3R4LCBwYXJ0aWFscyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWw7XG4gICAgfSxcblxuICAgIC8vIGhpZ2hlciBvcmRlciB0ZW1wbGF0ZXNcbiAgICBsczogZnVuY3Rpb24oZnVuYywgY3gsIHBhcnRpYWxzLCB0ZXh0LCB0YWdzKSB7XG4gICAgICB2YXIgb2xkVGFncyA9IHRoaXMub3B0aW9ucy5kZWxpbWl0ZXJzO1xuXG4gICAgICB0aGlzLm9wdGlvbnMuZGVsaW1pdGVycyA9IHRhZ3M7XG4gICAgICB0aGlzLmIodGhpcy5jdChjb2VyY2VUb1N0cmluZyhmdW5jLmNhbGwoY3gsIHRleHQpKSwgY3gsIHBhcnRpYWxzKSk7XG4gICAgICB0aGlzLm9wdGlvbnMuZGVsaW1pdGVycyA9IG9sZFRhZ3M7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gY29tcGlsZSB0ZXh0XG4gICAgY3Q6IGZ1bmN0aW9uKHRleHQsIGN4LCBwYXJ0aWFscykge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kaXNhYmxlTGFtYmRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTGFtYmRhIGZlYXR1cmVzIGRpc2FibGVkLicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuYy5jb21waWxlKHRleHQsIHRoaXMub3B0aW9ucykucmVuZGVyKGN4LCBwYXJ0aWFscyk7XG4gICAgfSxcblxuICAgIC8vIHRlbXBsYXRlIHJlc3VsdCBidWZmZXJpbmdcbiAgICBiOiBmdW5jdGlvbihzKSB7IHRoaXMuYnVmICs9IHM7IH0sXG5cbiAgICBmbDogZnVuY3Rpb24oKSB7IHZhciByID0gdGhpcy5idWY7IHRoaXMuYnVmID0gJyc7IHJldHVybiByOyB9LFxuXG4gICAgLy8gbWV0aG9kIHJlcGxhY2Ugc2VjdGlvblxuICAgIG1zOiBmdW5jdGlvbihmdW5jLCBjdHgsIHBhcnRpYWxzLCBpbnZlcnRlZCwgc3RhcnQsIGVuZCwgdGFncykge1xuICAgICAgdmFyIHRleHRTb3VyY2UsXG4gICAgICAgICAgY3ggPSBjdHhbY3R4Lmxlbmd0aCAtIDFdLFxuICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuY2FsbChjeCk7XG5cbiAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaWYgKGludmVydGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGV4dFNvdXJjZSA9ICh0aGlzLmFjdGl2ZVN1YiAmJiB0aGlzLnN1YnNUZXh0ICYmIHRoaXMuc3Vic1RleHRbdGhpcy5hY3RpdmVTdWJdKSA/IHRoaXMuc3Vic1RleHRbdGhpcy5hY3RpdmVTdWJdIDogdGhpcy50ZXh0O1xuICAgICAgICAgIHJldHVybiB0aGlzLmxzKHJlc3VsdCwgY3gsIHBhcnRpYWxzLCB0ZXh0U291cmNlLnN1YnN0cmluZyhzdGFydCwgZW5kKSwgdGFncyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgLy8gbWV0aG9kIHJlcGxhY2UgdmFyaWFibGVcbiAgICBtdjogZnVuY3Rpb24oZnVuYywgY3R4LCBwYXJ0aWFscykge1xuICAgICAgdmFyIGN4ID0gY3R4W2N0eC5sZW5ndGggLSAxXTtcbiAgICAgIHZhciByZXN1bHQgPSBmdW5jLmNhbGwoY3gpO1xuXG4gICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN0KGNvZXJjZVRvU3RyaW5nKHJlc3VsdC5jYWxsKGN4KSksIGN4LCBwYXJ0aWFscyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIHN1YjogZnVuY3Rpb24obmFtZSwgY29udGV4dCwgcGFydGlhbHMsIGluZGVudCkge1xuICAgICAgdmFyIGYgPSB0aGlzLnN1YnNbbmFtZV07XG4gICAgICBpZiAoZikge1xuICAgICAgICB0aGlzLmFjdGl2ZVN1YiA9IG5hbWU7XG4gICAgICAgIGYoY29udGV4dCwgcGFydGlhbHMsIHRoaXMsIGluZGVudCk7XG4gICAgICAgIHRoaXMuYWN0aXZlU3ViID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gIH07XG5cbiAgLy9GaW5kIGEga2V5IGluIGFuIG9iamVjdFxuICBmdW5jdGlvbiBmaW5kSW5TY29wZShrZXksIHNjb3BlLCBkb01vZGVsR2V0KSB7XG4gICAgdmFyIHZhbDtcblxuICAgIGlmIChzY29wZSAmJiB0eXBlb2Ygc2NvcGUgPT0gJ29iamVjdCcpIHtcblxuICAgICAgaWYgKHNjb3BlW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YWwgPSBzY29wZVtrZXldO1xuXG4gICAgICAvLyB0cnkgbG9va3VwIHdpdGggZ2V0IGZvciBiYWNrYm9uZSBvciBzaW1pbGFyIG1vZGVsIGRhdGFcbiAgICAgIH0gZWxzZSBpZiAoZG9Nb2RlbEdldCAmJiBzY29wZS5nZXQgJiYgdHlwZW9mIHNjb3BlLmdldCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbCA9IHNjb3BlLmdldChrZXkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVTcGVjaWFsaXplZFBhcnRpYWwoaW5zdGFuY2UsIHN1YnMsIHBhcnRpYWxzLCBzdGFja1N1YnMsIHN0YWNrUGFydGlhbHMsIHN0YWNrVGV4dCkge1xuICAgIGZ1bmN0aW9uIFBhcnRpYWxUZW1wbGF0ZSgpIHt9O1xuICAgIFBhcnRpYWxUZW1wbGF0ZS5wcm90b3R5cGUgPSBpbnN0YW5jZTtcbiAgICBmdW5jdGlvbiBTdWJzdGl0dXRpb25zKCkge307XG4gICAgU3Vic3RpdHV0aW9ucy5wcm90b3R5cGUgPSBpbnN0YW5jZS5zdWJzO1xuICAgIHZhciBrZXk7XG4gICAgdmFyIHBhcnRpYWwgPSBuZXcgUGFydGlhbFRlbXBsYXRlKCk7XG4gICAgcGFydGlhbC5zdWJzID0gbmV3IFN1YnN0aXR1dGlvbnMoKTtcbiAgICBwYXJ0aWFsLnN1YnNUZXh0ID0ge307ICAvL2hlaGUuIHN1YnN0ZXh0LlxuICAgIHBhcnRpYWwuYnVmID0gJyc7XG5cbiAgICBzdGFja1N1YnMgPSBzdGFja1N1YnMgfHwge307XG4gICAgcGFydGlhbC5zdGFja1N1YnMgPSBzdGFja1N1YnM7XG4gICAgcGFydGlhbC5zdWJzVGV4dCA9IHN0YWNrVGV4dDtcbiAgICBmb3IgKGtleSBpbiBzdWJzKSB7XG4gICAgICBpZiAoIXN0YWNrU3Vic1trZXldKSBzdGFja1N1YnNba2V5XSA9IHN1YnNba2V5XTtcbiAgICB9XG4gICAgZm9yIChrZXkgaW4gc3RhY2tTdWJzKSB7XG4gICAgICBwYXJ0aWFsLnN1YnNba2V5XSA9IHN0YWNrU3Vic1trZXldO1xuICAgIH1cblxuICAgIHN0YWNrUGFydGlhbHMgPSBzdGFja1BhcnRpYWxzIHx8IHt9O1xuICAgIHBhcnRpYWwuc3RhY2tQYXJ0aWFscyA9IHN0YWNrUGFydGlhbHM7XG4gICAgZm9yIChrZXkgaW4gcGFydGlhbHMpIHtcbiAgICAgIGlmICghc3RhY2tQYXJ0aWFsc1trZXldKSBzdGFja1BhcnRpYWxzW2tleV0gPSBwYXJ0aWFsc1trZXldO1xuICAgIH1cbiAgICBmb3IgKGtleSBpbiBzdGFja1BhcnRpYWxzKSB7XG4gICAgICBwYXJ0aWFsLnBhcnRpYWxzW2tleV0gPSBzdGFja1BhcnRpYWxzW2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnRpYWw7XG4gIH1cblxuICB2YXIgckFtcCA9IC8mL2csXG4gICAgICByTHQgPSAvPC9nLFxuICAgICAgckd0ID0gLz4vZyxcbiAgICAgIHJBcG9zID0gL1xcJy9nLFxuICAgICAgclF1b3QgPSAvXFxcIi9nLFxuICAgICAgaENoYXJzID0gL1smPD5cXFwiXFwnXS87XG5cbiAgZnVuY3Rpb24gY29lcmNlVG9TdHJpbmcodmFsKSB7XG4gICAgcmV0dXJuIFN0cmluZygodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSA/ICcnIDogdmFsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhvZ2FuRXNjYXBlKHN0cikge1xuICAgIHN0ciA9IGNvZXJjZVRvU3RyaW5nKHN0cik7XG4gICAgcmV0dXJuIGhDaGFycy50ZXN0KHN0cikgP1xuICAgICAgc3RyXG4gICAgICAgIC5yZXBsYWNlKHJBbXAsICcmYW1wOycpXG4gICAgICAgIC5yZXBsYWNlKHJMdCwgJyZsdDsnKVxuICAgICAgICAucmVwbGFjZShyR3QsICcmZ3Q7JylcbiAgICAgICAgLnJlcGxhY2UockFwb3MsICcmIzM5OycpXG4gICAgICAgIC5yZXBsYWNlKHJRdW90LCAnJnF1b3Q7JykgOlxuICAgICAgc3RyO1xuICB9XG5cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKGEpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG59KSh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgPyBleHBvcnRzIDogSG9nYW4pO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLypcclxuKiBAQXV0aG9yOiDpnZJcclxuKiBARGF0ZTogICAyMDIwLTA0LTE4IDExOjE3OjAxXHJcbiogQExhc3QgTW9kaWZpZWQgYnk6ICAg6Z2SXHJcbiogQExhc3QgTW9kaWZpZWQgdGltZTogMjAyMC0wNC0yNyAxMTowMDowNFxyXG4qL1xyXG5yZXF1aXJlKCcuL2luZGV4LmNzcycpO1xyXG5yZXF1aXJlKCdwYWdlL2NvbW1vbi9oZWFkZXIvaW5kZXguanMnKTtcclxudmFyIG5hdiA9IHJlcXVpcmUoJ3BhZ2UvY29tbW9uL25hdi9pbmRleC5qcycpO1xyXG52YXIgX21tID0gcmVxdWlyZSgndXRpbC9tbS5qcycpO1xyXG52YXIgX2NhcnQgPSByZXF1aXJlKCdzZXJ2aWNlL2NhcnQtc2VydmljZS5qcycpO1xyXG52YXIgdGVtcGxhdGVJbmRleCA9IHJlcXVpcmUoJy4vaW5kZXguc3RyaW5nJyk7XHJcblxyXG52YXIgcGFnZSA9IHtcclxuXHRkYXRhOiB7XHJcblx0XHRcclxuXHR9LFxyXG5cdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5vbkxvYWQoKTtcclxuXHRcdHRoaXMuYmluZEV2ZW50KCk7XHJcblx0fSxcclxuXHRvbkxvYWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5sb2FkQ2FydCgpO1xyXG5cdH0sXHJcblx0YmluZEV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBfdGhpcyA9IHRoaXM7XHJcblx0XHQvLyDllYblk4HnmoTpgInmi6kgLyDlj5bmtojpgInmi6lcclxuXHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuY2FydC1zZWxlY3QnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcclxuXHRcdFx0XHRwcm9kdWN0SWQgPSAkdGhpcy5wYXJlbnRzKCcuY2FydC10YWJsZScpLmRhdGEoJ3Byb2R1Y3QtaWQnKTtcclxuXHJcblx0XHRcdC8vIOmAieS4rVxyXG5cdFx0XHRpZigkdGhpcy5pcygnOmNoZWNrZWQnKSkge1xyXG5cdFx0XHRcdF9jYXJ0LnNlbGVjdFByb2R1Y3QocHJvZHVjdElkLCBmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0XHRcdF90aGlzLnJlbmRlckNhcnQocmVzKTtcclxuXHRcdFx0XHR9LCBmdW5jdGlvbihlcnJNc2cpIHtcclxuXHRcdFx0XHRcdF90aGlzLnNob3dDYXJ0RXJyb3IoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyDlj5bmtojpgInkuK1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0X2NhcnQudW5zZWxlY3RQcm9kdWN0KHByb2R1Y3RJZCwgZnVuY3Rpb24ocmVzKSB7XHJcblx0XHRcdFx0XHRfdGhpcy5yZW5kZXJDYXJ0KHJlcyk7XHJcblx0XHRcdFx0fSwgZnVuY3Rpb24oZXJyTXNnKSB7XHJcblx0XHRcdFx0XHRfdGhpcy5zaG93Q2FydEVycm9yKCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1x0XHRcclxuXHRcdC8vIOWVhuWTgeeahOWFqOmAiSAvIOWPlua2iOWFqOmAiVxyXG5cdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5jYXJ0LXNlbGVjdC1hbGwnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHRcdFx0Ly8g6YCJ5LitXHJcblx0XHRcdGlmKCR0aGlzLmlzKCc6Y2hlY2tlZCcpKSB7XHJcblx0XHRcdFx0X2NhcnQuc2VsZWN0QWxsUHJvZHVjdChmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0XHRcdF90aGlzLnJlbmRlckNhcnQocmVzKTtcclxuXHRcdFx0XHR9LCBmdW5jdGlvbihlcnJNc2cpIHtcclxuXHRcdFx0XHRcdF90aGlzLnNob3dDYXJ0RXJyb3IoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyDlj5bmtojpgInkuK1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0X2NhcnQudW5zZWxlY3RBbGxQcm9kdWN0KGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0XHRcdFx0X3RoaXMucmVuZGVyQ2FydChyZXMpO1xyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uKGVyck1zZykge1xyXG5cdFx0XHRcdFx0X3RoaXMuc2hvd0NhcnRFcnJvcigpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdC8vIOWVhuWTgeaVsOmHj+eahOWPmOWMllxyXG5cdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5jb3VudC1idG4nLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcclxuXHRcdFx0XHQkcENvdW50ID0gJHRoaXMuc2libGluZ3MoJy5jb3VudC1pbnB1dCcpLFxyXG5cdFx0XHRcdGN1cnJDb3VudCA9IHBhcnNlSW50KCRwQ291bnQudmFsKCkpLFxyXG5cdFx0XHRcdHR5cGUgPSAkdGhpcy5oYXNDbGFzcygncGx1cycpID8gJ3BsdXMnIDogJ21pbnVzJyxcclxuXHRcdFx0XHRwcm9kdWN0SWQgPSAkdGhpcy5wYXJlbnRzKCcuY2FydC10YWJsZScpLmRhdGEoJ3Byb2R1Y3QtaWQnKSxcclxuXHRcdFx0XHRtaW5Db3VudCA9IDEsXHJcblx0XHRcdFx0bWF4Q291bnQgPSBwYXJzZUludCgkcENvdW50LmRhdGEoJ21heCcpKSxcclxuXHRcdFx0XHRuZXdDb3VudCA9IDA7XHJcblx0XHRcdGlmKHR5cGUgPT09ICdwbHVzJyl7XHJcblx0XHRcdFx0aWYoY3VyckNvdW50ID49IG1heENvdW50KXtcclxuXHRcdFx0XHRcdF9tbS5lcnJvclRpcHMoJ+ivpeWVhuWTgeaVsOmHj+W3sui+vuWIsOS4iumZkCcpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdDb3VudCA9IGN1cnJDb3VudCArIDE7XHJcblx0XHRcdH1lbHNlIGlmKHR5cGUgPT09ICdtaW51cycpIHtcclxuXHRcdFx0XHRpZihjdXJyQ291bnQgPD0gbWluQ291bnQpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3Q291bnQgPSBjdXJyQ291bnQgLSAxO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIOabtOaWsOi0reeJqei9puWVhuWTgeaVsOmHj1xyXG5cdFx0XHRfY2FydC51cGRhdGVQcm9kdWN0KHtcclxuXHRcdFx0XHRwcm9kdWN0SWQ6IHByb2R1Y3RJZCxcclxuXHRcdFx0XHRjb3VudDogbmV3Q291bnRcclxuXHRcdFx0fSwgZnVuY3Rpb24ocmVzKSB7XHJcblx0XHRcdFx0X3RoaXMucmVuZGVyQ2FydChyZXMpO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJNc2cpIHtcclxuXHRcdFx0XHRfdGhpcy5zaG93Q2FydEVycm9yKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0XHQvLyDliKDpmaTljZXkuKrllYblk4FcclxuXHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuY2FydC1kZWxldGUnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYod2luZG93LmNvbmZpcm0oJ+ehruiupOimgeWIoOmZpOivpeWVhuWTge+8nycpKXtcclxuXHRcdFx0XHR2YXIgcHJvZHVjdElkID0gJCh0aGlzKS5wYXJlbnRzKCcuY2FydC10YWJsZScpXHJcblx0XHRcdFx0XHQuZGF0YSgncHJvZHVjdC1pZCcpO1xyXG5cdFx0XHRcdF90aGlzLmRlbGV0ZUNhcnRQcm9kdWN0KHByb2R1Y3RJZCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0Ly8g5Yig6Zmk6YCJ5Lit5ZWG5ZOBXHJcblx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmRlbGV0ZS1zZWxlY3RlZCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZih3aW5kb3cuY29uZmlybSgn56Gu6K6k6KaB5Yig6Zmk6YCJ5Lit55qE5ZWG5ZOB77yfJykpe1xyXG5cdFx0XHRcdHZhciBhcnJQcm9kdWN0SWRzID0gW10sXHJcblx0XHRcdFx0XHQkc2VsZWN0ZWRJdGVtID0gJCgnLmNhcnQtc2VsZWN0OmNoZWNrZWQnKTtcclxuXHRcdFx0XHQvLyDlvqrnjq/mn6Xmib7pgInkuK3nmoRwcm9kdWN0SWRzXHJcblx0XHRcdFx0Zm9yKHZhciBpPTAsaUxlbmd0aD0kc2VsZWN0ZWRJdGVtLmxlbmd0aDsgaTxpTGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdGFyclByb2R1Y3RJZHNcclxuXHRcdFx0XHRcdFx0LnB1c2goJCgkc2VsZWN0ZWRJdGVtW2ldKS5wYXJlbnRzKCcuY2FydC10YWJsZScpLmRhdGEoJ3Byb2R1Y3QtaWQnKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGFyclByb2R1Y3RJZHMubGVuZ3RoKXtcclxuXHRcdFx0XHRcdF90aGlzLmRlbGV0ZUNhcnRQcm9kdWN0KGFyclByb2R1Y3RJZHMuam9pbignLCcpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRfbW0uZXJyb3JUaXBzKCfmgqjov5jmsqHmnInpgInkuK3opoHliKDpmaTnmoTllYblk4EnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0Ly8g5o+Q5Lqk6LSt54mp6L2mXHJcblx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmJ0bi1zdWJtaXQnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8g5oC75Lu35aSn5LqOMO+8jOi/m+ihjOaPkOS6pFxyXG5cdFx0XHRpZihfdGhpcy5kYXRhLmNhcnRJbmZvICYmIF90aGlzLmRhdGEuY2FydEluZm8uY2FydFRvdGFsUHJpY2UgPiAwKSB7XHJcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9vcmRlci1jb25maXJtLmh0bWwnO1xyXG5cdFx0XHR9ZWxzZSB7XHJcblx0XHRcdFx0X21tLmVycm9yVGlwcygn6K+36YCJ5oup5ZWG5ZOB5ZCO5YaN5o+Q5LqkJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Ly8g5Yqg6L296LSt54mp6L2m5L+h5oGvXHJcblx0bG9hZENhcnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIF90aGlzID0gdGhpcztcclxuXHRcdC8vIOiOt+WPlui0reeJqei9puWIl+ihqFxyXG5cdFx0X2NhcnQuZ2V0Q2FydExpc3QoZnVuY3Rpb24ocmVzKSB7XHJcblx0XHRcdF90aGlzLnJlbmRlckNhcnQocmVzKTtcclxuXHRcdH0sIGZ1bmN0aW9uKGVyck1zZykge1xyXG5cdFx0XHRfdGhpcy5zaG93Q2FydEVycm9yKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdC8vIOa4suafk+i0reeJqei9plxyXG5cdHJlbmRlckNhcnQ6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdHRoaXMuZmlsdGVyKGRhdGEpO1xyXG5cdFx0Ly8g57yT5a2Y6LSt54mp6L2m5L+h5oGvXHJcblx0XHR0aGlzLmRhdGEuY2FydEluZm8gPSBkYXRhO1xyXG5cdFx0Ly8g55Sf5oiQSFRNTFxyXG5cdFx0dmFyIGNhcnRIdG1sID0gX21tLnJlbmRlckh0bWwodGVtcGxhdGVJbmRleCwgZGF0YSk7XHJcblx0XHQvLyDmj5LlhaVIVE1MXHJcblx0XHQkKCcucGFnZS13cmFwJykuaHRtbChjYXJ0SHRtbCk7XHJcblx0XHQvLyDpgJrnn6Xlr7zoiKrnmoTotK3nianovabmm7TmlrDmlbDph48o5aKe5YqgL+WIoOmZpOWVhuWTgeaXtuabtOaWsOWvvOiIqm5hdilcclxuXHRcdG5hdi5sb2FkQ2FydENvdW50KCk7XHJcblx0fSxcclxuXHQvLyDliKDpmaTmjIflrprllYblk4HvvIzmlK/mjIHmibnph4/vvIxwcm9kdWN0SWTnlKjpgJflj7fliIblibJcclxuXHRkZWxldGVDYXJ0UHJvZHVjdDogZnVuY3Rpb24ocHJvZHVjdElkcykge1xyXG5cdFx0dmFyIF90aGlzID0gdGhpcztcclxuXHRcdF9jYXJ0LmRlbGV0ZVByb2R1Y3QocHJvZHVjdElkcywgZnVuY3Rpb24ocmVzKSB7XHJcblx0XHRcdF90aGlzLnJlbmRlckNhcnQocmVzKTtcclxuXHRcdH0sIGZ1bmN0aW9uKGVyck1zZykge1xyXG5cdFx0XHRfdGhpcy5zaG93Q2FydEVycm9yKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdC8vIOaVsOaNruWMuemFjVxyXG5cdGZpbHRlcjogZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0ZGF0YS5ub3RFbXB0eSA9ICEhZGF0YS5jYXJ0UHJvZHVjdFZvTGlzdC5sZW5ndGg7XHJcblx0fSxcclxuXHQvLyDmmL7npLrplJnor6/kv6Hmga9cclxuXHRzaG93Q2FydEVycm9yOmZ1bmN0aW9uKCkge1xyXG5cdFx0JCgnLnBhZ2Utd3JhcCcpLmh0bWwoJzxwIGNsYXNzPVwiZXJyLXRpcFwiPuWTqumHjOS4jeWvueS6hu+8jOWIt+aWsOS4i+ivleivleWQp+OAgjwvcD4nKVxyXG5cdH1cclxufVxyXG5cclxuJChmdW5jdGlvbigpIHtcclxuXHRwYWdlLmluaXQoKTtcclxufSkiLCJtb2R1bGUuZXhwb3J0cyA9IFwie3sjbm90RW1wdHl9fVxcclxcbjxkaXYgY2xhc3M9XFxcImNhcnQtaGVhZGVyXFxcIj5cXHJcXG5cXHQ8dGFibGUgY2xhc3M9XFxcImNhcnQtdGFibGVcXFwiPlxcclxcblxcdFxcdDx0cj5cXHJcXG5cXHRcXHRcXHQ8dGggY2xhc3M9XFxcImNhcnQtY2VsbCBjZWxsLWNoZWNrXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHQ8bGFiZWwgY2xhc3M9XFxcImNhcnQtbGFiZWxcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdHt7I2FsbENoZWNrZWR9fVxcclxcblxcdFxcdFxcdFxcdFxcdDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgY2xhc3M9XFxcImNhcnQtc2VsZWN0LWFsbFxcXCIgY2hlY2tlZCAvPlxcclxcblxcdFxcdFxcdFxcdFxcdHt7L2FsbENoZWNrZWR9fVxcclxcblxcdFxcdFxcdFxcdFxcdHt7XmFsbENoZWNrZWR9fVxcclxcblxcdFxcdFxcdFxcdFxcdDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgY2xhc3M9XFxcImNhcnQtc2VsZWN0LWFsbFxcXCIgLz5cXHJcXG5cXHRcXHRcXHRcXHRcXHR7ey9hbGxDaGVja2VkfX1cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8c3Bhbj7lhajpgIk8L3NwYW4+XFxyXFxuXFx0XFx0XFx0XFx0PC9sYWJlbD5cXHJcXG5cXHRcXHRcXHQ8L3RoPlxcclxcblxcdFxcdFxcdDx0aCBjbGFzcz1cXFwiY2FydC1jZWxsIGNlbGwtaW5mb1xcXCI+5ZWG5ZOB5L+h5oGvPC90aD5cXHJcXG5cXHRcXHRcXHQ8dGggY2xhc3M9XFxcImNhcnQtY2VsbCBjZWxsLXByaWNlXFxcIj7ljZXku7c8L3RoPlxcclxcblxcdFxcdFxcdDx0aCBjbGFzcz1cXFwiY2FydC1jZWxsIGNlbGwtY291bnRcXFwiPuaVsOmHjzwvdGg+XFxyXFxuXFx0XFx0XFx0PHRoIGNsYXNzPVxcXCJjYXJ0LWNlbGwgY2VsbC10b3RhbFxcXCI+5ZCI6K6hPC90aD5cXHJcXG5cXHRcXHRcXHQ8dGggY2xhc3M9XFxcImNhcnQtY2VsbCBjZWxsLW9wZWFyXFxcIj7mk43kvZw8L3RoPlxcclxcblxcdFxcdDwvdHI+XFxyXFxuXFx0PC90YWJsZT5cXHJcXG48L2Rpdj5cXHJcXG48ZGl2IGNsYXNzPVxcXCJjYXJ0LWxpc3RcXFwiPlxcclxcblxcdHt7I2NhcnRQcm9kdWN0Vm9MaXN0fX1cXHJcXG5cXHQ8dGFibGUgY2xhc3M9XFxcImNhcnQtdGFibGVcXFwiIGRhdGEtcHJvZHVjdC1pZD1cXFwie3twcm9kdWN0SWR9fVxcXCI+XFxyXFxuXFx0XFx0PHRyPlxcclxcblxcdFxcdFxcdDx0ZCBjbGFzcz1cXFwiY2FydC1jZWxsIGNlbGwtY2hlY2tcXFwiPlxcclxcblxcdFxcdFxcdFxcdDxsYWJlbCBjbGFzcz1cXFwiY2FydC1sYWJlbFxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0XFx0e3sjcHJvZHVjdENoZWNrZWR9fVxcclxcblxcdFxcdFxcdFxcdFxcdDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgY2xhc3M9XFxcImNhcnQtc2VsZWN0XFxcIiBjaGVja2VkIC8+XFxyXFxuXFx0XFx0XFx0XFx0XFx0e3svcHJvZHVjdENoZWNrZWR9fVxcclxcblxcdFxcdFxcdFxcdFxcdHt7XnByb2R1Y3RDaGVja2VkfX1cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGNsYXNzPVxcXCJjYXJ0LXNlbGVjdFxcXCIgLz5cXHJcXG5cXHRcXHRcXHRcXHRcXHR7ey9wcm9kdWN0Q2hlY2tlZH19XFxyXFxuXFx0XFx0XFx0XFx0PC9sYWJlbD5cXHJcXG5cXHRcXHRcXHQ8L3RkPlxcclxcblxcdFxcdFxcdDx0ZCBjbGFzcz1cXFwiY2FydC1jZWxsIGNlbGwtaW1nXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHQ8YSBjbGFzcz1cXFwibGlua1xcXCIgaHJlZj1cXFwiLi9kZXRhaWwuaHRtbD9wcm9kdWN0SWQ9e3twcm9kdWN0SWR9fVxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0XFx0PGltZyBjbGFzcz1cXFwicC1pbWdcXFwiIHNyYz1cXFwie3tpbWFnZUhvc3R9fXt7cHJvZHVjdE1haW5JbWFnZX19XFxcIiBhbHQ9XFxcInt7cHJvZHVjdE5hbWV9fVxcXCIgLz5cXHJcXG5cXHRcXHRcXHRcXHQ8L2E+XFxyXFxuXFx0XFx0XFx0PC90ZD5cXHJcXG5cXHRcXHRcXHQ8dGQgY2xhc3M9XFxcImNhcnQtY2VsbCBjZWxsLWluZm9cXFwiPlxcclxcblxcdFxcdFxcdFxcdDxhIGNsYXNzPVxcXCJsaW5rXFxcIiBocmVmPVxcXCIuL2RldGFpbC5odG1sP3Byb2R1Y3RJZD17e3Byb2R1Y3RJZH19XFxcIj57e3Byb2R1Y3ROYW1lfX08L2E+XFxyXFxuXFx0XFx0XFx0PC90ZD5cXHJcXG5cXHRcXHRcXHQ8dGQgY2xhc3M9XFxcImNhcnQtY2VsbCBjZWxsLXByaWNlXFxcIj7vv6V7e3Byb2R1Y3RQcmljZX19PC90ZD5cXHJcXG5cXHRcXHRcXHQ8dGQgY2xhc3M9XFxcImNhcnQtY2VsbCBjZWxsLWNvdW50XFxcIj5cXHJcXG5cXHRcXHRcXHRcXHQ8c3BhbiBjbGFzcz1cXFwiY291bnQtYnRuIG1pbnVzXFxcIj4tPC9zcGFuPlxcclxcblxcdFxcdFxcdFxcdDxpbnB1dCBjbGFzcz1cXFwiY291bnQtaW5wdXRcXFwiIHZhbHVlPVxcXCJ7e3F1YW50aXR5fX1cXFwiIGRhdGEtbWF4PVxcXCJ7e3Byb2R1Y3RTdG9ja319XFxcIiAvPlxcclxcblxcdFxcdFxcdFxcdDxzcGFuIGNsYXNzPVxcXCJjb3VudC1idG4gcGx1c1xcXCI+Kzwvc3Bhbj5cXHJcXG5cXHRcXHRcXHQ8L3RkPlxcclxcblxcdFxcdFxcdDx0ZCBjbGFzcz1cXFwiY2FydC1jZWxsIGNlbGwtdG90YWxcXFwiPu+/pXt7cHJvZHVjdFRvdGFsUHJpY2V9fTwvdGQ+XFxyXFxuXFx0XFx0XFx0PHRkIGNsYXNzPVxcXCJjYXJ0LWNlbGwgY2VsbC1vcGVhclxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0PHNwYW4gY2xhc3M9XFxcImxpbmsgY2FydC1kZWxldGVcXFwiPuWIoOmZpDwvc3Bhbj5cXHJcXG5cXHRcXHRcXHQ8L3RkPlxcclxcblxcdFxcdDwvdHI+XFxyXFxuXFx0PC90YWJsZT5cXHJcXG5cXHR7ey9jYXJ0UHJvZHVjdFZvTGlzdH19XFxyXFxuPC9kaXY+XFxyXFxuPGRpdiBjbGFzcz1cXFwiY2FydC1mb290ZXJcXFwiPlxcclxcblxcdDxkaXYgY2xhc3M9XFxcInNlbGVjdC1jb25cXFwiPlxcclxcblxcdFxcdDxsYWJlbD5cXHJcXG5cXHRcXHRcXHR7eyNhbGxDaGVja2VkfX1cXHJcXG5cXHRcXHRcXHQ8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGNsYXNzPVxcXCJjYXJ0LXNlbGVjdC1hbGxcXFwiIGNoZWNrZWQgLz5cXHJcXG5cXHRcXHRcXHR7ey9hbGxDaGVja2VkfX1cXHJcXG5cXHRcXHRcXHR7e15hbGxDaGVja2VkfX1cXHJcXG5cXHRcXHRcXHQ8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGNsYXNzPVxcXCJjYXJ0LXNlbGVjdC1hbGxcXFwiIC8+XFxyXFxuXFx0XFx0XFx0e3svYWxsQ2hlY2tlZH19XFxyXFxuXFx0XFx0XFx0PHNwYW4+5YWo6YCJPC9zcGFuPlxcclxcblxcdFxcdDwvbGFiZWw+XFxyXFxuXFx0PC9kaXY+XFxyXFxuXFx0PGRpdiBjbGFzcz1cXFwiZGVsZXRlLWNvblxcXCI+XFxyXFxuXFx0XFx0PHNwYW4gY2xhc3M9XFxcImxpbmsgZGVsZXRlLXNlbGVjdGVkXFxcIj5cXHJcXG5cXHRcXHRcXHQ8aSBjbGFzcz1cXFwiZmEgZmEtdHJhc2gtYWx0XFxcIj48L2k+XFxyXFxuXFx0XFx0XFx0PHNwYW4+5Yig6Zmk6YCJ5LitPC9zcGFuPlxcclxcblxcdFxcdDwvc3Bhbj5cXHJcXG5cXHQ8L2Rpdj5cXHJcXG5cXHQ8ZGl2IGNsYXNzPVxcXCJzdWJtaXQtY29uXFxcIj5cXHJcXG5cXHRcXHQ8c3Bhbj7mgLvku7fvvJo8L3NwYW4+XFxyXFxuXFx0XFx0PHNwYW4gY2xhc3M9XFxcInN1Ym1pdC10b3RhbFxcXCI+77+le3tjYXJ0VG90YWxQcmljZX19PC9zcGFuPlxcclxcblxcdFxcdDxzcGFuIGNsYXNzPVxcXCJidG4gYnRuLXN1Ym1pdFxcXCI+5Y6757uT566XPC9zcGFuPlxcclxcblxcdDwvZGl2PlxcclxcbjwvZGl2Plxcclxcbnt7L25vdEVtcHR5fX1cXHJcXG57e15ub3RFbXB0eX19XFxyXFxuPHAgY2xhc3M9XFxcImVyci10aXBcXFwiPlxcclxcblxcdDxzcGFuPuaCqOeahOi0reeJqei9puepuuepuuWmguS5n++8jDwvc3Bhbj5cXHJcXG5cXHQ8YSBocmVmPVxcXCIuL2luZGV4Lmh0bWxcXFwiPueri+WNs+WOu+i0reeJqTwvYT5cXHJcXG48L3A+XFxyXFxue3svbm90RW1wdHl9fVwiOyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIi8qXHJcbiogQEF1dGhvcjog6Z2SXHJcbiogQERhdGU6ICAgMjAyMC0wMy0xNSAxMDoxMDoyN1xyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIOmdklxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMjAtMDQtMTAgMTU6NDE6NTFcclxuKi9cclxucmVxdWlyZSgnLi9pbmRleC5jc3MnKTtcclxudmFyIF9tbSA9IHJlcXVpcmUoJ3V0aWwvbW0uanMnKTtcclxuXHJcbi8vIOmAmueUqOmhtemdouWktOmDqFxyXG52YXIgaGVhZGVyID0ge1xyXG5cdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5vbkxvYWQoKTtcclxuXHRcdHRoaXMuYmluZEV2ZW50KCk7XHJcblx0fSxcclxuXHRvbkxvYWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Y29uc29sZS5sb2coJ29uTG9hZCcpO1xyXG5cclxuXHRcdHZhciBrZXl3b3JkID0gX21tLmdldFVybFBhcmFtKCdrZXl3b3JkJyk7XHJcblx0XHQvLyBrZXl3b3Jk5a2Y5Zyo77yM77yM5YiZ5Zue5aGr6L6T5YWl5qGGXHJcblx0XHRpZihrZXl3b3JkKXtcclxuXHRcdFx0JCgnI3NlYXJjaC1pbnB1dCcpLnZhbChrZXl3b3JkKTtcclxuXHRcdH07XHJcblx0fSxcclxuXHRiaW5kRXZlbnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIF90aGlzID0gdGhpcztcclxuXHRcdC8vIOeCueWHu+aQnOe0ouaMiemSruS7peWQjiDvvIzlgZrmkJzntKLmj5DkuqRcclxuXHRcdCQoJyNzZWFyY2gtYnRuJykuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHRcdF90aGlzLnNlYXJjaFN1Ym1pdCgpO1xyXG5cdFx0fSk7XHJcblx0XHQkKCcjc2VhcmNoLWlucHV0Jykua2V5dXAoZnVuY3Rpb24oZSkge1xyXG5cdFx0XHQvLyDljp/nlJ/nmoRqc+mUruebmOeggVxyXG5cdFx0XHRpZihlLmtleUNvZGUgPT09IDEzKXtcclxuXHRcdFx0XHRfdGhpcy5zZWFyY2hTdWJtaXQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdC8vIOaQnOe0oueahOaPkOS6pFxyXG5cdHNlYXJjaFN1Ym1pdDogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIga2V5d29yZCA9ICQudHJpbSgkKCcjc2VhcmNoLWlucHV0JykudmFsKCkpO1xyXG5cdFx0Ly8g5aaC5p6c5o+Q5Lqk55qE5pe25YCZ5pyJa2V5d29yZO+8jOato+W4uOi3s+i9rOWIsGxpc3TpobVcclxuXHRcdGlmKGtleXdvcmQpIHtcclxuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9saXN0Lmh0bWw/a2V5d29yZD0nICsga2V5d29yZDtcclxuXHRcdH1cclxuXHRcdC8vIOWmguaenGtleXdvcmTkuLrnqbrvvIznm7TmjqXov5Tlm57pppbpobVcclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRfbW0uZG9Ib21lKCk7XHJcblx0XHR9XHJcblx0XHRjb25zb2xlLmxvZyhrZXl3b3JkKTtcdFxyXG5cdH1cclxufVxyXG5cclxuaGVhZGVyLmluaXQoKTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvKlxyXG4qIEBBdXRob3I6IOmdklxyXG4qIEBEYXRlOiAgIDIwMjAtMDMtMTQgMTc6Mzg6NDdcclxuKiBATGFzdCBNb2RpZmllZCBieTogICDpnZJcclxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDIwLTA0LTI0IDIyOjE2OjU0XHJcbiovXHJcbnJlcXVpcmUoJy4vaW5kZXguY3NzJyk7XHJcbnZhciBfbW0gPSByZXF1aXJlKCd1dGlsL21tLmpzJyk7XHJcbnZhciBfdXNlciA9IHJlcXVpcmUoJ3NlcnZpY2UvdXNlci1zZXJ2aWNlLmpzJyk7XHJcbnZhciBfY2FydCA9IHJlcXVpcmUoJ3NlcnZpY2UvY2FydC1zZXJ2aWNlLmpzJyk7XHJcblxyXG4vLyDlr7zoiKpcclxudmFyIG5hdiA9IHtcclxuXHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuYmluZEV2ZW50KCk7XHJcblx0XHR0aGlzLmxvYWRVc2VySW5mbygpO1xyXG5cdFx0dGhpcy5sb2FkQ2FydENvdW50KCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cdGJpbmRFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyDnmbvlvZXngrnlh7vkuovku7ZcclxuXHRcdCQoJy5qcy1sb2dpbicpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRcdF9tbS5kb0xvZ2luKCk7XHJcblx0XHR9KTtcclxuXHRcdC8vIOazqOWGjOeCueWHu+S6i+S7tlxyXG5cdFx0JCgnLmpzLXJlZ2lzdGVyJykuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi91c2VyLXJlZ2lzdGVyLmh0bWwnO1xyXG5cdFx0fSk7XHJcblx0XHQvLyDpgIDlh7rngrnlh7vkuovku7ZcclxuXHRcdCQoJy5qcy1sb2dvdXQnKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHRfdXNlci5sb2dvdXQoZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVyck1zZyl7XHJcblx0XHRcdFx0X21tLmVycm9yVGlwcyhlcnJNc2cpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSk7XHJcblxyXG5cdH0sXHJcblx0Ly8g5Yqg6L2955So5oi35L+h5oGvXHJcblx0bG9hZFVzZXJJbmZvOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCcxMjMzMTIzMTInKTtcclxuXHRcdF91c2VyLmNoZWNrTG9naW4oZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ+eZu+W9leaIkOWKnycpXHJcblx0XHRcdCQoJy51c2VyLm5vdC1sb2dpbicpLmhpZGUoKS5zaWJsaW5ncygnLnVzZXIubG9naW4nKS5zaG93KCkuZmluZCgnLnVzZXJuYW1lJykudGV4dChyZXMudXNlcm5hbWUpO1xyXG5cdFx0fSwgZnVuY3Rpb24oZXJyTXNnKSB7XHJcblx0XHRcdC8vIGRvIG5vdGhpbmdcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Ly8g5Yqg6L296LSt54mp6L2m5pWw6YePXHJcblx0bG9hZENhcnRDb3VudDogZnVuY3Rpb24oKXtcclxuXHRcdF9jYXJ0LmdldENhcnRDb3VudChmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0JCgnLm5hdiAuY2FydC1jb3VudCcpLnRleHQocmVzIHx8IDApO1xyXG5cdFx0fSwgZnVuY3Rpb24oZXJyTXNnKSB7XHJcblx0XHRcdCQoJy5uYXYgLmNhcnQtY291bnQnKS50ZXh0KDApO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuYXYuaW5pdCgpOyIsIi8qXHJcbiogQEF1dGhvcjog6Z2SXHJcbiogQERhdGU6ICAgMjAyMC0wNC0xNiAxNzo1NjoxM1xyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIOmdklxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMjAtMDQtMjQgMjI6MTY6MzhcclxuKi9cclxuLypcclxuKiBAQXV0aG9yOiDpnZJcclxuKiBARGF0ZTogICAyMDIwLTA0LTEwIDE1OjMzOjE4XHJcbiogQExhc3QgTW9kaWZpZWQgYnk6ICAg6Z2SXHJcbiogQExhc3QgTW9kaWZpZWQgdGltZTogMjAyMC0wNC0xNCAxNzo1OTowNFxyXG4qL1xyXG52YXIgX21tID0gcmVxdWlyZSgndXRpbC9tbS5qcycpO1xyXG5cclxudmFyIF9jYXJ0ID0ge1xyXG5cdC8vIOiOt+WPlui0reeJqei9puaVsOmHj1xyXG5cdGdldENhcnRDb3VudDogZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL2NhcnQvZ2V0X2NhcnRfcHJvZHVjdF9jb3VudC5kbycpLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdC8vIOa3u+WKoOWIsOi0reeJqei9plxyXG5cdGFkZFRvQ2FydDogZnVuY3Rpb24ocHJvZHVjdEluZm8sIHJlc29sdmUsIHJlamVjdCkge1xyXG5cdFx0X21tLnJlcXVlc3Qoe1xyXG5cdFx0XHR1cmw6IF9tbS5nZXRTZXJ2ZXJVcmwoJy9jYXJ0L2FkZC5kbycpLFxyXG5cdFx0XHRkYXRhOiBwcm9kdWN0SW5mbyxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdC8vIOiOt+WPlui0reeJqei9puWIl+ihqFxyXG5cdGdldENhcnRMaXN0OiBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvY2FydC9saXN0LmRvJyksXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDpgInmi6notK3nianovabllYblk4FcclxuXHRzZWxlY3RQcm9kdWN0OiAgZnVuY3Rpb24ocHJvZHVjdElkLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvY2FydC9zZWxlY3QuZG8nKSxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdHByb2R1Y3RJZDogcHJvZHVjdElkXHJcblx0XHRcdH0sXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDlj5bmtojpgInmi6notK3nianovabllYblk4FcclxuXHR1bnNlbGVjdFByb2R1Y3Q6ICBmdW5jdGlvbihwcm9kdWN0SWQsIHJlc29sdmUsIHJlamVjdCkge1xyXG5cdFx0X21tLnJlcXVlc3Qoe1xyXG5cdFx0XHR1cmw6IF9tbS5nZXRTZXJ2ZXJVcmwoJy9jYXJ0L3VuX3NlbGVjdC5kbycpLFxyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0cHJvZHVjdElkOiBwcm9kdWN0SWRcclxuXHRcdFx0fSxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdC8vIOmAieS4reWFqOmDqOWVhuWTgVxyXG5cdHNlbGVjdEFsbFByb2R1Y3Q6ICBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvY2FydC9zZWxlY3RfYWxsLmRvJyksXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDlj5bmtojpgInkuK3lhajpg6jllYblk4FcclxuXHR1bnNlbGVjdEFsbFByb2R1Y3Q6ICBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvY2FydC91bl9zZWxlY3RfYWxsLmRvJyksXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDmm7TmlrDotK3nianovabllYblk4HmlbDph49cclxuXHR1cGRhdGVQcm9kdWN0OiBmdW5jdGlvbihwcm9kdWN0SW5mbywgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL2NhcnQvdXBkYXRlLmRvJyksXHJcblx0XHRcdGRhdGE6IHByb2R1Y3RJbmZvLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5Yig6Zmk5oyH5a6a5ZWG5ZOBXHJcblx0ZGVsZXRlUHJvZHVjdDogZnVuY3Rpb24ocHJvZHVjdElkcywgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL2NhcnQvZGVsZXRlX3Byb2R1Y3QuZG8nKSxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdHByb2R1Y3RJZHM6IHByb2R1Y3RJZHNcclxuXHRcdFx0fSxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSlcclxuXHR9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBfY2FydDsiLCIvKlxyXG4qIEBBdXRob3I6IOmdklxyXG4qIEBEYXRlOiAgIDIwMjAtMDMtMjcgMDk6NDM6MjRcclxuKiBATGFzdCBNb2RpZmllZCBieTogICDpnZJcclxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDIwLTA0LTE3IDE0OjM1OjA4XHJcbiovXHJcbnZhciBfbW0gPSByZXF1aXJlKCd1dGlsL21tLmpzJyk7XHJcblxyXG52YXIgX3VzZXIgPSB7XHJcblx0Ly8g55So5oi355m75b2VXHJcblx0bG9naW46IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9sb2dpbi5kbycpLFxyXG5cdFx0XHRkYXRhOiB1c2VySW5mbyxcclxuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDmo4Dmn6XnlKjmiLflkI1cclxuXHRjaGVja1VzZXJuYW1lOiBmdW5jdGlvbih1c2VybmFtZSwgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvY2hlY2tfdmFsaWQuZG8nKSxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdHR5cGU6ICd1c2VybmFtZScsXHJcblx0XHRcdFx0c3RyOiB1c2VybmFtZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRtZXRob2Q6ICdQT1NUJyxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdC8vIOeUqOaIt+azqOWGjFxyXG5cdHJlZ2lzdGVyOiBmdW5jdGlvbih1c2VySW5mbywgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvcmVnaXN0ZXIuZG8nKSxcclxuXHRcdFx0ZGF0YTogdXNlckluZm8sXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5qOA5p+l55m75b2V54q25oCBXHJcblx0Y2hlY2tMb2dpbjogZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9nZXRfdXNlcl9pbmZvLmRvJyksXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdC8vIOiOt+WPlueUqOaIt+WvhueggeaPkOekuumXrumimFxyXG5cdGdldFF1ZXN0aW9uOiBmdW5jdGlvbih1c2VybmFtZSwgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvZm9yZ2V0X2dldF9xdWVzdGlvbi5kbycpLFxyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0dXNlcm5hbWU6IHVzZXJuYW1lXHJcblx0XHRcdH0sXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5qOA5p+l5a+G56CB5o+Q56S66Zeu6aKY562U5qGIXHJcblx0Y2hlY2tBbnN3ZXI6IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9mb3JnZXRfY2hlY2tfYW5zd2VyLmRvJyksXHJcblx0XHRcdGRhdGE6IHVzZXJJbmZvLFxyXG5cdFx0XHRtZXRob2Q6ICdQT1NUJyxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdC8vIOmHjee9ruWvhueggVxyXG5cdHJlc2V0UGFzc3dvcmQ6IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9mb3JnZXRfcmVzZXRfcGFzc3dvcmQuZG8nKSxcclxuXHRcdFx0ZGF0YTogdXNlckluZm8sXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g6I635Y+W55So5oi35L+h5oGvXHJcblx0Z2V0VXNlckluZm86IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvZ2V0X2luZm9ybWF0aW9uLmRvJyksXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5pu05paw5Liq5Lq65L+h5oGvXHJcblx0dXBkYXRlVXNlckluZm86IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci91cGRhdGVfaW5mb3JtYXRpb24uZG8nKSxcclxuXHRcdFx0ZGF0YTogdXNlckluZm8sXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g55m75b2V54q25oCB5LiL5pu05paw5a+G56CBXHJcblx0dXBkYXRlUGFzc3dvcmQ6IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9yZXNldF9wYXNzd29yZC5kbycpLFxyXG5cdFx0XHRkYXRhOiB1c2VySW5mbyxcclxuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDnmbvlh7pcclxuXHRsb2dvdXQ6IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvbG9nb3V0LmRvJyksXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IF91c2VyOyIsIi8qXHJcbiogQEF1dGhvcjog6Z2SXHJcbiogQERhdGU6ICAgMjAyMC0wMy0wOSAxNTowMTowMVxyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIOmdklxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMjAtMDQtMTAgMTY6MjA6NTdcclxuKi9cclxudmFyIGNvbmYgPSB7XHJcblx0c2VydmVySG9zdDogJy9hcGknXHJcbn1cclxuXHJcbnZhciBIb2dhbiA9IHJlcXVpcmUoJ2hvZ2FuLmpzJyk7XHJcblxyXG52YXIgX21tID0ge1xyXG5cdC8vIOe9kee7nOivt+axglxyXG5cdHJlcXVlc3Q6IGZ1bmN0aW9uKHBhcmFtKSB7XHJcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xyXG5cdFx0JC5hamF4KHtcclxuXHRcdFx0dHlwZTogcGFyYW0ubWV0aG9kIHx8ICdnZXQnLFxyXG5cdFx0XHR1cmw6IHBhcmFtLnVybCB8fCAnJyxcclxuXHRcdFx0ZGF0YVR5cGU6IHBhcmFtLnR5cGUgfHwgJ2pzb24nLFxyXG5cdFx0XHRkYXRhOiBwYXJhbS5kYXRhIHx8ICcnLFxyXG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0XHQvLyDor7fmsYLmiJDlip9cclxuXHRcdFx0XHRpZihyZXMuc3RhdHVzID09PSAwKSB7XHJcblx0XHRcdFx0XHR0eXBlb2YgcGFyYW0uc3VjY2VzcyA9PT0gJ2Z1bmN0aW9uJyAmJiBwYXJhbS5zdWNjZXNzKHJlcy5kYXRhLCByZXMubXNnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8g5rKh5pyJ55m75b2V54q25oCB77yM6ZyA6KaB5by65Yi255m75b2VXHJcblx0XHRcdFx0ZWxzZSBpZihyZXMuc3RhdHVzID09PSAxMCkge1xyXG5cdFx0XHRcdFx0X3RoaXMuZG9Mb2dpbigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyDor7fmsYLmlbDmja7plJnor69cclxuXHRcdFx0XHRlbHNlIGlmKHJlcy5zdGF0dXMgPT09IDEpIHtcclxuXHRcdFx0XHRcdHR5cGVvZiBwYXJhbS5lcnJvciA9PT0gJ2Z1bmN0aW9uJyAmJiBwYXJhbS5lcnJvcihyZXMubXNnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGVycm9yOiBmdW5jdGlvbihlcnIpIHtcclxuXHRcdFx0XHR0eXBlb2YgcGFyYW0uZXJyb3IgPT09ICdmdW5jdGlvbicgJiYgcGFyYW0uZXJyb3IoZXJyLnN0YXR1c1RleHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g6I635Y+W5pyN5Yqh5Zmo5Zyw5Z2AXHJcblx0Z2V0U2VydmVyVXJsOiBmdW5jdGlvbihwYXRoKSB7XHJcblx0XHRyZXR1cm4gY29uZi5zZXJ2ZXJIb3N0ICsgcGF0aDtcclxuXHR9LFxyXG5cdC8vIOiOt+WPlnVybOWPguaVsFxyXG5cdGdldFVybFBhcmFtOiBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHR2YXIgcmVnID0gbmV3IFJlZ0V4cCgnKF58JiknICsgbmFtZSArICc9KFteJl0qKSgmfCQpJyk7XHJcblx0XHR2YXIgcmVzdWx0ID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSkubWF0Y2gocmVnKTtcclxuXHRcdHJldHVybiByZXN1bHQgPyBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0WzJdKSA6IG51bGw7XHJcblx0XHQvLyAvKF58Jil0ZXN0PShbXiZdKikoJnwkKS9cclxuXHRcdC8vIHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHQvLyDmuLLmn5NodG1s5qih5p2/XHJcblx0cmVuZGVySHRtbDogZnVuY3Rpb24oaHRtbFRlbXBsYXRlLCBkYXRhKSB7XHJcblx0XHR2YXIgdGVtcGxhdGUgPSBIb2dhbi5jb21waWxlKGh0bWxUZW1wbGF0ZSksXHJcblx0XHRcdHJlc3VsdCA9IHRlbXBsYXRlLnJlbmRlcihkYXRhKTtcclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHQvLyDmiJDlip/mj5DnpLpcclxuXHRzdWNjZXNzVGlwczogZnVuY3Rpb24obXNnKSB7XHJcblx0XHRhbGVydChtc2cgfHwgJ+aTjeS9nOaIkOWKn++8gScpO1xyXG5cdH0sXHJcblx0Ly8g6ZSZ6K+v5o+Q56S6XHJcblx0ZXJyb3JUaXBzOiBmdW5jdGlvbihtc2cpIHtcclxuXHRcdGFsZXJ0KG1zZyB8fCAn6ZSZ6K+v5o+Q56S6Jyk7XHJcblx0fSxcclxuXHQvLyDlrZfmrrXnmoTpqozor4HjgIHmlK/mjIHpnZ7nqbrjgIHmiYvmnLrjgIHlh7npmbflpITnmoTliKTmlq1cclxuXHR2YWxpZGF0ZTogZnVuY3Rpb24odmFsdWUgLCB0eXBlKSB7XHJcblx0XHR2YXIgdmFsdWUgPSAkLnRyaW0odmFsdWUpO1xyXG5cdFx0Ly8g6Z2e56m66aqM6K+BXHJcblx0XHRpZigncmVxdWlyZScgPT09IHR5cGUpIHtcclxuXHRcdFx0cmV0dXJuICEhdmFsdWU7XHJcblx0XHR9XHJcblx0XHQvLyDmiYvmnLrlj7fpqozor4FcclxuXHRcdGlmKCdwaG9uZScgPT09IHR5cGUpIHtcclxuXHRcdFx0cmV0dXJuIC9eMVxcZHsxMH0kLy50ZXN0KHZhbHVlKTtcclxuXHRcdH1cclxuXHRcdC8vIOmCrueuseagvOW8j+mqjOivgVxyXG5cdFx0aWYoJ2VtYWlsJyA9PT0gdHlwZSkge1xyXG5cdFx0XHRyZXR1cm4gL14oW0EtWmEtejAtOV9cXC1cXC5dKStcXEAoW0EtWmEtejAtOV9cXC1cXC5dKStcXC4oW0EtWmEtel17Miw0fSkkLy50ZXN0KHZhbHVlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdC8vIOe7n+S4gOeZu+W9leWkhOeQhlxyXG5cdGRvTG9naW46IGZ1bmN0aW9uKCkge1xyXG5cdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi91c2VyLWxvZ2luLmh0bWw/cmVkaXJlY3Q9JyArIGVuY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24uaHJlZik7XHJcblx0fSxcclxuXHRkb0hvbWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9pbmRleC5odG1sJztcclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IF9tbTsiXSwic291cmNlUm9vdCI6IiJ9