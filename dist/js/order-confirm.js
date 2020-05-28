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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/page/order-confirm/index.js");
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

/***/ "./src/page/order-confirm/address-list.string":
/*!****************************************************!*\
  !*** ./src/page/order-confirm/address-list.string ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "{{#list}}\r\n{{#isActive}}\r\n<div class=\"address-item active\" data-id=\"{{id}}\">\r\n{{/isActive}}\r\n{{^isActive}}\r\n<div class=\"address-item\" data-id=\"{{id}}\">\r\n{{/isActive}}\r\n\t<div class=\"address-title\">\r\n\t\t{{receiverCity}} {{receiverProvince}} （ {{receiverName}} 收）\r\n\t</div>\r\n\t<div class=\"address-detail\">\r\n\t\t{{receiverAddress}} {{receiverPhone}}\r\n\t</div>\r\n\t<div class=\"address-opera\">\r\n\t\t<span class=\"link address-update\">编辑</span>\r\n\t\t<span class=\"link address-delete\">删除</span>\r\n\t</div>\r\n</div>\r\n{{/list}}\r\n\r\n<div class=\"address-add\">\r\n\t<div class=\"address-new\">\r\n\t\t<i class=\"fa fa-plus\"></i>\r\n\t\t<div class=\"text\">使用新地址</div>\r\n\t</div>\r\n</div>\r\n";

/***/ }),

/***/ "./src/page/order-confirm/address-modal.js":
/*!*************************************************!*\
  !*** ./src/page/order-confirm/address-modal.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
* @Author: 青
* @Date:   2020-04-29 16:36:52
* @Last Modified by:   青
* @Last Modified time: 2020-05-09 16:29:21
*/
/*
* @Author: 青
* @Date:   2020-04-27 10:57:06
* @Last Modified by:   青
* @Last Modified time: 2020-04-29 16:37:52
*/
var _mm = __webpack_require__(/*! util/mm.js */ "./src/util/mm.js");
var _cities = __webpack_require__(/*! util/cities/index.js */ "./src/util/cities/index.js");
var _address = __webpack_require__(/*! service/address-service.js */ "./src/service/address-service.js");
var templateAddress = __webpack_require__(/*! ./address-modal.string */ "./src/page/order-confirm/address-modal.string");

var addressModal = {
	show: function(option) {
		// option的绑定
		this.option = option;
		this.option.data = option.data || {};
		this.$modalWrap = $('.modal-wrap');
		// 渲染页面
		this.loadModal();
		// 绑定事件
		this.bindEvent();
	},
	loadModal: function() {
		var addressModalHtml = _mm.renderHtml(templateAddress, {
			isUpdate: this.option.isUpdate,
			data: this.option.data
		});
		this.$modalWrap.html(addressModalHtml);
		// 加载省份
		this.loadProvince();
	},
	// 加载省份信息
	loadProvince: function() {
		var provinces = _cities.getProvinces() || [],
			$provinceSelect = this.$modalWrap.find('#receiver-province');
		$provinceSelect.html(this.getSelectOption(provinces));
		// 如果是更新地址，并且有省份信息，做省份的回填
		if(this.option.isUpdate && this.option.data.receiverProvince){
			$provinceSelect.val(this.option.data.receiverProvince);
			this.loadCities(this.option.data.receiverProvince);

		}
	},
	// 加载城市信息
	loadCities: function(provinceName) {
		var cities = _cities.getCities(provinceName) || [],
			$citySelect = this.$modalWrap.find('#receiver-city');
		$citySelect.html(this.getSelectOption(cities));

		// 如果是更新地址，并且有城市信息，做城市的回填
		// ？？？
		if(this.option.isUpdate && this.option.data.receiverCity && this.option.data.receiverProvince === provinceName){
			$citySelect.val(this.option.data.receiverCity);
		}
	},
	// 获取select框的选项，输入：array，输出：HTML
	getSelectOption: function(optionArray) {
		var html = '<option value="">请选择</option>'
		for(var i=0,length=optionArray.length; i<length; i++){
			html += '<option value="' + optionArray[i] + '">' + optionArray[i] + '</option>'
		}
		return html;
	},
	bindEvent: function() {
		var _this = this;
		// 省份和城市的二级联动
		this.$modalWrap.find('#receiver-province').change(function() {
			var selectedProvince = $(this).val();
			_this.loadCities(selectedProvince);
		});
		// 提交收货地址
		this.$modalWrap.find('.address-btn').click(function() {
			var receiverInfo = _this.getReceiverInfo(),
				isUpdate = _this.option.isUpdate;

			// 使用新地址，且验证通过
			if(!isUpdate && receiverInfo.status){
				_address.save(receiverInfo.data, function(res) {
					_mm.successTips('地址添加成功');
					_this.hide();
					typeof _this.option.onSuccess === 'function'
						&& _this.option.onSuccess(res)
				}, function(errMsg) {
					_mm.errorTips(errMsg);
				});
			}
			// 更新收件人，并且验证通过
			else if(isUpdate && receiverInfo.status){
				_address.update(receiverInfo.data, function(res) {
					_mm.successTips('地址修改成功');
					_this.hide();
					typeof _this.option.onSuccess === 'function'
						&& _this.option.onSuccess(res)
				}, function(errMsg) {
					_mm.errorTips(errMsg);
				});
			}
			// 验证不通过
			else {
				_mm.errorTips(receiverInfo.errMsg || '好像哪里不对了~');
			}
		});
		// 保证点击modal内容区的时候，不关闭弹窗
		this.$modalWrap.find('.modal-container').click(function(e) {
			e.stopPropagation();
		});
		// 点击叉号或者蒙版区域，关闭弹窗
		this.$modalWrap.find('.close').click(function() {
			_this.hide();
		});
	},
	// 加载表单里收件人信息，并做表单的验证
	getReceiverInfo: function() {
		var receiverInfo 	= {},
			result 			= {
				status: false
			};

		receiverInfo.receiverName 		= $.trim(this.$modalWrap.find('#receiver-name').val());
		receiverInfo.receiverProvince 	= this.$modalWrap.find('#receiver-province').val();
		receiverInfo.receiverCity 		= this.$modalWrap.find('#receiver-city').val();
		receiverInfo.receiverAddress 	= $.trim(this.$modalWrap.find('#receiver-address').val());
		receiverInfo.receiverMobile 		= $.trim(this.$modalWrap.find('#receiver-phone').val());
		receiverInfo.receiverZip 		= $.trim(this.$modalWrap.find('#receiver-zip').val());
		console.log(receiverInfo);

		if(this.option.isUpdate) {
			receiverInfo.id 			= this.$modalWrap.find('#receiver-id').val();
		}
		// 表单验证
		if(!receiverInfo.receiverName) {
			result.errMsg = '请输入收件人姓名';
		}
		else if (!receiverInfo.receiverProvince) {
			result.errMsg = '请选择收件人所在省份';
		}
		else if (!receiverInfo.receiverCity) {
			result.errMsg = '请选择收件人所在城市';
		}
		else if (!receiverInfo.receiverAddress) {
			result.errMsg = '请输入收件人详细地址';
		}
		else if (!receiverInfo.receiverMobile) {
			result.errMsg = '请输入收件人手机号';
		}
		// 所有验证都通过了
		else {
			result.status 	= true;
			result.data 	= receiverInfo;
		}
		return result;

	},
	// 关闭弹窗
	hide: function() {
		this.$modalWrap.empty();
	}
}
module.exports = addressModal;

/***/ }),

/***/ "./src/page/order-confirm/address-modal.string":
/*!*****************************************************!*\
  !*** ./src/page/order-confirm/address-modal.string ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"modal close\">\r\n\t<div class=\"modal-container\">\r\n\t\t<div class=\"modal-header\">\r\n\t\t\t{{#isUpdate}}\r\n\t\t\t<h1 class=\"modal-title\">更新地址</h1>\r\n\t\t\t{{/isUpdate}}\r\n\t\t\t{{^isUpdate}}\r\n\t\t\t<h1 class=\"modal-title\">使用新地址</h1>\r\n\t\t\t{{/isUpdate}}\r\n\t\t\t<i class=\"fa fa-times close\"></i>\r\n\t\t</div>\r\n\t\t<div class=\"modal-body\">\r\n\t\t\t<div class=\"form\">\r\n\t\t\t\t<div class=\"form-line\">\r\n\t\t\t\t\t<label class=\"label\" for=\"receiver-name\">\r\n\t\t\t\t\t\t<span class=\"required\">*</span>\r\n\t\t\t\t\t\t收件人姓名：\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<input class=\"form-item\" id=\"receiver-name\" placeholder=\"请输入收件人姓名\" value=\"{{data.receiverName}}\" />\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"form-line\">\r\n\t\t\t\t\t<label class=\"label\" for=\"receiver-province\">\r\n\t\t\t\t\t\t<span class=\"required\">*</span>\r\n\t\t\t\t\t\t所在城市：\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<select class=\"form-item\" id=\"receiver-province\">\r\n\t\t\t\t\t\t<option value=\"\">请选择</option>\r\n\t\t\t\t\t</select>\r\n\t\t\t\t\t<select class=\"form-item\" id=\"receiver-city\">\r\n\t\t\t\t\t\t<option value=\"\">请选择</option>\r\n\t\t\t\t\t</select>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"form-line\">\r\n\t\t\t\t\t<label class=\"label\" for=\"receiver-address\">\r\n\t\t\t\t\t\t<span class=\"required\">*</span>\r\n\t\t\t\t\t\t详细地址：\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<input class=\"form-item\" id=\"receiver-address\" placeholder=\"请精确到门牌号\" value=\"{{data.receiverAddress}}\" />\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"form-line\">\r\n\t\t\t\t\t<label class=\"label\" for=\"receiver-phone\">\r\n\t\t\t\t\t\t<span class=\"required\">*</span>\r\n\t\t\t\t\t\t收件人手机：\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<input class=\"form-item\" id=\"receiver-phone\" placeholder=\"请输入收件人姓名\" value=\"{{data.receiverPhone}}\" />\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"form-line\">\r\n\t\t\t\t\t<label class=\"label\" for=\"receiver-zip\">\r\n\t\t\t\t\t\t邮政编码：\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<input class=\"form-item\" id=\"receiver-zip\" placeholder=\"如：100000\" value=\"{{data.receiverZip}}\" />\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"form-line\">\r\n\t\t\t\t\t<input type=\"hidden\" id=\"receiver-id\" value=\"{{data.id}}\" />\r\n\t\t\t\t\t<a class=\"btn address-btn\">保存收货地址</a>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n";

/***/ }),

/***/ "./src/page/order-confirm/index.css":
/*!******************************************!*\
  !*** ./src/page/order-confirm/index.css ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/page/order-confirm/index.js":
/*!*****************************************!*\
  !*** ./src/page/order-confirm/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
* @Author: 青
* @Date:   2020-04-27 10:57:06
* @Last Modified by:   青
* @Last Modified time: 2020-04-30 19:25:12
*/
__webpack_require__(/*! ./index.css */ "./src/page/order-confirm/index.css");
__webpack_require__(/*! page/common/header/index.js */ "./src/page/common/header/index.js");
__webpack_require__(/*! page/common/nav/index.js */ "./src/page/common/nav/index.js");
var _mm = __webpack_require__(/*! util/mm.js */ "./src/util/mm.js");
var _order = __webpack_require__(/*! service/order-service.js */ "./src/service/order-service.js");
var _address = __webpack_require__(/*! service/address-service.js */ "./src/service/address-service.js");
var templateAddress = __webpack_require__(/*! ./address-list.string */ "./src/page/order-confirm/address-list.string");
var templateProduct = __webpack_require__(/*! ./product-list.string */ "./src/page/order-confirm/product-list.string");
var addressModal = __webpack_require__(/*! ./address-modal.js */ "./src/page/order-confirm/address-modal.js");

var page = {
	data: {
		selectedAddressId: null
	},
	init: function() {
		this.onLoad();
		this.bindEvent();
	},
	onLoad: function() {
		this.loadAddressList();
		this.loadProductList();
	},
	bindEvent: function() {
		var _this = this;
		// 地址的选择
		$(document).on('click', '.address-item', function() {
			$(this).addClass('active')
				.siblings('.address-item').removeClass('active');
			_this.data.selectedAddressId = $(this).data('id');
		});
		// 订单的提交
		$(document).on('click', '.order-submit', function() {
			var shippingId = _this.data.selectedAddressId;
			if(shippingId){
				_order.createOrder({
					shippingId: shippingId
				}, function(res) {
					window.location.href = './payment.html?orderNumber=' + res.orderNo;
				}, function(errMsg) {
					_mm.errorTips(errMsg);
				});
			}
			else {
				_mm.errorTips('请选择地址后再提交');
			}
		});
		// 地址的添加
		$(document).on('click', '.address-add', function(e) {
			addressModal.show({
				isUpdate: false,
				onSuccess: function() {
					_this.loadAddressList();
				}
			});
		});
		// 地址的编辑
		$(document).on('click', '.address-update', function(e) {
			e.stopPropagation();
			var shippingId = $(this).parents('.address-item').data('id');
			_address.getAddress(shippingId, function(res) {
				addressModal.show({
					isUpdate: true,
					data: res,
					onSuccess: function() {
						_this.loadAddressList();
					}
				});
			}, function(errMsg) {
				_mm.errorTips(errMsg);
			});
		});
		// 地址的删除
		$(document).on('click', '.address-delete', function(e) {
			e.stopPropagation();
			var id = $(this).parents('.address-item').data('id');
			if(window.confirm('确认要删除该地址？')){
				_address.deleteAddress(id, function(res) {
					_this.loadAddressList();
				}, function(errMsg) {
					_mm.errorTips(errMsg);
				});
			}
		});
	},
	// 加载地址列表
	loadAddressList: function() {
		var _this = this;
		$('.address-con').html('<div class="loading"></div>');
		// 获取地址列表
		_address.getAddressList(function(res) {
			_this.addressFilter(res);
			var addressListHtml = _mm.renderHtml(templateAddress, res);
			$('.address-con').html(addressListHtml);
		}, function(errMsg) {
			$('.address-con').html('<p class="err-tip">地址加载失败，请刷新后重试</p>')
		});
	},
	// 获取地址列表中选中状态
	addressFilter: function(data) {
		if(this.data.selectedAddressId) {
			var selectAddressIdFlag = false;
			for(var i=0,length=data.list.length; i<length; i++) {
				if(data.list[i].id === this.data.selectedAddressId) {
					data.list[i].isActive = true;
					selectAddressIdFlag = true;
				}
			}
			// 如果以前选中的地址不在列表里，将其删除
			if(!selectAddressIdFlag) {
				this.data.selectedAddressId = null;
			}
		}
	},
	// 加载商品清单
	loadProductList: function() {
		var _this = this;
		$('.product-con').html('<div class="loading"></div>');
		// 获取地址列表
		_order.getProductList(function(res) {
			var productListHtml = _mm.renderHtml(templateProduct, res);
			$('.product-con').html(productListHtml);
		}, function(errMsg) {
			$('.product-con').html('<p class="err-tip">商品信息加载失败，请刷新后重试</p>')
		});
	}
}

$(function() {
	page.init();
})

/***/ }),

/***/ "./src/page/order-confirm/product-list.string":
/*!****************************************************!*\
  !*** ./src/page/order-confirm/product-list.string ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<table class=\"product-table\">\r\n\t<tr>\r\n\t\t<th class=\"cell-img\">&nbsp;</th>\r\n\t\t<th class=\"cell-info\">商品描述</th>\r\n\t\t<th class=\"cell-price\">价格</th>\r\n\t\t<th class=\"cell-count\">数量</th>\r\n\t\t<th class=\"cell-total\">小计</th>\r\n\t</tr>\r\n\r\n\t{{#orderItemVoList}}\r\n\t<tr>\r\n\t\t<td class=\"cell-img\">\r\n\t\t\t<a href=\"./detail.html?productId={{productId}}\" target=\"_blank\">\r\n\t\t\t\t<img class=\"p-img\" src=\"{{imageHost}}{{productImage}}\" alt=\"{{productName}}\">\r\n\t\t\t</a>\r\n\t\t</td>\r\n\t\t<td class=\"cell-info\">\r\n\t\t\t<a class=\"link\" href=\"./detail.html?productId={{productId}}\" target=\"_blank\">{{productName}}</a>\r\n\t\t</td>\r\n\t\t<td class=\"cell-price\">￥{{currentUnitPrice}}</td>\r\n\t\t<td class=\"cell-count\">{{quantity}}</td>\r\n\t\t<td class=\"cell-total\">￥{{totalPrice}}</td>\r\n\t</tr>\r\n\t{{/orderItemVoList}}\r\n</table>\r\n<div class=\"submit-con\">\r\n\t<span>订单总价：</span>\r\n\t<span class=\"submit-total\">￥{{productTotalPrice}}</span>\r\n\t<span class=\"btn order-submit\">提交订单</span>\r\n</div>\r\n";

/***/ }),

/***/ "./src/service/address-service.js":
/*!****************************************!*\
  !*** ./src/service/address-service.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
* @Author: 青
* @Date:   2020-04-28 11:32:07
* @Last Modified by:   青
* @Last Modified time: 2020-04-30 18:56:20
*/
var _mm = __webpack_require__(/*! util/mm.js */ "./src/util/mm.js");

var _mm = __webpack_require__(/*! util/mm.js */ "./src/util/mm.js");

var _address = {
	// 获取地址列表
	getAddressList: function(resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/shipping/list.do'),
			data: {
				pageSize: 50
			},
			success: resolve,
			error: reject
		});
	},
	// 新建收件人
	save: function(addressInfo, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/shipping/add.do'),
			data: addressInfo,
			success: resolve,
			error: reject
		});
	},
	// 更新收件人
	update: function(addressInfo, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/shipping/update.do'),
			data: addressInfo,
			success: resolve,
			error: reject
		});
	},
	// 删除收件人
	deleteAddress: function(shippingId, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/shipping/del.do'),
			data: {
				shippingId: shippingId
			},
			success: resolve,
			error: reject
		});
	},
	// 获取单条收件人信息
	getAddress: function(shippingId, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/shipping/select.do'),
			data: {
				shippingId: shippingId
			},
			success: resolve,
			error: reject
		});
	}
}
module.exports = _address;

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

/***/ "./src/service/order-service.js":
/*!**************************************!*\
  !*** ./src/service/order-service.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
* @Author: 青
* @Date:   2020-04-27 11:00:51
* @Last Modified by:   青
* @Last Modified time: 2020-05-09 17:28:57
*/
var _mm = __webpack_require__(/*! util/mm.js */ "./src/util/mm.js");

var _order = {
	// 获取商品列表
	getProductList: function(resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/order/get_order_cart_product.do'),
			success: resolve,
			error: reject
		})
	},
	// 提交订单
	createOrder: function(orderInfo, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/order/create.do'),
			data: orderInfo,
			success: resolve,
			error: reject
		})
	},
	// 获取订单列表
	getOrderList: function(listParam, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/order/list.do'),
			data: listParam,
			success: resolve,
			error: reject
		})
	},
	// 获取订单详情
	getOrderDetail: function(orderNumber, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/order/detail.do'),
			data: {
				orderNo: orderNumber
			},
			success: resolve,
			error: reject
		})
	},
	// 取消订单
	cancelOrder: function(orderNumber, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/order/cancel.do'),
			data: {
				orderNo: orderNumber
			},
			success: resolve,
			error: reject
		})
	}
}
module.exports = _order;

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

/***/ "./src/util/cities/index.js":
/*!**********************************!*\
  !*** ./src/util/cities/index.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
* @Author: 青
* @Date:   2020-04-29 17:46:50
* @Last Modified by:   青
* @Last Modified time: 2020-04-29 18:15:56
*/

