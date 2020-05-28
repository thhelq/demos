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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/page/order-list/index.js");
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

/***/ "./src/page/common/nav-side/index.css":
/*!********************************************!*\
  !*** ./src/page/common/nav-side/index.css ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/page/common/nav-side/index.js":
/*!*******************************************!*\
  !*** ./src/page/common/nav-side/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
* @Author: 青
* @Date:   2020-03-15 15:37:29
* @Last Modified by:   青
* @Last Modified time: 2020-03-29 15:04:06
*/
__webpack_require__(/*! ./index.css */ "./src/page/common/nav-side/index.css");
var _mm = __webpack_require__(/*! util/mm.js */ "./src/util/mm.js");
var templateIndex = __webpack_require__(/*! ./index.string */ "./src/page/common/nav-side/index.string");

// 侧边导航
var navSide = {
	option: {
		name: '',
		navList: [
			{name: 'user-center', desc: '个人中心', href: './user-center.html'},
			{name: 'order-list', desc: '我的订单', href: './order-list.html'},
			{name: 'user-pass-update', desc: '修改密码', href: './user-pass-update.html'},
			{name: 'about', desc: '关于MMall', href: './about.html'},
		]
	},
	init: function(option) {
		// 合并选项
		$.extend(this.option, option);
		console.log(this.option);
		this.renderNav();
	},
	// 渲染导航菜单
	renderNav: function() {
		// 计算active数据
		for(var i=0,iLength=this.option.navList.length; i<iLength; i++) {
			if(this.option.navList[i].name === this.option.name){
				this.option.navList[i].isActive = true;
			}
		};
		// 渲染list数据
		var navHtml = _mm.renderHtml(templateIndex, {
			navList: this.option.navList
		});
		// 把html放入容器
		$('.nav-side').html(navHtml);
		console.log(this.option.navList);
	}
}

module.exports = navSide;

/***/ }),

/***/ "./src/page/common/nav-side/index.string":
/*!***********************************************!*\
  !*** ./src/page/common/nav-side/index.string ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "{{#navList}}\r\n\t{{#isActive}}\r\n\t<li class=\"nav-item active\">\r\n\t{{/isActive}}\r\n\t{{^isActive}}\r\n\t<li class=\"nav-item\">\r\n\t{{/isActive}}\r\n\t\t<a class=\"link\" href=\"{{href}}\">{{desc}}</a>\r\n\t</li>\r\n{{/navList}}";

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

/***/ "./src/page/order-list/index.css":
/*!***************************************!*\
  !*** ./src/page/order-list/index.css ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/page/order-list/index.js":
/*!**************************************!*\
  !*** ./src/page/order-list/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
* @Author: 青
* @Date:   2020-05-01 09:35:43
* @Last Modified by:   青
* @Last Modified time: 2020-05-05 17:25:28
*/
__webpack_require__(/*! ./index.css */ "./src/page/order-list/index.css");
__webpack_require__(/*! page/common/nav/index.js */ "./src/page/common/nav/index.js");
__webpack_require__(/*! page/common/header/index.js */ "./src/page/common/header/index.js");
var navSide = __webpack_require__(/*! page/common/nav-side/index.js */ "./src/page/common/nav-side/index.js");
var _mm = __webpack_require__(/*! util/mm.js */ "./src/util/mm.js");
var _order = __webpack_require__(/*! service/order-service */ "./src/service/order-service.js");
var templateIndex = __webpack_require__(/*! ./index.string */ "./src/page/order-list/index.string");
var Pagination = __webpack_require__(/*! util/pagination/index.js */ "./src/util/pagination/index.js");


// page 逻辑部分
var page = {
	data: {
		listParam: {
			pageNum: 1,
			pageSize: 10
		}
	},
	init: function(){
		this.onLoad();
	},
	onLoad: function(){
		this.loadOrderList();
		// 初始化左侧菜单
		navSide.init({
			name: 'order-list'
		});
	},
	// 加载订单列表
	loadOrderList: function() {
		var _this = this,
			orderListHtml = '',
			$listCon = $('.order-list-con');

		$listCon.html('<div class="loading"></div>');
		_order.getOrderList(this.data.listParam, function(res) {
			// 渲染html
			orderListHtml = _mm.renderHtml(templateIndex, res);
			$listCon.html(orderListHtml);
			_this.loadPagination({
				hasPreviousPage: res.hasPreviousPage,
				prePage: res.prePage,
				hasNextPage: res.hasNextPage,
				nextPage: res.nextPage,
				pageNum: res.pageNum,
				pages: res.pages
			});
		}, function(errMsg) {
			$listCon.html('<p class="err-tip">加载订单失败，请刷新后重试</p>');
		});
	},
	// 加载分页信息
	loadPagination: function(pageInfo){
		console.log(pageInfo)

		var _this = this;
		this.pagination ? '' : (this.pagination = new Pagination());

		this.pagination.render($.extend({}, pageInfo, {
			container: $('.pagination'),
			onSelectPage: function(pageNum) {
				_this.data.listParam.pageNum = pageNum;
				_this.loadOrderList();
			}
		}));

		console.log(this.pagination);
	}

};
$(function(){
	page.init();
})

/***/ }),

/***/ "./src/page/order-list/index.string":
/*!******************************************!*\
  !*** ./src/page/order-list/index.string ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<table class=\"order-list-table header\">\r\n\t<tr>\r\n\t\t<th class=\"cell cell-img\">&nbsp;</th>\r\n\t\t<th class=\"cell cell-info\">商品信息</th>\r\n\t\t<th class=\"cell cell-price\">单价</th>\r\n\t\t<th class=\"cell cell-count\">数量</th>\r\n\t\t<th class=\"cell cell-total\">小计</th>\r\n\t</tr>\r\n</table>\r\n{{#list}}\r\n<table class=\"order-list-table order-item\">\r\n\t<tr>\r\n\t\t<td colspan=\"5\" class=\"order-info\">\r\n\t\t\t<span class=\"order-text\">\r\n\t\t\t\t<span>订单号：</span>\r\n\t\t\t\t<a class=\"link order-num\" href=\"./order-detail.html?orderNumber={{orderNo}}\" target=\"_blank\">{{orderNo}}</a>\r\n\t\t\t</span>\r\n\t\t\t<span class=\"order-text\">{{createTime}}</span>\r\n\t\t\t<span class=\"order-text\">收件人：{{receiverName}}</span>\r\n\t\t\t<span class=\"order-text\">订单状态：{{statusDesc}}</span>\r\n\t\t\t<span class=\"order-text\">\r\n\t\t\t\t<span>订单总价：</span>\r\n\t\t\t\t<span class=\"order-total\">￥{{payment}}</span>\r\n\t\t\t</span>\r\n\t\t\t<a class=\"link order-detail\" href=\"./order-detail.html?orderNumber={{orderNo}}\" target=\"_blank\">查看详情</a>\r\n\t\t</td>\r\n\t</tr>\r\n\t{{#orderItemVoList}}\r\n\t<tr>\r\n\t\t<td class=\"cell cell-img\">\r\n\t\t\t<a href=\"./detail.html?productId={{productId}}\" target=\"_blank\">\r\n\t\t\t\t<img class=\"p-img\" src=\"{{imageHost}}{{productImage}}\" alt=\"{{productName}}\">\r\n\t\t\t</a>\r\n\t\t</td>\r\n\t\t<td class=\"cell cell-info\">\r\n\t\t\t<a class=\"link\" href=\"./detail.html?productId={{productId}}\" target=\"_blank\">{{productName}}</a>\r\n\t\t</td>\r\n\t\t<td class=\"cell cell-price\">￥{{currentUnitPrice}}</td>\r\n\t\t<td class=\"cell cell-count\">{{quantity}}</td>\r\n\t\t<td class=\"cell cell-total\">￥{{totalPrice}}</td>\r\n\t</tr>\r\n\t{{/orderItemVoList}}\r\n</table>\r\n{{/list}}\r\n{{^list}}\r\n<p class=\"err-tip\">您暂时还没有订单</p>\r\n{{/list}}\r\n";

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

/***/ }),

/***/ "./src/util/pagination/index.css":
/*!***************************************!*\
  !*** ./src/util/pagination/index.css ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/util/pagination/index.js":
/*!**************************************!*\
  !*** ./src/util/pagination/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
* @Author: 青
* @Date:   2020-04-11 15:15:21
* @Last Modified by:   青
* @Last Modified time: 2020-04-11 23:37:22
*/
__webpack_require__(/*! ./index.css */ "./src/util/pagination/index.css");
var templatePagination = __webpack_require__(/*! ./index.string */ "./src/util/pagination/index.string");
var _mm = __webpack_require__(/*! util/mm.js */ "./src/util/mm.js");

var Pagination = function() {
	var _this = this;
	this.defaultOption = {
		container: null,
		pageNum: 1,
		pageRange: 3,
		onSelectPage: null
	};
	// 事件的处理
	$(document).on('click', '.pg-item', function() {
		var $this = $(this);
		// 对于active和disabled按钮点击，不做处理
		if($this.hasClass('active') || $this.hasClass('disabled')) {
			return;
		}
		typeof _this.option.onSelectPage === 'function'
			? _this.option.onSelectPage($this.data('value')) : null;
	});
}

// 渲染分页组件
Pagination.prototype.render = function(userOption) {
	// 合并选项
	this.option = $.extend({}, this.defaultOption, userOption);
	// 判断容器是否为合法的jquery对象
	if(!(this.option.container instanceof jQuery)) {
		return;
	}
	// 判断是否只有1页
	if(this.option.pages <= 1) {
		return;
	}
	// 渲染分页内容
	this.option.container.html(this.getPaginationHtml());
}
// 获取分页的html, |上一页| 1 2 3 4 =5= 6 |下一页| 5/6
// 获取分页的html, |上一页| 2 3 4 =5= 6 7 8 |下一页| 5/9
Pagination.prototype.getPaginationHtml = function() {
	var html ='',
		pageArray = [],
		option = this.option,
		start = option.pageNum - option.pageRange > 0
			? option.pageNum - option.pageRange : 1,
		end = option.pageNum + option.pageRange < option.pages
			? option.pageNum + option.pageRange : option.pages;
	// 上一页按钮的数据
	pageArray.push({
		name: '上一页',
		value: this.option.prePage,
		// 有没有上一页，没有false，并取反
		disabled: !this.option.hasPreviousPage
	});
	// 数字按钮的处理
	for(var i = start; i <= end; i++) {
		pageArray.push({
			name: i,
			value: i,
			active: (i === option.pageNum)
		});
	};
	// 下一页按钮的数据
	pageArray.push({
		name: '下一页',
		value: this.option.nextPage,
		// 有没有下一页，没有false，并取反
		disabled: !this.option.hasNextPage
	});
	html = _mm.renderHtml(templatePagination, {
		pageArray: pageArray,
		pageNum: option.pageNum,
		pages: option.pages
	});
	console.log(pageArray);
	console.log(start, end);
	return html;
};

module.exports = Pagination;

/***/ }),