var _cities = {
	cityInfo: {
		'北京': ['北京'],
		'上海': ['上海'],
		'天津': ['天津'],
		'重庆': ['重庆'],
		'河北省': ['石家庄', '张家口', '承德', '秦皇岛', '唐山', '廊坊', '保定', '沧州', '衡水', '邢台', '邯郸'],
		'山西省': ['太原', '大同', '朔州', '阳泉', '长治', '晋城', '忻州', '吕梁', '晋中', '临汾', '运城'],
		'辽宁省': ['沈阳', '朝阳', '阜新', '铁岭', '抚顺', '本溪', '辽阳', '鞍山', '丹东', '大连', '营口', '盘锦', '锦州', '葫芦岛'],
		'吉林省': ['长春', '白城', '松原', '吉林', '四平', '辽源', '通化', '白山', '延边'],
		'黑龙江省': ['哈尔滨', '齐齐哈尔', '黑河', '大庆', '伊春', '鹤岗', '佳木斯', '双鸭山', '七台河', '鸡西', '牡丹江', '绥化', '大兴安'],
		'江苏省': ['南京', '徐州', '连云港', '宿迁', '淮阴', '盐城', '扬州', '泰州', '南通', '镇江', '常州', '无锡', '苏州'],
		'浙江省': ['杭州', '湖州', '嘉兴', '舟山', '宁波', '绍兴', '金华', '台州', '温州', '丽水'],
		'安徽省': ['合肥', '宿州', '淮北', '阜阳', '蚌埠', '淮南', '滁州', '马鞍山', '芜湖', '铜陵', '安庆', '黄山', '六安', '巢湖', '池州', '宣城'],
		'福建省': ['福州', '南平', '三明', '莆田', '泉州', '厦门', '漳州', '龙岩', '宁德'],
		'江西省': ['南昌', '九江', '景德镇', '鹰潭', '新余', '萍乡', '赣州', '上饶', '抚州', '宜春', '吉安'],
		'山东省': ['济南', '聊城', '德州', '东营', '淄博', '潍坊', '烟台', '威海', '青岛', '日照', '临沂', '枣庄', '济宁', '泰安', '莱芜', '滨州', '菏泽'],
		'河南省': ['郑州', '三门峡', '洛阳', '焦作', '新乡', '鹤壁', '安阳', '濮阳', '开封', '商丘', '许昌', '漯河', '平顶山', '南阳', '信阳', '周口', '驻马店'],
		'湖北省': ['武汉', '十堰', '襄攀', '荆门', '孝感', '黄冈', '鄂州', '黄石', '咸宁', '荆州', '宜昌', '恩施', '襄樊'],
		'湖南省': ['长沙', '张家界', '常德', '益阳', '岳阳', '株洲', '湘潭', '衡阳', '郴州', '永州', '邵阳', '怀化', '娄底', '湘西'],
		'广东省': ['广州', '清远', '韶关', '河源', '梅州', '潮州', '汕头', '揭阳', '汕尾', '惠州', '东莞', '深圳', '珠海', '江门', '佛山', '肇庆', '云浮', '阳江', '茂名', '湛江'],
		'海南省': ['海口', '三亚'],
		'四川省': ['成都', '广元', '绵阳', '德阳', '南充', '广安', '遂宁', '内江', '乐山', '自贡', '泸州', '宜宾', '攀枝花', '巴中', '达川', '资阳', '眉山', '雅安', '阿坝', '甘孜', '凉山'],
		'贵州省': ['贵阳', '六盘水', '遵义', '毕节', '铜仁', '安顺', '黔东南', '黔南', '黔西南'],
		'云南省': ['昆明', '曲靖', '玉溪', '丽江', '昭通', '思茅', '临沧', '保山', '德宏', '怒江', '迪庆', '大理', '楚雄', '红河', '文山', '西双版纳'],
		'陕西省': ['西安', '延安', '铜川', '渭南', '咸阳', '宝鸡', '汉中', '榆林', '商洛', '安康'],
		'甘肃省': ['兰州', '嘉峪关', '金昌', '白银', '天水', '酒泉', '张掖', '武威', '庆阳', '平凉', '定西', '陇南', '临夏', '甘南'],
		'青海省': ['西宁', '海东', '西宁', '海北', '海南', '黄南', '果洛', '玉树', '海西'],
		'内蒙古': ['呼和浩特', '包头', '乌海', '赤峰', '呼伦贝尔盟', '兴安盟', '哲里木盟', '锡林郭勒盟', '乌兰察布盟', '鄂尔多斯', '巴彦淖尔盟', '阿拉善盟'],
		'广西': ['南宁', '桂林', '柳州', '梧州', '贵港', '玉林', '钦州', '北海', '防城港', '南宁', '百色', '河池', '柳州', '贺州'],
		'西藏': ['拉萨', '那曲', '昌都', '林芝', '山南', '日喀则', '阿里'],
		'宁夏': ['银川', '石嘴山', '吴忠', '固原'],
		'新疆': ['乌鲁木齐', '克拉玛依', '喀什', '阿克苏', '和田', '吐鲁番', '哈密', '博尔塔拉', '昌吉', '巴音郭楞', '伊犁', '塔城', '阿勒泰'],
		'香港': ['香港'],
		'澳门': ['澳门'],
		'台湾': ['台北', '台南', '其他']
	},
	// 获取所有的省份
	getProvinces: function() {
		var provinces = [];
		for(var item in this.cityInfo){
			// psuh进key，省份
			provinces.push(item);
		}
		return provinces;
	},
	// 获取某省份的所有城市
	getCities: function(provinceName) {
		return this.cityInfo[provinceName] || [];
	}
}

module.exports = _cities;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2hvZ2FuLmpzL2xpYi9jb21waWxlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaG9nYW4uanMvbGliL2hvZ2FuLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ob2dhbi5qcy9saWIvdGVtcGxhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2UvY29tbW9uL2hlYWRlci9pbmRleC5jc3M/OGUyOCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZS9jb21tb24vaGVhZGVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlL2NvbW1vbi9uYXYvaW5kZXguY3NzPzEwMjEiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2UvY29tbW9uL25hdi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZS9vcmRlci1jb25maXJtL2FkZHJlc3MtbGlzdC5zdHJpbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2Uvb3JkZXItY29uZmlybS9hZGRyZXNzLW1vZGFsLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlL29yZGVyLWNvbmZpcm0vYWRkcmVzcy1tb2RhbC5zdHJpbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2Uvb3JkZXItY29uZmlybS9pbmRleC5jc3M/NjNiZiIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZS9vcmRlci1jb25maXJtL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlL29yZGVyLWNvbmZpcm0vcHJvZHVjdC1saXN0LnN0cmluZyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZS9hZGRyZXNzLXNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2UvY2FydC1zZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlL29yZGVyLXNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2UvdXNlci1zZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL2NpdGllcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC9tbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEIsa0JBQWtCOztBQUVsQjtBQUNBO0FBQ0EscUJBQXFCLGlDQUFpQztBQUN0RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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SjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLHVCOzs7Ozs7Ozs7OztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx5Qjs7Ozs7Ozs7Ozs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFlBQVksbUJBQU8sQ0FBQyxzREFBVTs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixHQUFHO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLGdFQUFnRSxJQUFJO0FBQ3BFO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQiIsImZpbGUiOiIuL2pzL29yZGVyLWNvbmZpcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9wYWdlL29yZGVyLWNvbmZpcm0vaW5kZXguanNcIik7XG4iLCIvKlxuICogIENvcHlyaWdodCAyMDExIFR3aXR0ZXIsIEluYy5cbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbiAoSG9nYW4pIHtcbiAgLy8gU2V0dXAgcmVnZXggIGFzc2lnbm1lbnRzXG4gIC8vIHJlbW92ZSB3aGl0ZXNwYWNlIGFjY29yZGluZyB0byBNdXN0YWNoZSBzcGVjXG4gIHZhciBySXNXaGl0ZXNwYWNlID0gL1xcUy8sXG4gICAgICByUXVvdCA9IC9cXFwiL2csXG4gICAgICByTmV3bGluZSA9ICAvXFxuL2csXG4gICAgICByQ3IgPSAvXFxyL2csXG4gICAgICByU2xhc2ggPSAvXFxcXC9nLFxuICAgICAgckxpbmVTZXAgPSAvXFx1MjAyOC8sXG4gICAgICByUGFyYWdyYXBoU2VwID0gL1xcdTIwMjkvO1xuXG4gIEhvZ2FuLnRhZ3MgPSB7XG4gICAgJyMnOiAxLCAnXic6IDIsICc8JzogMywgJyQnOiA0LFxuICAgICcvJzogNSwgJyEnOiA2LCAnPic6IDcsICc9JzogOCwgJ192JzogOSxcbiAgICAneyc6IDEwLCAnJic6IDExLCAnX3QnOiAxMlxuICB9O1xuXG4gIEhvZ2FuLnNjYW4gPSBmdW5jdGlvbiBzY2FuKHRleHQsIGRlbGltaXRlcnMpIHtcbiAgICB2YXIgbGVuID0gdGV4dC5sZW5ndGgsXG4gICAgICAgIElOX1RFWFQgPSAwLFxuICAgICAgICBJTl9UQUdfVFlQRSA9IDEsXG4gICAgICAgIElOX1RBRyA9IDIsXG4gICAgICAgIHN0YXRlID0gSU5fVEVYVCxcbiAgICAgICAgdGFnVHlwZSA9IG51bGwsXG4gICAgICAgIHRhZyA9IG51bGwsXG4gICAgICAgIGJ1ZiA9ICcnLFxuICAgICAgICB0b2tlbnMgPSBbXSxcbiAgICAgICAgc2VlblRhZyA9IGZhbHNlLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGluZVN0YXJ0ID0gMCxcbiAgICAgICAgb3RhZyA9ICd7eycsXG4gICAgICAgIGN0YWcgPSAnfX0nO1xuXG4gICAgZnVuY3Rpb24gYWRkQnVmKCkge1xuICAgICAgaWYgKGJ1Zi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRva2Vucy5wdXNoKHt0YWc6ICdfdCcsIHRleHQ6IG5ldyBTdHJpbmcoYnVmKX0pO1xuICAgICAgICBidWYgPSAnJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5lSXNXaGl0ZXNwYWNlKCkge1xuICAgICAgdmFyIGlzQWxsV2hpdGVzcGFjZSA9IHRydWU7XG4gICAgICBmb3IgKHZhciBqID0gbGluZVN0YXJ0OyBqIDwgdG9rZW5zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlzQWxsV2hpdGVzcGFjZSA9XG4gICAgICAgICAgKEhvZ2FuLnRhZ3NbdG9rZW5zW2pdLnRhZ10gPCBIb2dhbi50YWdzWydfdiddKSB8fFxuICAgICAgICAgICh0b2tlbnNbal0udGFnID09ICdfdCcgJiYgdG9rZW5zW2pdLnRleHQubWF0Y2gocklzV2hpdGVzcGFjZSkgPT09IG51bGwpO1xuICAgICAgICBpZiAoIWlzQWxsV2hpdGVzcGFjZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXNBbGxXaGl0ZXNwYWNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckxpbmUoaGF2ZVNlZW5UYWcsIG5vTmV3TGluZSkge1xuICAgICAgYWRkQnVmKCk7XG5cbiAgICAgIGlmIChoYXZlU2VlblRhZyAmJiBsaW5lSXNXaGl0ZXNwYWNlKCkpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IGxpbmVTdGFydCwgbmV4dDsgaiA8IHRva2Vucy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGlmICh0b2tlbnNbal0udGV4dCkge1xuICAgICAgICAgICAgaWYgKChuZXh0ID0gdG9rZW5zW2orMV0pICYmIG5leHQudGFnID09ICc+Jykge1xuICAgICAgICAgICAgICAvLyBzZXQgaW5kZW50IHRvIHRva2VuIHZhbHVlXG4gICAgICAgICAgICAgIG5leHQuaW5kZW50ID0gdG9rZW5zW2pdLnRleHQudG9TdHJpbmcoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9rZW5zLnNwbGljZShqLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIW5vTmV3TGluZSkge1xuICAgICAgICB0b2tlbnMucHVzaCh7dGFnOidcXG4nfSk7XG4gICAgICB9XG5cbiAgICAgIHNlZW5UYWcgPSBmYWxzZTtcbiAgICAgIGxpbmVTdGFydCA9IHRva2Vucy5sZW5ndGg7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hhbmdlRGVsaW1pdGVycyh0ZXh0LCBpbmRleCkge1xuICAgICAgdmFyIGNsb3NlID0gJz0nICsgY3RhZyxcbiAgICAgICAgICBjbG9zZUluZGV4ID0gdGV4dC5pbmRleE9mKGNsb3NlLCBpbmRleCksXG4gICAgICAgICAgZGVsaW1pdGVycyA9IHRyaW0oXG4gICAgICAgICAgICB0ZXh0LnN1YnN0cmluZyh0ZXh0LmluZGV4T2YoJz0nLCBpbmRleCkgKyAxLCBjbG9zZUluZGV4KVxuICAgICAgICAgICkuc3BsaXQoJyAnKTtcblxuICAgICAgb3RhZyA9IGRlbGltaXRlcnNbMF07XG4gICAgICBjdGFnID0gZGVsaW1pdGVyc1tkZWxpbWl0ZXJzLmxlbmd0aCAtIDFdO1xuXG4gICAgICByZXR1cm4gY2xvc2VJbmRleCArIGNsb3NlLmxlbmd0aCAtIDE7XG4gICAgfVxuXG4gICAgaWYgKGRlbGltaXRlcnMpIHtcbiAgICAgIGRlbGltaXRlcnMgPSBkZWxpbWl0ZXJzLnNwbGl0KCcgJyk7XG4gICAgICBvdGFnID0gZGVsaW1pdGVyc1swXTtcbiAgICAgIGN0YWcgPSBkZWxpbWl0ZXJzWzFdO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHN0YXRlID09IElOX1RFWFQpIHtcbiAgICAgICAgaWYgKHRhZ0NoYW5nZShvdGFnLCB0ZXh0LCBpKSkge1xuICAgICAgICAgIC0taTtcbiAgICAgICAgICBhZGRCdWYoKTtcbiAgICAgICAgICBzdGF0ZSA9IElOX1RBR19UWVBFO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0ZXh0LmNoYXJBdChpKSA9PSAnXFxuJykge1xuICAgICAgICAgICAgZmlsdGVyTGluZShzZWVuVGFnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnVmICs9IHRleHQuY2hhckF0KGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PSBJTl9UQUdfVFlQRSkge1xuICAgICAgICBpICs9IG90YWcubGVuZ3RoIC0gMTtcbiAgICAgICAgdGFnID0gSG9nYW4udGFnc1t0ZXh0LmNoYXJBdChpICsgMSldO1xuICAgICAgICB0YWdUeXBlID0gdGFnID8gdGV4dC5jaGFyQXQoaSArIDEpIDogJ192JztcbiAgICAgICAgaWYgKHRhZ1R5cGUgPT0gJz0nKSB7XG4gICAgICAgICAgaSA9IGNoYW5nZURlbGltaXRlcnModGV4dCwgaSk7XG4gICAgICAgICAgc3RhdGUgPSBJTl9URVhUO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0YWcpIHtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RhdGUgPSBJTl9UQUc7XG4gICAgICAgIH1cbiAgICAgICAgc2VlblRhZyA9IGk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGFnQ2hhbmdlKGN0YWcsIHRleHQsIGkpKSB7XG4gICAgICAgICAgdG9rZW5zLnB1c2goe3RhZzogdGFnVHlwZSwgbjogdHJpbShidWYpLCBvdGFnOiBvdGFnLCBjdGFnOiBjdGFnLFxuICAgICAgICAgICAgICAgICAgICAgICBpOiAodGFnVHlwZSA9PSAnLycpID8gc2VlblRhZyAtIG90YWcubGVuZ3RoIDogaSArIGN0YWcubGVuZ3RofSk7XG4gICAgICAgICAgYnVmID0gJyc7XG4gICAgICAgICAgaSArPSBjdGFnLmxlbmd0aCAtIDE7XG4gICAgICAgICAgc3RhdGUgPSBJTl9URVhUO1xuICAgICAgICAgIGlmICh0YWdUeXBlID09ICd7Jykge1xuICAgICAgICAgICAgaWYgKGN0YWcgPT0gJ319Jykge1xuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjbGVhblRyaXBsZVN0YWNoZSh0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnVmICs9IHRleHQuY2hhckF0KGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZmlsdGVyTGluZShzZWVuVGFnLCB0cnVlKTtcblxuICAgIHJldHVybiB0b2tlbnM7XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhblRyaXBsZVN0YWNoZSh0b2tlbikge1xuICAgIGlmICh0b2tlbi5uLnN1YnN0cih0b2tlbi5uLmxlbmd0aCAtIDEpID09PSAnfScpIHtcbiAgICAgIHRva2VuLm4gPSB0b2tlbi5uLnN1YnN0cmluZygwLCB0b2tlbi5uLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRyaW0ocykge1xuICAgIGlmIChzLnRyaW0pIHtcbiAgICAgIHJldHVybiBzLnRyaW0oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcy5yZXBsYWNlKC9eXFxzKnxcXHMqJC9nLCAnJyk7XG4gIH1cblxuICBmdW5jdGlvbiB0YWdDaGFuZ2UodGFnLCB0ZXh0LCBpbmRleCkge1xuICAgIGlmICh0ZXh0LmNoYXJBdChpbmRleCkgIT0gdGFnLmNoYXJBdCgwKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAxLCBsID0gdGFnLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKHRleHQuY2hhckF0KGluZGV4ICsgaSkgIT0gdGFnLmNoYXJBdChpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyB0aGUgdGFncyBhbGxvd2VkIGluc2lkZSBzdXBlciB0ZW1wbGF0ZXNcbiAgdmFyIGFsbG93ZWRJblN1cGVyID0geydfdCc6IHRydWUsICdcXG4nOiB0cnVlLCAnJCc6IHRydWUsICcvJzogdHJ1ZX07XG5cbiAgZnVuY3Rpb24gYnVpbGRUcmVlKHRva2Vucywga2luZCwgc3RhY2ssIGN1c3RvbVRhZ3MpIHtcbiAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gW10sXG4gICAgICAgIG9wZW5lciA9IG51bGwsXG4gICAgICAgIHRhaWwgPSBudWxsLFxuICAgICAgICB0b2tlbiA9IG51bGw7XG5cbiAgICB0YWlsID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cbiAgICB3aGlsZSAodG9rZW5zLmxlbmd0aCA+IDApIHtcbiAgICAgIHRva2VuID0gdG9rZW5zLnNoaWZ0KCk7XG5cbiAgICAgIGlmICh0YWlsICYmIHRhaWwudGFnID09ICc8JyAmJiAhKHRva2VuLnRhZyBpbiBhbGxvd2VkSW5TdXBlcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbGxlZ2FsIGNvbnRlbnQgaW4gPCBzdXBlciB0YWcuJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChIb2dhbi50YWdzW3Rva2VuLnRhZ10gPD0gSG9nYW4udGFnc1snJCddIHx8IGlzT3BlbmVyKHRva2VuLCBjdXN0b21UYWdzKSkge1xuICAgICAgICBzdGFjay5wdXNoKHRva2VuKTtcbiAgICAgICAgdG9rZW4ubm9kZXMgPSBidWlsZFRyZWUodG9rZW5zLCB0b2tlbi50YWcsIHN0YWNrLCBjdXN0b21UYWdzKTtcbiAgICAgIH0gZWxzZSBpZiAodG9rZW4udGFnID09ICcvJykge1xuICAgICAgICBpZiAoc3RhY2subGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDbG9zaW5nIHRhZyB3aXRob3V0IG9wZW5lcjogLycgKyB0b2tlbi5uKTtcbiAgICAgICAgfVxuICAgICAgICBvcGVuZXIgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgaWYgKHRva2VuLm4gIT0gb3BlbmVyLm4gJiYgIWlzQ2xvc2VyKHRva2VuLm4sIG9wZW5lci5uLCBjdXN0b21UYWdzKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTmVzdGluZyBlcnJvcjogJyArIG9wZW5lci5uICsgJyB2cy4gJyArIHRva2VuLm4pO1xuICAgICAgICB9XG4gICAgICAgIG9wZW5lci5lbmQgPSB0b2tlbi5pO1xuICAgICAgICByZXR1cm4gaW5zdHJ1Y3Rpb25zO1xuICAgICAgfSBlbHNlIGlmICh0b2tlbi50YWcgPT0gJ1xcbicpIHtcbiAgICAgICAgdG9rZW4ubGFzdCA9ICh0b2tlbnMubGVuZ3RoID09IDApIHx8ICh0b2tlbnNbMF0udGFnID09ICdcXG4nKTtcbiAgICAgIH1cblxuICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2godG9rZW4pO1xuICAgIH1cblxuICAgIGlmIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21pc3NpbmcgY2xvc2luZyB0YWc6ICcgKyBzdGFjay5wb3AoKS5uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5zdHJ1Y3Rpb25zO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNPcGVuZXIodG9rZW4sIHRhZ3MpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRhZ3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodGFnc1tpXS5vID09IHRva2VuLm4pIHtcbiAgICAgICAgdG9rZW4udGFnID0gJyMnO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc0Nsb3NlcihjbG9zZSwgb3BlbiwgdGFncykge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGFncy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICh0YWdzW2ldLmMgPT0gY2xvc2UgJiYgdGFnc1tpXS5vID09IG9wZW4pIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc3RyaW5naWZ5U3Vic3RpdHV0aW9ucyhvYmopIHtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpdGVtcy5wdXNoKCdcIicgKyBlc2Moa2V5KSArICdcIjogZnVuY3Rpb24oYyxwLHQsaSkgeycgKyBvYmpba2V5XSArICd9Jyk7XG4gICAgfVxuICAgIHJldHVybiBcInsgXCIgKyBpdGVtcy5qb2luKFwiLFwiKSArIFwiIH1cIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0cmluZ2lmeVBhcnRpYWxzKGNvZGVPYmopIHtcbiAgICB2YXIgcGFydGlhbHMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gY29kZU9iai5wYXJ0aWFscykge1xuICAgICAgcGFydGlhbHMucHVzaCgnXCInICsgZXNjKGtleSkgKyAnXCI6e25hbWU6XCInICsgZXNjKGNvZGVPYmoucGFydGlhbHNba2V5XS5uYW1lKSArICdcIiwgJyArIHN0cmluZ2lmeVBhcnRpYWxzKGNvZGVPYmoucGFydGlhbHNba2V5XSkgKyBcIn1cIik7XG4gICAgfVxuICAgIHJldHVybiBcInBhcnRpYWxzOiB7XCIgKyBwYXJ0aWFscy5qb2luKFwiLFwiKSArIFwifSwgc3ViczogXCIgKyBzdHJpbmdpZnlTdWJzdGl0dXRpb25zKGNvZGVPYmouc3Vicyk7XG4gIH1cblxuICBIb2dhbi5zdHJpbmdpZnkgPSBmdW5jdGlvbihjb2RlT2JqLCB0ZXh0LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIFwie2NvZGU6IGZ1bmN0aW9uIChjLHAsaSkgeyBcIiArIEhvZ2FuLndyYXBNYWluKGNvZGVPYmouY29kZSkgKyBcIiB9LFwiICsgc3RyaW5naWZ5UGFydGlhbHMoY29kZU9iaikgKyAgXCJ9XCI7XG4gIH1cblxuICB2YXIgc2VyaWFsTm8gPSAwO1xuICBIb2dhbi5nZW5lcmF0ZSA9IGZ1bmN0aW9uKHRyZWUsIHRleHQsIG9wdGlvbnMpIHtcbiAgICBzZXJpYWxObyA9IDA7XG4gICAgdmFyIGNvbnRleHQgPSB7IGNvZGU6ICcnLCBzdWJzOiB7fSwgcGFydGlhbHM6IHt9IH07XG4gICAgSG9nYW4ud2Fsayh0cmVlLCBjb250ZXh0KTtcblxuICAgIGlmIChvcHRpb25zLmFzU3RyaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdHJpbmdpZnkoY29udGV4dCwgdGV4dCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubWFrZVRlbXBsYXRlKGNvbnRleHQsIHRleHQsIG9wdGlvbnMpO1xuICB9XG5cbiAgSG9nYW4ud3JhcE1haW4gPSBmdW5jdGlvbihjb2RlKSB7XG4gICAgcmV0dXJuICd2YXIgdD10aGlzO3QuYihpPWl8fFwiXCIpOycgKyBjb2RlICsgJ3JldHVybiB0LmZsKCk7JztcbiAgfVxuXG4gIEhvZ2FuLnRlbXBsYXRlID0gSG9nYW4uVGVtcGxhdGU7XG5cbiAgSG9nYW4ubWFrZVRlbXBsYXRlID0gZnVuY3Rpb24oY29kZU9iaiwgdGV4dCwgb3B0aW9ucykge1xuICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMubWFrZVBhcnRpYWxzKGNvZGVPYmopO1xuICAgIHRlbXBsYXRlLmNvZGUgPSBuZXcgRnVuY3Rpb24oJ2MnLCAncCcsICdpJywgdGhpcy53cmFwTWFpbihjb2RlT2JqLmNvZGUpKTtcbiAgICByZXR1cm4gbmV3IHRoaXMudGVtcGxhdGUodGVtcGxhdGUsIHRleHQsIHRoaXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgSG9nYW4ubWFrZVBhcnRpYWxzID0gZnVuY3Rpb24oY29kZU9iaikge1xuICAgIHZhciBrZXksIHRlbXBsYXRlID0ge3N1YnM6IHt9LCBwYXJ0aWFsczogY29kZU9iai5wYXJ0aWFscywgbmFtZTogY29kZU9iai5uYW1lfTtcbiAgICBmb3IgKGtleSBpbiB0ZW1wbGF0ZS5wYXJ0aWFscykge1xuICAgICAgdGVtcGxhdGUucGFydGlhbHNba2V5XSA9IHRoaXMubWFrZVBhcnRpYWxzKHRlbXBsYXRlLnBhcnRpYWxzW2tleV0pO1xuICAgIH1cbiAgICBmb3IgKGtleSBpbiBjb2RlT2JqLnN1YnMpIHtcbiAgICAgIHRlbXBsYXRlLnN1YnNba2V5XSA9IG5ldyBGdW5jdGlvbignYycsICdwJywgJ3QnLCAnaScsIGNvZGVPYmouc3Vic1trZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG5cbiAgZnVuY3Rpb24gZXNjKHMpIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKHJTbGFzaCwgJ1xcXFxcXFxcJylcbiAgICAgICAgICAgIC5yZXBsYWNlKHJRdW90LCAnXFxcXFxcXCInKVxuICAgICAgICAgICAgLnJlcGxhY2Uock5ld2xpbmUsICdcXFxcbicpXG4gICAgICAgICAgICAucmVwbGFjZShyQ3IsICdcXFxccicpXG4gICAgICAgICAgICAucmVwbGFjZShyTGluZVNlcCwgJ1xcXFx1MjAyOCcpXG4gICAgICAgICAgICAucmVwbGFjZShyUGFyYWdyYXBoU2VwLCAnXFxcXHUyMDI5Jyk7XG4gIH1cblxuICBmdW5jdGlvbiBjaG9vc2VNZXRob2Qocykge1xuICAgIHJldHVybiAofnMuaW5kZXhPZignLicpKSA/ICdkJyA6ICdmJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVBhcnRpYWwobm9kZSwgY29udGV4dCkge1xuICAgIHZhciBwcmVmaXggPSBcIjxcIiArIChjb250ZXh0LnByZWZpeCB8fCBcIlwiKTtcbiAgICB2YXIgc3ltID0gcHJlZml4ICsgbm9kZS5uICsgc2VyaWFsTm8rKztcbiAgICBjb250ZXh0LnBhcnRpYWxzW3N5bV0gPSB7bmFtZTogbm9kZS5uLCBwYXJ0aWFsczoge319O1xuICAgIGNvbnRleHQuY29kZSArPSAndC5iKHQucnAoXCInICsgIGVzYyhzeW0pICsgJ1wiLGMscCxcIicgKyAobm9kZS5pbmRlbnQgfHwgJycpICsgJ1wiKSk7JztcbiAgICByZXR1cm4gc3ltO1xuICB9XG5cbiAgSG9nYW4uY29kZWdlbiA9IHtcbiAgICAnIyc6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQuY29kZSArPSAnaWYodC5zKHQuJyArIGNob29zZU1ldGhvZChub2RlLm4pICsgJyhcIicgKyBlc2Mobm9kZS5uKSArICdcIixjLHAsMSksJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ2MscCwwLCcgKyBub2RlLmkgKyAnLCcgKyBub2RlLmVuZCArICcsXCInICsgbm9kZS5vdGFnICsgXCIgXCIgKyBub2RlLmN0YWcgKyAnXCIpKXsnICtcbiAgICAgICAgICAgICAgICAgICAgICAndC5ycyhjLHAsJyArICdmdW5jdGlvbihjLHAsdCl7JztcbiAgICAgIEhvZ2FuLndhbGsobm9kZS5ub2RlcywgY29udGV4dCk7XG4gICAgICBjb250ZXh0LmNvZGUgKz0gJ30pO2MucG9wKCk7fSc7XG4gICAgfSxcblxuICAgICdeJzogZnVuY3Rpb24obm9kZSwgY29udGV4dCkge1xuICAgICAgY29udGV4dC5jb2RlICs9ICdpZighdC5zKHQuJyArIGNob29zZU1ldGhvZChub2RlLm4pICsgJyhcIicgKyBlc2Mobm9kZS5uKSArICdcIixjLHAsMSksYyxwLDEsMCwwLFwiXCIpKXsnO1xuICAgICAgSG9nYW4ud2Fsayhub2RlLm5vZGVzLCBjb250ZXh0KTtcbiAgICAgIGNvbnRleHQuY29kZSArPSAnfTsnO1xuICAgIH0sXG5cbiAgICAnPic6IGNyZWF0ZVBhcnRpYWwsXG4gICAgJzwnOiBmdW5jdGlvbihub2RlLCBjb250ZXh0KSB7XG4gICAgICB2YXIgY3R4ID0ge3BhcnRpYWxzOiB7fSwgY29kZTogJycsIHN1YnM6IHt9LCBpblBhcnRpYWw6IHRydWV9O1xuICAgICAgSG9nYW4ud2Fsayhub2RlLm5vZGVzLCBjdHgpO1xuICAgICAgdmFyIHRlbXBsYXRlID0gY29udGV4dC5wYXJ0aWFsc1tjcmVhdGVQYXJ0aWFsKG5vZGUsIGNvbnRleHQpXTtcbiAgICAgIHRlbXBsYXRlLnN1YnMgPSBjdHguc3VicztcbiAgICAgIHRlbXBsYXRlLnBhcnRpYWxzID0gY3R4LnBhcnRpYWxzO1xuICAgIH0sXG5cbiAgICAnJCc6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIHZhciBjdHggPSB7c3Viczoge30sIGNvZGU6ICcnLCBwYXJ0aWFsczogY29udGV4dC5wYXJ0aWFscywgcHJlZml4OiBub2RlLm59O1xuICAgICAgSG9nYW4ud2Fsayhub2RlLm5vZGVzLCBjdHgpO1xuICAgICAgY29udGV4dC5zdWJzW25vZGUubl0gPSBjdHguY29kZTtcbiAgICAgIGlmICghY29udGV4dC5pblBhcnRpYWwpIHtcbiAgICAgICAgY29udGV4dC5jb2RlICs9ICd0LnN1YihcIicgKyBlc2Mobm9kZS5uKSArICdcIixjLHAsaSk7JztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJ1xcbic6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQuY29kZSArPSB3cml0ZSgnXCJcXFxcblwiJyArIChub2RlLmxhc3QgPyAnJyA6ICcgKyBpJykpO1xuICAgIH0sXG5cbiAgICAnX3YnOiBmdW5jdGlvbihub2RlLCBjb250ZXh0KSB7XG4gICAgICBjb250ZXh0LmNvZGUgKz0gJ3QuYih0LnYodC4nICsgY2hvb3NlTWV0aG9kKG5vZGUubikgKyAnKFwiJyArIGVzYyhub2RlLm4pICsgJ1wiLGMscCwwKSkpOyc7XG4gICAgfSxcblxuICAgICdfdCc6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQuY29kZSArPSB3cml0ZSgnXCInICsgZXNjKG5vZGUudGV4dCkgKyAnXCInKTtcbiAgICB9LFxuXG4gICAgJ3snOiB0cmlwbGVTdGFjaGUsXG5cbiAgICAnJic6IHRyaXBsZVN0YWNoZVxuICB9XG5cbiAgZnVuY3Rpb24gdHJpcGxlU3RhY2hlKG5vZGUsIGNvbnRleHQpIHtcbiAgICBjb250ZXh0LmNvZGUgKz0gJ3QuYih0LnQodC4nICsgY2hvb3NlTWV0aG9kKG5vZGUubikgKyAnKFwiJyArIGVzYyhub2RlLm4pICsgJ1wiLGMscCwwKSkpOyc7XG4gIH1cblxuICBmdW5jdGlvbiB3cml0ZShzKSB7XG4gICAgcmV0dXJuICd0LmIoJyArIHMgKyAnKTsnO1xuICB9XG5cbiAgSG9nYW4ud2FsayA9IGZ1bmN0aW9uKG5vZGVsaXN0LCBjb250ZXh0KSB7XG4gICAgdmFyIGZ1bmM7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBub2RlbGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGZ1bmMgPSBIb2dhbi5jb2RlZ2VuW25vZGVsaXN0W2ldLnRhZ107XG4gICAgICBmdW5jICYmIGZ1bmMobm9kZWxpc3RbaV0sIGNvbnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuXG4gIEhvZ2FuLnBhcnNlID0gZnVuY3Rpb24odG9rZW5zLCB0ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgcmV0dXJuIGJ1aWxkVHJlZSh0b2tlbnMsICcnLCBbXSwgb3B0aW9ucy5zZWN0aW9uVGFncyB8fCBbXSk7XG4gIH1cblxuICBIb2dhbi5jYWNoZSA9IHt9O1xuXG4gIEhvZ2FuLmNhY2hlS2V5ID0gZnVuY3Rpb24odGV4dCwgb3B0aW9ucykge1xuICAgIHJldHVybiBbdGV4dCwgISFvcHRpb25zLmFzU3RyaW5nLCAhIW9wdGlvbnMuZGlzYWJsZUxhbWJkYSwgb3B0aW9ucy5kZWxpbWl0ZXJzLCAhIW9wdGlvbnMubW9kZWxHZXRdLmpvaW4oJ3x8Jyk7XG4gIH1cblxuICBIb2dhbi5jb21waWxlID0gZnVuY3Rpb24odGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBrZXkgPSBIb2dhbi5jYWNoZUtleSh0ZXh0LCBvcHRpb25zKTtcbiAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLmNhY2hlW2tleV07XG5cbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgIHZhciBwYXJ0aWFscyA9IHRlbXBsYXRlLnBhcnRpYWxzO1xuICAgICAgZm9yICh2YXIgbmFtZSBpbiBwYXJ0aWFscykge1xuICAgICAgICBkZWxldGUgcGFydGlhbHNbbmFtZV0uaW5zdGFuY2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgdGVtcGxhdGUgPSB0aGlzLmdlbmVyYXRlKHRoaXMucGFyc2UodGhpcy5zY2FuKHRleHQsIG9wdGlvbnMuZGVsaW1pdGVycyksIHRleHQsIG9wdGlvbnMpLCB0ZXh0LCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5jYWNoZVtrZXldID0gdGVtcGxhdGU7XG4gIH1cbn0pKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyA/IGV4cG9ydHMgOiBIb2dhbik7XG4iLCIvKlxuICogIENvcHlyaWdodCAyMDExIFR3aXR0ZXIsIEluYy5cbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8vIFRoaXMgZmlsZSBpcyBmb3IgdXNlIHdpdGggTm9kZS5qcy4gU2VlIGRpc3QvIGZvciBicm93c2VyIGZpbGVzLlxuXG52YXIgSG9nYW4gPSByZXF1aXJlKCcuL2NvbXBpbGVyJyk7XG5Ib2dhbi5UZW1wbGF0ZSA9IHJlcXVpcmUoJy4vdGVtcGxhdGUnKS5UZW1wbGF0ZTtcbkhvZ2FuLnRlbXBsYXRlID0gSG9nYW4uVGVtcGxhdGU7XG5tb2R1bGUuZXhwb3J0cyA9IEhvZ2FuO1xuIiwiLypcbiAqICBDb3B5cmlnaHQgMjAxMSBUd2l0dGVyLCBJbmMuXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG52YXIgSG9nYW4gPSB7fTtcblxuKGZ1bmN0aW9uIChIb2dhbikge1xuICBIb2dhbi5UZW1wbGF0ZSA9IGZ1bmN0aW9uIChjb2RlT2JqLCB0ZXh0LCBjb21waWxlciwgb3B0aW9ucykge1xuICAgIGNvZGVPYmogPSBjb2RlT2JqIHx8IHt9O1xuICAgIHRoaXMuciA9IGNvZGVPYmouY29kZSB8fCB0aGlzLnI7XG4gICAgdGhpcy5jID0gY29tcGlsZXI7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnRleHQgPSB0ZXh0IHx8ICcnO1xuICAgIHRoaXMucGFydGlhbHMgPSBjb2RlT2JqLnBhcnRpYWxzIHx8IHt9O1xuICAgIHRoaXMuc3VicyA9IGNvZGVPYmouc3VicyB8fCB7fTtcbiAgICB0aGlzLmJ1ZiA9ICcnO1xuICB9XG5cbiAgSG9nYW4uVGVtcGxhdGUucHJvdG90eXBlID0ge1xuICAgIC8vIHJlbmRlcjogcmVwbGFjZWQgYnkgZ2VuZXJhdGVkIGNvZGUuXG4gICAgcjogZnVuY3Rpb24gKGNvbnRleHQsIHBhcnRpYWxzLCBpbmRlbnQpIHsgcmV0dXJuICcnOyB9LFxuXG4gICAgLy8gdmFyaWFibGUgZXNjYXBpbmdcbiAgICB2OiBob2dhbkVzY2FwZSxcblxuICAgIC8vIHRyaXBsZSBzdGFjaGVcbiAgICB0OiBjb2VyY2VUb1N0cmluZyxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGNvbnRleHQsIHBhcnRpYWxzLCBpbmRlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJpKFtjb250ZXh0XSwgcGFydGlhbHMgfHwge30sIGluZGVudCk7XG4gICAgfSxcblxuICAgIC8vIHJlbmRlciBpbnRlcm5hbCAtLSBhIGhvb2sgZm9yIG92ZXJyaWRlcyB0aGF0IGNhdGNoZXMgcGFydGlhbHMgdG9vXG4gICAgcmk6IGZ1bmN0aW9uIChjb250ZXh0LCBwYXJ0aWFscywgaW5kZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5yKGNvbnRleHQsIHBhcnRpYWxzLCBpbmRlbnQpO1xuICAgIH0sXG5cbiAgICAvLyBlbnN1cmVQYXJ0aWFsXG4gICAgZXA6IGZ1bmN0aW9uKHN5bWJvbCwgcGFydGlhbHMpIHtcbiAgICAgIHZhciBwYXJ0aWFsID0gdGhpcy5wYXJ0aWFsc1tzeW1ib2xdO1xuXG4gICAgICAvLyBjaGVjayB0byBzZWUgdGhhdCBpZiB3ZSd2ZSBpbnN0YW50aWF0ZWQgdGhpcyBwYXJ0aWFsIGJlZm9yZVxuICAgICAgdmFyIHRlbXBsYXRlID0gcGFydGlhbHNbcGFydGlhbC5uYW1lXTtcbiAgICAgIGlmIChwYXJ0aWFsLmluc3RhbmNlICYmIHBhcnRpYWwuYmFzZSA9PSB0ZW1wbGF0ZSkge1xuICAgICAgICByZXR1cm4gcGFydGlhbC5pbnN0YW5jZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoIXRoaXMuYykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGNvbXBpbGVyIGF2YWlsYWJsZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgdGVtcGxhdGUgPSB0aGlzLmMuY29tcGlsZSh0ZW1wbGF0ZSwgdGhpcy5vcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0ZW1wbGF0ZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gV2UgdXNlIHRoaXMgdG8gY2hlY2sgd2hldGhlciB0aGUgcGFydGlhbHMgZGljdGlvbmFyeSBoYXMgY2hhbmdlZFxuICAgICAgdGhpcy5wYXJ0aWFsc1tzeW1ib2xdLmJhc2UgPSB0ZW1wbGF0ZTtcblxuICAgICAgaWYgKHBhcnRpYWwuc3Vicykge1xuICAgICAgICAvLyBNYWtlIHN1cmUgd2UgY29uc2lkZXIgcGFyZW50IHRlbXBsYXRlIG5vd1xuICAgICAgICBpZiAoIXBhcnRpYWxzLnN0YWNrVGV4dCkgcGFydGlhbHMuc3RhY2tUZXh0ID0ge307XG4gICAgICAgIGZvciAoa2V5IGluIHBhcnRpYWwuc3Vicykge1xuICAgICAgICAgIGlmICghcGFydGlhbHMuc3RhY2tUZXh0W2tleV0pIHtcbiAgICAgICAgICAgIHBhcnRpYWxzLnN0YWNrVGV4dFtrZXldID0gKHRoaXMuYWN0aXZlU3ViICE9PSB1bmRlZmluZWQgJiYgcGFydGlhbHMuc3RhY2tUZXh0W3RoaXMuYWN0aXZlU3ViXSkgPyBwYXJ0aWFscy5zdGFja1RleHRbdGhpcy5hY3RpdmVTdWJdIDogdGhpcy50ZXh0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wbGF0ZSA9IGNyZWF0ZVNwZWNpYWxpemVkUGFydGlhbCh0ZW1wbGF0ZSwgcGFydGlhbC5zdWJzLCBwYXJ0aWFsLnBhcnRpYWxzLFxuICAgICAgICAgIHRoaXMuc3RhY2tTdWJzLCB0aGlzLnN0YWNrUGFydGlhbHMsIHBhcnRpYWxzLnN0YWNrVGV4dCk7XG4gICAgICB9XG4gICAgICB0aGlzLnBhcnRpYWxzW3N5bWJvbF0uaW5zdGFuY2UgPSB0ZW1wbGF0ZTtcblxuICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH0sXG5cbiAgICAvLyB0cmllcyB0byBmaW5kIGEgcGFydGlhbCBpbiB0aGUgY3VycmVudCBzY29wZSBhbmQgcmVuZGVyIGl0XG4gICAgcnA6IGZ1bmN0aW9uKHN5bWJvbCwgY29udGV4dCwgcGFydGlhbHMsIGluZGVudCkge1xuICAgICAgdmFyIHBhcnRpYWwgPSB0aGlzLmVwKHN5bWJvbCwgcGFydGlhbHMpO1xuICAgICAgaWYgKCFwYXJ0aWFsKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhcnRpYWwucmkoY29udGV4dCwgcGFydGlhbHMsIGluZGVudCk7XG4gICAgfSxcblxuICAgIC8vIHJlbmRlciBhIHNlY3Rpb25cbiAgICByczogZnVuY3Rpb24oY29udGV4dCwgcGFydGlhbHMsIHNlY3Rpb24pIHtcbiAgICAgIHZhciB0YWlsID0gY29udGV4dFtjb250ZXh0Lmxlbmd0aCAtIDFdO1xuXG4gICAgICBpZiAoIWlzQXJyYXkodGFpbCkpIHtcbiAgICAgICAgc2VjdGlvbihjb250ZXh0LCBwYXJ0aWFscywgdGhpcyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWlsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnRleHQucHVzaCh0YWlsW2ldKTtcbiAgICAgICAgc2VjdGlvbihjb250ZXh0LCBwYXJ0aWFscywgdGhpcyk7XG4gICAgICAgIGNvbnRleHQucG9wKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIG1heWJlIHN0YXJ0IGEgc2VjdGlvblxuICAgIHM6IGZ1bmN0aW9uKHZhbCwgY3R4LCBwYXJ0aWFscywgaW52ZXJ0ZWQsIHN0YXJ0LCBlbmQsIHRhZ3MpIHtcbiAgICAgIHZhciBwYXNzO1xuXG4gICAgICBpZiAoaXNBcnJheSh2YWwpICYmIHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbCA9IHRoaXMubXModmFsLCBjdHgsIHBhcnRpYWxzLCBpbnZlcnRlZCwgc3RhcnQsIGVuZCwgdGFncyk7XG4gICAgICB9XG5cbiAgICAgIHBhc3MgPSAhIXZhbDtcblxuICAgICAgaWYgKCFpbnZlcnRlZCAmJiBwYXNzICYmIGN0eCkge1xuICAgICAgICBjdHgucHVzaCgodHlwZW9mIHZhbCA9PSAnb2JqZWN0JykgPyB2YWwgOiBjdHhbY3R4Lmxlbmd0aCAtIDFdKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhc3M7XG4gICAgfSxcblxuICAgIC8vIGZpbmQgdmFsdWVzIHdpdGggZG90dGVkIG5hbWVzXG4gICAgZDogZnVuY3Rpb24oa2V5LCBjdHgsIHBhcnRpYWxzLCByZXR1cm5Gb3VuZCkge1xuICAgICAgdmFyIGZvdW5kLFxuICAgICAgICAgIG5hbWVzID0ga2V5LnNwbGl0KCcuJyksXG4gICAgICAgICAgdmFsID0gdGhpcy5mKG5hbWVzWzBdLCBjdHgsIHBhcnRpYWxzLCByZXR1cm5Gb3VuZCksXG4gICAgICAgICAgZG9Nb2RlbEdldCA9IHRoaXMub3B0aW9ucy5tb2RlbEdldCxcbiAgICAgICAgICBjeCA9IG51bGw7XG5cbiAgICAgIGlmIChrZXkgPT09ICcuJyAmJiBpc0FycmF5KGN0eFtjdHgubGVuZ3RoIC0gMl0pKSB7XG4gICAgICAgIHZhbCA9IGN0eFtjdHgubGVuZ3RoIC0gMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZm91bmQgPSBmaW5kSW5TY29wZShuYW1lc1tpXSwgdmFsLCBkb01vZGVsR2V0KTtcbiAgICAgICAgICBpZiAoZm91bmQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY3ggPSB2YWw7XG4gICAgICAgICAgICB2YWwgPSBmb3VuZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsID0gJyc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXR1cm5Gb3VuZCAmJiAhdmFsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZXR1cm5Gb3VuZCAmJiB0eXBlb2YgdmFsID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY3R4LnB1c2goY3gpO1xuICAgICAgICB2YWwgPSB0aGlzLm12KHZhbCwgY3R4LCBwYXJ0aWFscyk7XG4gICAgICAgIGN0eC5wb3AoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9LFxuXG4gICAgLy8gZmluZCB2YWx1ZXMgd2l0aCBub3JtYWwgbmFtZXNcbiAgICBmOiBmdW5jdGlvbihrZXksIGN0eCwgcGFydGlhbHMsIHJldHVybkZvdW5kKSB7XG4gICAgICB2YXIgdmFsID0gZmFsc2UsXG4gICAgICAgICAgdiA9IG51bGwsXG4gICAgICAgICAgZm91bmQgPSBmYWxzZSxcbiAgICAgICAgICBkb01vZGVsR2V0ID0gdGhpcy5vcHRpb25zLm1vZGVsR2V0O1xuXG4gICAgICBmb3IgKHZhciBpID0gY3R4Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHYgPSBjdHhbaV07XG4gICAgICAgIHZhbCA9IGZpbmRJblNjb3BlKGtleSwgdiwgZG9Nb2RlbEdldCk7XG4gICAgICAgIGlmICh2YWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgIHJldHVybiAocmV0dXJuRm91bmQpID8gZmFsc2UgOiBcIlwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJldHVybkZvdW5kICYmIHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YWwgPSB0aGlzLm12KHZhbCwgY3R4LCBwYXJ0aWFscyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWw7XG4gICAgfSxcblxuICAgIC8vIGhpZ2hlciBvcmRlciB0ZW1wbGF0ZXNcbiAgICBsczogZnVuY3Rpb24oZnVuYywgY3gsIHBhcnRpYWxzLCB0ZXh0LCB0YWdzKSB7XG4gICAgICB2YXIgb2xkVGFncyA9IHRoaXMub3B0aW9ucy5kZWxpbWl0ZXJzO1xuXG4gICAgICB0aGlzLm9wdGlvbnMuZGVsaW1pdGVycyA9IHRhZ3M7XG4gICAgICB0aGlzLmIodGhpcy5jdChjb2VyY2VUb1N0cmluZyhmdW5jLmNhbGwoY3gsIHRleHQpKSwgY3gsIHBhcnRpYWxzKSk7XG4gICAgICB0aGlzLm9wdGlvbnMuZGVsaW1pdGVycyA9IG9sZFRhZ3M7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gY29tcGlsZSB0ZXh0XG4gICAgY3Q6IGZ1bmN0aW9uKHRleHQsIGN4LCBwYXJ0aWFscykge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kaXNhYmxlTGFtYmRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTGFtYmRhIGZlYXR1cmVzIGRpc2FibGVkLicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuYy5jb21waWxlKHRleHQsIHRoaXMub3B0aW9ucykucmVuZGVyKGN4LCBwYXJ0aWFscyk7XG4gICAgfSxcblxuICAgIC8vIHRlbXBsYXRlIHJlc3VsdCBidWZmZXJpbmdcbiAgICBiOiBmdW5jdGlvbihzKSB7IHRoaXMuYnVmICs9IHM7IH0sXG5cbiAgICBmbDogZnVuY3Rpb24oKSB7IHZhciByID0gdGhpcy5idWY7IHRoaXMuYnVmID0gJyc7IHJldHVybiByOyB9LFxuXG4gICAgLy8gbWV0aG9kIHJlcGxhY2Ugc2VjdGlvblxuICAgIG1zOiBmdW5jdGlvbihmdW5jLCBjdHgsIHBhcnRpYWxzLCBpbnZlcnRlZCwgc3RhcnQsIGVuZCwgdGFncykge1xuICAgICAgdmFyIHRleHRTb3VyY2UsXG4gICAgICAgICAgY3ggPSBjdHhbY3R4Lmxlbmd0aCAtIDFdLFxuICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuY2FsbChjeCk7XG5cbiAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaWYgKGludmVydGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGV4dFNvdXJjZSA9ICh0aGlzLmFjdGl2ZVN1YiAmJiB0aGlzLnN1YnNUZXh0ICYmIHRoaXMuc3Vic1RleHRbdGhpcy5hY3RpdmVTdWJdKSA/IHRoaXMuc3Vic1RleHRbdGhpcy5hY3RpdmVTdWJdIDogdGhpcy50ZXh0O1xuICAgICAgICAgIHJldHVybiB0aGlzLmxzKHJlc3VsdCwgY3gsIHBhcnRpYWxzLCB0ZXh0U291cmNlLnN1YnN0cmluZyhzdGFydCwgZW5kKSwgdGFncyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgLy8gbWV0aG9kIHJlcGxhY2UgdmFyaWFibGVcbiAgICBtdjogZnVuY3Rpb24oZnVuYywgY3R4LCBwYXJ0aWFscykge1xuICAgICAgdmFyIGN4ID0gY3R4W2N0eC5sZW5ndGggLSAxXTtcbiAgICAgIHZhciByZXN1bHQgPSBmdW5jLmNhbGwoY3gpO1xuXG4gICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN0KGNvZXJjZVRvU3RyaW5nKHJlc3VsdC5jYWxsKGN4KSksIGN4LCBwYXJ0aWFscyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIHN1YjogZnVuY3Rpb24obmFtZSwgY29udGV4dCwgcGFydGlhbHMsIGluZGVudCkge1xuICAgICAgdmFyIGYgPSB0aGlzLnN1YnNbbmFtZV07XG4gICAgICBpZiAoZikge1xuICAgICAgICB0aGlzLmFjdGl2ZVN1YiA9IG5hbWU7XG4gICAgICAgIGYoY29udGV4dCwgcGFydGlhbHMsIHRoaXMsIGluZGVudCk7XG4gICAgICAgIHRoaXMuYWN0aXZlU3ViID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gIH07XG5cbiAgLy9GaW5kIGEga2V5IGluIGFuIG9iamVjdFxuICBmdW5jdGlvbiBmaW5kSW5TY29wZShrZXksIHNjb3BlLCBkb01vZGVsR2V0KSB7XG4gICAgdmFyIHZhbDtcblxuICAgIGlmIChzY29wZSAmJiB0eXBlb2Ygc2NvcGUgPT0gJ29iamVjdCcpIHtcblxuICAgICAgaWYgKHNjb3BlW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YWwgPSBzY29wZVtrZXldO1xuXG4gICAgICAvLyB0cnkgbG9va3VwIHdpdGggZ2V0IGZvciBiYWNrYm9uZSBvciBzaW1pbGFyIG1vZGVsIGRhdGFcbiAgICAgIH0gZWxzZSBpZiAoZG9Nb2RlbEdldCAmJiBzY29wZS5nZXQgJiYgdHlwZW9mIHNjb3BlLmdldCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbCA9IHNjb3BlLmdldChrZXkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVTcGVjaWFsaXplZFBhcnRpYWwoaW5zdGFuY2UsIHN1YnMsIHBhcnRpYWxzLCBzdGFja1N1YnMsIHN0YWNrUGFydGlhbHMsIHN0YWNrVGV4dCkge1xuICAgIGZ1bmN0aW9uIFBhcnRpYWxUZW1wbGF0ZSgpIHt9O1xuICAgIFBhcnRpYWxUZW1wbGF0ZS5wcm90b3R5cGUgPSBpbnN0YW5jZTtcbiAgICBmdW5jdGlvbiBTdWJzdGl0dXRpb25zKCkge307XG4gICAgU3Vic3RpdHV0aW9ucy5wcm90b3R5cGUgPSBpbnN0YW5jZS5zdWJzO1xuICAgIHZhciBrZXk7XG4gICAgdmFyIHBhcnRpYWwgPSBuZXcgUGFydGlhbFRlbXBsYXRlKCk7XG4gICAgcGFydGlhbC5zdWJzID0gbmV3IFN1YnN0aXR1dGlvbnMoKTtcbiAgICBwYXJ0aWFsLnN1YnNUZXh0ID0ge307ICAvL2hlaGUuIHN1YnN0ZXh0LlxuICAgIHBhcnRpYWwuYnVmID0gJyc7XG5cbiAgICBzdGFja1N1YnMgPSBzdGFja1N1YnMgfHwge307XG4gICAgcGFydGlhbC5zdGFja1N1YnMgPSBzdGFja1N1YnM7XG4gICAgcGFydGlhbC5zdWJzVGV4dCA9IHN0YWNrVGV4dDtcbiAgICBmb3IgKGtleSBpbiBzdWJzKSB7XG4gICAgICBpZiAoIXN0YWNrU3Vic1trZXldKSBzdGFja1N1YnNba2V5XSA9IHN1YnNba2V5XTtcbiAgICB9XG4gICAgZm9yIChrZXkgaW4gc3RhY2tTdWJzKSB7XG4gICAgICBwYXJ0aWFsLnN1YnNba2V5XSA9IHN0YWNrU3Vic1trZXldO1xuICAgIH1cblxuICAgIHN0YWNrUGFydGlhbHMgPSBzdGFja1BhcnRpYWxzIHx8IHt9O1xuICAgIHBhcnRpYWwuc3RhY2tQYXJ0aWFscyA9IHN0YWNrUGFydGlhbHM7XG4gICAgZm9yIChrZXkgaW4gcGFydGlhbHMpIHtcbiAgICAgIGlmICghc3RhY2tQYXJ0aWFsc1trZXldKSBzdGFja1BhcnRpYWxzW2tleV0gPSBwYXJ0aWFsc1trZXldO1xuICAgIH1cbiAgICBmb3IgKGtleSBpbiBzdGFja1BhcnRpYWxzKSB7XG4gICAgICBwYXJ0aWFsLnBhcnRpYWxzW2tleV0gPSBzdGFja1BhcnRpYWxzW2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnRpYWw7XG4gIH1cblxuICB2YXIgckFtcCA9IC8mL2csXG4gICAgICByTHQgPSAvPC9nLFxuICAgICAgckd0ID0gLz4vZyxcbiAgICAgIHJBcG9zID0gL1xcJy9nLFxuICAgICAgclF1b3QgPSAvXFxcIi9nLFxuICAgICAgaENoYXJzID0gL1smPD5cXFwiXFwnXS87XG5cbiAgZnVuY3Rpb24gY29lcmNlVG9TdHJpbmcodmFsKSB7XG4gICAgcmV0dXJuIFN0cmluZygodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSA/ICcnIDogdmFsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhvZ2FuRXNjYXBlKHN0cikge1xuICAgIHN0ciA9IGNvZXJjZVRvU3RyaW5nKHN0cik7XG4gICAgcmV0dXJuIGhDaGFycy50ZXN0KHN0cikgP1xuICAgICAgc3RyXG4gICAgICAgIC5yZXBsYWNlKHJBbXAsICcmYW1wOycpXG4gICAgICAgIC5yZXBsYWNlKHJMdCwgJyZsdDsnKVxuICAgICAgICAucmVwbGFjZShyR3QsICcmZ3Q7JylcbiAgICAgICAgLnJlcGxhY2UockFwb3MsICcmIzM5OycpXG4gICAgICAgIC5yZXBsYWNlKHJRdW90LCAnJnF1b3Q7JykgOlxuICAgICAgc3RyO1xuICB9XG5cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKGEpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG59KSh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgPyBleHBvcnRzIDogSG9nYW4pO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLypcclxuKiBAQXV0aG9yOiDpnZJcclxuKiBARGF0ZTogICAyMDIwLTAzLTE1IDEwOjEwOjI3XHJcbiogQExhc3QgTW9kaWZpZWQgYnk6ICAg6Z2SXHJcbiogQExhc3QgTW9kaWZpZWQgdGltZTogMjAyMC0wNC0xMCAxNTo0MTo1MVxyXG4qL1xyXG5yZXF1aXJlKCcuL2luZGV4LmNzcycpO1xyXG52YXIgX21tID0gcmVxdWlyZSgndXRpbC9tbS5qcycpO1xyXG5cclxuLy8g6YCa55So6aG16Z2i5aS06YOoXHJcbnZhciBoZWFkZXIgPSB7XHJcblx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLm9uTG9hZCgpO1xyXG5cdFx0dGhpcy5iaW5kRXZlbnQoKTtcclxuXHR9LFxyXG5cdG9uTG9hZDogZnVuY3Rpb24oKSB7XHJcblx0XHRjb25zb2xlLmxvZygnb25Mb2FkJyk7XHJcblxyXG5cdFx0dmFyIGtleXdvcmQgPSBfbW0uZ2V0VXJsUGFyYW0oJ2tleXdvcmQnKTtcclxuXHRcdC8vIGtleXdvcmTlrZjlnKjvvIzvvIzliJnlm57loavovpPlhaXmoYZcclxuXHRcdGlmKGtleXdvcmQpe1xyXG5cdFx0XHQkKCcjc2VhcmNoLWlucHV0JykudmFsKGtleXdvcmQpO1xyXG5cdFx0fTtcclxuXHR9LFxyXG5cdGJpbmRFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xyXG5cdFx0Ly8g54K55Ye75pCc57Si5oyJ6ZKu5Lul5ZCOIO+8jOWBmuaQnOe0ouaPkOS6pFxyXG5cdFx0JCgnI3NlYXJjaC1idG4nKS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdFx0X3RoaXMuc2VhcmNoU3VibWl0KCk7XHJcblx0XHR9KTtcclxuXHRcdCQoJyNzZWFyY2gtaW5wdXQnKS5rZXl1cChmdW5jdGlvbihlKSB7XHJcblx0XHRcdC8vIOWOn+eUn+eahGpz6ZSu55uY56CBXHJcblx0XHRcdGlmKGUua2V5Q29kZSA9PT0gMTMpe1xyXG5cdFx0XHRcdF90aGlzLnNlYXJjaFN1Ym1pdCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5pCc57Si55qE5o+Q5LqkXHJcblx0c2VhcmNoU3VibWl0OiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBrZXl3b3JkID0gJC50cmltKCQoJyNzZWFyY2gtaW5wdXQnKS52YWwoKSk7XHJcblx0XHQvLyDlpoLmnpzmj5DkuqTnmoTml7blgJnmnIlrZXl3b3Jk77yM5q2j5bi46Lez6L2s5YiwbGlzdOmhtVxyXG5cdFx0aWYoa2V5d29yZCkge1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL2xpc3QuaHRtbD9rZXl3b3JkPScgKyBrZXl3b3JkO1xyXG5cdFx0fVxyXG5cdFx0Ly8g5aaC5p6ca2V5d29yZOS4uuepuu+8jOebtOaOpei/lOWbnummlumhtVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdF9tbS5kb0hvbWUoKTtcclxuXHRcdH1cclxuXHRcdGNvbnNvbGUubG9nKGtleXdvcmQpO1x0XHJcblx0fVxyXG59XHJcblxyXG5oZWFkZXIuaW5pdCgpOyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIi8qXHJcbiogQEF1dGhvcjog6Z2SXHJcbiogQERhdGU6ICAgMjAyMC0wMy0xNCAxNzozODo0N1xyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIOmdklxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMjAtMDQtMjQgMjI6MTY6NTRcclxuKi9cclxucmVxdWlyZSgnLi9pbmRleC5jc3MnKTtcclxudmFyIF9tbSA9IHJlcXVpcmUoJ3V0aWwvbW0uanMnKTtcclxudmFyIF91c2VyID0gcmVxdWlyZSgnc2VydmljZS91c2VyLXNlcnZpY2UuanMnKTtcclxudmFyIF9jYXJ0ID0gcmVxdWlyZSgnc2VydmljZS9jYXJ0LXNlcnZpY2UuanMnKTtcclxuXHJcbi8vIOWvvOiIqlxyXG52YXIgbmF2ID0ge1xyXG5cdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5iaW5kRXZlbnQoKTtcclxuXHRcdHRoaXMubG9hZFVzZXJJbmZvKCk7XHJcblx0XHR0aGlzLmxvYWRDYXJ0Q291bnQoKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblx0YmluZEV2ZW50OiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIOeZu+W9leeCueWHu+S6i+S7tlxyXG5cdFx0JCgnLmpzLWxvZ2luJykuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdFx0X21tLmRvTG9naW4oKTtcclxuXHRcdH0pO1xyXG5cdFx0Ly8g5rOo5YaM54K55Ye75LqL5Lu2XHJcblx0XHQkKCcuanMtcmVnaXN0ZXInKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL3VzZXItcmVnaXN0ZXIuaHRtbCc7XHJcblx0XHR9KTtcclxuXHRcdC8vIOmAgOWHuueCueWHu+S6i+S7tlxyXG5cdFx0JCgnLmpzLWxvZ291dCcpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRcdF91c2VyLmxvZ291dChmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyTXNnKXtcclxuXHRcdFx0XHRfbW0uZXJyb3JUaXBzKGVyck1zZyk7XHJcblx0XHRcdH0pXHJcblx0XHR9KTtcclxuXHJcblx0fSxcclxuXHQvLyDliqDovb3nlKjmiLfkv6Hmga9cclxuXHRsb2FkVXNlckluZm86IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJzEyMzMxMjMxMicpO1xyXG5cdFx0X3VzZXIuY2hlY2tMb2dpbihmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygn55m75b2V5oiQ5YqfJylcclxuXHRcdFx0JCgnLnVzZXIubm90LWxvZ2luJykuaGlkZSgpLnNpYmxpbmdzKCcudXNlci5sb2dpbicpLnNob3coKS5maW5kKCcudXNlcm5hbWUnKS50ZXh0KHJlcy51c2VybmFtZSk7XHJcblx0XHR9LCBmdW5jdGlvbihlcnJNc2cpIHtcclxuXHRcdFx0Ly8gZG8gbm90aGluZ1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHQvLyDliqDovb3otK3nianovabmlbDph49cclxuXHRsb2FkQ2FydENvdW50OiBmdW5jdGlvbigpe1xyXG5cdFx0X2NhcnQuZ2V0Q2FydENvdW50KGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0XHQkKCcubmF2IC5jYXJ0LWNvdW50JykudGV4dChyZXMgfHwgMCk7XHJcblx0XHR9LCBmdW5jdGlvbihlcnJNc2cpIHtcclxuXHRcdFx0JCgnLm5hdiAuY2FydC1jb3VudCcpLnRleHQoMCk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG5hdi5pbml0KCk7IiwibW9kdWxlLmV4cG9ydHMgPSBcInt7I2xpc3R9fVxcclxcbnt7I2lzQWN0aXZlfX1cXHJcXG48ZGl2IGNsYXNzPVxcXCJhZGRyZXNzLWl0ZW0gYWN0aXZlXFxcIiBkYXRhLWlkPVxcXCJ7e2lkfX1cXFwiPlxcclxcbnt7L2lzQWN0aXZlfX1cXHJcXG57e15pc0FjdGl2ZX19XFxyXFxuPGRpdiBjbGFzcz1cXFwiYWRkcmVzcy1pdGVtXFxcIiBkYXRhLWlkPVxcXCJ7e2lkfX1cXFwiPlxcclxcbnt7L2lzQWN0aXZlfX1cXHJcXG5cXHQ8ZGl2IGNsYXNzPVxcXCJhZGRyZXNzLXRpdGxlXFxcIj5cXHJcXG5cXHRcXHR7e3JlY2VpdmVyQ2l0eX19IHt7cmVjZWl2ZXJQcm92aW5jZX19IO+8iCB7e3JlY2VpdmVyTmFtZX19IOaUtu+8iVxcclxcblxcdDwvZGl2PlxcclxcblxcdDxkaXYgY2xhc3M9XFxcImFkZHJlc3MtZGV0YWlsXFxcIj5cXHJcXG5cXHRcXHR7e3JlY2VpdmVyQWRkcmVzc319IHt7cmVjZWl2ZXJQaG9uZX19XFxyXFxuXFx0PC9kaXY+XFxyXFxuXFx0PGRpdiBjbGFzcz1cXFwiYWRkcmVzcy1vcGVyYVxcXCI+XFxyXFxuXFx0XFx0PHNwYW4gY2xhc3M9XFxcImxpbmsgYWRkcmVzcy11cGRhdGVcXFwiPue8lui+kTwvc3Bhbj5cXHJcXG5cXHRcXHQ8c3BhbiBjbGFzcz1cXFwibGluayBhZGRyZXNzLWRlbGV0ZVxcXCI+5Yig6ZmkPC9zcGFuPlxcclxcblxcdDwvZGl2PlxcclxcbjwvZGl2Plxcclxcbnt7L2xpc3R9fVxcclxcblxcclxcbjxkaXYgY2xhc3M9XFxcImFkZHJlc3MtYWRkXFxcIj5cXHJcXG5cXHQ8ZGl2IGNsYXNzPVxcXCJhZGRyZXNzLW5ld1xcXCI+XFxyXFxuXFx0XFx0PGkgY2xhc3M9XFxcImZhIGZhLXBsdXNcXFwiPjwvaT5cXHJcXG5cXHRcXHQ8ZGl2IGNsYXNzPVxcXCJ0ZXh0XFxcIj7kvb/nlKjmlrDlnLDlnYA8L2Rpdj5cXHJcXG5cXHQ8L2Rpdj5cXHJcXG48L2Rpdj5cXHJcXG5cIjsiLCIvKlxyXG4qIEBBdXRob3I6IOmdklxyXG4qIEBEYXRlOiAgIDIwMjAtMDQtMjkgMTY6MzY6NTJcclxuKiBATGFzdCBNb2RpZmllZCBieTogICDpnZJcclxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDIwLTA1LTA5IDE2OjI5OjIxXHJcbiovXHJcbi8qXHJcbiogQEF1dGhvcjog6Z2SXHJcbiogQERhdGU6ICAgMjAyMC0wNC0yNyAxMDo1NzowNlxyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIOmdklxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMjAtMDQtMjkgMTY6Mzc6NTJcclxuKi9cclxudmFyIF9tbSA9IHJlcXVpcmUoJ3V0aWwvbW0uanMnKTtcclxudmFyIF9jaXRpZXMgPSByZXF1aXJlKCd1dGlsL2NpdGllcy9pbmRleC5qcycpO1xyXG52YXIgX2FkZHJlc3MgPSByZXF1aXJlKCdzZXJ2aWNlL2FkZHJlc3Mtc2VydmljZS5qcycpO1xyXG52YXIgdGVtcGxhdGVBZGRyZXNzID0gcmVxdWlyZSgnLi9hZGRyZXNzLW1vZGFsLnN0cmluZycpO1xyXG5cclxudmFyIGFkZHJlc3NNb2RhbCA9IHtcclxuXHRzaG93OiBmdW5jdGlvbihvcHRpb24pIHtcclxuXHRcdC8vIG9wdGlvbueahOe7keWumlxyXG5cdFx0dGhpcy5vcHRpb24gPSBvcHRpb247XHJcblx0XHR0aGlzLm9wdGlvbi5kYXRhID0gb3B0aW9uLmRhdGEgfHwge307XHJcblx0XHR0aGlzLiRtb2RhbFdyYXAgPSAkKCcubW9kYWwtd3JhcCcpO1xyXG5cdFx0Ly8g5riy5p+T6aG16Z2iXHJcblx0XHR0aGlzLmxvYWRNb2RhbCgpO1xyXG5cdFx0Ly8g57uR5a6a5LqL5Lu2XHJcblx0XHR0aGlzLmJpbmRFdmVudCgpO1xyXG5cdH0sXHJcblx0bG9hZE1vZGFsOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBhZGRyZXNzTW9kYWxIdG1sID0gX21tLnJlbmRlckh0bWwodGVtcGxhdGVBZGRyZXNzLCB7XHJcblx0XHRcdGlzVXBkYXRlOiB0aGlzLm9wdGlvbi5pc1VwZGF0ZSxcclxuXHRcdFx0ZGF0YTogdGhpcy5vcHRpb24uZGF0YVxyXG5cdFx0fSk7XHJcblx0XHR0aGlzLiRtb2RhbFdyYXAuaHRtbChhZGRyZXNzTW9kYWxIdG1sKTtcclxuXHRcdC8vIOWKoOi9veecgeS7vVxyXG5cdFx0dGhpcy5sb2FkUHJvdmluY2UoKTtcclxuXHR9LFxyXG5cdC8vIOWKoOi9veecgeS7veS/oeaBr1xyXG5cdGxvYWRQcm92aW5jZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgcHJvdmluY2VzID0gX2NpdGllcy5nZXRQcm92aW5jZXMoKSB8fCBbXSxcclxuXHRcdFx0JHByb3ZpbmNlU2VsZWN0ID0gdGhpcy4kbW9kYWxXcmFwLmZpbmQoJyNyZWNlaXZlci1wcm92aW5jZScpO1xyXG5cdFx0JHByb3ZpbmNlU2VsZWN0Lmh0bWwodGhpcy5nZXRTZWxlY3RPcHRpb24ocHJvdmluY2VzKSk7XHJcblx0XHQvLyDlpoLmnpzmmK/mm7TmlrDlnLDlnYDvvIzlubbkuJTmnInnnIHku73kv6Hmga/vvIzlgZrnnIHku73nmoTlm57loatcclxuXHRcdGlmKHRoaXMub3B0aW9uLmlzVXBkYXRlICYmIHRoaXMub3B0aW9uLmRhdGEucmVjZWl2ZXJQcm92aW5jZSl7XHJcblx0XHRcdCRwcm92aW5jZVNlbGVjdC52YWwodGhpcy5vcHRpb24uZGF0YS5yZWNlaXZlclByb3ZpbmNlKTtcclxuXHRcdFx0dGhpcy5sb2FkQ2l0aWVzKHRoaXMub3B0aW9uLmRhdGEucmVjZWl2ZXJQcm92aW5jZSk7XHJcblxyXG5cdFx0fVxyXG5cdH0sXHJcblx0Ly8g5Yqg6L295Z+O5biC5L+h5oGvXHJcblx0bG9hZENpdGllczogZnVuY3Rpb24ocHJvdmluY2VOYW1lKSB7XHJcblx0XHR2YXIgY2l0aWVzID0gX2NpdGllcy5nZXRDaXRpZXMocHJvdmluY2VOYW1lKSB8fCBbXSxcclxuXHRcdFx0JGNpdHlTZWxlY3QgPSB0aGlzLiRtb2RhbFdyYXAuZmluZCgnI3JlY2VpdmVyLWNpdHknKTtcclxuXHRcdCRjaXR5U2VsZWN0Lmh0bWwodGhpcy5nZXRTZWxlY3RPcHRpb24oY2l0aWVzKSk7XHJcblxyXG5cdFx0Ly8g5aaC5p6c5piv5pu05paw5Zyw5Z2A77yM5bm25LiU5pyJ5Z+O5biC5L+h5oGv77yM5YGa5Z+O5biC55qE5Zue5aGrXHJcblx0XHQvLyDvvJ/vvJ/vvJ9cclxuXHRcdGlmKHRoaXMub3B0aW9uLmlzVXBkYXRlICYmIHRoaXMub3B0aW9uLmRhdGEucmVjZWl2ZXJDaXR5ICYmIHRoaXMub3B0aW9uLmRhdGEucmVjZWl2ZXJQcm92aW5jZSA9PT0gcHJvdmluY2VOYW1lKXtcclxuXHRcdFx0JGNpdHlTZWxlY3QudmFsKHRoaXMub3B0aW9uLmRhdGEucmVjZWl2ZXJDaXR5KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdC8vIOiOt+WPlnNlbGVjdOahhueahOmAiemhue+8jOi+k+WFpe+8mmFycmF577yM6L6T5Ye677yaSFRNTFxyXG5cdGdldFNlbGVjdE9wdGlvbjogZnVuY3Rpb24ob3B0aW9uQXJyYXkpIHtcclxuXHRcdHZhciBodG1sID0gJzxvcHRpb24gdmFsdWU9XCJcIj7or7fpgInmi6k8L29wdGlvbj4nXHJcblx0XHRmb3IodmFyIGk9MCxsZW5ndGg9b3B0aW9uQXJyYXkubGVuZ3RoOyBpPGxlbmd0aDsgaSsrKXtcclxuXHRcdFx0aHRtbCArPSAnPG9wdGlvbiB2YWx1ZT1cIicgKyBvcHRpb25BcnJheVtpXSArICdcIj4nICsgb3B0aW9uQXJyYXlbaV0gKyAnPC9vcHRpb24+J1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGh0bWw7XHJcblx0fSxcclxuXHRiaW5kRXZlbnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIF90aGlzID0gdGhpcztcclxuXHRcdC8vIOecgeS7veWSjOWfjuW4gueahOS6jOe6p+iBlOWKqFxyXG5cdFx0dGhpcy4kbW9kYWxXcmFwLmZpbmQoJyNyZWNlaXZlci1wcm92aW5jZScpLmNoYW5nZShmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHNlbGVjdGVkUHJvdmluY2UgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0XHRfdGhpcy5sb2FkQ2l0aWVzKHNlbGVjdGVkUHJvdmluY2UpO1xyXG5cdFx0fSk7XHJcblx0XHQvLyDmj5DkuqTmlLbotKflnLDlnYBcclxuXHRcdHRoaXMuJG1vZGFsV3JhcC5maW5kKCcuYWRkcmVzcy1idG4nKS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHJlY2VpdmVySW5mbyA9IF90aGlzLmdldFJlY2VpdmVySW5mbygpLFxyXG5cdFx0XHRcdGlzVXBkYXRlID0gX3RoaXMub3B0aW9uLmlzVXBkYXRlO1xyXG5cclxuXHRcdFx0Ly8g5L2/55So5paw5Zyw5Z2A77yM5LiU6aqM6K+B6YCa6L+HXHJcblx0XHRcdGlmKCFpc1VwZGF0ZSAmJiByZWNlaXZlckluZm8uc3RhdHVzKXtcclxuXHRcdFx0XHRfYWRkcmVzcy5zYXZlKHJlY2VpdmVySW5mby5kYXRhLCBmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0XHRcdF9tbS5zdWNjZXNzVGlwcygn5Zyw5Z2A5re75Yqg5oiQ5YqfJyk7XHJcblx0XHRcdFx0XHRfdGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0XHR0eXBlb2YgX3RoaXMub3B0aW9uLm9uU3VjY2VzcyA9PT0gJ2Z1bmN0aW9uJ1xyXG5cdFx0XHRcdFx0XHQmJiBfdGhpcy5vcHRpb24ub25TdWNjZXNzKHJlcylcclxuXHRcdFx0XHR9LCBmdW5jdGlvbihlcnJNc2cpIHtcclxuXHRcdFx0XHRcdF9tbS5lcnJvclRpcHMoZXJyTXNnKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyDmm7TmlrDmlLbku7bkurrvvIzlubbkuJTpqozor4HpgJrov4dcclxuXHRcdFx0ZWxzZSBpZihpc1VwZGF0ZSAmJiByZWNlaXZlckluZm8uc3RhdHVzKXtcclxuXHRcdFx0XHRfYWRkcmVzcy51cGRhdGUocmVjZWl2ZXJJbmZvLmRhdGEsIGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0XHRcdFx0X21tLnN1Y2Nlc3NUaXBzKCflnLDlnYDkv67mlLnmiJDlip8nKTtcclxuXHRcdFx0XHRcdF90aGlzLmhpZGUoKTtcclxuXHRcdFx0XHRcdHR5cGVvZiBfdGhpcy5vcHRpb24ub25TdWNjZXNzID09PSAnZnVuY3Rpb24nXHJcblx0XHRcdFx0XHRcdCYmIF90aGlzLm9wdGlvbi5vblN1Y2Nlc3MocmVzKVxyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uKGVyck1zZykge1xyXG5cdFx0XHRcdFx0X21tLmVycm9yVGlwcyhlcnJNc2cpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIOmqjOivgeS4jemAmui/h1xyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRfbW0uZXJyb3JUaXBzKHJlY2VpdmVySW5mby5lcnJNc2cgfHwgJ+WlveWDj+WTqumHjOS4jeWvueS6hn4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHQvLyDkv53or4Hngrnlh7ttb2RhbOWGheWuueWMuueahOaXtuWAme+8jOS4jeWFs+mXreW8ueeql1xyXG5cdFx0dGhpcy4kbW9kYWxXcmFwLmZpbmQoJy5tb2RhbC1jb250YWluZXInKS5jbGljayhmdW5jdGlvbihlKSB7XHJcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHR9KTtcclxuXHRcdC8vIOeCueWHu+WPieWPt+aIluiAheiSmeeJiOWMuuWfn++8jOWFs+mXreW8ueeql1xyXG5cdFx0dGhpcy4kbW9kYWxXcmFwLmZpbmQoJy5jbG9zZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRfdGhpcy5oaWRlKCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdC8vIOWKoOi9veihqOWNlemHjOaUtuS7tuS6uuS/oeaBr++8jOW5tuWBmuihqOWNleeahOmqjOivgVxyXG5cdGdldFJlY2VpdmVySW5mbzogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgcmVjZWl2ZXJJbmZvIFx0PSB7fSxcclxuXHRcdFx0cmVzdWx0IFx0XHRcdD0ge1xyXG5cdFx0XHRcdHN0YXR1czogZmFsc2VcclxuXHRcdFx0fTtcclxuXHJcblx0XHRyZWNlaXZlckluZm8ucmVjZWl2ZXJOYW1lIFx0XHQ9ICQudHJpbSh0aGlzLiRtb2RhbFdyYXAuZmluZCgnI3JlY2VpdmVyLW5hbWUnKS52YWwoKSk7XHJcblx0XHRyZWNlaXZlckluZm8ucmVjZWl2ZXJQcm92aW5jZSBcdD0gdGhpcy4kbW9kYWxXcmFwLmZpbmQoJyNyZWNlaXZlci1wcm92aW5jZScpLnZhbCgpO1xyXG5cdFx0cmVjZWl2ZXJJbmZvLnJlY2VpdmVyQ2l0eSBcdFx0PSB0aGlzLiRtb2RhbFdyYXAuZmluZCgnI3JlY2VpdmVyLWNpdHknKS52YWwoKTtcclxuXHRcdHJlY2VpdmVySW5mby5yZWNlaXZlckFkZHJlc3MgXHQ9ICQudHJpbSh0aGlzLiRtb2RhbFdyYXAuZmluZCgnI3JlY2VpdmVyLWFkZHJlc3MnKS52YWwoKSk7XHJcblx0XHRyZWNlaXZlckluZm8ucmVjZWl2ZXJNb2JpbGUgXHRcdD0gJC50cmltKHRoaXMuJG1vZGFsV3JhcC5maW5kKCcjcmVjZWl2ZXItcGhvbmUnKS52YWwoKSk7XHJcblx0XHRyZWNlaXZlckluZm8ucmVjZWl2ZXJaaXAgXHRcdD0gJC50cmltKHRoaXMuJG1vZGFsV3JhcC5maW5kKCcjcmVjZWl2ZXItemlwJykudmFsKCkpO1xyXG5cdFx0Y29uc29sZS5sb2cocmVjZWl2ZXJJbmZvKTtcclxuXHJcblx0XHRpZih0aGlzLm9wdGlvbi5pc1VwZGF0ZSkge1xyXG5cdFx0XHRyZWNlaXZlckluZm8uaWQgXHRcdFx0PSB0aGlzLiRtb2RhbFdyYXAuZmluZCgnI3JlY2VpdmVyLWlkJykudmFsKCk7XHJcblx0XHR9XHJcblx0XHQvLyDooajljZXpqozor4FcclxuXHRcdGlmKCFyZWNlaXZlckluZm8ucmVjZWl2ZXJOYW1lKSB7XHJcblx0XHRcdHJlc3VsdC5lcnJNc2cgPSAn6K+36L6T5YWl5pS25Lu25Lq65aeT5ZCNJztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKCFyZWNlaXZlckluZm8ucmVjZWl2ZXJQcm92aW5jZSkge1xyXG5cdFx0XHRyZXN1bHQuZXJyTXNnID0gJ+ivt+mAieaLqeaUtuS7tuS6uuaJgOWcqOecgeS7vSc7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICghcmVjZWl2ZXJJbmZvLnJlY2VpdmVyQ2l0eSkge1xyXG5cdFx0XHRyZXN1bHQuZXJyTXNnID0gJ+ivt+mAieaLqeaUtuS7tuS6uuaJgOWcqOWfjuW4gic7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICghcmVjZWl2ZXJJbmZvLnJlY2VpdmVyQWRkcmVzcykge1xyXG5cdFx0XHRyZXN1bHQuZXJyTXNnID0gJ+ivt+i+k+WFpeaUtuS7tuS6uuivpue7huWcsOWdgCc7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICghcmVjZWl2ZXJJbmZvLnJlY2VpdmVyTW9iaWxlKSB7XHJcblx0XHRcdHJlc3VsdC5lcnJNc2cgPSAn6K+36L6T5YWl5pS25Lu25Lq65omL5py65Y+3JztcclxuXHRcdH1cclxuXHRcdC8vIOaJgOaciemqjOivgemDvemAmui/h+S6hlxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJlc3VsdC5zdGF0dXMgXHQ9IHRydWU7XHJcblx0XHRcdHJlc3VsdC5kYXRhIFx0PSByZWNlaXZlckluZm87XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cclxuXHR9LFxyXG5cdC8vIOWFs+mXreW8ueeql1xyXG5cdGhpZGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy4kbW9kYWxXcmFwLmVtcHR5KCk7XHJcblx0fVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gYWRkcmVzc01vZGFsOyIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGNsYXNzPVxcXCJtb2RhbCBjbG9zZVxcXCI+XFxyXFxuXFx0PGRpdiBjbGFzcz1cXFwibW9kYWwtY29udGFpbmVyXFxcIj5cXHJcXG5cXHRcXHQ8ZGl2IGNsYXNzPVxcXCJtb2RhbC1oZWFkZXJcXFwiPlxcclxcblxcdFxcdFxcdHt7I2lzVXBkYXRlfX1cXHJcXG5cXHRcXHRcXHQ8aDEgY2xhc3M9XFxcIm1vZGFsLXRpdGxlXFxcIj7mm7TmlrDlnLDlnYA8L2gxPlxcclxcblxcdFxcdFxcdHt7L2lzVXBkYXRlfX1cXHJcXG5cXHRcXHRcXHR7e15pc1VwZGF0ZX19XFxyXFxuXFx0XFx0XFx0PGgxIGNsYXNzPVxcXCJtb2RhbC10aXRsZVxcXCI+5L2/55So5paw5Zyw5Z2APC9oMT5cXHJcXG5cXHRcXHRcXHR7ey9pc1VwZGF0ZX19XFxyXFxuXFx0XFx0XFx0PGkgY2xhc3M9XFxcImZhIGZhLXRpbWVzIGNsb3NlXFxcIj48L2k+XFxyXFxuXFx0XFx0PC9kaXY+XFxyXFxuXFx0XFx0PGRpdiBjbGFzcz1cXFwibW9kYWwtYm9keVxcXCI+XFxyXFxuXFx0XFx0XFx0PGRpdiBjbGFzcz1cXFwiZm9ybVxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0PGRpdiBjbGFzcz1cXFwiZm9ybS1saW5lXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8bGFiZWwgY2xhc3M9XFxcImxhYmVsXFxcIiBmb3I9XFxcInJlY2VpdmVyLW5hbWVcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDxzcGFuIGNsYXNzPVxcXCJyZXF1aXJlZFxcXCI+Kjwvc3Bhbj5cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHTmlLbku7bkurrlp5PlkI3vvJpcXHJcXG5cXHRcXHRcXHRcXHRcXHQ8L2xhYmVsPlxcclxcblxcdFxcdFxcdFxcdFxcdDxpbnB1dCBjbGFzcz1cXFwiZm9ybS1pdGVtXFxcIiBpZD1cXFwicmVjZWl2ZXItbmFtZVxcXCIgcGxhY2Vob2xkZXI9XFxcIuivt+i+k+WFpeaUtuS7tuS6uuWnk+WQjVxcXCIgdmFsdWU9XFxcInt7ZGF0YS5yZWNlaXZlck5hbWV9fVxcXCIgLz5cXHJcXG5cXHRcXHRcXHRcXHQ8L2Rpdj5cXHJcXG5cXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVxcXCJmb3JtLWxpbmVcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdDxsYWJlbCBjbGFzcz1cXFwibGFiZWxcXFwiIGZvcj1cXFwicmVjZWl2ZXItcHJvdmluY2VcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDxzcGFuIGNsYXNzPVxcXCJyZXF1aXJlZFxcXCI+Kjwvc3Bhbj5cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHTmiYDlnKjln47luILvvJpcXHJcXG5cXHRcXHRcXHRcXHRcXHQ8L2xhYmVsPlxcclxcblxcdFxcdFxcdFxcdFxcdDxzZWxlY3QgY2xhc3M9XFxcImZvcm0taXRlbVxcXCIgaWQ9XFxcInJlY2VpdmVyLXByb3ZpbmNlXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHQ8b3B0aW9uIHZhbHVlPVxcXCJcXFwiPuivt+mAieaLqTwvb3B0aW9uPlxcclxcblxcdFxcdFxcdFxcdFxcdDwvc2VsZWN0PlxcclxcblxcdFxcdFxcdFxcdFxcdDxzZWxlY3QgY2xhc3M9XFxcImZvcm0taXRlbVxcXCIgaWQ9XFxcInJlY2VpdmVyLWNpdHlcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDxvcHRpb24gdmFsdWU9XFxcIlxcXCI+6K+36YCJ5oupPC9vcHRpb24+XFxyXFxuXFx0XFx0XFx0XFx0XFx0PC9zZWxlY3Q+XFxyXFxuXFx0XFx0XFx0XFx0PC9kaXY+XFxyXFxuXFx0XFx0XFx0XFx0PGRpdiBjbGFzcz1cXFwiZm9ybS1saW5lXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8bGFiZWwgY2xhc3M9XFxcImxhYmVsXFxcIiBmb3I9XFxcInJlY2VpdmVyLWFkZHJlc3NcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDxzcGFuIGNsYXNzPVxcXCJyZXF1aXJlZFxcXCI+Kjwvc3Bhbj5cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHTor6bnu4blnLDlnYDvvJpcXHJcXG5cXHRcXHRcXHRcXHRcXHQ8L2xhYmVsPlxcclxcblxcdFxcdFxcdFxcdFxcdDxpbnB1dCBjbGFzcz1cXFwiZm9ybS1pdGVtXFxcIiBpZD1cXFwicmVjZWl2ZXItYWRkcmVzc1xcXCIgcGxhY2Vob2xkZXI9XFxcIuivt+eyvuehruWIsOmXqOeJjOWPt1xcXCIgdmFsdWU9XFxcInt7ZGF0YS5yZWNlaXZlckFkZHJlc3N9fVxcXCIgLz5cXHJcXG5cXHRcXHRcXHRcXHQ8L2Rpdj5cXHJcXG5cXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVxcXCJmb3JtLWxpbmVcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdDxsYWJlbCBjbGFzcz1cXFwibGFiZWxcXFwiIGZvcj1cXFwicmVjZWl2ZXItcGhvbmVcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDxzcGFuIGNsYXNzPVxcXCJyZXF1aXJlZFxcXCI+Kjwvc3Bhbj5cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHTmlLbku7bkurrmiYvmnLrvvJpcXHJcXG5cXHRcXHRcXHRcXHRcXHQ8L2xhYmVsPlxcclxcblxcdFxcdFxcdFxcdFxcdDxpbnB1dCBjbGFzcz1cXFwiZm9ybS1pdGVtXFxcIiBpZD1cXFwicmVjZWl2ZXItcGhvbmVcXFwiIHBsYWNlaG9sZGVyPVxcXCLor7fovpPlhaXmlLbku7bkurrlp5PlkI1cXFwiIHZhbHVlPVxcXCJ7e2RhdGEucmVjZWl2ZXJQaG9uZX19XFxcIiAvPlxcclxcblxcdFxcdFxcdFxcdDwvZGl2PlxcclxcblxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XFxcImZvcm0tbGluZVxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0XFx0PGxhYmVsIGNsYXNzPVxcXCJsYWJlbFxcXCIgZm9yPVxcXCJyZWNlaXZlci16aXBcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdOmCruaUv+e8luegge+8mlxcclxcblxcdFxcdFxcdFxcdFxcdDwvbGFiZWw+XFxyXFxuXFx0XFx0XFx0XFx0XFx0PGlucHV0IGNsYXNzPVxcXCJmb3JtLWl0ZW1cXFwiIGlkPVxcXCJyZWNlaXZlci16aXBcXFwiIHBsYWNlaG9sZGVyPVxcXCLlpoLvvJoxMDAwMDBcXFwiIHZhbHVlPVxcXCJ7e2RhdGEucmVjZWl2ZXJaaXB9fVxcXCIgLz5cXHJcXG5cXHRcXHRcXHRcXHQ8L2Rpdj5cXHJcXG5cXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVxcXCJmb3JtLWxpbmVcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdDxpbnB1dCB0eXBlPVxcXCJoaWRkZW5cXFwiIGlkPVxcXCJyZWNlaXZlci1pZFxcXCIgdmFsdWU9XFxcInt7ZGF0YS5pZH19XFxcIiAvPlxcclxcblxcdFxcdFxcdFxcdFxcdDxhIGNsYXNzPVxcXCJidG4gYWRkcmVzcy1idG5cXFwiPuS/neWtmOaUtui0p+WcsOWdgDwvYT5cXHJcXG5cXHRcXHRcXHRcXHQ8L2Rpdj5cXHJcXG5cXHRcXHRcXHQ8L2Rpdj5cXHJcXG5cXHRcXHQ8L2Rpdj5cXHJcXG5cXHQ8L2Rpdj5cXHJcXG48L2Rpdj5cXHJcXG5cIjsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvKlxyXG4qIEBBdXRob3I6IOmdklxyXG4qIEBEYXRlOiAgIDIwMjAtMDQtMjcgMTA6NTc6MDZcclxuKiBATGFzdCBNb2RpZmllZCBieTogICDpnZJcclxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDIwLTA0LTMwIDE5OjI1OjEyXHJcbiovXHJcbnJlcXVpcmUoJy4vaW5kZXguY3NzJyk7XHJcbnJlcXVpcmUoJ3BhZ2UvY29tbW9uL2hlYWRlci9pbmRleC5qcycpO1xyXG5yZXF1aXJlKCdwYWdlL2NvbW1vbi9uYXYvaW5kZXguanMnKTtcclxudmFyIF9tbSA9IHJlcXVpcmUoJ3V0aWwvbW0uanMnKTtcclxudmFyIF9vcmRlciA9IHJlcXVpcmUoJ3NlcnZpY2Uvb3JkZXItc2VydmljZS5qcycpO1xyXG52YXIgX2FkZHJlc3MgPSByZXF1aXJlKCdzZXJ2aWNlL2FkZHJlc3Mtc2VydmljZS5qcycpO1xyXG52YXIgdGVtcGxhdGVBZGRyZXNzID0gcmVxdWlyZSgnLi9hZGRyZXNzLWxpc3Quc3RyaW5nJyk7XHJcbnZhciB0ZW1wbGF0ZVByb2R1Y3QgPSByZXF1aXJlKCcuL3Byb2R1Y3QtbGlzdC5zdHJpbmcnKTtcclxudmFyIGFkZHJlc3NNb2RhbCA9IHJlcXVpcmUoJy4vYWRkcmVzcy1tb2RhbC5qcycpO1xyXG5cclxudmFyIHBhZ2UgPSB7XHJcblx0ZGF0YToge1xyXG5cdFx0c2VsZWN0ZWRBZGRyZXNzSWQ6IG51bGxcclxuXHR9LFxyXG5cdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5vbkxvYWQoKTtcclxuXHRcdHRoaXMuYmluZEV2ZW50KCk7XHJcblx0fSxcclxuXHRvbkxvYWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5sb2FkQWRkcmVzc0xpc3QoKTtcclxuXHRcdHRoaXMubG9hZFByb2R1Y3RMaXN0KCk7XHJcblx0fSxcclxuXHRiaW5kRXZlbnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIF90aGlzID0gdGhpcztcclxuXHRcdC8vIOWcsOWdgOeahOmAieaLqVxyXG5cdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5hZGRyZXNzLWl0ZW0nLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJylcclxuXHRcdFx0XHQuc2libGluZ3MoJy5hZGRyZXNzLWl0ZW0nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdF90aGlzLmRhdGEuc2VsZWN0ZWRBZGRyZXNzSWQgPSAkKHRoaXMpLmRhdGEoJ2lkJyk7XHJcblx0XHR9KTtcclxuXHRcdC8vIOiuouWNleeahOaPkOS6pFxyXG5cdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5vcmRlci1zdWJtaXQnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHNoaXBwaW5nSWQgPSBfdGhpcy5kYXRhLnNlbGVjdGVkQWRkcmVzc0lkO1xyXG5cdFx0XHRpZihzaGlwcGluZ0lkKXtcclxuXHRcdFx0XHRfb3JkZXIuY3JlYXRlT3JkZXIoe1xyXG5cdFx0XHRcdFx0c2hpcHBpbmdJZDogc2hpcHBpbmdJZFxyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9wYXltZW50Lmh0bWw/b3JkZXJOdW1iZXI9JyArIHJlcy5vcmRlck5vO1xyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uKGVyck1zZykge1xyXG5cdFx0XHRcdFx0X21tLmVycm9yVGlwcyhlcnJNc2cpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdF9tbS5lcnJvclRpcHMoJ+ivt+mAieaLqeWcsOWdgOWQjuWGjeaPkOS6pCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdC8vIOWcsOWdgOeahOa3u+WKoFxyXG5cdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5hZGRyZXNzLWFkZCcsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0YWRkcmVzc01vZGFsLnNob3coe1xyXG5cdFx0XHRcdGlzVXBkYXRlOiBmYWxzZSxcclxuXHRcdFx0XHRvblN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0X3RoaXMubG9hZEFkZHJlc3NMaXN0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdFx0Ly8g5Zyw5Z2A55qE57yW6L6RXHJcblx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmFkZHJlc3MtdXBkYXRlJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHR2YXIgc2hpcHBpbmdJZCA9ICQodGhpcykucGFyZW50cygnLmFkZHJlc3MtaXRlbScpLmRhdGEoJ2lkJyk7XHJcblx0XHRcdF9hZGRyZXNzLmdldEFkZHJlc3Moc2hpcHBpbmdJZCwgZnVuY3Rpb24ocmVzKSB7XHJcblx0XHRcdFx0YWRkcmVzc01vZGFsLnNob3coe1xyXG5cdFx0XHRcdFx0aXNVcGRhdGU6IHRydWUsXHJcblx0XHRcdFx0XHRkYXRhOiByZXMsXHJcblx0XHRcdFx0XHRvblN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5sb2FkQWRkcmVzc0xpc3QoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyTXNnKSB7XHJcblx0XHRcdFx0X21tLmVycm9yVGlwcyhlcnJNc2cpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdFx0Ly8g5Zyw5Z2A55qE5Yig6ZmkXHJcblx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmFkZHJlc3MtZGVsZXRlJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHR2YXIgaWQgPSAkKHRoaXMpLnBhcmVudHMoJy5hZGRyZXNzLWl0ZW0nKS5kYXRhKCdpZCcpO1xyXG5cdFx0XHRpZih3aW5kb3cuY29uZmlybSgn56Gu6K6k6KaB5Yig6Zmk6K+l5Zyw5Z2A77yfJykpe1xyXG5cdFx0XHRcdF9hZGRyZXNzLmRlbGV0ZUFkZHJlc3MoaWQsIGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0XHRcdFx0X3RoaXMubG9hZEFkZHJlc3NMaXN0KCk7XHJcblx0XHRcdFx0fSwgZnVuY3Rpb24oZXJyTXNnKSB7XHJcblx0XHRcdFx0XHRfbW0uZXJyb3JUaXBzKGVyck1zZyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Ly8g5Yqg6L295Zyw5Z2A5YiX6KGoXHJcblx0bG9hZEFkZHJlc3NMaXN0OiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBfdGhpcyA9IHRoaXM7XHJcblx0XHQkKCcuYWRkcmVzcy1jb24nKS5odG1sKCc8ZGl2IGNsYXNzPVwibG9hZGluZ1wiPjwvZGl2PicpO1xyXG5cdFx0Ly8g6I635Y+W5Zyw5Z2A5YiX6KGoXHJcblx0XHRfYWRkcmVzcy5nZXRBZGRyZXNzTGlzdChmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0X3RoaXMuYWRkcmVzc0ZpbHRlcihyZXMpO1xyXG5cdFx0XHR2YXIgYWRkcmVzc0xpc3RIdG1sID0gX21tLnJlbmRlckh0bWwodGVtcGxhdGVBZGRyZXNzLCByZXMpO1xyXG5cdFx0XHQkKCcuYWRkcmVzcy1jb24nKS5odG1sKGFkZHJlc3NMaXN0SHRtbCk7XHJcblx0XHR9LCBmdW5jdGlvbihlcnJNc2cpIHtcclxuXHRcdFx0JCgnLmFkZHJlc3MtY29uJykuaHRtbCgnPHAgY2xhc3M9XCJlcnItdGlwXCI+5Zyw5Z2A5Yqg6L295aSx6LSl77yM6K+35Yi35paw5ZCO6YeN6K+VPC9wPicpXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdC8vIOiOt+WPluWcsOWdgOWIl+ihqOS4remAieS4reeKtuaAgVxyXG5cdGFkZHJlc3NGaWx0ZXI6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdGlmKHRoaXMuZGF0YS5zZWxlY3RlZEFkZHJlc3NJZCkge1xyXG5cdFx0XHR2YXIgc2VsZWN0QWRkcmVzc0lkRmxhZyA9IGZhbHNlO1xyXG5cdFx0XHRmb3IodmFyIGk9MCxsZW5ndGg9ZGF0YS5saXN0Lmxlbmd0aDsgaTxsZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmKGRhdGEubGlzdFtpXS5pZCA9PT0gdGhpcy5kYXRhLnNlbGVjdGVkQWRkcmVzc0lkKSB7XHJcblx0XHRcdFx0XHRkYXRhLmxpc3RbaV0uaXNBY3RpdmUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0c2VsZWN0QWRkcmVzc0lkRmxhZyA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vIOWmguaenOS7peWJjemAieS4reeahOWcsOWdgOS4jeWcqOWIl+ihqOmHjO+8jOWwhuWFtuWIoOmZpFxyXG5cdFx0XHRpZighc2VsZWN0QWRkcmVzc0lkRmxhZykge1xyXG5cdFx0XHRcdHRoaXMuZGF0YS5zZWxlY3RlZEFkZHJlc3NJZCA9IG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdC8vIOWKoOi9veWVhuWTgea4heWNlVxyXG5cdGxvYWRQcm9kdWN0TGlzdDogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xyXG5cdFx0JCgnLnByb2R1Y3QtY29uJykuaHRtbCgnPGRpdiBjbGFzcz1cImxvYWRpbmdcIj48L2Rpdj4nKTtcclxuXHRcdC8vIOiOt+WPluWcsOWdgOWIl+ihqFxyXG5cdFx0X29yZGVyLmdldFByb2R1Y3RMaXN0KGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0XHR2YXIgcHJvZHVjdExpc3RIdG1sID0gX21tLnJlbmRlckh0bWwodGVtcGxhdGVQcm9kdWN0LCByZXMpO1xyXG5cdFx0XHQkKCcucHJvZHVjdC1jb24nKS5odG1sKHByb2R1Y3RMaXN0SHRtbCk7XHJcblx0XHR9LCBmdW5jdGlvbihlcnJNc2cpIHtcclxuXHRcdFx0JCgnLnByb2R1Y3QtY29uJykuaHRtbCgnPHAgY2xhc3M9XCJlcnItdGlwXCI+5ZWG5ZOB5L+h5oGv5Yqg6L295aSx6LSl77yM6K+35Yi35paw5ZCO6YeN6K+VPC9wPicpXHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcbiQoZnVuY3Rpb24oKSB7XHJcblx0cGFnZS5pbml0KCk7XHJcbn0pIiwibW9kdWxlLmV4cG9ydHMgPSBcIjx0YWJsZSBjbGFzcz1cXFwicHJvZHVjdC10YWJsZVxcXCI+XFxyXFxuXFx0PHRyPlxcclxcblxcdFxcdDx0aCBjbGFzcz1cXFwiY2VsbC1pbWdcXFwiPiZuYnNwOzwvdGg+XFxyXFxuXFx0XFx0PHRoIGNsYXNzPVxcXCJjZWxsLWluZm9cXFwiPuWVhuWTgeaPj+i/sDwvdGg+XFxyXFxuXFx0XFx0PHRoIGNsYXNzPVxcXCJjZWxsLXByaWNlXFxcIj7ku7fmoLw8L3RoPlxcclxcblxcdFxcdDx0aCBjbGFzcz1cXFwiY2VsbC1jb3VudFxcXCI+5pWw6YePPC90aD5cXHJcXG5cXHRcXHQ8dGggY2xhc3M9XFxcImNlbGwtdG90YWxcXFwiPuWwj+iuoTwvdGg+XFxyXFxuXFx0PC90cj5cXHJcXG5cXHJcXG5cXHR7eyNvcmRlckl0ZW1Wb0xpc3R9fVxcclxcblxcdDx0cj5cXHJcXG5cXHRcXHQ8dGQgY2xhc3M9XFxcImNlbGwtaW1nXFxcIj5cXHJcXG5cXHRcXHRcXHQ8YSBocmVmPVxcXCIuL2RldGFpbC5odG1sP3Byb2R1Y3RJZD17e3Byb2R1Y3RJZH19XFxcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCI+XFxyXFxuXFx0XFx0XFx0XFx0PGltZyBjbGFzcz1cXFwicC1pbWdcXFwiIHNyYz1cXFwie3tpbWFnZUhvc3R9fXt7cHJvZHVjdEltYWdlfX1cXFwiIGFsdD1cXFwie3twcm9kdWN0TmFtZX19XFxcIj5cXHJcXG5cXHRcXHRcXHQ8L2E+XFxyXFxuXFx0XFx0PC90ZD5cXHJcXG5cXHRcXHQ8dGQgY2xhc3M9XFxcImNlbGwtaW5mb1xcXCI+XFxyXFxuXFx0XFx0XFx0PGEgY2xhc3M9XFxcImxpbmtcXFwiIGhyZWY9XFxcIi4vZGV0YWlsLmh0bWw/cHJvZHVjdElkPXt7cHJvZHVjdElkfX1cXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIj57e3Byb2R1Y3ROYW1lfX08L2E+XFxyXFxuXFx0XFx0PC90ZD5cXHJcXG5cXHRcXHQ8dGQgY2xhc3M9XFxcImNlbGwtcHJpY2VcXFwiPu+/pXt7Y3VycmVudFVuaXRQcmljZX19PC90ZD5cXHJcXG5cXHRcXHQ8dGQgY2xhc3M9XFxcImNlbGwtY291bnRcXFwiPnt7cXVhbnRpdHl9fTwvdGQ+XFxyXFxuXFx0XFx0PHRkIGNsYXNzPVxcXCJjZWxsLXRvdGFsXFxcIj7vv6V7e3RvdGFsUHJpY2V9fTwvdGQ+XFxyXFxuXFx0PC90cj5cXHJcXG5cXHR7ey9vcmRlckl0ZW1Wb0xpc3R9fVxcclxcbjwvdGFibGU+XFxyXFxuPGRpdiBjbGFzcz1cXFwic3VibWl0LWNvblxcXCI+XFxyXFxuXFx0PHNwYW4+6K6i5Y2V5oC75Lu377yaPC9zcGFuPlxcclxcblxcdDxzcGFuIGNsYXNzPVxcXCJzdWJtaXQtdG90YWxcXFwiPu+/pXt7cHJvZHVjdFRvdGFsUHJpY2V9fTwvc3Bhbj5cXHJcXG5cXHQ8c3BhbiBjbGFzcz1cXFwiYnRuIG9yZGVyLXN1Ym1pdFxcXCI+5o+Q5Lqk6K6i5Y2VPC9zcGFuPlxcclxcbjwvZGl2PlxcclxcblwiOyIsIi8qXHJcbiogQEF1dGhvcjog6Z2SXHJcbiogQERhdGU6ICAgMjAyMC0wNC0yOCAxMTozMjowN1xyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIOmdklxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMjAtMDQtMzAgMTg6NTY6MjBcclxuKi9cclxudmFyIF9tbSA9IHJlcXVpcmUoJ3V0aWwvbW0uanMnKTtcclxuXHJcbnZhciBfbW0gPSByZXF1aXJlKCd1dGlsL21tLmpzJyk7XHJcblxyXG52YXIgX2FkZHJlc3MgPSB7XHJcblx0Ly8g6I635Y+W5Zyw5Z2A5YiX6KGoXHJcblx0Z2V0QWRkcmVzc0xpc3Q6IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG5cdFx0X21tLnJlcXVlc3Qoe1xyXG5cdFx0XHR1cmw6IF9tbS5nZXRTZXJ2ZXJVcmwoJy9zaGlwcGluZy9saXN0LmRvJyksXHJcblx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRwYWdlU2l6ZTogNTBcclxuXHRcdFx0fSxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHQvLyDmlrDlu7rmlLbku7bkurpcclxuXHRzYXZlOiBmdW5jdGlvbihhZGRyZXNzSW5mbywgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3NoaXBwaW5nL2FkZC5kbycpLFxyXG5cdFx0XHRkYXRhOiBhZGRyZXNzSW5mbyxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHQvLyDmm7TmlrDmlLbku7bkurpcclxuXHR1cGRhdGU6IGZ1bmN0aW9uKGFkZHJlc3NJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvc2hpcHBpbmcvdXBkYXRlLmRvJyksXHJcblx0XHRcdGRhdGE6IGFkZHJlc3NJbmZvLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdC8vIOWIoOmZpOaUtuS7tuS6ulxyXG5cdGRlbGV0ZUFkZHJlc3M6IGZ1bmN0aW9uKHNoaXBwaW5nSWQsIHJlc29sdmUsIHJlamVjdCkge1xyXG5cdFx0X21tLnJlcXVlc3Qoe1xyXG5cdFx0XHR1cmw6IF9tbS5nZXRTZXJ2ZXJVcmwoJy9zaGlwcGluZy9kZWwuZG8nKSxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdHNoaXBwaW5nSWQ6IHNoaXBwaW5nSWRcclxuXHRcdFx0fSxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHQvLyDojrflj5bljZXmnaHmlLbku7bkurrkv6Hmga9cclxuXHRnZXRBZGRyZXNzOiBmdW5jdGlvbihzaGlwcGluZ0lkLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvc2hpcHBpbmcvc2VsZWN0LmRvJyksXHJcblx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRzaGlwcGluZ0lkOiBzaGlwcGluZ0lkXHJcblx0XHRcdH0sXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IF9hZGRyZXNzOyIsIi8qXHJcbiogQEF1dGhvcjog6Z2SXHJcbiogQERhdGU6ICAgMjAyMC0wNC0xNiAxNzo1NjoxM1xyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIOmdklxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMjAtMDQtMjQgMjI6MTY6MzhcclxuKi9cclxuLypcclxuKiBAQXV0aG9yOiDpnZJcclxuKiBARGF0ZTogICAyMDIwLTA0LTEwIDE1OjMzOjE4XHJcbiogQExhc3QgTW9kaWZpZWQgYnk6ICAg6Z2SXHJcbiogQExhc3QgTW9kaWZpZWQgdGltZTogMjAyMC0wNC0xNCAxNzo1OTowNFxyXG4qL1xyXG52YXIgX21tID0gcmVxdWlyZSgndXRpbC9tbS5qcycpO1xyXG5cclxudmFyIF9jYXJ0ID0ge1xyXG5cdC8vIOiOt+WPlui0reeJqei9puaVsOmHj1xyXG5cdGdldENhcnRDb3VudDogZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL2NhcnQvZ2V0X2NhcnRfcHJvZHVjdF9jb3VudC5kbycpLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdC8vIOa3u+WKoOWIsOi0reeJqei9plxyXG5cdGFkZFRvQ2FydDogZnVuY3Rpb24ocHJvZHVjdEluZm8sIHJlc29sdmUsIHJlamVjdCkge1xyXG5cdFx0X21tLnJlcXVlc3Qoe1xyXG5cdFx0XHR1cmw6IF9tbS5nZXRTZXJ2ZXJVcmwoJy9jYXJ0L2FkZC5kbycpLFxyXG5cdFx0XHRkYXRhOiBwcm9kdWN0SW5mbyxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdC8vIOiOt+WPlui0reeJqei9puWIl+ihqFxyXG5cdGdldENhcnRMaXN0OiBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvY2FydC9saXN0LmRvJyksXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDpgInmi6notK3nianovabllYblk4FcclxuXHRzZWxlY3RQcm9kdWN0OiAgZnVuY3Rpb24ocHJvZHVjdElkLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvY2FydC9zZWxlY3QuZG8nKSxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdHByb2R1Y3RJZDogcHJvZHVjdElkXHJcblx0XHRcdH0sXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDlj5bmtojpgInmi6notK3nianovabllYblk4FcclxuXHR1bnNlbGVjdFByb2R1Y3Q6ICBmdW5jdGlvbihwcm9kdWN0SWQsIHJlc29sdmUsIHJlamVjdCkge1xyXG5cdFx0X21tLnJlcXVlc3Qoe1xyXG5cdFx0XHR1cmw6IF9tbS5nZXRTZXJ2ZXJVcmwoJy9jYXJ0L3VuX3NlbGVjdC5kbycpLFxyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0cHJvZHVjdElkOiBwcm9kdWN0SWRcclxuXHRcdFx0fSxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdC8vIOmAieS4reWFqOmDqOWVhuWTgVxyXG5cdHNlbGVjdEFsbFByb2R1Y3Q6ICBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvY2FydC9zZWxlY3RfYWxsLmRvJyksXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDlj5bmtojpgInkuK3lhajpg6jllYblk4FcclxuXHR1bnNlbGVjdEFsbFByb2R1Y3Q6ICBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvY2FydC91bl9zZWxlY3RfYWxsLmRvJyksXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDmm7TmlrDotK3nianovabllYblk4HmlbDph49cclxuXHR1cGRhdGVQcm9kdWN0OiBmdW5jdGlvbihwcm9kdWN0SW5mbywgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL2NhcnQvdXBkYXRlLmRvJyksXHJcblx0XHRcdGRhdGE6IHByb2R1Y3RJbmZvLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5Yig6Zmk5oyH5a6a5ZWG5ZOBXHJcblx0ZGVsZXRlUHJvZHVjdDogZnVuY3Rpb24ocHJvZHVjdElkcywgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL2NhcnQvZGVsZXRlX3Byb2R1Y3QuZG8nKSxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdHByb2R1Y3RJZHM6IHByb2R1Y3RJZHNcclxuXHRcdFx0fSxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSlcclxuXHR9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBfY2FydDsiLCIvKlxyXG4qIEBBdXRob3I6IOmdklxyXG4qIEBEYXRlOiAgIDIwMjAtMDQtMjcgMTE6MDA6NTFcclxuKiBATGFzdCBNb2RpZmllZCBieTogICDpnZJcclxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDIwLTA1LTA5IDE3OjI4OjU3XHJcbiovXHJcbnZhciBfbW0gPSByZXF1aXJlKCd1dGlsL21tLmpzJyk7XHJcblxyXG52YXIgX29yZGVyID0ge1xyXG5cdC8vIOiOt+WPluWVhuWTgeWIl+ihqFxyXG5cdGdldFByb2R1Y3RMaXN0OiBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvb3JkZXIvZ2V0X29yZGVyX2NhcnRfcHJvZHVjdC5kbycpLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5o+Q5Lqk6K6i5Y2VXHJcblx0Y3JlYXRlT3JkZXI6IGZ1bmN0aW9uKG9yZGVySW5mbywgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL29yZGVyL2NyZWF0ZS5kbycpLFxyXG5cdFx0XHRkYXRhOiBvcmRlckluZm8sXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDojrflj5borqLljZXliJfooahcclxuXHRnZXRPcmRlckxpc3Q6IGZ1bmN0aW9uKGxpc3RQYXJhbSwgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL29yZGVyL2xpc3QuZG8nKSxcclxuXHRcdFx0ZGF0YTogbGlzdFBhcmFtLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g6I635Y+W6K6i5Y2V6K+m5oOFXHJcblx0Z2V0T3JkZXJEZXRhaWw6IGZ1bmN0aW9uKG9yZGVyTnVtYmVyLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvb3JkZXIvZGV0YWlsLmRvJyksXHJcblx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRvcmRlck5vOiBvcmRlck51bWJlclxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5Y+W5raI6K6i5Y2VXHJcblx0Y2FuY2VsT3JkZXI6IGZ1bmN0aW9uKG9yZGVyTnVtYmVyLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvb3JkZXIvY2FuY2VsLmRvJyksXHJcblx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRvcmRlck5vOiBvcmRlck51bWJlclxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IF9vcmRlcjsiLCIvKlxyXG4qIEBBdXRob3I6IOmdklxyXG4qIEBEYXRlOiAgIDIwMjAtMDMtMjcgMDk6NDM6MjRcclxuKiBATGFzdCBNb2RpZmllZCBieTogICDpnZJcclxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDIwLTA0LTE3IDE0OjM1OjA4XHJcbiovXHJcbnZhciBfbW0gPSByZXF1aXJlKCd1dGlsL21tLmpzJyk7XHJcblxyXG52YXIgX3VzZXIgPSB7XHJcblx0Ly8g55So5oi355m75b2VXHJcblx0bG9naW46IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9sb2dpbi5kbycpLFxyXG5cdFx0XHRkYXRhOiB1c2VySW5mbyxcclxuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDmo4Dmn6XnlKjmiLflkI1cclxuXHRjaGVja1VzZXJuYW1lOiBmdW5jdGlvbih1c2VybmFtZSwgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvY2hlY2tfdmFsaWQuZG8nKSxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdHR5cGU6ICd1c2VybmFtZScsXHJcblx0XHRcdFx0c3RyOiB1c2VybmFtZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRtZXRob2Q6ICdQT1NUJyxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdC8vIOeUqOaIt+azqOWGjFxyXG5cdHJlZ2lzdGVyOiBmdW5jdGlvbih1c2VySW5mbywgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvcmVnaXN0ZXIuZG8nKSxcclxuXHRcdFx0ZGF0YTogdXNlckluZm8sXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5qOA5p+l55m75b2V54q25oCBXHJcblx0Y2hlY2tMb2dpbjogZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9nZXRfdXNlcl9pbmZvLmRvJyksXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdC8vIOiOt+WPlueUqOaIt+WvhueggeaPkOekuumXrumimFxyXG5cdGdldFF1ZXN0aW9uOiBmdW5jdGlvbih1c2VybmFtZSwgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvZm9yZ2V0X2dldF9xdWVzdGlvbi5kbycpLFxyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0dXNlcm5hbWU6IHVzZXJuYW1lXHJcblx0XHRcdH0sXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5qOA5p+l5a+G56CB5o+Q56S66Zeu6aKY562U5qGIXHJcblx0Y2hlY2tBbnN3ZXI6IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9mb3JnZXRfY2hlY2tfYW5zd2VyLmRvJyksXHJcblx0XHRcdGRhdGE6IHVzZXJJbmZvLFxyXG5cdFx0XHRtZXRob2Q6ICdQT1NUJyxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdC8vIOmHjee9ruWvhueggVxyXG5cdHJlc2V0UGFzc3dvcmQ6IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9mb3JnZXRfcmVzZXRfcGFzc3dvcmQuZG8nKSxcclxuXHRcdFx0ZGF0YTogdXNlckluZm8sXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g6I635Y+W55So5oi35L+h5oGvXHJcblx0Z2V0VXNlckluZm86IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvZ2V0X2luZm9ybWF0aW9uLmRvJyksXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5pu05paw5Liq5Lq65L+h5oGvXHJcblx0dXBkYXRlVXNlckluZm86IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci91cGRhdGVfaW5mb3JtYXRpb24uZG8nKSxcclxuXHRcdFx0ZGF0YTogdXNlckluZm8sXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g55m75b2V54q25oCB5LiL5pu05paw5a+G56CBXHJcblx0dXBkYXRlUGFzc3dvcmQ6IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9yZXNldF9wYXNzd29yZC5kbycpLFxyXG5cdFx0XHRkYXRhOiB1c2VySW5mbyxcclxuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDnmbvlh7pcclxuXHRsb2dvdXQ6IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvbG9nb3V0LmRvJyksXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IF91c2VyOyIsIi8qXHJcbiogQEF1dGhvcjog6Z2SXHJcbiogQERhdGU6ICAgMjAyMC0wNC0yOSAxNzo0Njo1MFxyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIOmdklxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMjAtMDQtMjkgMTg6MTU6NTZcclxuKi9cclxuXHJcbnZhciBfY2l0aWVzID0ge1xyXG5cdGNpdHlJbmZvOiB7XHJcblx0XHQn5YyX5LqsJzogWyfljJfkuqwnXSxcclxuXHRcdCfkuIrmtbcnOiBbJ+S4iua1tyddLFxyXG5cdFx0J+Wkqea0pSc6IFsn5aSp5rSlJ10sXHJcblx0XHQn6YeN5bqGJzogWyfph43luoYnXSxcclxuXHRcdCfmsrPljJfnnIEnOiBbJ+efs+WutuW6hCcsICflvKDlrrblj6MnLCAn5om/5b63JywgJ+enpueah+WymycsICfllJDlsbEnLCAn5buK5Z2KJywgJ+S/neWumicsICfmsqflt54nLCAn6KGh5rC0JywgJ+mCouWPsCcsICfpgq/pg7gnXSxcclxuXHRcdCflsbHopb/nnIEnOiBbJ+WkquWOnycsICflpKflkIwnLCAn5pyU5beeJywgJ+mYs+aziScsICfplb/msrsnLCAn5pmL5Z+OJywgJ+W/u+W3nicsICflkJXmooEnLCAn5pmL5LitJywgJ+S4tOaxvicsICfov5Dln44nXSxcclxuXHRcdCfovr3lroHnnIEnOiBbJ+ayiOmYsycsICfmnJ3pmLMnLCAn6Zic5pawJywgJ+mTgeWyrScsICfmiprpobonLCAn5pys5rqqJywgJ+i+vemYsycsICfpno3lsbEnLCAn5Li55LicJywgJ+Wkp+i/nicsICfokKXlj6MnLCAn55uY6ZSmJywgJ+mUpuW3nicsICfokavoiqblspsnXSxcclxuXHRcdCflkInmnpfnnIEnOiBbJ+mVv+aYpScsICfnmb3ln44nLCAn5p2+5Y6fJywgJ+WQieaelycsICflm5vlubMnLCAn6L695rqQJywgJ+mAmuWMlicsICfnmb3lsbEnLCAn5bu26L65J10sXHJcblx0XHQn6buR6b6Z5rGf55yBJzogWyflk4jlsJTmu6gnLCAn6b2Q6b2Q5ZOI5bCUJywgJ+m7keaysycsICflpKfluoYnLCAn5LyK5pilJywgJ+m5pOWylycsICfkvbPmnKjmlq8nLCAn5Y+M6bit5bGxJywgJ+S4g+WPsOaysycsICfpuKHopb8nLCAn54mh5Li55rGfJywgJ+e7peWMlicsICflpKflhbTlroknXSxcclxuXHRcdCfmsZ/oi4/nnIEnOiBbJ+WNl+S6rCcsICflvpDlt54nLCAn6L+e5LqR5rivJywgJ+Wuv+i/gScsICfmt67pmLQnLCAn55uQ5Z+OJywgJ+aJrOW3nicsICfms7Dlt54nLCAn5Y2X6YCaJywgJ+mVh+axnycsICfluLjlt54nLCAn5peg6ZShJywgJ+iLj+W3niddLFxyXG5cdFx0J+a1meaxn+ecgSc6IFsn5p2t5beeJywgJ+a5luW3nicsICflmInlhbQnLCAn6Iif5bGxJywgJ+WugeazoicsICfnu43lhbQnLCAn6YeR5Y2OJywgJ+WPsOW3nicsICfmuKnlt54nLCAn5Li95rC0J10sXHJcblx0XHQn5a6J5b6955yBJzogWyflkIjogqUnLCAn5a6/5beeJywgJ+a3ruWMlycsICfpmJzpmLMnLCAn6JqM5Z+gJywgJ+a3ruWNlycsICfmu4Hlt54nLCAn6ams6Z6N5bGxJywgJ+iKnOa5licsICfpk5zpmbUnLCAn5a6J5bqGJywgJ+m7hOWxsScsICflha3lroknLCAn5bei5rmWJywgJ+axoOW3nicsICflrqPln44nXSxcclxuXHRcdCfnpo/lu7rnnIEnOiBbJ+emj+W3nicsICfljZflubMnLCAn5LiJ5piOJywgJ+iOhueUsCcsICfms4nlt54nLCAn5Y6m6ZeoJywgJ+a8s+W3nicsICfpvpnlsqknLCAn5a6B5b63J10sXHJcblx0XHQn5rGf6KW/55yBJzogWyfljZfmmIwnLCAn5Lmd5rGfJywgJ+aZr+W+t+mVhycsICfpubDmva0nLCAn5paw5L2ZJywgJ+iQjeS5oScsICfotaPlt54nLCAn5LiK6aW2JywgJ+aKmuW3nicsICflrpzmmKUnLCAn5ZCJ5a6JJ10sXHJcblx0XHQn5bGx5Lic55yBJzogWyfmtY7ljZcnLCAn6IGK5Z+OJywgJ+W+t+W3nicsICfkuJzokKUnLCAn5reE5Y2aJywgJ+a9jeWdiicsICfng5/lj7AnLCAn5aiB5rW3JywgJ+mdkuWymycsICfml6XnhacnLCAn5Li05rKCJywgJ+aeo+W6hCcsICfmtY7lroEnLCAn5rOw5a6JJywgJ+iOseiKnCcsICfmu6jlt54nLCAn6I+P5rO9J10sXHJcblx0XHQn5rKz5Y2X55yBJzogWyfpg5Hlt54nLCAn5LiJ6Zeo5bOhJywgJ+a0m+mYsycsICfnhKbkvZwnLCAn5paw5LmhJywgJ+m5pOWjgScsICflronpmLMnLCAn5r+u6ZizJywgJ+W8gOWwgScsICfllYbkuJgnLCAn6K645piMJywgJ+a8r+aysycsICflubPpobblsbEnLCAn5Y2X6ZizJywgJ+S/oemYsycsICflkajlj6MnLCAn6am76ams5bqXJ10sXHJcblx0XHQn5rmW5YyX55yBJzogWyfmrabmsYknLCAn5Y2B5aCwJywgJ+ilhOaUgCcsICfojYbpl6gnLCAn5a2d5oSfJywgJ+m7hOWGiCcsICfphILlt54nLCAn6buE55+zJywgJ+WSuOWugScsICfojYblt54nLCAn5a6c5piMJywgJ+aBqeaWvScsICfopYTmqIonXSxcclxuXHRcdCfmuZbljZfnnIEnOiBbJ+mVv+aymScsICflvKDlrrbnlYwnLCAn5bi45b63JywgJ+ebiumYsycsICflsrPpmLMnLCAn5qCq5rSyJywgJ+a5mOa9rScsICfooaHpmLMnLCAn6YO05beeJywgJ+awuOW3nicsICfpgrXpmLMnLCAn5oCA5YyWJywgJ+WohOW6lScsICfmuZjopb8nXSxcclxuXHRcdCflub/kuJznnIEnOiBbJ+W5v+W3nicsICfmuIXov5wnLCAn6Z+25YWzJywgJ+ays+a6kCcsICfmooXlt54nLCAn5r2u5beeJywgJ+axleWktCcsICfmj63pmLMnLCAn5rGV5bC+JywgJ+aDoOW3nicsICfkuJzojp4nLCAn5rex5ZyzJywgJ+ePoOa1tycsICfmsZ/pl6gnLCAn5L2b5bGxJywgJ+iCh+W6hicsICfkupHmta4nLCAn6Ziz5rGfJywgJ+iMguWQjScsICfmuZvmsZ8nXSxcclxuXHRcdCfmtbfljZfnnIEnOiBbJ+a1t+WPoycsICfkuInkuponXSxcclxuXHRcdCflm5vlt53nnIEnOiBbJ+aIkOmDvScsICflub/lhYMnLCAn57u16ZizJywgJ+W+t+mYsycsICfljZflhYUnLCAn5bm/5a6JJywgJ+mBguWugScsICflhoXmsZ8nLCAn5LmQ5bGxJywgJ+iHqui0oScsICfms7jlt54nLCAn5a6c5a6+JywgJ+aUgOaeneiKsScsICflt7TkuK0nLCAn6L6+5bedJywgJ+i1hOmYsycsICfnnInlsbEnLCAn6ZuF5a6JJywgJ+mYv+WdnScsICfnlJjlrZwnLCAn5YeJ5bGxJ10sXHJcblx0XHQn6LS15bee55yBJzogWyfotLXpmLMnLCAn5YWt55uY5rC0JywgJ+mBteS5iScsICfmr5XoioInLCAn6ZOc5LuBJywgJ+WuiemhuicsICfpu5TkuJzljZcnLCAn6buU5Y2XJywgJ+m7lOilv+WNlyddLFxyXG5cdFx0J+S6keWNl+ecgSc6IFsn5piG5piOJywgJ+absumdlicsICfnjonmuqonLCAn5Li95rGfJywgJ+aYremAmicsICfmgJ3ojIUnLCAn5Li05rKnJywgJ+S/neWxsScsICflvrflro8nLCAn5oCS5rGfJywgJ+i/quW6hicsICflpKfnkIYnLCAn5qWa6ZuEJywgJ+e6ouaysycsICfmloflsbEnLCAn6KW/5Y+M54mI57qzJ10sXHJcblx0XHQn6ZmV6KW/55yBJzogWyfopb/lroknLCAn5bu25a6JJywgJ+mTnOW3nScsICfmuK3ljZcnLCAn5ZK46ZizJywgJ+Wunem4oScsICfmsYnkuK0nLCAn5qaG5p6XJywgJ+WVhua0mycsICflronlurcnXSxcclxuXHRcdCfnlJjogoPnnIEnOiBbJ+WFsOW3nicsICflmInls6rlhbMnLCAn6YeR5piMJywgJ+eZvemTticsICflpKnmsLQnLCAn6YWS5rOJJywgJ+W8oOaOlicsICfmrablqIEnLCAn5bqG6ZizJywgJ+W5s+WHiScsICflrpropb8nLCAn6ZmH5Y2XJywgJ+S4tOWkjycsICfnlJjljZcnXSxcclxuXHRcdCfpnZLmtbfnnIEnOiBbJ+ilv+WugScsICfmtbfkuJwnLCAn6KW/5a6BJywgJ+a1t+WMlycsICfmtbfljZcnLCAn6buE5Y2XJywgJ+aenOa0mycsICfnjonmoJEnLCAn5rW36KW/J10sXHJcblx0XHQn5YaF6JKZ5Y+kJzogWyflkbzlkozmtannibknLCAn5YyF5aS0JywgJ+S5jOa1tycsICfotaTls7AnLCAn5ZG85Lym6LSd5bCU55ufJywgJ+WFtOWuieebnycsICflk7Lph4zmnKjnm58nLCAn6ZSh5p6X6YOt5YuS55ufJywgJ+S5jOWFsOWvn+W4g+ebnycsICfphILlsJTlpJrmlq8nLCAn5be05b2m5reW5bCU55ufJywgJ+mYv+aLieWWhOebnyddLFxyXG5cdFx0J+W5v+ilvyc6IFsn5Y2X5a6BJywgJ+ahguaelycsICfmn7Plt54nLCAn5qKn5beeJywgJ+i0tea4rycsICfnjonmnpcnLCAn6ZKm5beeJywgJ+WMl+a1tycsICfpmLLln47muK8nLCAn5Y2X5a6BJywgJ+eZvuiJsicsICfmsrPmsaAnLCAn5p+z5beeJywgJ+i0uuW3niddLFxyXG5cdFx0J+ilv+iXjyc6IFsn5ouJ6JCoJywgJ+mCo+absicsICfmmIzpg70nLCAn5p6X6IqdJywgJ+WxseWNlycsICfml6XlloDliJknLCAn6Zi/6YeMJ10sXHJcblx0XHQn5a6B5aSPJzogWyfpk7blt50nLCAn55+z5Zi05bGxJywgJ+WQtOW/oCcsICflm7rljp8nXSxcclxuXHRcdCfmlrDnloYnOiBbJ+S5jOmygeacqOm9kCcsICflhYvmi4nnjpvkvp0nLCAn5ZaA5LuAJywgJ+mYv+WFi+iLjycsICflkoznlLAnLCAn5ZCQ6bKB55WqJywgJ+WTiOWvhicsICfljZrlsJTloZTmi4knLCAn5piM5ZCJJywgJ+W3tOmfs+mDrealnicsICfkvIrnioEnLCAn5aGU5Z+OJywgJ+mYv+WLkuazsCddLFxyXG5cdFx0J+mmmea4ryc6IFsn6aaZ5rivJ10sXHJcblx0XHQn5r6z6ZeoJzogWyfmvrPpl6gnXSxcclxuXHRcdCflj7Dmub4nOiBbJ+WPsOWMlycsICflj7DljZcnLCAn5YW25LuWJ11cclxuXHR9LFxyXG5cdC8vIOiOt+WPluaJgOacieeahOecgeS7vVxyXG5cdGdldFByb3ZpbmNlczogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgcHJvdmluY2VzID0gW107XHJcblx0XHRmb3IodmFyIGl0ZW0gaW4gdGhpcy5jaXR5SW5mbyl7XHJcblx0XHRcdC8vIHBzdWjov5trZXnvvIznnIHku71cclxuXHRcdFx0cHJvdmluY2VzLnB1c2goaXRlbSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcHJvdmluY2VzO1xyXG5cdH0sXHJcblx0Ly8g6I635Y+W5p+Q55yB5Lu955qE5omA5pyJ5Z+O5biCXHJcblx0Z2V0Q2l0aWVzOiBmdW5jdGlvbihwcm92aW5jZU5hbWUpIHtcclxuXHRcdHJldHVybiB0aGlzLmNpdHlJbmZvW3Byb3ZpbmNlTmFtZV0gfHwgW107XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IF9jaXRpZXM7IiwiLypcclxuKiBAQXV0aG9yOiDpnZJcclxuKiBARGF0ZTogICAyMDIwLTAzLTA5IDE1OjAxOjAxXHJcbiogQExhc3QgTW9kaWZpZWQgYnk6ICAg6Z2SXHJcbiogQExhc3QgTW9kaWZpZWQgdGltZTogMjAyMC0wNC0xMCAxNjoyMDo1N1xyXG4qL1xyXG52YXIgY29uZiA9IHtcclxuXHRzZXJ2ZXJIb3N0OiAnL2FwaSdcclxufVxyXG5cclxudmFyIEhvZ2FuID0gcmVxdWlyZSgnaG9nYW4uanMnKTtcclxuXHJcbnZhciBfbW0gPSB7XHJcblx0Ly8g572R57uc6K+35rGCXHJcblx0cmVxdWVzdDogZnVuY3Rpb24ocGFyYW0pIHtcclxuXHRcdHZhciBfdGhpcyA9IHRoaXM7XHJcblx0XHQkLmFqYXgoe1xyXG5cdFx0XHR0eXBlOiBwYXJhbS5tZXRob2QgfHwgJ2dldCcsXHJcblx0XHRcdHVybDogcGFyYW0udXJsIHx8ICcnLFxyXG5cdFx0XHRkYXRhVHlwZTogcGFyYW0udHlwZSB8fCAnanNvbicsXHJcblx0XHRcdGRhdGE6IHBhcmFtLmRhdGEgfHwgJycsXHJcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0XHRcdC8vIOivt+axguaIkOWKn1xyXG5cdFx0XHRcdGlmKHJlcy5zdGF0dXMgPT09IDApIHtcclxuXHRcdFx0XHRcdHR5cGVvZiBwYXJhbS5zdWNjZXNzID09PSAnZnVuY3Rpb24nICYmIHBhcmFtLnN1Y2Nlc3MocmVzLmRhdGEsIHJlcy5tc2cpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyDmsqHmnInnmbvlvZXnirbmgIHvvIzpnIDopoHlvLrliLbnmbvlvZVcclxuXHRcdFx0XHRlbHNlIGlmKHJlcy5zdGF0dXMgPT09IDEwKSB7XHJcblx0XHRcdFx0XHRfdGhpcy5kb0xvZ2luKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIOivt+axguaVsOaNrumUmeivr1xyXG5cdFx0XHRcdGVsc2UgaWYocmVzLnN0YXR1cyA9PT0gMSkge1xyXG5cdFx0XHRcdFx0dHlwZW9mIHBhcmFtLmVycm9yID09PSAnZnVuY3Rpb24nICYmIHBhcmFtLmVycm9yKHJlcy5tc2cpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKGVycikge1xyXG5cdFx0XHRcdHR5cGVvZiBwYXJhbS5lcnJvciA9PT0gJ2Z1bmN0aW9uJyAmJiBwYXJhbS5lcnJvcihlcnIuc3RhdHVzVGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDojrflj5bmnI3liqHlmajlnLDlnYBcclxuXHRnZXRTZXJ2ZXJVcmw6IGZ1bmN0aW9uKHBhdGgpIHtcclxuXHRcdHJldHVybiBjb25mLnNlcnZlckhvc3QgKyBwYXRoO1xyXG5cdH0sXHJcblx0Ly8g6I635Y+WdXJs5Y+C5pWwXHJcblx0Z2V0VXJsUGFyYW06IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdHZhciByZWcgPSBuZXcgUmVnRXhwKCcoXnwmKScgKyBuYW1lICsgJz0oW14mXSopKCZ8JCknKTtcclxuXHRcdHZhciByZXN1bHQgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKS5tYXRjaChyZWcpO1xyXG5cdFx0cmV0dXJuIHJlc3VsdCA/IGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRbMl0pIDogbnVsbDtcclxuXHRcdC8vIC8oXnwmKXRlc3Q9KFteJl0qKSgmfCQpL1xyXG5cdFx0Ly8gcmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cdC8vIOa4suafk2h0bWzmqKHmnb9cclxuXHRyZW5kZXJIdG1sOiBmdW5jdGlvbihodG1sVGVtcGxhdGUsIGRhdGEpIHtcclxuXHRcdHZhciB0ZW1wbGF0ZSA9IEhvZ2FuLmNvbXBpbGUoaHRtbFRlbXBsYXRlKSxcclxuXHRcdFx0cmVzdWx0ID0gdGVtcGxhdGUucmVuZGVyKGRhdGEpO1xyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cdC8vIOaIkOWKn+aPkOekulxyXG5cdHN1Y2Nlc3NUaXBzOiBmdW5jdGlvbihtc2cpIHtcclxuXHRcdGFsZXJ0KG1zZyB8fCAn5pON5L2c5oiQ5Yqf77yBJyk7XHJcblx0fSxcclxuXHQvLyDplJnor6/mj5DnpLpcclxuXHRlcnJvclRpcHM6IGZ1bmN0aW9uKG1zZykge1xyXG5cdFx0YWxlcnQobXNnIHx8ICfplJnor6/mj5DnpLonKTtcclxuXHR9LFxyXG5cdC8vIOWtl+auteeahOmqjOivgeOAgeaUr+aMgemdnuepuuOAgeaJi+acuuOAgeWHuemZt+WkhOeahOWIpOaWrVxyXG5cdHZhbGlkYXRlOiBmdW5jdGlvbih2YWx1ZSAsIHR5cGUpIHtcclxuXHRcdHZhciB2YWx1ZSA9ICQudHJpbSh2YWx1ZSk7XHJcblx0XHQvLyDpnZ7nqbrpqozor4FcclxuXHRcdGlmKCdyZXF1aXJlJyA9PT0gdHlwZSkge1xyXG5cdFx0XHRyZXR1cm4gISF2YWx1ZTtcclxuXHRcdH1cclxuXHRcdC8vIOaJi+acuuWPt+mqjOivgVxyXG5cdFx0aWYoJ3Bob25lJyA9PT0gdHlwZSkge1xyXG5cdFx0XHRyZXR1cm4gL14xXFxkezEwfSQvLnRlc3QodmFsdWUpO1xyXG5cdFx0fVxyXG5cdFx0Ly8g6YKu566x5qC85byP6aqM6K+BXHJcblx0XHRpZignZW1haWwnID09PSB0eXBlKSB7XHJcblx0XHRcdHJldHVybiAvXihbQS1aYS16MC05X1xcLVxcLl0pK1xcQChbQS1aYS16MC05X1xcLVxcLl0pK1xcLihbQS1aYS16XXsyLDR9KSQvLnRlc3QodmFsdWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Ly8g57uf5LiA55m75b2V5aSE55CGXHJcblx0ZG9Mb2dpbjogZnVuY3Rpb24oKSB7XHJcblx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL3VzZXItbG9naW4uaHRtbD9yZWRpcmVjdD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuXHR9LFxyXG5cdGRvSG9tZTogZnVuY3Rpb24oKSB7XHJcblx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL2luZGV4Lmh0bWwnO1xyXG5cdH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gX21tOyJdLCJzb3VyY2VSb290IjoiIn0=