/***/ "./src/util/pagination/index.string":
/*!******************************************!*\
  !*** ./src/util/pagination/index.string ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"pg-content\">\r\n\t{{#pageArray}}\r\n\t{{#disabled}}\r\n\t\t<span class=\"pg-item disabled\" data-value=\"{{value}}\">{{name}}</span>\r\n\t{{/disabled}}\r\n\t{{^disabled}}\r\n\t\t{{#active}}\r\n\t\t\t<span class=\"pg-item active\" data-value=\"{{value}}\">{{name}}</span>\r\n\t\t{{/active}}\r\n\t\t{{^active}}\r\n\t\t\t<span class=\"pg-item\" data-value=\"{{value}}\">{{name}}</span>\r\n\t\t{{/active}}\r\n\t{{/disabled}}\r\n\t{{/pageArray}}\r\n\r\n\t<span class=\"pg-total\">{{pageNum}} / {{pages}}</span>\r\n</div>";

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2hvZ2FuLmpzL2xpYi9jb21waWxlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaG9nYW4uanMvbGliL2hvZ2FuLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ob2dhbi5qcy9saWIvdGVtcGxhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2UvY29tbW9uL2hlYWRlci9pbmRleC5jc3M/OGUyOCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZS9jb21tb24vaGVhZGVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlL2NvbW1vbi9uYXYtc2lkZS9pbmRleC5jc3M/YTU2NyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZS9jb21tb24vbmF2LXNpZGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2UvY29tbW9uL25hdi1zaWRlL2luZGV4LnN0cmluZyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZS9jb21tb24vbmF2L2luZGV4LmNzcz8xMDIxIiwid2VicGFjazovLy8uL3NyYy9wYWdlL2NvbW1vbi9uYXYvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2Uvb3JkZXItbGlzdC9pbmRleC5jc3M/YmUxOCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZS9vcmRlci1saXN0L2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlL29yZGVyLWxpc3QvaW5kZXguc3RyaW5nIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlL2NhcnQtc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZS9vcmRlci1zZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlL3VzZXItc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC9tbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC9wYWdpbmF0aW9uL2luZGV4LmNzcz9mZGQ5Iiwid2VicGFjazovLy8uL3NyYy91dGlsL3BhZ2luYXRpb24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvcGFnaW5hdGlvbi9pbmRleC5zdHJpbmciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLGtCQUFrQjs7QUFFbEI7QUFDQTtBQUNBLHFCQUFxQixpQ0FBaUM7QUFDdEQ7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QUFJO0FBQ0o7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLHdCOzs7Ozs7Ozs7OztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLG1CQUFPLENBQUMsb0NBQVk7O0FBRTlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSx1Qjs7Ozs7Ozs7Ozs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFlBQVksbUJBQU8sQ0FBQyxzREFBVTs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixHQUFHO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLGdFQUFnRSxJQUFJO0FBQ3BFO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQjs7Ozs7Ozs7Ozs7QUMzRkEsdUM7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQU8sQ0FBQyxvREFBYTtBQUNyQix5QkFBeUIsbUJBQU8sQ0FBQywwREFBZ0I7QUFDakQsVUFBVSxtQkFBTyxDQUFDLG9DQUFZOztBQUU5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxtQkFBbUIsVUFBVTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0Qjs7Ozs7Ozs7Ozs7QUN2RkEsb0RBQW9ELFlBQVksUUFBUSxXQUFXLHdEQUF3RCxPQUFPLEtBQUssTUFBTSxlQUFlLFdBQVcsUUFBUSxXQUFXLFVBQVUsU0FBUyx3REFBd0QsT0FBTyxLQUFLLE1BQU0saUJBQWlCLFNBQVMsVUFBVSxTQUFTLGlEQUFpRCxPQUFPLEtBQUssTUFBTSxpQkFBaUIsU0FBUyxRQUFRLFdBQVcsUUFBUSxZQUFZLHFDQUFxQyxTQUFTLEtBQUssT0FBTyxtQiIsImZpbGUiOiIuL2pzL29yZGVyLWxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9wYWdlL29yZGVyLWxpc3QvaW5kZXguanNcIik7XG4iLCIvKlxuICogIENvcHlyaWdodCAyMDExIFR3aXR0ZXIsIEluYy5cbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbiAoSG9nYW4pIHtcbiAgLy8gU2V0dXAgcmVnZXggIGFzc2lnbm1lbnRzXG4gIC8vIHJlbW92ZSB3aGl0ZXNwYWNlIGFjY29yZGluZyB0byBNdXN0YWNoZSBzcGVjXG4gIHZhciBySXNXaGl0ZXNwYWNlID0gL1xcUy8sXG4gICAgICByUXVvdCA9IC9cXFwiL2csXG4gICAgICByTmV3bGluZSA9ICAvXFxuL2csXG4gICAgICByQ3IgPSAvXFxyL2csXG4gICAgICByU2xhc2ggPSAvXFxcXC9nLFxuICAgICAgckxpbmVTZXAgPSAvXFx1MjAyOC8sXG4gICAgICByUGFyYWdyYXBoU2VwID0gL1xcdTIwMjkvO1xuXG4gIEhvZ2FuLnRhZ3MgPSB7XG4gICAgJyMnOiAxLCAnXic6IDIsICc8JzogMywgJyQnOiA0LFxuICAgICcvJzogNSwgJyEnOiA2LCAnPic6IDcsICc9JzogOCwgJ192JzogOSxcbiAgICAneyc6IDEwLCAnJic6IDExLCAnX3QnOiAxMlxuICB9O1xuXG4gIEhvZ2FuLnNjYW4gPSBmdW5jdGlvbiBzY2FuKHRleHQsIGRlbGltaXRlcnMpIHtcbiAgICB2YXIgbGVuID0gdGV4dC5sZW5ndGgsXG4gICAgICAgIElOX1RFWFQgPSAwLFxuICAgICAgICBJTl9UQUdfVFlQRSA9IDEsXG4gICAgICAgIElOX1RBRyA9IDIsXG4gICAgICAgIHN0YXRlID0gSU5fVEVYVCxcbiAgICAgICAgdGFnVHlwZSA9IG51bGwsXG4gICAgICAgIHRhZyA9IG51bGwsXG4gICAgICAgIGJ1ZiA9ICcnLFxuICAgICAgICB0b2tlbnMgPSBbXSxcbiAgICAgICAgc2VlblRhZyA9IGZhbHNlLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGluZVN0YXJ0ID0gMCxcbiAgICAgICAgb3RhZyA9ICd7eycsXG4gICAgICAgIGN0YWcgPSAnfX0nO1xuXG4gICAgZnVuY3Rpb24gYWRkQnVmKCkge1xuICAgICAgaWYgKGJ1Zi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRva2Vucy5wdXNoKHt0YWc6ICdfdCcsIHRleHQ6IG5ldyBTdHJpbmcoYnVmKX0pO1xuICAgICAgICBidWYgPSAnJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5lSXNXaGl0ZXNwYWNlKCkge1xuICAgICAgdmFyIGlzQWxsV2hpdGVzcGFjZSA9IHRydWU7XG4gICAgICBmb3IgKHZhciBqID0gbGluZVN0YXJ0OyBqIDwgdG9rZW5zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlzQWxsV2hpdGVzcGFjZSA9XG4gICAgICAgICAgKEhvZ2FuLnRhZ3NbdG9rZW5zW2pdLnRhZ10gPCBIb2dhbi50YWdzWydfdiddKSB8fFxuICAgICAgICAgICh0b2tlbnNbal0udGFnID09ICdfdCcgJiYgdG9rZW5zW2pdLnRleHQubWF0Y2gocklzV2hpdGVzcGFjZSkgPT09IG51bGwpO1xuICAgICAgICBpZiAoIWlzQWxsV2hpdGVzcGFjZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXNBbGxXaGl0ZXNwYWNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckxpbmUoaGF2ZVNlZW5UYWcsIG5vTmV3TGluZSkge1xuICAgICAgYWRkQnVmKCk7XG5cbiAgICAgIGlmIChoYXZlU2VlblRhZyAmJiBsaW5lSXNXaGl0ZXNwYWNlKCkpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IGxpbmVTdGFydCwgbmV4dDsgaiA8IHRva2Vucy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGlmICh0b2tlbnNbal0udGV4dCkge1xuICAgICAgICAgICAgaWYgKChuZXh0ID0gdG9rZW5zW2orMV0pICYmIG5leHQudGFnID09ICc+Jykge1xuICAgICAgICAgICAgICAvLyBzZXQgaW5kZW50IHRvIHRva2VuIHZhbHVlXG4gICAgICAgICAgICAgIG5leHQuaW5kZW50ID0gdG9rZW5zW2pdLnRleHQudG9TdHJpbmcoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9rZW5zLnNwbGljZShqLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIW5vTmV3TGluZSkge1xuICAgICAgICB0b2tlbnMucHVzaCh7dGFnOidcXG4nfSk7XG4gICAgICB9XG5cbiAgICAgIHNlZW5UYWcgPSBmYWxzZTtcbiAgICAgIGxpbmVTdGFydCA9IHRva2Vucy5sZW5ndGg7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hhbmdlRGVsaW1pdGVycyh0ZXh0LCBpbmRleCkge1xuICAgICAgdmFyIGNsb3NlID0gJz0nICsgY3RhZyxcbiAgICAgICAgICBjbG9zZUluZGV4ID0gdGV4dC5pbmRleE9mKGNsb3NlLCBpbmRleCksXG4gICAgICAgICAgZGVsaW1pdGVycyA9IHRyaW0oXG4gICAgICAgICAgICB0ZXh0LnN1YnN0cmluZyh0ZXh0LmluZGV4T2YoJz0nLCBpbmRleCkgKyAxLCBjbG9zZUluZGV4KVxuICAgICAgICAgICkuc3BsaXQoJyAnKTtcblxuICAgICAgb3RhZyA9IGRlbGltaXRlcnNbMF07XG4gICAgICBjdGFnID0gZGVsaW1pdGVyc1tkZWxpbWl0ZXJzLmxlbmd0aCAtIDFdO1xuXG4gICAgICByZXR1cm4gY2xvc2VJbmRleCArIGNsb3NlLmxlbmd0aCAtIDE7XG4gICAgfVxuXG4gICAgaWYgKGRlbGltaXRlcnMpIHtcbiAgICAgIGRlbGltaXRlcnMgPSBkZWxpbWl0ZXJzLnNwbGl0KCcgJyk7XG4gICAgICBvdGFnID0gZGVsaW1pdGVyc1swXTtcbiAgICAgIGN0YWcgPSBkZWxpbWl0ZXJzWzFdO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHN0YXRlID09IElOX1RFWFQpIHtcbiAgICAgICAgaWYgKHRhZ0NoYW5nZShvdGFnLCB0ZXh0LCBpKSkge1xuICAgICAgICAgIC0taTtcbiAgICAgICAgICBhZGRCdWYoKTtcbiAgICAgICAgICBzdGF0ZSA9IElOX1RBR19UWVBFO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0ZXh0LmNoYXJBdChpKSA9PSAnXFxuJykge1xuICAgICAgICAgICAgZmlsdGVyTGluZShzZWVuVGFnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnVmICs9IHRleHQuY2hhckF0KGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PSBJTl9UQUdfVFlQRSkge1xuICAgICAgICBpICs9IG90YWcubGVuZ3RoIC0gMTtcbiAgICAgICAgdGFnID0gSG9nYW4udGFnc1t0ZXh0LmNoYXJBdChpICsgMSldO1xuICAgICAgICB0YWdUeXBlID0gdGFnID8gdGV4dC5jaGFyQXQoaSArIDEpIDogJ192JztcbiAgICAgICAgaWYgKHRhZ1R5cGUgPT0gJz0nKSB7XG4gICAgICAgICAgaSA9IGNoYW5nZURlbGltaXRlcnModGV4dCwgaSk7XG4gICAgICAgICAgc3RhdGUgPSBJTl9URVhUO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0YWcpIHtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RhdGUgPSBJTl9UQUc7XG4gICAgICAgIH1cbiAgICAgICAgc2VlblRhZyA9IGk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGFnQ2hhbmdlKGN0YWcsIHRleHQsIGkpKSB7XG4gICAgICAgICAgdG9rZW5zLnB1c2goe3RhZzogdGFnVHlwZSwgbjogdHJpbShidWYpLCBvdGFnOiBvdGFnLCBjdGFnOiBjdGFnLFxuICAgICAgICAgICAgICAgICAgICAgICBpOiAodGFnVHlwZSA9PSAnLycpID8gc2VlblRhZyAtIG90YWcubGVuZ3RoIDogaSArIGN0YWcubGVuZ3RofSk7XG4gICAgICAgICAgYnVmID0gJyc7XG4gICAgICAgICAgaSArPSBjdGFnLmxlbmd0aCAtIDE7XG4gICAgICAgICAgc3RhdGUgPSBJTl9URVhUO1xuICAgICAgICAgIGlmICh0YWdUeXBlID09ICd7Jykge1xuICAgICAgICAgICAgaWYgKGN0YWcgPT0gJ319Jykge1xuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjbGVhblRyaXBsZVN0YWNoZSh0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnVmICs9IHRleHQuY2hhckF0KGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZmlsdGVyTGluZShzZWVuVGFnLCB0cnVlKTtcblxuICAgIHJldHVybiB0b2tlbnM7XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhblRyaXBsZVN0YWNoZSh0b2tlbikge1xuICAgIGlmICh0b2tlbi5uLnN1YnN0cih0b2tlbi5uLmxlbmd0aCAtIDEpID09PSAnfScpIHtcbiAgICAgIHRva2VuLm4gPSB0b2tlbi5uLnN1YnN0cmluZygwLCB0b2tlbi5uLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRyaW0ocykge1xuICAgIGlmIChzLnRyaW0pIHtcbiAgICAgIHJldHVybiBzLnRyaW0oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcy5yZXBsYWNlKC9eXFxzKnxcXHMqJC9nLCAnJyk7XG4gIH1cblxuICBmdW5jdGlvbiB0YWdDaGFuZ2UodGFnLCB0ZXh0LCBpbmRleCkge1xuICAgIGlmICh0ZXh0LmNoYXJBdChpbmRleCkgIT0gdGFnLmNoYXJBdCgwKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAxLCBsID0gdGFnLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKHRleHQuY2hhckF0KGluZGV4ICsgaSkgIT0gdGFnLmNoYXJBdChpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyB0aGUgdGFncyBhbGxvd2VkIGluc2lkZSBzdXBlciB0ZW1wbGF0ZXNcbiAgdmFyIGFsbG93ZWRJblN1cGVyID0geydfdCc6IHRydWUsICdcXG4nOiB0cnVlLCAnJCc6IHRydWUsICcvJzogdHJ1ZX07XG5cbiAgZnVuY3Rpb24gYnVpbGRUcmVlKHRva2Vucywga2luZCwgc3RhY2ssIGN1c3RvbVRhZ3MpIHtcbiAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gW10sXG4gICAgICAgIG9wZW5lciA9IG51bGwsXG4gICAgICAgIHRhaWwgPSBudWxsLFxuICAgICAgICB0b2tlbiA9IG51bGw7XG5cbiAgICB0YWlsID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cbiAgICB3aGlsZSAodG9rZW5zLmxlbmd0aCA+IDApIHtcbiAgICAgIHRva2VuID0gdG9rZW5zLnNoaWZ0KCk7XG5cbiAgICAgIGlmICh0YWlsICYmIHRhaWwudGFnID09ICc8JyAmJiAhKHRva2VuLnRhZyBpbiBhbGxvd2VkSW5TdXBlcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbGxlZ2FsIGNvbnRlbnQgaW4gPCBzdXBlciB0YWcuJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChIb2dhbi50YWdzW3Rva2VuLnRhZ10gPD0gSG9nYW4udGFnc1snJCddIHx8IGlzT3BlbmVyKHRva2VuLCBjdXN0b21UYWdzKSkge1xuICAgICAgICBzdGFjay5wdXNoKHRva2VuKTtcbiAgICAgICAgdG9rZW4ubm9kZXMgPSBidWlsZFRyZWUodG9rZW5zLCB0b2tlbi50YWcsIHN0YWNrLCBjdXN0b21UYWdzKTtcbiAgICAgIH0gZWxzZSBpZiAodG9rZW4udGFnID09ICcvJykge1xuICAgICAgICBpZiAoc3RhY2subGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDbG9zaW5nIHRhZyB3aXRob3V0IG9wZW5lcjogLycgKyB0b2tlbi5uKTtcbiAgICAgICAgfVxuICAgICAgICBvcGVuZXIgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgaWYgKHRva2VuLm4gIT0gb3BlbmVyLm4gJiYgIWlzQ2xvc2VyKHRva2VuLm4sIG9wZW5lci5uLCBjdXN0b21UYWdzKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTmVzdGluZyBlcnJvcjogJyArIG9wZW5lci5uICsgJyB2cy4gJyArIHRva2VuLm4pO1xuICAgICAgICB9XG4gICAgICAgIG9wZW5lci5lbmQgPSB0b2tlbi5pO1xuICAgICAgICByZXR1cm4gaW5zdHJ1Y3Rpb25zO1xuICAgICAgfSBlbHNlIGlmICh0b2tlbi50YWcgPT0gJ1xcbicpIHtcbiAgICAgICAgdG9rZW4ubGFzdCA9ICh0b2tlbnMubGVuZ3RoID09IDApIHx8ICh0b2tlbnNbMF0udGFnID09ICdcXG4nKTtcbiAgICAgIH1cblxuICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2godG9rZW4pO1xuICAgIH1cblxuICAgIGlmIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21pc3NpbmcgY2xvc2luZyB0YWc6ICcgKyBzdGFjay5wb3AoKS5uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5zdHJ1Y3Rpb25zO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNPcGVuZXIodG9rZW4sIHRhZ3MpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRhZ3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodGFnc1tpXS5vID09IHRva2VuLm4pIHtcbiAgICAgICAgdG9rZW4udGFnID0gJyMnO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc0Nsb3NlcihjbG9zZSwgb3BlbiwgdGFncykge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGFncy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICh0YWdzW2ldLmMgPT0gY2xvc2UgJiYgdGFnc1tpXS5vID09IG9wZW4pIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc3RyaW5naWZ5U3Vic3RpdHV0aW9ucyhvYmopIHtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpdGVtcy5wdXNoKCdcIicgKyBlc2Moa2V5KSArICdcIjogZnVuY3Rpb24oYyxwLHQsaSkgeycgKyBvYmpba2V5XSArICd9Jyk7XG4gICAgfVxuICAgIHJldHVybiBcInsgXCIgKyBpdGVtcy5qb2luKFwiLFwiKSArIFwiIH1cIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0cmluZ2lmeVBhcnRpYWxzKGNvZGVPYmopIHtcbiAgICB2YXIgcGFydGlhbHMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gY29kZU9iai5wYXJ0aWFscykge1xuICAgICAgcGFydGlhbHMucHVzaCgnXCInICsgZXNjKGtleSkgKyAnXCI6e25hbWU6XCInICsgZXNjKGNvZGVPYmoucGFydGlhbHNba2V5XS5uYW1lKSArICdcIiwgJyArIHN0cmluZ2lmeVBhcnRpYWxzKGNvZGVPYmoucGFydGlhbHNba2V5XSkgKyBcIn1cIik7XG4gICAgfVxuICAgIHJldHVybiBcInBhcnRpYWxzOiB7XCIgKyBwYXJ0aWFscy5qb2luKFwiLFwiKSArIFwifSwgc3ViczogXCIgKyBzdHJpbmdpZnlTdWJzdGl0dXRpb25zKGNvZGVPYmouc3Vicyk7XG4gIH1cblxuICBIb2dhbi5zdHJpbmdpZnkgPSBmdW5jdGlvbihjb2RlT2JqLCB0ZXh0LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIFwie2NvZGU6IGZ1bmN0aW9uIChjLHAsaSkgeyBcIiArIEhvZ2FuLndyYXBNYWluKGNvZGVPYmouY29kZSkgKyBcIiB9LFwiICsgc3RyaW5naWZ5UGFydGlhbHMoY29kZU9iaikgKyAgXCJ9XCI7XG4gIH1cblxuICB2YXIgc2VyaWFsTm8gPSAwO1xuICBIb2dhbi5nZW5lcmF0ZSA9IGZ1bmN0aW9uKHRyZWUsIHRleHQsIG9wdGlvbnMpIHtcbiAgICBzZXJpYWxObyA9IDA7XG4gICAgdmFyIGNvbnRleHQgPSB7IGNvZGU6ICcnLCBzdWJzOiB7fSwgcGFydGlhbHM6IHt9IH07XG4gICAgSG9nYW4ud2Fsayh0cmVlLCBjb250ZXh0KTtcblxuICAgIGlmIChvcHRpb25zLmFzU3RyaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdHJpbmdpZnkoY29udGV4dCwgdGV4dCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubWFrZVRlbXBsYXRlKGNvbnRleHQsIHRleHQsIG9wdGlvbnMpO1xuICB9XG5cbiAgSG9nYW4ud3JhcE1haW4gPSBmdW5jdGlvbihjb2RlKSB7XG4gICAgcmV0dXJuICd2YXIgdD10aGlzO3QuYihpPWl8fFwiXCIpOycgKyBjb2RlICsgJ3JldHVybiB0LmZsKCk7JztcbiAgfVxuXG4gIEhvZ2FuLnRlbXBsYXRlID0gSG9nYW4uVGVtcGxhdGU7XG5cbiAgSG9nYW4ubWFrZVRlbXBsYXRlID0gZnVuY3Rpb24oY29kZU9iaiwgdGV4dCwgb3B0aW9ucykge1xuICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMubWFrZVBhcnRpYWxzKGNvZGVPYmopO1xuICAgIHRlbXBsYXRlLmNvZGUgPSBuZXcgRnVuY3Rpb24oJ2MnLCAncCcsICdpJywgdGhpcy53cmFwTWFpbihjb2RlT2JqLmNvZGUpKTtcbiAgICByZXR1cm4gbmV3IHRoaXMudGVtcGxhdGUodGVtcGxhdGUsIHRleHQsIHRoaXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgSG9nYW4ubWFrZVBhcnRpYWxzID0gZnVuY3Rpb24oY29kZU9iaikge1xuICAgIHZhciBrZXksIHRlbXBsYXRlID0ge3N1YnM6IHt9LCBwYXJ0aWFsczogY29kZU9iai5wYXJ0aWFscywgbmFtZTogY29kZU9iai5uYW1lfTtcbiAgICBmb3IgKGtleSBpbiB0ZW1wbGF0ZS5wYXJ0aWFscykge1xuICAgICAgdGVtcGxhdGUucGFydGlhbHNba2V5XSA9IHRoaXMubWFrZVBhcnRpYWxzKHRlbXBsYXRlLnBhcnRpYWxzW2tleV0pO1xuICAgIH1cbiAgICBmb3IgKGtleSBpbiBjb2RlT2JqLnN1YnMpIHtcbiAgICAgIHRlbXBsYXRlLnN1YnNba2V5XSA9IG5ldyBGdW5jdGlvbignYycsICdwJywgJ3QnLCAnaScsIGNvZGVPYmouc3Vic1trZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG5cbiAgZnVuY3Rpb24gZXNjKHMpIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKHJTbGFzaCwgJ1xcXFxcXFxcJylcbiAgICAgICAgICAgIC5yZXBsYWNlKHJRdW90LCAnXFxcXFxcXCInKVxuICAgICAgICAgICAgLnJlcGxhY2Uock5ld2xpbmUsICdcXFxcbicpXG4gICAgICAgICAgICAucmVwbGFjZShyQ3IsICdcXFxccicpXG4gICAgICAgICAgICAucmVwbGFjZShyTGluZVNlcCwgJ1xcXFx1MjAyOCcpXG4gICAgICAgICAgICAucmVwbGFjZShyUGFyYWdyYXBoU2VwLCAnXFxcXHUyMDI5Jyk7XG4gIH1cblxuICBmdW5jdGlvbiBjaG9vc2VNZXRob2Qocykge1xuICAgIHJldHVybiAofnMuaW5kZXhPZignLicpKSA/ICdkJyA6ICdmJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVBhcnRpYWwobm9kZSwgY29udGV4dCkge1xuICAgIHZhciBwcmVmaXggPSBcIjxcIiArIChjb250ZXh0LnByZWZpeCB8fCBcIlwiKTtcbiAgICB2YXIgc3ltID0gcHJlZml4ICsgbm9kZS5uICsgc2VyaWFsTm8rKztcbiAgICBjb250ZXh0LnBhcnRpYWxzW3N5bV0gPSB7bmFtZTogbm9kZS5uLCBwYXJ0aWFsczoge319O1xuICAgIGNvbnRleHQuY29kZSArPSAndC5iKHQucnAoXCInICsgIGVzYyhzeW0pICsgJ1wiLGMscCxcIicgKyAobm9kZS5pbmRlbnQgfHwgJycpICsgJ1wiKSk7JztcbiAgICByZXR1cm4gc3ltO1xuICB9XG5cbiAgSG9nYW4uY29kZWdlbiA9IHtcbiAgICAnIyc6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQuY29kZSArPSAnaWYodC5zKHQuJyArIGNob29zZU1ldGhvZChub2RlLm4pICsgJyhcIicgKyBlc2Mobm9kZS5uKSArICdcIixjLHAsMSksJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ2MscCwwLCcgKyBub2RlLmkgKyAnLCcgKyBub2RlLmVuZCArICcsXCInICsgbm9kZS5vdGFnICsgXCIgXCIgKyBub2RlLmN0YWcgKyAnXCIpKXsnICtcbiAgICAgICAgICAgICAgICAgICAgICAndC5ycyhjLHAsJyArICdmdW5jdGlvbihjLHAsdCl7JztcbiAgICAgIEhvZ2FuLndhbGsobm9kZS5ub2RlcywgY29udGV4dCk7XG4gICAgICBjb250ZXh0LmNvZGUgKz0gJ30pO2MucG9wKCk7fSc7XG4gICAgfSxcblxuICAgICdeJzogZnVuY3Rpb24obm9kZSwgY29udGV4dCkge1xuICAgICAgY29udGV4dC5jb2RlICs9ICdpZighdC5zKHQuJyArIGNob29zZU1ldGhvZChub2RlLm4pICsgJyhcIicgKyBlc2Mobm9kZS5uKSArICdcIixjLHAsMSksYyxwLDEsMCwwLFwiXCIpKXsnO1xuICAgICAgSG9nYW4ud2Fsayhub2RlLm5vZGVzLCBjb250ZXh0KTtcbiAgICAgIGNvbnRleHQuY29kZSArPSAnfTsnO1xuICAgIH0sXG5cbiAgICAnPic6IGNyZWF0ZVBhcnRpYWwsXG4gICAgJzwnOiBmdW5jdGlvbihub2RlLCBjb250ZXh0KSB7XG4gICAgICB2YXIgY3R4ID0ge3BhcnRpYWxzOiB7fSwgY29kZTogJycsIHN1YnM6IHt9LCBpblBhcnRpYWw6IHRydWV9O1xuICAgICAgSG9nYW4ud2Fsayhub2RlLm5vZGVzLCBjdHgpO1xuICAgICAgdmFyIHRlbXBsYXRlID0gY29udGV4dC5wYXJ0aWFsc1tjcmVhdGVQYXJ0aWFsKG5vZGUsIGNvbnRleHQpXTtcbiAgICAgIHRlbXBsYXRlLnN1YnMgPSBjdHguc3VicztcbiAgICAgIHRlbXBsYXRlLnBhcnRpYWxzID0gY3R4LnBhcnRpYWxzO1xuICAgIH0sXG5cbiAgICAnJCc6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIHZhciBjdHggPSB7c3Viczoge30sIGNvZGU6ICcnLCBwYXJ0aWFsczogY29udGV4dC5wYXJ0aWFscywgcHJlZml4OiBub2RlLm59O1xuICAgICAgSG9nYW4ud2Fsayhub2RlLm5vZGVzLCBjdHgpO1xuICAgICAgY29udGV4dC5zdWJzW25vZGUubl0gPSBjdHguY29kZTtcbiAgICAgIGlmICghY29udGV4dC5pblBhcnRpYWwpIHtcbiAgICAgICAgY29udGV4dC5jb2RlICs9ICd0LnN1YihcIicgKyBlc2Mobm9kZS5uKSArICdcIixjLHAsaSk7JztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJ1xcbic6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQuY29kZSArPSB3cml0ZSgnXCJcXFxcblwiJyArIChub2RlLmxhc3QgPyAnJyA6ICcgKyBpJykpO1xuICAgIH0sXG5cbiAgICAnX3YnOiBmdW5jdGlvbihub2RlLCBjb250ZXh0KSB7XG4gICAgICBjb250ZXh0LmNvZGUgKz0gJ3QuYih0LnYodC4nICsgY2hvb3NlTWV0aG9kKG5vZGUubikgKyAnKFwiJyArIGVzYyhub2RlLm4pICsgJ1wiLGMscCwwKSkpOyc7XG4gICAgfSxcblxuICAgICdfdCc6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQuY29kZSArPSB3cml0ZSgnXCInICsgZXNjKG5vZGUudGV4dCkgKyAnXCInKTtcbiAgICB9LFxuXG4gICAgJ3snOiB0cmlwbGVTdGFjaGUsXG5cbiAgICAnJic6IHRyaXBsZVN0YWNoZVxuICB9XG5cbiAgZnVuY3Rpb24gdHJpcGxlU3RhY2hlKG5vZGUsIGNvbnRleHQpIHtcbiAgICBjb250ZXh0LmNvZGUgKz0gJ3QuYih0LnQodC4nICsgY2hvb3NlTWV0aG9kKG5vZGUubikgKyAnKFwiJyArIGVzYyhub2RlLm4pICsgJ1wiLGMscCwwKSkpOyc7XG4gIH1cblxuICBmdW5jdGlvbiB3cml0ZShzKSB7XG4gICAgcmV0dXJuICd0LmIoJyArIHMgKyAnKTsnO1xuICB9XG5cbiAgSG9nYW4ud2FsayA9IGZ1bmN0aW9uKG5vZGVsaXN0LCBjb250ZXh0KSB7XG4gICAgdmFyIGZ1bmM7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBub2RlbGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGZ1bmMgPSBIb2dhbi5jb2RlZ2VuW25vZGVsaXN0W2ldLnRhZ107XG4gICAgICBmdW5jICYmIGZ1bmMobm9kZWxpc3RbaV0sIGNvbnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuXG4gIEhvZ2FuLnBhcnNlID0gZnVuY3Rpb24odG9rZW5zLCB0ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgcmV0dXJuIGJ1aWxkVHJlZSh0b2tlbnMsICcnLCBbXSwgb3B0aW9ucy5zZWN0aW9uVGFncyB8fCBbXSk7XG4gIH1cblxuICBIb2dhbi5jYWNoZSA9IHt9O1xuXG4gIEhvZ2FuLmNhY2hlS2V5ID0gZnVuY3Rpb24odGV4dCwgb3B0aW9ucykge1xuICAgIHJldHVybiBbdGV4dCwgISFvcHRpb25zLmFzU3RyaW5nLCAhIW9wdGlvbnMuZGlzYWJsZUxhbWJkYSwgb3B0aW9ucy5kZWxpbWl0ZXJzLCAhIW9wdGlvbnMubW9kZWxHZXRdLmpvaW4oJ3x8Jyk7XG4gIH1cblxuICBIb2dhbi5jb21waWxlID0gZnVuY3Rpb24odGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBrZXkgPSBIb2dhbi5jYWNoZUtleSh0ZXh0LCBvcHRpb25zKTtcbiAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLmNhY2hlW2tleV07XG5cbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgIHZhciBwYXJ0aWFscyA9IHRlbXBsYXRlLnBhcnRpYWxzO1xuICAgICAgZm9yICh2YXIgbmFtZSBpbiBwYXJ0aWFscykge1xuICAgICAgICBkZWxldGUgcGFydGlhbHNbbmFtZV0uaW5zdGFuY2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgdGVtcGxhdGUgPSB0aGlzLmdlbmVyYXRlKHRoaXMucGFyc2UodGhpcy5zY2FuKHRleHQsIG9wdGlvbnMuZGVsaW1pdGVycyksIHRleHQsIG9wdGlvbnMpLCB0ZXh0LCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5jYWNoZVtrZXldID0gdGVtcGxhdGU7XG4gIH1cbn0pKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyA/IGV4cG9ydHMgOiBIb2dhbik7XG4iLCIvKlxuICogIENvcHlyaWdodCAyMDExIFR3aXR0ZXIsIEluYy5cbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8vIFRoaXMgZmlsZSBpcyBmb3IgdXNlIHdpdGggTm9kZS5qcy4gU2VlIGRpc3QvIGZvciBicm93c2VyIGZpbGVzLlxuXG52YXIgSG9nYW4gPSByZXF1aXJlKCcuL2NvbXBpbGVyJyk7XG5Ib2dhbi5UZW1wbGF0ZSA9IHJlcXVpcmUoJy4vdGVtcGxhdGUnKS5UZW1wbGF0ZTtcbkhvZ2FuLnRlbXBsYXRlID0gSG9nYW4uVGVtcGxhdGU7XG5tb2R1bGUuZXhwb3J0cyA9IEhvZ2FuO1xuIiwiLypcbiAqICBDb3B5cmlnaHQgMjAxMSBUd2l0dGVyLCBJbmMuXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG52YXIgSG9nYW4gPSB7fTtcblxuKGZ1bmN0aW9uIChIb2dhbikge1xuICBIb2dhbi5UZW1wbGF0ZSA9IGZ1bmN0aW9uIChjb2RlT2JqLCB0ZXh0LCBjb21waWxlciwgb3B0aW9ucykge1xuICAgIGNvZGVPYmogPSBjb2RlT2JqIHx8IHt9O1xuICAgIHRoaXMuciA9IGNvZGVPYmouY29kZSB8fCB0aGlzLnI7XG4gICAgdGhpcy5jID0gY29tcGlsZXI7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnRleHQgPSB0ZXh0IHx8ICcnO1xuICAgIHRoaXMucGFydGlhbHMgPSBjb2RlT2JqLnBhcnRpYWxzIHx8IHt9O1xuICAgIHRoaXMuc3VicyA9IGNvZGVPYmouc3VicyB8fCB7fTtcbiAgICB0aGlzLmJ1ZiA9ICcnO1xuICB9XG5cbiAgSG9nYW4uVGVtcGxhdGUucHJvdG90eXBlID0ge1xuICAgIC8vIHJlbmRlcjogcmVwbGFjZWQgYnkgZ2VuZXJhdGVkIGNvZGUuXG4gICAgcjogZnVuY3Rpb24gKGNvbnRleHQsIHBhcnRpYWxzLCBpbmRlbnQpIHsgcmV0dXJuICcnOyB9LFxuXG4gICAgLy8gdmFyaWFibGUgZXNjYXBpbmdcbiAgICB2OiBob2dhbkVzY2FwZSxcblxuICAgIC8vIHRyaXBsZSBzdGFjaGVcbiAgICB0OiBjb2VyY2VUb1N0cmluZyxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGNvbnRleHQsIHBhcnRpYWxzLCBpbmRlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJpKFtjb250ZXh0XSwgcGFydGlhbHMgfHwge30sIGluZGVudCk7XG4gICAgfSxcblxuICAgIC8vIHJlbmRlciBpbnRlcm5hbCAtLSBhIGhvb2sgZm9yIG92ZXJyaWRlcyB0aGF0IGNhdGNoZXMgcGFydGlhbHMgdG9vXG4gICAgcmk6IGZ1bmN0aW9uIChjb250ZXh0LCBwYXJ0aWFscywgaW5kZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5yKGNvbnRleHQsIHBhcnRpYWxzLCBpbmRlbnQpO1xuICAgIH0sXG5cbiAgICAvLyBlbnN1cmVQYXJ0aWFsXG4gICAgZXA6IGZ1bmN0aW9uKHN5bWJvbCwgcGFydGlhbHMpIHtcbiAgICAgIHZhciBwYXJ0aWFsID0gdGhpcy5wYXJ0aWFsc1tzeW1ib2xdO1xuXG4gICAgICAvLyBjaGVjayB0byBzZWUgdGhhdCBpZiB3ZSd2ZSBpbnN0YW50aWF0ZWQgdGhpcyBwYXJ0aWFsIGJlZm9yZVxuICAgICAgdmFyIHRlbXBsYXRlID0gcGFydGlhbHNbcGFydGlhbC5uYW1lXTtcbiAgICAgIGlmIChwYXJ0aWFsLmluc3RhbmNlICYmIHBhcnRpYWwuYmFzZSA9PSB0ZW1wbGF0ZSkge1xuICAgICAgICByZXR1cm4gcGFydGlhbC5pbnN0YW5jZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoIXRoaXMuYykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGNvbXBpbGVyIGF2YWlsYWJsZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgdGVtcGxhdGUgPSB0aGlzLmMuY29tcGlsZSh0ZW1wbGF0ZSwgdGhpcy5vcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0ZW1wbGF0ZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gV2UgdXNlIHRoaXMgdG8gY2hlY2sgd2hldGhlciB0aGUgcGFydGlhbHMgZGljdGlvbmFyeSBoYXMgY2hhbmdlZFxuICAgICAgdGhpcy5wYXJ0aWFsc1tzeW1ib2xdLmJhc2UgPSB0ZW1wbGF0ZTtcblxuICAgICAgaWYgKHBhcnRpYWwuc3Vicykge1xuICAgICAgICAvLyBNYWtlIHN1cmUgd2UgY29uc2lkZXIgcGFyZW50IHRlbXBsYXRlIG5vd1xuICAgICAgICBpZiAoIXBhcnRpYWxzLnN0YWNrVGV4dCkgcGFydGlhbHMuc3RhY2tUZXh0ID0ge307XG4gICAgICAgIGZvciAoa2V5IGluIHBhcnRpYWwuc3Vicykge1xuICAgICAgICAgIGlmICghcGFydGlhbHMuc3RhY2tUZXh0W2tleV0pIHtcbiAgICAgICAgICAgIHBhcnRpYWxzLnN0YWNrVGV4dFtrZXldID0gKHRoaXMuYWN0aXZlU3ViICE9PSB1bmRlZmluZWQgJiYgcGFydGlhbHMuc3RhY2tUZXh0W3RoaXMuYWN0aXZlU3ViXSkgPyBwYXJ0aWFscy5zdGFja1RleHRbdGhpcy5hY3RpdmVTdWJdIDogdGhpcy50ZXh0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wbGF0ZSA9IGNyZWF0ZVNwZWNpYWxpemVkUGFydGlhbCh0ZW1wbGF0ZSwgcGFydGlhbC5zdWJzLCBwYXJ0aWFsLnBhcnRpYWxzLFxuICAgICAgICAgIHRoaXMuc3RhY2tTdWJzLCB0aGlzLnN0YWNrUGFydGlhbHMsIHBhcnRpYWxzLnN0YWNrVGV4dCk7XG4gICAgICB9XG4gICAgICB0aGlzLnBhcnRpYWxzW3N5bWJvbF0uaW5zdGFuY2UgPSB0ZW1wbGF0ZTtcblxuICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH0sXG5cbiAgICAvLyB0cmllcyB0byBmaW5kIGEgcGFydGlhbCBpbiB0aGUgY3VycmVudCBzY29wZSBhbmQgcmVuZGVyIGl0XG4gICAgcnA6IGZ1bmN0aW9uKHN5bWJvbCwgY29udGV4dCwgcGFydGlhbHMsIGluZGVudCkge1xuICAgICAgdmFyIHBhcnRpYWwgPSB0aGlzLmVwKHN5bWJvbCwgcGFydGlhbHMpO1xuICAgICAgaWYgKCFwYXJ0aWFsKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhcnRpYWwucmkoY29udGV4dCwgcGFydGlhbHMsIGluZGVudCk7XG4gICAgfSxcblxuICAgIC8vIHJlbmRlciBhIHNlY3Rpb25cbiAgICByczogZnVuY3Rpb24oY29udGV4dCwgcGFydGlhbHMsIHNlY3Rpb24pIHtcbiAgICAgIHZhciB0YWlsID0gY29udGV4dFtjb250ZXh0Lmxlbmd0aCAtIDFdO1xuXG4gICAgICBpZiAoIWlzQXJyYXkodGFpbCkpIHtcbiAgICAgICAgc2VjdGlvbihjb250ZXh0LCBwYXJ0aWFscywgdGhpcyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWlsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnRleHQucHVzaCh0YWlsW2ldKTtcbiAgICAgICAgc2VjdGlvbihjb250ZXh0LCBwYXJ0aWFscywgdGhpcyk7XG4gICAgICAgIGNvbnRleHQucG9wKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIG1heWJlIHN0YXJ0IGEgc2VjdGlvblxuICAgIHM6IGZ1bmN0aW9uKHZhbCwgY3R4LCBwYXJ0aWFscywgaW52ZXJ0ZWQsIHN0YXJ0LCBlbmQsIHRhZ3MpIHtcbiAgICAgIHZhciBwYXNzO1xuXG4gICAgICBpZiAoaXNBcnJheSh2YWwpICYmIHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbCA9IHRoaXMubXModmFsLCBjdHgsIHBhcnRpYWxzLCBpbnZlcnRlZCwgc3RhcnQsIGVuZCwgdGFncyk7XG4gICAgICB9XG5cbiAgICAgIHBhc3MgPSAhIXZhbDtcblxuICAgICAgaWYgKCFpbnZlcnRlZCAmJiBwYXNzICYmIGN0eCkge1xuICAgICAgICBjdHgucHVzaCgodHlwZW9mIHZhbCA9PSAnb2JqZWN0JykgPyB2YWwgOiBjdHhbY3R4Lmxlbmd0aCAtIDFdKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhc3M7XG4gICAgfSxcblxuICAgIC8vIGZpbmQgdmFsdWVzIHdpdGggZG90dGVkIG5hbWVzXG4gICAgZDogZnVuY3Rpb24oa2V5LCBjdHgsIHBhcnRpYWxzLCByZXR1cm5Gb3VuZCkge1xuICAgICAgdmFyIGZvdW5kLFxuICAgICAgICAgIG5hbWVzID0ga2V5LnNwbGl0KCcuJyksXG4gICAgICAgICAgdmFsID0gdGhpcy5mKG5hbWVzWzBdLCBjdHgsIHBhcnRpYWxzLCByZXR1cm5Gb3VuZCksXG4gICAgICAgICAgZG9Nb2RlbEdldCA9IHRoaXMub3B0aW9ucy5tb2RlbEdldCxcbiAgICAgICAgICBjeCA9IG51bGw7XG5cbiAgICAgIGlmIChrZXkgPT09ICcuJyAmJiBpc0FycmF5KGN0eFtjdHgubGVuZ3RoIC0gMl0pKSB7XG4gICAgICAgIHZhbCA9IGN0eFtjdHgubGVuZ3RoIC0gMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZm91bmQgPSBmaW5kSW5TY29wZShuYW1lc1tpXSwgdmFsLCBkb01vZGVsR2V0KTtcbiAgICAgICAgICBpZiAoZm91bmQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY3ggPSB2YWw7XG4gICAgICAgICAgICB2YWwgPSBmb3VuZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsID0gJyc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXR1cm5Gb3VuZCAmJiAhdmFsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZXR1cm5Gb3VuZCAmJiB0eXBlb2YgdmFsID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY3R4LnB1c2goY3gpO1xuICAgICAgICB2YWwgPSB0aGlzLm12KHZhbCwgY3R4LCBwYXJ0aWFscyk7XG4gICAgICAgIGN0eC5wb3AoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9LFxuXG4gICAgLy8gZmluZCB2YWx1ZXMgd2l0aCBub3JtYWwgbmFtZXNcbiAgICBmOiBmdW5jdGlvbihrZXksIGN0eCwgcGFydGlhbHMsIHJldHVybkZvdW5kKSB7XG4gICAgICB2YXIgdmFsID0gZmFsc2UsXG4gICAgICAgICAgdiA9IG51bGwsXG4gICAgICAgICAgZm91bmQgPSBmYWxzZSxcbiAgICAgICAgICBkb01vZGVsR2V0ID0gdGhpcy5vcHRpb25zLm1vZGVsR2V0O1xuXG4gICAgICBmb3IgKHZhciBpID0gY3R4Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHYgPSBjdHhbaV07XG4gICAgICAgIHZhbCA9IGZpbmRJblNjb3BlKGtleSwgdiwgZG9Nb2RlbEdldCk7XG4gICAgICAgIGlmICh2YWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgIHJldHVybiAocmV0dXJuRm91bmQpID8gZmFsc2UgOiBcIlwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJldHVybkZvdW5kICYmIHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YWwgPSB0aGlzLm12KHZhbCwgY3R4LCBwYXJ0aWFscyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWw7XG4gICAgfSxcblxuICAgIC8vIGhpZ2hlciBvcmRlciB0ZW1wbGF0ZXNcbiAgICBsczogZnVuY3Rpb24oZnVuYywgY3gsIHBhcnRpYWxzLCB0ZXh0LCB0YWdzKSB7XG4gICAgICB2YXIgb2xkVGFncyA9IHRoaXMub3B0aW9ucy5kZWxpbWl0ZXJzO1xuXG4gICAgICB0aGlzLm9wdGlvbnMuZGVsaW1pdGVycyA9IHRhZ3M7XG4gICAgICB0aGlzLmIodGhpcy5jdChjb2VyY2VUb1N0cmluZyhmdW5jLmNhbGwoY3gsIHRleHQpKSwgY3gsIHBhcnRpYWxzKSk7XG4gICAgICB0aGlzLm9wdGlvbnMuZGVsaW1pdGVycyA9IG9sZFRhZ3M7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gY29tcGlsZSB0ZXh0XG4gICAgY3Q6IGZ1bmN0aW9uKHRleHQsIGN4LCBwYXJ0aWFscykge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kaXNhYmxlTGFtYmRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTGFtYmRhIGZlYXR1cmVzIGRpc2FibGVkLicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuYy5jb21waWxlKHRleHQsIHRoaXMub3B0aW9ucykucmVuZGVyKGN4LCBwYXJ0aWFscyk7XG4gICAgfSxcblxuICAgIC8vIHRlbXBsYXRlIHJlc3VsdCBidWZmZXJpbmdcbiAgICBiOiBmdW5jdGlvbihzKSB7IHRoaXMuYnVmICs9IHM7IH0sXG5cbiAgICBmbDogZnVuY3Rpb24oKSB7IHZhciByID0gdGhpcy5idWY7IHRoaXMuYnVmID0gJyc7IHJldHVybiByOyB9LFxuXG4gICAgLy8gbWV0aG9kIHJlcGxhY2Ugc2VjdGlvblxuICAgIG1zOiBmdW5jdGlvbihmdW5jLCBjdHgsIHBhcnRpYWxzLCBpbnZlcnRlZCwgc3RhcnQsIGVuZCwgdGFncykge1xuICAgICAgdmFyIHRleHRTb3VyY2UsXG4gICAgICAgICAgY3ggPSBjdHhbY3R4Lmxlbmd0aCAtIDFdLFxuICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuY2FsbChjeCk7XG5cbiAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaWYgKGludmVydGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGV4dFNvdXJjZSA9ICh0aGlzLmFjdGl2ZVN1YiAmJiB0aGlzLnN1YnNUZXh0ICYmIHRoaXMuc3Vic1RleHRbdGhpcy5hY3RpdmVTdWJdKSA/IHRoaXMuc3Vic1RleHRbdGhpcy5hY3RpdmVTdWJdIDogdGhpcy50ZXh0O1xuICAgICAgICAgIHJldHVybiB0aGlzLmxzKHJlc3VsdCwgY3gsIHBhcnRpYWxzLCB0ZXh0U291cmNlLnN1YnN0cmluZyhzdGFydCwgZW5kKSwgdGFncyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgLy8gbWV0aG9kIHJlcGxhY2UgdmFyaWFibGVcbiAgICBtdjogZnVuY3Rpb24oZnVuYywgY3R4LCBwYXJ0aWFscykge1xuICAgICAgdmFyIGN4ID0gY3R4W2N0eC5sZW5ndGggLSAxXTtcbiAgICAgIHZhciByZXN1bHQgPSBmdW5jLmNhbGwoY3gpO1xuXG4gICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN0KGNvZXJjZVRvU3RyaW5nKHJlc3VsdC5jYWxsKGN4KSksIGN4LCBwYXJ0aWFscyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIHN1YjogZnVuY3Rpb24obmFtZSwgY29udGV4dCwgcGFydGlhbHMsIGluZGVudCkge1xuICAgICAgdmFyIGYgPSB0aGlzLnN1YnNbbmFtZV07XG4gICAgICBpZiAoZikge1xuICAgICAgICB0aGlzLmFjdGl2ZVN1YiA9IG5hbWU7XG4gICAgICAgIGYoY29udGV4dCwgcGFydGlhbHMsIHRoaXMsIGluZGVudCk7XG4gICAgICAgIHRoaXMuYWN0aXZlU3ViID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gIH07XG5cbiAgLy9GaW5kIGEga2V5IGluIGFuIG9iamVjdFxuICBmdW5jdGlvbiBmaW5kSW5TY29wZShrZXksIHNjb3BlLCBkb01vZGVsR2V0KSB7XG4gICAgdmFyIHZhbDtcblxuICAgIGlmIChzY29wZSAmJiB0eXBlb2Ygc2NvcGUgPT0gJ29iamVjdCcpIHtcblxuICAgICAgaWYgKHNjb3BlW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YWwgPSBzY29wZVtrZXldO1xuXG4gICAgICAvLyB0cnkgbG9va3VwIHdpdGggZ2V0IGZvciBiYWNrYm9uZSBvciBzaW1pbGFyIG1vZGVsIGRhdGFcbiAgICAgIH0gZWxzZSBpZiAoZG9Nb2RlbEdldCAmJiBzY29wZS5nZXQgJiYgdHlwZW9mIHNjb3BlLmdldCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbCA9IHNjb3BlLmdldChrZXkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVTcGVjaWFsaXplZFBhcnRpYWwoaW5zdGFuY2UsIHN1YnMsIHBhcnRpYWxzLCBzdGFja1N1YnMsIHN0YWNrUGFydGlhbHMsIHN0YWNrVGV4dCkge1xuICAgIGZ1bmN0aW9uIFBhcnRpYWxUZW1wbGF0ZSgpIHt9O1xuICAgIFBhcnRpYWxUZW1wbGF0ZS5wcm90b3R5cGUgPSBpbnN0YW5jZTtcbiAgICBmdW5jdGlvbiBTdWJzdGl0dXRpb25zKCkge307XG4gICAgU3Vic3RpdHV0aW9ucy5wcm90b3R5cGUgPSBpbnN0YW5jZS5zdWJzO1xuICAgIHZhciBrZXk7XG4gICAgdmFyIHBhcnRpYWwgPSBuZXcgUGFydGlhbFRlbXBsYXRlKCk7XG4gICAgcGFydGlhbC5zdWJzID0gbmV3IFN1YnN0aXR1dGlvbnMoKTtcbiAgICBwYXJ0aWFsLnN1YnNUZXh0ID0ge307ICAvL2hlaGUuIHN1YnN0ZXh0LlxuICAgIHBhcnRpYWwuYnVmID0gJyc7XG5cbiAgICBzdGFja1N1YnMgPSBzdGFja1N1YnMgfHwge307XG4gICAgcGFydGlhbC5zdGFja1N1YnMgPSBzdGFja1N1YnM7XG4gICAgcGFydGlhbC5zdWJzVGV4dCA9IHN0YWNrVGV4dDtcbiAgICBmb3IgKGtleSBpbiBzdWJzKSB7XG4gICAgICBpZiAoIXN0YWNrU3Vic1trZXldKSBzdGFja1N1YnNba2V5XSA9IHN1YnNba2V5XTtcbiAgICB9XG4gICAgZm9yIChrZXkgaW4gc3RhY2tTdWJzKSB7XG4gICAgICBwYXJ0aWFsLnN1YnNba2V5XSA9IHN0YWNrU3Vic1trZXldO1xuICAgIH1cblxuICAgIHN0YWNrUGFydGlhbHMgPSBzdGFja1BhcnRpYWxzIHx8IHt9O1xuICAgIHBhcnRpYWwuc3RhY2tQYXJ0aWFscyA9IHN0YWNrUGFydGlhbHM7XG4gICAgZm9yIChrZXkgaW4gcGFydGlhbHMpIHtcbiAgICAgIGlmICghc3RhY2tQYXJ0aWFsc1trZXldKSBzdGFja1BhcnRpYWxzW2tleV0gPSBwYXJ0aWFsc1trZXldO1xuICAgIH1cbiAgICBmb3IgKGtleSBpbiBzdGFja1BhcnRpYWxzKSB7XG4gICAgICBwYXJ0aWFsLnBhcnRpYWxzW2tleV0gPSBzdGFja1BhcnRpYWxzW2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnRpYWw7XG4gIH1cblxuICB2YXIgckFtcCA9IC8mL2csXG4gICAgICByTHQgPSAvPC9nLFxuICAgICAgckd0ID0gLz4vZyxcbiAgICAgIHJBcG9zID0gL1xcJy9nLFxuICAgICAgclF1b3QgPSAvXFxcIi9nLFxuICAgICAgaENoYXJzID0gL1smPD5cXFwiXFwnXS87XG5cbiAgZnVuY3Rpb24gY29lcmNlVG9TdHJpbmcodmFsKSB7XG4gICAgcmV0dXJuIFN0cmluZygodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSA/ICcnIDogdmFsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhvZ2FuRXNjYXBlKHN0cikge1xuICAgIHN0ciA9IGNvZXJjZVRvU3RyaW5nKHN0cik7XG4gICAgcmV0dXJuIGhDaGFycy50ZXN0KHN0cikgP1xuICAgICAgc3RyXG4gICAgICAgIC5yZXBsYWNlKHJBbXAsICcmYW1wOycpXG4gICAgICAgIC5yZXBsYWNlKHJMdCwgJyZsdDsnKVxuICAgICAgICAucmVwbGFjZShyR3QsICcmZ3Q7JylcbiAgICAgICAgLnJlcGxhY2UockFwb3MsICcmIzM5OycpXG4gICAgICAgIC5yZXBsYWNlKHJRdW90LCAnJnF1b3Q7JykgOlxuICAgICAgc3RyO1xuICB9XG5cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKGEpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG59KSh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgPyBleHBvcnRzIDogSG9nYW4pO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLypcclxuKiBAQXV0aG9yOiDpnZJcclxuKiBARGF0ZTogICAyMDIwLTAzLTE1IDEwOjEwOjI3XHJcbiogQExhc3QgTW9kaWZpZWQgYnk6ICAg6Z2SXHJcbiogQExhc3QgTW9kaWZpZWQgdGltZTogMjAyMC0wNC0xMCAxNTo0MTo1MVxyXG4qL1xyXG5yZXF1aXJlKCcuL2luZGV4LmNzcycpO1xyXG52YXIgX21tID0gcmVxdWlyZSgndXRpbC9tbS5qcycpO1xyXG5cclxuLy8g6YCa55So6aG16Z2i5aS06YOoXHJcbnZhciBoZWFkZXIgPSB7XHJcblx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLm9uTG9hZCgpO1xyXG5cdFx0dGhpcy5iaW5kRXZlbnQoKTtcclxuXHR9LFxyXG5cdG9uTG9hZDogZnVuY3Rpb24oKSB7XHJcblx0XHRjb25zb2xlLmxvZygnb25Mb2FkJyk7XHJcblxyXG5cdFx0dmFyIGtleXdvcmQgPSBfbW0uZ2V0VXJsUGFyYW0oJ2tleXdvcmQnKTtcclxuXHRcdC8vIGtleXdvcmTlrZjlnKjvvIzvvIzliJnlm57loavovpPlhaXmoYZcclxuXHRcdGlmKGtleXdvcmQpe1xyXG5cdFx0XHQkKCcjc2VhcmNoLWlucHV0JykudmFsKGtleXdvcmQpO1xyXG5cdFx0fTtcclxuXHR9LFxyXG5cdGJpbmRFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xyXG5cdFx0Ly8g54K55Ye75pCc57Si5oyJ6ZKu5Lul5ZCOIO+8jOWBmuaQnOe0ouaPkOS6pFxyXG5cdFx0JCgnI3NlYXJjaC1idG4nKS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdFx0X3RoaXMuc2VhcmNoU3VibWl0KCk7XHJcblx0XHR9KTtcclxuXHRcdCQoJyNzZWFyY2gtaW5wdXQnKS5rZXl1cChmdW5jdGlvbihlKSB7XHJcblx0XHRcdC8vIOWOn+eUn+eahGpz6ZSu55uY56CBXHJcblx0XHRcdGlmKGUua2V5Q29kZSA9PT0gMTMpe1xyXG5cdFx0XHRcdF90aGlzLnNlYXJjaFN1Ym1pdCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5pCc57Si55qE5o+Q5LqkXHJcblx0c2VhcmNoU3VibWl0OiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBrZXl3b3JkID0gJC50cmltKCQoJyNzZWFyY2gtaW5wdXQnKS52YWwoKSk7XHJcblx0XHQvLyDlpoLmnpzmj5DkuqTnmoTml7blgJnmnIlrZXl3b3Jk77yM5q2j5bi46Lez6L2s5YiwbGlzdOmhtVxyXG5cdFx0aWYoa2V5d29yZCkge1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL2xpc3QuaHRtbD9rZXl3b3JkPScgKyBrZXl3b3JkO1xyXG5cdFx0fVxyXG5cdFx0Ly8g5aaC5p6ca2V5d29yZOS4uuepuu+8jOebtOaOpei/lOWbnummlumhtVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdF9tbS5kb0hvbWUoKTtcclxuXHRcdH1cclxuXHRcdGNvbnNvbGUubG9nKGtleXdvcmQpO1x0XHJcblx0fVxyXG59XHJcblxyXG5oZWFkZXIuaW5pdCgpOyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIi8qXHJcbiogQEF1dGhvcjog6Z2SXHJcbiogQERhdGU6ICAgMjAyMC0wMy0xNSAxNTozNzoyOVxyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIOmdklxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMjAtMDMtMjkgMTU6MDQ6MDZcclxuKi9cclxucmVxdWlyZSgnLi9pbmRleC5jc3MnKTtcclxudmFyIF9tbSA9IHJlcXVpcmUoJ3V0aWwvbW0uanMnKTtcclxudmFyIHRlbXBsYXRlSW5kZXggPSByZXF1aXJlKCcuL2luZGV4LnN0cmluZycpO1xyXG5cclxuLy8g5L6n6L655a+86IiqXHJcbnZhciBuYXZTaWRlID0ge1xyXG5cdG9wdGlvbjoge1xyXG5cdFx0bmFtZTogJycsXHJcblx0XHRuYXZMaXN0OiBbXHJcblx0XHRcdHtuYW1lOiAndXNlci1jZW50ZXInLCBkZXNjOiAn5Liq5Lq65Lit5b+DJywgaHJlZjogJy4vdXNlci1jZW50ZXIuaHRtbCd9LFxyXG5cdFx0XHR7bmFtZTogJ29yZGVyLWxpc3QnLCBkZXNjOiAn5oiR55qE6K6i5Y2VJywgaHJlZjogJy4vb3JkZXItbGlzdC5odG1sJ30sXHJcblx0XHRcdHtuYW1lOiAndXNlci1wYXNzLXVwZGF0ZScsIGRlc2M6ICfkv67mlLnlr4bnoIEnLCBocmVmOiAnLi91c2VyLXBhc3MtdXBkYXRlLmh0bWwnfSxcclxuXHRcdFx0e25hbWU6ICdhYm91dCcsIGRlc2M6ICflhbPkuo5NTWFsbCcsIGhyZWY6ICcuL2Fib3V0Lmh0bWwnfSxcclxuXHRcdF1cclxuXHR9LFxyXG5cdGluaXQ6IGZ1bmN0aW9uKG9wdGlvbikge1xyXG5cdFx0Ly8g5ZCI5bm26YCJ6aG5XHJcblx0XHQkLmV4dGVuZCh0aGlzLm9wdGlvbiwgb3B0aW9uKTtcclxuXHRcdGNvbnNvbGUubG9nKHRoaXMub3B0aW9uKTtcclxuXHRcdHRoaXMucmVuZGVyTmF2KCk7XHJcblx0fSxcclxuXHQvLyDmuLLmn5Plr7zoiKroj5zljZVcclxuXHRyZW5kZXJOYXY6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8g6K6h566XYWN0aXZl5pWw5o2uXHJcblx0XHRmb3IodmFyIGk9MCxpTGVuZ3RoPXRoaXMub3B0aW9uLm5hdkxpc3QubGVuZ3RoOyBpPGlMZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZih0aGlzLm9wdGlvbi5uYXZMaXN0W2ldLm5hbWUgPT09IHRoaXMub3B0aW9uLm5hbWUpe1xyXG5cdFx0XHRcdHRoaXMub3B0aW9uLm5hdkxpc3RbaV0uaXNBY3RpdmUgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0Ly8g5riy5p+TbGlzdOaVsOaNrlxyXG5cdFx0dmFyIG5hdkh0bWwgPSBfbW0ucmVuZGVySHRtbCh0ZW1wbGF0ZUluZGV4LCB7XHJcblx0XHRcdG5hdkxpc3Q6IHRoaXMub3B0aW9uLm5hdkxpc3RcclxuXHRcdH0pO1xyXG5cdFx0Ly8g5oqKaHRtbOaUvuWFpeWuueWZqFxyXG5cdFx0JCgnLm5hdi1zaWRlJykuaHRtbChuYXZIdG1sKTtcclxuXHRcdGNvbnNvbGUubG9nKHRoaXMub3B0aW9uLm5hdkxpc3QpO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuYXZTaWRlOyIsIm1vZHVsZS5leHBvcnRzID0gXCJ7eyNuYXZMaXN0fX1cXHJcXG5cXHR7eyNpc0FjdGl2ZX19XFxyXFxuXFx0PGxpIGNsYXNzPVxcXCJuYXYtaXRlbSBhY3RpdmVcXFwiPlxcclxcblxcdHt7L2lzQWN0aXZlfX1cXHJcXG5cXHR7e15pc0FjdGl2ZX19XFxyXFxuXFx0PGxpIGNsYXNzPVxcXCJuYXYtaXRlbVxcXCI+XFxyXFxuXFx0e3svaXNBY3RpdmV9fVxcclxcblxcdFxcdDxhIGNsYXNzPVxcXCJsaW5rXFxcIiBocmVmPVxcXCJ7e2hyZWZ9fVxcXCI+e3tkZXNjfX08L2E+XFxyXFxuXFx0PC9saT5cXHJcXG57ey9uYXZMaXN0fX1cIjsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvKlxyXG4qIEBBdXRob3I6IOmdklxyXG4qIEBEYXRlOiAgIDIwMjAtMDMtMTQgMTc6Mzg6NDdcclxuKiBATGFzdCBNb2RpZmllZCBieTogICDpnZJcclxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDIwLTA0LTI0IDIyOjE2OjU0XHJcbiovXHJcbnJlcXVpcmUoJy4vaW5kZXguY3NzJyk7XHJcbnZhciBfbW0gPSByZXF1aXJlKCd1dGlsL21tLmpzJyk7XHJcbnZhciBfdXNlciA9IHJlcXVpcmUoJ3NlcnZpY2UvdXNlci1zZXJ2aWNlLmpzJyk7XHJcbnZhciBfY2FydCA9IHJlcXVpcmUoJ3NlcnZpY2UvY2FydC1zZXJ2aWNlLmpzJyk7XHJcblxyXG4vLyDlr7zoiKpcclxudmFyIG5hdiA9IHtcclxuXHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuYmluZEV2ZW50KCk7XHJcblx0XHR0aGlzLmxvYWRVc2VySW5mbygpO1xyXG5cdFx0dGhpcy5sb2FkQ2FydENvdW50KCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cdGJpbmRFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyDnmbvlvZXngrnlh7vkuovku7ZcclxuXHRcdCQoJy5qcy1sb2dpbicpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRcdF9tbS5kb0xvZ2luKCk7XHJcblx0XHR9KTtcclxuXHRcdC8vIOazqOWGjOeCueWHu+S6i+S7tlxyXG5cdFx0JCgnLmpzLXJlZ2lzdGVyJykuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi91c2VyLXJlZ2lzdGVyLmh0bWwnO1xyXG5cdFx0fSk7XHJcblx0XHQvLyDpgIDlh7rngrnlh7vkuovku7ZcclxuXHRcdCQoJy5qcy1sb2dvdXQnKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHRfdXNlci5sb2dvdXQoZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVyck1zZyl7XHJcblx0XHRcdFx0X21tLmVycm9yVGlwcyhlcnJNc2cpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSk7XHJcblxyXG5cdH0sXHJcblx0Ly8g5Yqg6L2955So5oi35L+h5oGvXHJcblx0bG9hZFVzZXJJbmZvOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCcxMjMzMTIzMTInKTtcclxuXHRcdF91c2VyLmNoZWNrTG9naW4oZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ+eZu+W9leaIkOWKnycpXHJcblx0XHRcdCQoJy51c2VyLm5vdC1sb2dpbicpLmhpZGUoKS5zaWJsaW5ncygnLnVzZXIubG9naW4nKS5zaG93KCkuZmluZCgnLnVzZXJuYW1lJykudGV4dChyZXMudXNlcm5hbWUpO1xyXG5cdFx0fSwgZnVuY3Rpb24oZXJyTXNnKSB7XHJcblx0XHRcdC8vIGRvIG5vdGhpbmdcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Ly8g5Yqg6L296LSt54mp6L2m5pWw6YePXHJcblx0bG9hZENhcnRDb3VudDogZnVuY3Rpb24oKXtcclxuXHRcdF9jYXJ0LmdldENhcnRDb3VudChmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0JCgnLm5hdiAuY2FydC1jb3VudCcpLnRleHQocmVzIHx8IDApO1xyXG5cdFx0fSwgZnVuY3Rpb24oZXJyTXNnKSB7XHJcblx0XHRcdCQoJy5uYXYgLmNhcnQtY291bnQnKS50ZXh0KDApO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuYXYuaW5pdCgpOyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIi8qXHJcbiogQEF1dGhvcjog6Z2SXHJcbiogQERhdGU6ICAgMjAyMC0wNS0wMSAwOTozNTo0M1xyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIOmdklxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMjAtMDUtMDUgMTc6MjU6MjhcclxuKi9cclxucmVxdWlyZSgnLi9pbmRleC5jc3MnKTtcclxucmVxdWlyZSgncGFnZS9jb21tb24vbmF2L2luZGV4LmpzJyk7XHJcbnJlcXVpcmUoJ3BhZ2UvY29tbW9uL2hlYWRlci9pbmRleC5qcycpO1xyXG52YXIgbmF2U2lkZSA9IHJlcXVpcmUoJ3BhZ2UvY29tbW9uL25hdi1zaWRlL2luZGV4LmpzJyk7XHJcbnZhciBfbW0gPSByZXF1aXJlKCd1dGlsL21tLmpzJyk7XHJcbnZhciBfb3JkZXIgPSByZXF1aXJlKCdzZXJ2aWNlL29yZGVyLXNlcnZpY2UnKTtcclxudmFyIHRlbXBsYXRlSW5kZXggPSByZXF1aXJlKCcuL2luZGV4LnN0cmluZycpO1xyXG52YXIgUGFnaW5hdGlvbiA9IHJlcXVpcmUoJ3V0aWwvcGFnaW5hdGlvbi9pbmRleC5qcycpO1xyXG5cclxuXHJcbi8vIHBhZ2Ug6YC76L6R6YOo5YiGXHJcbnZhciBwYWdlID0ge1xyXG5cdGRhdGE6IHtcclxuXHRcdGxpc3RQYXJhbToge1xyXG5cdFx0XHRwYWdlTnVtOiAxLFxyXG5cdFx0XHRwYWdlU2l6ZTogMTBcclxuXHRcdH1cclxuXHR9LFxyXG5cdGluaXQ6IGZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLm9uTG9hZCgpO1xyXG5cdH0sXHJcblx0b25Mb2FkOiBmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5sb2FkT3JkZXJMaXN0KCk7XHJcblx0XHQvLyDliJ3lp4vljJblt6bkvqfoj5zljZVcclxuXHRcdG5hdlNpZGUuaW5pdCh7XHJcblx0XHRcdG5hbWU6ICdvcmRlci1saXN0J1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHQvLyDliqDovb3orqLljZXliJfooahcclxuXHRsb2FkT3JkZXJMaXN0OiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBfdGhpcyA9IHRoaXMsXHJcblx0XHRcdG9yZGVyTGlzdEh0bWwgPSAnJyxcclxuXHRcdFx0JGxpc3RDb24gPSAkKCcub3JkZXItbGlzdC1jb24nKTtcclxuXHJcblx0XHQkbGlzdENvbi5odG1sKCc8ZGl2IGNsYXNzPVwibG9hZGluZ1wiPjwvZGl2PicpO1xyXG5cdFx0X29yZGVyLmdldE9yZGVyTGlzdCh0aGlzLmRhdGEubGlzdFBhcmFtLCBmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0Ly8g5riy5p+TaHRtbFxyXG5cdFx0XHRvcmRlckxpc3RIdG1sID0gX21tLnJlbmRlckh0bWwodGVtcGxhdGVJbmRleCwgcmVzKTtcclxuXHRcdFx0JGxpc3RDb24uaHRtbChvcmRlckxpc3RIdG1sKTtcclxuXHRcdFx0X3RoaXMubG9hZFBhZ2luYXRpb24oe1xyXG5cdFx0XHRcdGhhc1ByZXZpb3VzUGFnZTogcmVzLmhhc1ByZXZpb3VzUGFnZSxcclxuXHRcdFx0XHRwcmVQYWdlOiByZXMucHJlUGFnZSxcclxuXHRcdFx0XHRoYXNOZXh0UGFnZTogcmVzLmhhc05leHRQYWdlLFxyXG5cdFx0XHRcdG5leHRQYWdlOiByZXMubmV4dFBhZ2UsXHJcblx0XHRcdFx0cGFnZU51bTogcmVzLnBhZ2VOdW0sXHJcblx0XHRcdFx0cGFnZXM6IHJlcy5wYWdlc1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sIGZ1bmN0aW9uKGVyck1zZykge1xyXG5cdFx0XHQkbGlzdENvbi5odG1sKCc8cCBjbGFzcz1cImVyci10aXBcIj7liqDovb3orqLljZXlpLHotKXvvIzor7fliLfmlrDlkI7ph43or5U8L3A+Jyk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdC8vIOWKoOi9veWIhumhteS/oeaBr1xyXG5cdGxvYWRQYWdpbmF0aW9uOiBmdW5jdGlvbihwYWdlSW5mbyl7XHJcblx0XHRjb25zb2xlLmxvZyhwYWdlSW5mbylcclxuXHJcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xyXG5cdFx0dGhpcy5wYWdpbmF0aW9uID8gJycgOiAodGhpcy5wYWdpbmF0aW9uID0gbmV3IFBhZ2luYXRpb24oKSk7XHJcblxyXG5cdFx0dGhpcy5wYWdpbmF0aW9uLnJlbmRlcigkLmV4dGVuZCh7fSwgcGFnZUluZm8sIHtcclxuXHRcdFx0Y29udGFpbmVyOiAkKCcucGFnaW5hdGlvbicpLFxyXG5cdFx0XHRvblNlbGVjdFBhZ2U6IGZ1bmN0aW9uKHBhZ2VOdW0pIHtcclxuXHRcdFx0XHRfdGhpcy5kYXRhLmxpc3RQYXJhbS5wYWdlTnVtID0gcGFnZU51bTtcclxuXHRcdFx0XHRfdGhpcy5sb2FkT3JkZXJMaXN0KCk7XHJcblx0XHRcdH1cclxuXHRcdH0pKTtcclxuXHJcblx0XHRjb25zb2xlLmxvZyh0aGlzLnBhZ2luYXRpb24pO1xyXG5cdH1cclxuXHJcbn07XHJcbiQoZnVuY3Rpb24oKXtcclxuXHRwYWdlLmluaXQoKTtcclxufSkiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHRhYmxlIGNsYXNzPVxcXCJvcmRlci1saXN0LXRhYmxlIGhlYWRlclxcXCI+XFxyXFxuXFx0PHRyPlxcclxcblxcdFxcdDx0aCBjbGFzcz1cXFwiY2VsbCBjZWxsLWltZ1xcXCI+Jm5ic3A7PC90aD5cXHJcXG5cXHRcXHQ8dGggY2xhc3M9XFxcImNlbGwgY2VsbC1pbmZvXFxcIj7llYblk4Hkv6Hmga88L3RoPlxcclxcblxcdFxcdDx0aCBjbGFzcz1cXFwiY2VsbCBjZWxsLXByaWNlXFxcIj7ljZXku7c8L3RoPlxcclxcblxcdFxcdDx0aCBjbGFzcz1cXFwiY2VsbCBjZWxsLWNvdW50XFxcIj7mlbDph488L3RoPlxcclxcblxcdFxcdDx0aCBjbGFzcz1cXFwiY2VsbCBjZWxsLXRvdGFsXFxcIj7lsI/orqE8L3RoPlxcclxcblxcdDwvdHI+XFxyXFxuPC90YWJsZT5cXHJcXG57eyNsaXN0fX1cXHJcXG48dGFibGUgY2xhc3M9XFxcIm9yZGVyLWxpc3QtdGFibGUgb3JkZXItaXRlbVxcXCI+XFxyXFxuXFx0PHRyPlxcclxcblxcdFxcdDx0ZCBjb2xzcGFuPVxcXCI1XFxcIiBjbGFzcz1cXFwib3JkZXItaW5mb1xcXCI+XFxyXFxuXFx0XFx0XFx0PHNwYW4gY2xhc3M9XFxcIm9yZGVyLXRleHRcXFwiPlxcclxcblxcdFxcdFxcdFxcdDxzcGFuPuiuouWNleWPt++8mjwvc3Bhbj5cXHJcXG5cXHRcXHRcXHRcXHQ8YSBjbGFzcz1cXFwibGluayBvcmRlci1udW1cXFwiIGhyZWY9XFxcIi4vb3JkZXItZGV0YWlsLmh0bWw/b3JkZXJOdW1iZXI9e3tvcmRlck5vfX1cXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIj57e29yZGVyTm99fTwvYT5cXHJcXG5cXHRcXHRcXHQ8L3NwYW4+XFxyXFxuXFx0XFx0XFx0PHNwYW4gY2xhc3M9XFxcIm9yZGVyLXRleHRcXFwiPnt7Y3JlYXRlVGltZX19PC9zcGFuPlxcclxcblxcdFxcdFxcdDxzcGFuIGNsYXNzPVxcXCJvcmRlci10ZXh0XFxcIj7mlLbku7bkurrvvJp7e3JlY2VpdmVyTmFtZX19PC9zcGFuPlxcclxcblxcdFxcdFxcdDxzcGFuIGNsYXNzPVxcXCJvcmRlci10ZXh0XFxcIj7orqLljZXnirbmgIHvvJp7e3N0YXR1c0Rlc2N9fTwvc3Bhbj5cXHJcXG5cXHRcXHRcXHQ8c3BhbiBjbGFzcz1cXFwib3JkZXItdGV4dFxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0PHNwYW4+6K6i5Y2V5oC75Lu377yaPC9zcGFuPlxcclxcblxcdFxcdFxcdFxcdDxzcGFuIGNsYXNzPVxcXCJvcmRlci10b3RhbFxcXCI+77+le3twYXltZW50fX08L3NwYW4+XFxyXFxuXFx0XFx0XFx0PC9zcGFuPlxcclxcblxcdFxcdFxcdDxhIGNsYXNzPVxcXCJsaW5rIG9yZGVyLWRldGFpbFxcXCIgaHJlZj1cXFwiLi9vcmRlci1kZXRhaWwuaHRtbD9vcmRlck51bWJlcj17e29yZGVyTm99fVxcXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiPuafpeeci+ivpuaDhTwvYT5cXHJcXG5cXHRcXHQ8L3RkPlxcclxcblxcdDwvdHI+XFxyXFxuXFx0e3sjb3JkZXJJdGVtVm9MaXN0fX1cXHJcXG5cXHQ8dHI+XFxyXFxuXFx0XFx0PHRkIGNsYXNzPVxcXCJjZWxsIGNlbGwtaW1nXFxcIj5cXHJcXG5cXHRcXHRcXHQ8YSBocmVmPVxcXCIuL2RldGFpbC5odG1sP3Byb2R1Y3RJZD17e3Byb2R1Y3RJZH19XFxcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCI+XFxyXFxuXFx0XFx0XFx0XFx0PGltZyBjbGFzcz1cXFwicC1pbWdcXFwiIHNyYz1cXFwie3tpbWFnZUhvc3R9fXt7cHJvZHVjdEltYWdlfX1cXFwiIGFsdD1cXFwie3twcm9kdWN0TmFtZX19XFxcIj5cXHJcXG5cXHRcXHRcXHQ8L2E+XFxyXFxuXFx0XFx0PC90ZD5cXHJcXG5cXHRcXHQ8dGQgY2xhc3M9XFxcImNlbGwgY2VsbC1pbmZvXFxcIj5cXHJcXG5cXHRcXHRcXHQ8YSBjbGFzcz1cXFwibGlua1xcXCIgaHJlZj1cXFwiLi9kZXRhaWwuaHRtbD9wcm9kdWN0SWQ9e3twcm9kdWN0SWR9fVxcXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiPnt7cHJvZHVjdE5hbWV9fTwvYT5cXHJcXG5cXHRcXHQ8L3RkPlxcclxcblxcdFxcdDx0ZCBjbGFzcz1cXFwiY2VsbCBjZWxsLXByaWNlXFxcIj7vv6V7e2N1cnJlbnRVbml0UHJpY2V9fTwvdGQ+XFxyXFxuXFx0XFx0PHRkIGNsYXNzPVxcXCJjZWxsIGNlbGwtY291bnRcXFwiPnt7cXVhbnRpdHl9fTwvdGQ+XFxyXFxuXFx0XFx0PHRkIGNsYXNzPVxcXCJjZWxsIGNlbGwtdG90YWxcXFwiPu+/pXt7dG90YWxQcmljZX19PC90ZD5cXHJcXG5cXHQ8L3RyPlxcclxcblxcdHt7L29yZGVySXRlbVZvTGlzdH19XFxyXFxuPC90YWJsZT5cXHJcXG57ey9saXN0fX1cXHJcXG57e15saXN0fX1cXHJcXG48cCBjbGFzcz1cXFwiZXJyLXRpcFxcXCI+5oKo5pqC5pe26L+Y5rKh5pyJ6K6i5Y2VPC9wPlxcclxcbnt7L2xpc3R9fVxcclxcblwiOyIsIi8qXHJcbiogQEF1dGhvcjog6Z2SXHJcbiogQERhdGU6ICAgMjAyMC0wNC0xNiAxNzo1NjoxM1xyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIOmdklxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMjAtMDQtMjQgMjI6MTY6MzhcclxuKi9cclxuLypcclxuKiBAQXV0aG9yOiDpnZJcclxuKiBARGF0ZTogICAyMDIwLTA0LTEwIDE1OjMzOjE4XHJcbiogQExhc3QgTW9kaWZpZWQgYnk6ICAg6Z2SXHJcbiogQExhc3QgTW9kaWZpZWQgdGltZTogMjAyMC0wNC0xNCAxNzo1OTowNFxyXG4qL1xyXG52YXIgX21tID0gcmVxdWlyZSgndXRpbC9tbS5qcycpO1xyXG5cclxudmFyIF9jYXJ0ID0ge1xyXG5cdC8vIOiOt+WPlui0reeJqei9puaVsOmHj1xyXG5cdGdldENhcnRDb3VudDogZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL2NhcnQvZ2V0X2NhcnRfcHJvZHVjdF9jb3VudC5kbycpLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdC8vIOa3u+WKoOWIsOi0reeJqei9plxyXG5cdGFkZFRvQ2FydDogZnVuY3Rpb24ocHJvZHVjdEluZm8sIHJlc29sdmUsIHJlamVjdCkge1xyXG5cdFx0X21tLnJlcXVlc3Qoe1xyXG5cdFx0XHR1cmw6IF9tbS5nZXRTZXJ2ZXJVcmwoJy9jYXJ0L2FkZC5kbycpLFxyXG5cdFx0XHRkYXRhOiBwcm9kdWN0SW5mbyxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdC8vIOiOt+WPlui0reeJqei9puWIl+ihqFxyXG5cdGdldENhcnRMaXN0OiBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvY2FydC9saXN0LmRvJyksXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDpgInmi6notK3nianovabllYblk4FcclxuXHRzZWxlY3RQcm9kdWN0OiAgZnVuY3Rpb24ocHJvZHVjdElkLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvY2FydC9zZWxlY3QuZG8nKSxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdHByb2R1Y3RJZDogcHJvZHVjdElkXHJcblx0XHRcdH0sXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDlj5bmtojpgInmi6notK3nianovabllYblk4FcclxuXHR1bnNlbGVjdFByb2R1Y3Q6ICBmdW5jdGlvbihwcm9kdWN0SWQsIHJlc29sdmUsIHJlamVjdCkge1xyXG5cdFx0X21tLnJlcXVlc3Qoe1xyXG5cdFx0XHR1cmw6IF9tbS5nZXRTZXJ2ZXJVcmwoJy9jYXJ0L3VuX3NlbGVjdC5kbycpLFxyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0cHJvZHVjdElkOiBwcm9kdWN0SWRcclxuXHRcdFx0fSxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdC8vIOmAieS4reWFqOmDqOWVhuWTgVxyXG5cdHNlbGVjdEFsbFByb2R1Y3Q6ICBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvY2FydC9zZWxlY3RfYWxsLmRvJyksXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDlj5bmtojpgInkuK3lhajpg6jllYblk4FcclxuXHR1bnNlbGVjdEFsbFByb2R1Y3Q6ICBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvY2FydC91bl9zZWxlY3RfYWxsLmRvJyksXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDmm7TmlrDotK3nianovabllYblk4HmlbDph49cclxuXHR1cGRhdGVQcm9kdWN0OiBmdW5jdGlvbihwcm9kdWN0SW5mbywgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL2NhcnQvdXBkYXRlLmRvJyksXHJcblx0XHRcdGRhdGE6IHByb2R1Y3RJbmZvLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5Yig6Zmk5oyH5a6a5ZWG5ZOBXHJcblx0ZGVsZXRlUHJvZHVjdDogZnVuY3Rpb24ocHJvZHVjdElkcywgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL2NhcnQvZGVsZXRlX3Byb2R1Y3QuZG8nKSxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdHByb2R1Y3RJZHM6IHByb2R1Y3RJZHNcclxuXHRcdFx0fSxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSlcclxuXHR9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBfY2FydDsiLCIvKlxyXG4qIEBBdXRob3I6IOmdklxyXG4qIEBEYXRlOiAgIDIwMjAtMDQtMjcgMTE6MDA6NTFcclxuKiBATGFzdCBNb2RpZmllZCBieTogICDpnZJcclxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDIwLTA1LTA5IDE3OjI4OjU3XHJcbiovXHJcbnZhciBfbW0gPSByZXF1aXJlKCd1dGlsL21tLmpzJyk7XHJcblxyXG52YXIgX29yZGVyID0ge1xyXG5cdC8vIOiOt+WPluWVhuWTgeWIl+ihqFxyXG5cdGdldFByb2R1Y3RMaXN0OiBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvb3JkZXIvZ2V0X29yZGVyX2NhcnRfcHJvZHVjdC5kbycpLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5o+Q5Lqk6K6i5Y2VXHJcblx0Y3JlYXRlT3JkZXI6IGZ1bmN0aW9uKG9yZGVySW5mbywgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL29yZGVyL2NyZWF0ZS5kbycpLFxyXG5cdFx0XHRkYXRhOiBvcmRlckluZm8sXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDojrflj5borqLljZXliJfooahcclxuXHRnZXRPcmRlckxpc3Q6IGZ1bmN0aW9uKGxpc3RQYXJhbSwgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL29yZGVyL2xpc3QuZG8nKSxcclxuXHRcdFx0ZGF0YTogbGlzdFBhcmFtLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g6I635Y+W6K6i5Y2V6K+m5oOFXHJcblx0Z2V0T3JkZXJEZXRhaWw6IGZ1bmN0aW9uKG9yZGVyTnVtYmVyLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvb3JkZXIvZGV0YWlsLmRvJyksXHJcblx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRvcmRlck5vOiBvcmRlck51bWJlclxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5Y+W5raI6K6i5Y2VXHJcblx0Y2FuY2VsT3JkZXI6IGZ1bmN0aW9uKG9yZGVyTnVtYmVyLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvb3JkZXIvY2FuY2VsLmRvJyksXHJcblx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRvcmRlck5vOiBvcmRlck51bWJlclxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IF9vcmRlcjsiLCIvKlxyXG4qIEBBdXRob3I6IOmdklxyXG4qIEBEYXRlOiAgIDIwMjAtMDMtMjcgMDk6NDM6MjRcclxuKiBATGFzdCBNb2RpZmllZCBieTogICDpnZJcclxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDIwLTA0LTE3IDE0OjM1OjA4XHJcbiovXHJcbnZhciBfbW0gPSByZXF1aXJlKCd1dGlsL21tLmpzJyk7XHJcblxyXG52YXIgX3VzZXIgPSB7XHJcblx0Ly8g55So5oi355m75b2VXHJcblx0bG9naW46IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9sb2dpbi5kbycpLFxyXG5cdFx0XHRkYXRhOiB1c2VySW5mbyxcclxuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDmo4Dmn6XnlKjmiLflkI1cclxuXHRjaGVja1VzZXJuYW1lOiBmdW5jdGlvbih1c2VybmFtZSwgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvY2hlY2tfdmFsaWQuZG8nKSxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdHR5cGU6ICd1c2VybmFtZScsXHJcblx0XHRcdFx0c3RyOiB1c2VybmFtZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRtZXRob2Q6ICdQT1NUJyxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdC8vIOeUqOaIt+azqOWGjFxyXG5cdHJlZ2lzdGVyOiBmdW5jdGlvbih1c2VySW5mbywgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvcmVnaXN0ZXIuZG8nKSxcclxuXHRcdFx0ZGF0YTogdXNlckluZm8sXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5qOA5p+l55m75b2V54q25oCBXHJcblx0Y2hlY2tMb2dpbjogZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9nZXRfdXNlcl9pbmZvLmRvJyksXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdC8vIOiOt+WPlueUqOaIt+WvhueggeaPkOekuumXrumimFxyXG5cdGdldFF1ZXN0aW9uOiBmdW5jdGlvbih1c2VybmFtZSwgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvZm9yZ2V0X2dldF9xdWVzdGlvbi5kbycpLFxyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0dXNlcm5hbWU6IHVzZXJuYW1lXHJcblx0XHRcdH0sXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5qOA5p+l5a+G56CB5o+Q56S66Zeu6aKY562U5qGIXHJcblx0Y2hlY2tBbnN3ZXI6IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9mb3JnZXRfY2hlY2tfYW5zd2VyLmRvJyksXHJcblx0XHRcdGRhdGE6IHVzZXJJbmZvLFxyXG5cdFx0XHRtZXRob2Q6ICdQT1NUJyxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdC8vIOmHjee9ruWvhueggVxyXG5cdHJlc2V0UGFzc3dvcmQ6IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9mb3JnZXRfcmVzZXRfcGFzc3dvcmQuZG8nKSxcclxuXHRcdFx0ZGF0YTogdXNlckluZm8sXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g6I635Y+W55So5oi35L+h5oGvXHJcblx0Z2V0VXNlckluZm86IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvZ2V0X2luZm9ybWF0aW9uLmRvJyksXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5pu05paw5Liq5Lq65L+h5oGvXHJcblx0dXBkYXRlVXNlckluZm86IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci91cGRhdGVfaW5mb3JtYXRpb24uZG8nKSxcclxuXHRcdFx0ZGF0YTogdXNlckluZm8sXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g55m75b2V54q25oCB5LiL5pu05paw5a+G56CBXHJcblx0dXBkYXRlUGFzc3dvcmQ6IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9yZXNldF9wYXNzd29yZC5kbycpLFxyXG5cdFx0XHRkYXRhOiB1c2VySW5mbyxcclxuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDnmbvlh7pcclxuXHRsb2dvdXQ6IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvbG9nb3V0LmRvJyksXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IF91c2VyOyIsIi8qXHJcbiogQEF1dGhvcjog6Z2SXHJcbiogQERhdGU6ICAgMjAyMC0wMy0wOSAxNTowMTowMVxyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIOmdklxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMjAtMDQtMTAgMTY6MjA6NTdcclxuKi9cclxudmFyIGNvbmYgPSB7XHJcblx0c2VydmVySG9zdDogJy9hcGknXHJcbn1cclxuXHJcbnZhciBIb2dhbiA9IHJlcXVpcmUoJ2hvZ2FuLmpzJyk7XHJcblxyXG52YXIgX21tID0ge1xyXG5cdC8vIOe9kee7nOivt+axglxyXG5cdHJlcXVlc3Q6IGZ1bmN0aW9uKHBhcmFtKSB7XHJcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xyXG5cdFx0JC5hamF4KHtcclxuXHRcdFx0dHlwZTogcGFyYW0ubWV0aG9kIHx8ICdnZXQnLFxyXG5cdFx0XHR1cmw6IHBhcmFtLnVybCB8fCAnJyxcclxuXHRcdFx0ZGF0YVR5cGU6IHBhcmFtLnR5cGUgfHwgJ2pzb24nLFxyXG5cdFx0XHRkYXRhOiBwYXJhbS5kYXRhIHx8ICcnLFxyXG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0XHQvLyDor7fmsYLmiJDlip9cclxuXHRcdFx0XHRpZihyZXMuc3RhdHVzID09PSAwKSB7XHJcblx0XHRcdFx0XHR0eXBlb2YgcGFyYW0uc3VjY2VzcyA9PT0gJ2Z1bmN0aW9uJyAmJiBwYXJhbS5zdWNjZXNzKHJlcy5kYXRhLCByZXMubXNnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8g5rKh5pyJ55m75b2V54q25oCB77yM6ZyA6KaB5by65Yi255m75b2VXHJcblx0XHRcdFx0ZWxzZSBpZihyZXMuc3RhdHVzID09PSAxMCkge1xyXG5cdFx0XHRcdFx0X3RoaXMuZG9Mb2dpbigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyDor7fmsYLmlbDmja7plJnor69cclxuXHRcdFx0XHRlbHNlIGlmKHJlcy5zdGF0dXMgPT09IDEpIHtcclxuXHRcdFx0XHRcdHR5cGVvZiBwYXJhbS5lcnJvciA9PT0gJ2Z1bmN0aW9uJyAmJiBwYXJhbS5lcnJvcihyZXMubXNnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGVycm9yOiBmdW5jdGlvbihlcnIpIHtcclxuXHRcdFx0XHR0eXBlb2YgcGFyYW0uZXJyb3IgPT09ICdmdW5jdGlvbicgJiYgcGFyYW0uZXJyb3IoZXJyLnN0YXR1c1RleHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g6I635Y+W5pyN5Yqh5Zmo5Zyw5Z2AXHJcblx0Z2V0U2VydmVyVXJsOiBmdW5jdGlvbihwYXRoKSB7XHJcblx0XHRyZXR1cm4gY29uZi5zZXJ2ZXJIb3N0ICsgcGF0aDtcclxuXHR9LFxyXG5cdC8vIOiOt+WPlnVybOWPguaVsFxyXG5cdGdldFVybFBhcmFtOiBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHR2YXIgcmVnID0gbmV3IFJlZ0V4cCgnKF58JiknICsgbmFtZSArICc9KFteJl0qKSgmfCQpJyk7XHJcblx0XHR2YXIgcmVzdWx0ID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSkubWF0Y2gocmVnKTtcclxuXHRcdHJldHVybiByZXN1bHQgPyBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0WzJdKSA6IG51bGw7XHJcblx0XHQvLyAvKF58Jil0ZXN0PShbXiZdKikoJnwkKS9cclxuXHRcdC8vIHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHQvLyDmuLLmn5NodG1s5qih5p2/XHJcblx0cmVuZGVySHRtbDogZnVuY3Rpb24oaHRtbFRlbXBsYXRlLCBkYXRhKSB7XHJcblx0XHR2YXIgdGVtcGxhdGUgPSBIb2dhbi5jb21waWxlKGh0bWxUZW1wbGF0ZSksXHJcblx0XHRcdHJlc3VsdCA9IHRlbXBsYXRlLnJlbmRlcihkYXRhKTtcclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHQvLyDmiJDlip/mj5DnpLpcclxuXHRzdWNjZXNzVGlwczogZnVuY3Rpb24obXNnKSB7XHJcblx0XHRhbGVydChtc2cgfHwgJ+aTjeS9nOaIkOWKn++8gScpO1xyXG5cdH0sXHJcblx0Ly8g6ZSZ6K+v5o+Q56S6XHJcblx0ZXJyb3JUaXBzOiBmdW5jdGlvbihtc2cpIHtcclxuXHRcdGFsZXJ0KG1zZyB8fCAn6ZSZ6K+v5o+Q56S6Jyk7XHJcblx0fSxcclxuXHQvLyDlrZfmrrXnmoTpqozor4HjgIHmlK/mjIHpnZ7nqbrjgIHmiYvmnLrjgIHlh7npmbflpITnmoTliKTmlq1cclxuXHR2YWxpZGF0ZTogZnVuY3Rpb24odmFsdWUgLCB0eXBlKSB7XHJcblx0XHR2YXIgdmFsdWUgPSAkLnRyaW0odmFsdWUpO1xyXG5cdFx0Ly8g6Z2e56m66aqM6K+BXHJcblx0XHRpZigncmVxdWlyZScgPT09IHR5cGUpIHtcclxuXHRcdFx0cmV0dXJuICEhdmFsdWU7XHJcblx0XHR9XHJcblx0XHQvLyDmiYvmnLrlj7fpqozor4FcclxuXHRcdGlmKCdwaG9uZScgPT09IHR5cGUpIHtcclxuXHRcdFx0cmV0dXJuIC9eMVxcZHsxMH0kLy50ZXN0KHZhbHVlKTtcclxuXHRcdH1cclxuXHRcdC8vIOmCrueuseagvOW8j+mqjOivgVxyXG5cdFx0aWYoJ2VtYWlsJyA9PT0gdHlwZSkge1xyXG5cdFx0XHRyZXR1cm4gL14oW0EtWmEtejAtOV9cXC1cXC5dKStcXEAoW0EtWmEtejAtOV9cXC1cXC5dKStcXC4oW0EtWmEtel17Miw0fSkkLy50ZXN0KHZhbHVlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdC8vIOe7n+S4gOeZu+W9leWkhOeQhlxyXG5cdGRvTG9naW46IGZ1bmN0aW9uKCkge1xyXG5cdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi91c2VyLWxvZ2luLmh0bWw/cmVkaXJlY3Q9JyArIGVuY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24uaHJlZik7XHJcblx0fSxcclxuXHRkb0hvbWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9pbmRleC5odG1sJztcclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IF9tbTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvKlxyXG4qIEBBdXRob3I6IOmdklxyXG4qIEBEYXRlOiAgIDIwMjAtMDQtMTEgMTU6MTU6MjFcclxuKiBATGFzdCBNb2RpZmllZCBieTogICDpnZJcclxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDIwLTA0LTExIDIzOjM3OjIyXHJcbiovXHJcbnJlcXVpcmUoJy4vaW5kZXguY3NzJyk7XHJcbnZhciB0ZW1wbGF0ZVBhZ2luYXRpb24gPSByZXF1aXJlKCcuL2luZGV4LnN0cmluZycpO1xyXG52YXIgX21tID0gcmVxdWlyZSgndXRpbC9tbS5qcycpO1xyXG5cclxudmFyIFBhZ2luYXRpb24gPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgX3RoaXMgPSB0aGlzO1xyXG5cdHRoaXMuZGVmYXVsdE9wdGlvbiA9IHtcclxuXHRcdGNvbnRhaW5lcjogbnVsbCxcclxuXHRcdHBhZ2VOdW06IDEsXHJcblx0XHRwYWdlUmFuZ2U6IDMsXHJcblx0XHRvblNlbGVjdFBhZ2U6IG51bGxcclxuXHR9O1xyXG5cdC8vIOS6i+S7tueahOWkhOeQhlxyXG5cdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcucGctaXRlbScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHRcdC8vIOWvueS6jmFjdGl2ZeWSjGRpc2FibGVk5oyJ6ZKu54K55Ye777yM5LiN5YGa5aSE55CGXHJcblx0XHRpZigkdGhpcy5oYXNDbGFzcygnYWN0aXZlJykgfHwgJHRoaXMuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0dHlwZW9mIF90aGlzLm9wdGlvbi5vblNlbGVjdFBhZ2UgPT09ICdmdW5jdGlvbidcclxuXHRcdFx0PyBfdGhpcy5vcHRpb24ub25TZWxlY3RQYWdlKCR0aGlzLmRhdGEoJ3ZhbHVlJykpIDogbnVsbDtcclxuXHR9KTtcclxufVxyXG5cclxuLy8g5riy5p+T5YiG6aG157uE5Lu2XHJcblBhZ2luYXRpb24ucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKHVzZXJPcHRpb24pIHtcclxuXHQvLyDlkIjlubbpgInpoblcclxuXHR0aGlzLm9wdGlvbiA9ICQuZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRPcHRpb24sIHVzZXJPcHRpb24pO1xyXG5cdC8vIOWIpOaWreWuueWZqOaYr+WQpuS4uuWQiOazleeahGpxdWVyeeWvueixoVxyXG5cdGlmKCEodGhpcy5vcHRpb24uY29udGFpbmVyIGluc3RhbmNlb2YgalF1ZXJ5KSkge1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHQvLyDliKTmlq3mmK/lkKblj6rmnIkx6aG1XHJcblx0aWYodGhpcy5vcHRpb24ucGFnZXMgPD0gMSkge1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHQvLyDmuLLmn5PliIbpobXlhoXlrrlcclxuXHR0aGlzLm9wdGlvbi5jb250YWluZXIuaHRtbCh0aGlzLmdldFBhZ2luYXRpb25IdG1sKCkpO1xyXG59XHJcbi8vIOiOt+WPluWIhumhteeahGh0bWwsIHzkuIrkuIDpobV8IDEgMiAzIDQgPTU9IDYgfOS4i+S4gOmhtXwgNS82XHJcbi8vIOiOt+WPluWIhumhteeahGh0bWwsIHzkuIrkuIDpobV8IDIgMyA0ID01PSA2IDcgOCB85LiL5LiA6aG1fCA1LzlcclxuUGFnaW5hdGlvbi5wcm90b3R5cGUuZ2V0UGFnaW5hdGlvbkh0bWwgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgaHRtbCA9JycsXHJcblx0XHRwYWdlQXJyYXkgPSBbXSxcclxuXHRcdG9wdGlvbiA9IHRoaXMub3B0aW9uLFxyXG5cdFx0c3RhcnQgPSBvcHRpb24ucGFnZU51bSAtIG9wdGlvbi5wYWdlUmFuZ2UgPiAwXHJcblx0XHRcdD8gb3B0aW9uLnBhZ2VOdW0gLSBvcHRpb24ucGFnZVJhbmdlIDogMSxcclxuXHRcdGVuZCA9IG9wdGlvbi5wYWdlTnVtICsgb3B0aW9uLnBhZ2VSYW5nZSA8IG9wdGlvbi5wYWdlc1xyXG5cdFx0XHQ/IG9wdGlvbi5wYWdlTnVtICsgb3B0aW9uLnBhZ2VSYW5nZSA6IG9wdGlvbi5wYWdlcztcclxuXHQvLyDkuIrkuIDpobXmjInpkq7nmoTmlbDmja5cclxuXHRwYWdlQXJyYXkucHVzaCh7XHJcblx0XHRuYW1lOiAn5LiK5LiA6aG1JyxcclxuXHRcdHZhbHVlOiB0aGlzLm9wdGlvbi5wcmVQYWdlLFxyXG5cdFx0Ly8g5pyJ5rKh5pyJ5LiK5LiA6aG177yM5rKh5pyJZmFsc2XvvIzlubblj5blj41cclxuXHRcdGRpc2FibGVkOiAhdGhpcy5vcHRpb24uaGFzUHJldmlvdXNQYWdlXHJcblx0fSk7XHJcblx0Ly8g5pWw5a2X5oyJ6ZKu55qE5aSE55CGXHJcblx0Zm9yKHZhciBpID0gc3RhcnQ7IGkgPD0gZW5kOyBpKyspIHtcclxuXHRcdHBhZ2VBcnJheS5wdXNoKHtcclxuXHRcdFx0bmFtZTogaSxcclxuXHRcdFx0dmFsdWU6IGksXHJcblx0XHRcdGFjdGl2ZTogKGkgPT09IG9wdGlvbi5wYWdlTnVtKVxyXG5cdFx0fSk7XHJcblx0fTtcclxuXHQvLyDkuIvkuIDpobXmjInpkq7nmoTmlbDmja5cclxuXHRwYWdlQXJyYXkucHVzaCh7XHJcblx0XHRuYW1lOiAn5LiL5LiA6aG1JyxcclxuXHRcdHZhbHVlOiB0aGlzLm9wdGlvbi5uZXh0UGFnZSxcclxuXHRcdC8vIOacieayoeacieS4i+S4gOmhte+8jOayoeaciWZhbHNl77yM5bm25Y+W5Y+NXHJcblx0XHRkaXNhYmxlZDogIXRoaXMub3B0aW9uLmhhc05leHRQYWdlXHJcblx0fSk7XHJcblx0aHRtbCA9IF9tbS5yZW5kZXJIdG1sKHRlbXBsYXRlUGFnaW5hdGlvbiwge1xyXG5cdFx0cGFnZUFycmF5OiBwYWdlQXJyYXksXHJcblx0XHRwYWdlTnVtOiBvcHRpb24ucGFnZU51bSxcclxuXHRcdHBhZ2VzOiBvcHRpb24ucGFnZXNcclxuXHR9KTtcclxuXHRjb25zb2xlLmxvZyhwYWdlQXJyYXkpO1xyXG5cdGNvbnNvbGUubG9nKHN0YXJ0LCBlbmQpO1xyXG5cdHJldHVybiBodG1sO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYWdpbmF0aW9uOyIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGNsYXNzPVxcXCJwZy1jb250ZW50XFxcIj5cXHJcXG5cXHR7eyNwYWdlQXJyYXl9fVxcclxcblxcdHt7I2Rpc2FibGVkfX1cXHJcXG5cXHRcXHQ8c3BhbiBjbGFzcz1cXFwicGctaXRlbSBkaXNhYmxlZFxcXCIgZGF0YS12YWx1ZT1cXFwie3t2YWx1ZX19XFxcIj57e25hbWV9fTwvc3Bhbj5cXHJcXG5cXHR7ey9kaXNhYmxlZH19XFxyXFxuXFx0e3teZGlzYWJsZWR9fVxcclxcblxcdFxcdHt7I2FjdGl2ZX19XFxyXFxuXFx0XFx0XFx0PHNwYW4gY2xhc3M9XFxcInBnLWl0ZW0gYWN0aXZlXFxcIiBkYXRhLXZhbHVlPVxcXCJ7e3ZhbHVlfX1cXFwiPnt7bmFtZX19PC9zcGFuPlxcclxcblxcdFxcdHt7L2FjdGl2ZX19XFxyXFxuXFx0XFx0e3teYWN0aXZlfX1cXHJcXG5cXHRcXHRcXHQ8c3BhbiBjbGFzcz1cXFwicGctaXRlbVxcXCIgZGF0YS12YWx1ZT1cXFwie3t2YWx1ZX19XFxcIj57e25hbWV9fTwvc3Bhbj5cXHJcXG5cXHRcXHR7ey9hY3RpdmV9fVxcclxcblxcdHt7L2Rpc2FibGVkfX1cXHJcXG5cXHR7ey9wYWdlQXJyYXl9fVxcclxcblxcclxcblxcdDxzcGFuIGNsYXNzPVxcXCJwZy10b3RhbFxcXCI+e3twYWdlTnVtfX0gLyB7e3BhZ2VzfX08L3NwYW4+XFxyXFxuPC9kaXY+XCI7Il0sInNvdXJjZVJvb3QiOiIifQ==