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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/page/user-register/index.js");
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

/***/ "./src/page/common/nav-simple/index.css":
/*!**********************************************!*\
  !*** ./src/page/common/nav-simple/index.css ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/page/common/nav-simple/index.js":
/*!*********************************************!*\
  !*** ./src/page/common/nav-simple/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
* @Author: 青
* @Date:   2020-03-14 17:02:56
* @Last Modified by:   青
* @Last Modified time: 2020-03-14 17:03:46
*/

__webpack_require__(/*! ./index.css */ "./src/page/common/nav-simple/index.css");

/***/ }),

/***/ "./src/page/user-register/index.css":
/*!******************************************!*\
  !*** ./src/page/user-register/index.css ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/page/user-register/index.js":
/*!*****************************************!*\
  !*** ./src/page/user-register/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
* @Author: 青
* @Date:   2020-03-15 17:56:45
* @Last Modified by:   青
* @Last Modified time: 2020-03-28 00:25:07
*/
__webpack_require__(/*! ./index.css */ "./src/page/user-register/index.css");
__webpack_require__(/*! page/common/nav-simple/index.js */ "./src/page/common/nav-simple/index.js");
var _mm = __webpack_require__(/*! util/mm.js */ "./src/util/mm.js");
var _user = __webpack_require__(/*! service/user-service.js */ "./src/service/user-service.js");
// 表单里的错误提示
var formError = {
	show: function(errMsg) {
		$('.error-item').show().find('.err-msg').text(errMsg);
	},
	hide: function() {
		$('.error-item').hide().find('err-msg').text('');
	}
}

// page 逻辑部分
var page = {
	init: function() {
		this.bindEvent();
	},
	bindEvent: function() {
		var _this = this;
		// 验证username
		$('#username').blur(function() {
			var username = $.trim($(this).val());
			// 如果用户名为空，我们不做验证
			if(!username) {
				return;
			}
			// 异步验证用户名是否存在
			_user.checkUsername(username, function(res) {
				formError.hide();
			}, function(errMsg) {
				formError.show(errMsg);
			})
		});

		// 登录按钮的点击 
		$('#submit').click(function() {
			_this.submit();
		});
		// 如果按下回车，也进行提交
		$('.user-content').keyup(function(e) {
			// keyCode == 13 表示回车
			if(e.keyCode === 13) {
				_this.submit();
			}
		})
	},
	// 提交表单
	submit: function() {
		var formData = {
			username: $.trim($('#username').val()),
			password: $.trim($('#password').val()),
			passwordConfirm: $.trim($('#password-confirm').val()),
			phone: $.trim($('#phone').val()),
			email: $.trim($('#email').val()),
			question: $.trim($('#question').val()),
			answer: $.trim($('#answer').val())
		};
		// 表单验证结果
		var validateResult = this.formValidate(formData);
		// 验证成功
		if(validateResult.status) {
			_user.register(formData, function(res) {
				window.location.href = './result.html?type=register';
			}, function(errMsg) {
				formError.show(errMsg);
			});
		}
		// 验证失败
		else {
			// 错误提示
			formError.show(validateResult.msg);
		}
	},
	// 表单字段的验证
	formValidate: function(formData) {
		var result = {
			status: false,
			msg: ''
		}
		// 验证用户名是否为空
		if(!_mm.validate(formData.username, 'require')) {
			result.msg = '用户名不能为空';
			return result;
		}
		// 验证密码是是否为空
		if(!_mm.validate(formData.password, 'require')) {
			result.msg = '密码不能为空';
			return result;
		}
		// 验证密码长度
		if(formData.password.length < 6) {
			result.msg = '密码长度不能少于6位';
			return result;
		}
		// 验证两次输入的密码是否一致
		if(formData.password !== formData.passwordConfirm) {
			result.msg = '两次输入的密码不一致';
			return result;
		}
		// 验证手机号
		if(!_mm.validate(formData.phone, 'phone')) {
			result.msg = '手机号格式不正确';
			return result;
		}
		// 验证邮箱
		if(!_mm.validate(formData.email, 'email')) {
			result.msg = '邮箱格式不正确';
			return result;
		}
		// 验证密码提示问题是否为空
		if(!_mm.validate(formData.question, 'require')) {
			result.msg = '密码提示问题不能为空';
			return result;
		}		
		// 验证密码提示问题答案是否为空
		if(!_mm.validate(formData.answer, 'require')) {
			result.msg = '密码提示问题答案不能为空';
			return result;
		}

		// 通过验证，返回正确提示
		result.status = true;
		result.msg = '验证通过';
		return result;
	}
}
$(function() {
	page.init();
})

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2hvZ2FuLmpzL2xpYi9jb21waWxlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaG9nYW4uanMvbGliL2hvZ2FuLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ob2dhbi5qcy9saWIvdGVtcGxhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2UvY29tbW9uL25hdi1zaW1wbGUvaW5kZXguY3NzPzVmNGEiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2UvY29tbW9uL25hdi1zaW1wbGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2UvdXNlci1yZWdpc3Rlci9pbmRleC5jc3M/MmFjYyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZS91c2VyLXJlZ2lzdGVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlL3VzZXItc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC9tbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiww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Ozs7Ozs7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2Q0FBNkMsV0FBVyxFQUFFOztBQUUxRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw4Q0FBOEM7QUFDOUMsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFCQUFxQixpQkFBaUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUCx1QkFBdUIsa0JBQWtCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0NBQWtDLFFBQVE7QUFDMUM7QUFDQTtBQUNB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O0FBQ0E7QUFDQTtBQUNBLFVBQVUsbUJBQU8sQ0FBQyxvQ0FBWTs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLHVCOzs7Ozs7Ozs7OztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsWUFBWSxtQkFBTyxDQUFDLHNEQUFVOztBQUU5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLEdBQUc7QUFDbkI7QUFDQTtBQUNBO0FBQ0EsZ0VBQWdFLElBQUk7QUFDcEU7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFCIiwiZmlsZSI6Ii4vanMvdXNlci1yZWdpc3Rlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3BhZ2UvdXNlci1yZWdpc3Rlci9pbmRleC5qc1wiKTtcbiIsIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTEgVHdpdHRlciwgSW5jLlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuKGZ1bmN0aW9uIChIb2dhbikge1xuICAvLyBTZXR1cCByZWdleCAgYXNzaWdubWVudHNcbiAgLy8gcmVtb3ZlIHdoaXRlc3BhY2UgYWNjb3JkaW5nIHRvIE11c3RhY2hlIHNwZWNcbiAgdmFyIHJJc1doaXRlc3BhY2UgPSAvXFxTLyxcbiAgICAgIHJRdW90ID0gL1xcXCIvZyxcbiAgICAgIHJOZXdsaW5lID0gIC9cXG4vZyxcbiAgICAgIHJDciA9IC9cXHIvZyxcbiAgICAgIHJTbGFzaCA9IC9cXFxcL2csXG4gICAgICByTGluZVNlcCA9IC9cXHUyMDI4LyxcbiAgICAgIHJQYXJhZ3JhcGhTZXAgPSAvXFx1MjAyOS87XG5cbiAgSG9nYW4udGFncyA9IHtcbiAgICAnIyc6IDEsICdeJzogMiwgJzwnOiAzLCAnJCc6IDQsXG4gICAgJy8nOiA1LCAnISc6IDYsICc+JzogNywgJz0nOiA4LCAnX3YnOiA5LFxuICAgICd7JzogMTAsICcmJzogMTEsICdfdCc6IDEyXG4gIH07XG5cbiAgSG9nYW4uc2NhbiA9IGZ1bmN0aW9uIHNjYW4odGV4dCwgZGVsaW1pdGVycykge1xuICAgIHZhciBsZW4gPSB0ZXh0Lmxlbmd0aCxcbiAgICAgICAgSU5fVEVYVCA9IDAsXG4gICAgICAgIElOX1RBR19UWVBFID0gMSxcbiAgICAgICAgSU5fVEFHID0gMixcbiAgICAgICAgc3RhdGUgPSBJTl9URVhULFxuICAgICAgICB0YWdUeXBlID0gbnVsbCxcbiAgICAgICAgdGFnID0gbnVsbCxcbiAgICAgICAgYnVmID0gJycsXG4gICAgICAgIHRva2VucyA9IFtdLFxuICAgICAgICBzZWVuVGFnID0gZmFsc2UsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBsaW5lU3RhcnQgPSAwLFxuICAgICAgICBvdGFnID0gJ3t7JyxcbiAgICAgICAgY3RhZyA9ICd9fSc7XG5cbiAgICBmdW5jdGlvbiBhZGRCdWYoKSB7XG4gICAgICBpZiAoYnVmLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdG9rZW5zLnB1c2goe3RhZzogJ190JywgdGV4dDogbmV3IFN0cmluZyhidWYpfSk7XG4gICAgICAgIGJ1ZiA9ICcnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmVJc1doaXRlc3BhY2UoKSB7XG4gICAgICB2YXIgaXNBbGxXaGl0ZXNwYWNlID0gdHJ1ZTtcbiAgICAgIGZvciAodmFyIGogPSBsaW5lU3RhcnQ7IGogPCB0b2tlbnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaXNBbGxXaGl0ZXNwYWNlID1cbiAgICAgICAgICAoSG9nYW4udGFnc1t0b2tlbnNbal0udGFnXSA8IEhvZ2FuLnRhZ3NbJ192J10pIHx8XG4gICAgICAgICAgKHRva2Vuc1tqXS50YWcgPT0gJ190JyAmJiB0b2tlbnNbal0udGV4dC5tYXRjaChySXNXaGl0ZXNwYWNlKSA9PT0gbnVsbCk7XG4gICAgICAgIGlmICghaXNBbGxXaGl0ZXNwYWNlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpc0FsbFdoaXRlc3BhY2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsdGVyTGluZShoYXZlU2VlblRhZywgbm9OZXdMaW5lKSB7XG4gICAgICBhZGRCdWYoKTtcblxuICAgICAgaWYgKGhhdmVTZWVuVGFnICYmIGxpbmVJc1doaXRlc3BhY2UoKSkge1xuICAgICAgICBmb3IgKHZhciBqID0gbGluZVN0YXJ0LCBuZXh0OyBqIDwgdG9rZW5zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgaWYgKHRva2Vuc1tqXS50ZXh0KSB7XG4gICAgICAgICAgICBpZiAoKG5leHQgPSB0b2tlbnNbaisxXSkgJiYgbmV4dC50YWcgPT0gJz4nKSB7XG4gICAgICAgICAgICAgIC8vIHNldCBpbmRlbnQgdG8gdG9rZW4gdmFsdWVcbiAgICAgICAgICAgICAgbmV4dC5pbmRlbnQgPSB0b2tlbnNbal0udGV4dC50b1N0cmluZygpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b2tlbnMuc3BsaWNlKGosIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghbm9OZXdMaW5lKSB7XG4gICAgICAgIHRva2Vucy5wdXNoKHt0YWc6J1xcbid9KTtcbiAgICAgIH1cblxuICAgICAgc2VlblRhZyA9IGZhbHNlO1xuICAgICAgbGluZVN0YXJ0ID0gdG9rZW5zLmxlbmd0aDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGFuZ2VEZWxpbWl0ZXJzKHRleHQsIGluZGV4KSB7XG4gICAgICB2YXIgY2xvc2UgPSAnPScgKyBjdGFnLFxuICAgICAgICAgIGNsb3NlSW5kZXggPSB0ZXh0LmluZGV4T2YoY2xvc2UsIGluZGV4KSxcbiAgICAgICAgICBkZWxpbWl0ZXJzID0gdHJpbShcbiAgICAgICAgICAgIHRleHQuc3Vic3RyaW5nKHRleHQuaW5kZXhPZignPScsIGluZGV4KSArIDEsIGNsb3NlSW5kZXgpXG4gICAgICAgICAgKS5zcGxpdCgnICcpO1xuXG4gICAgICBvdGFnID0gZGVsaW1pdGVyc1swXTtcbiAgICAgIGN0YWcgPSBkZWxpbWl0ZXJzW2RlbGltaXRlcnMubGVuZ3RoIC0gMV07XG5cbiAgICAgIHJldHVybiBjbG9zZUluZGV4ICsgY2xvc2UubGVuZ3RoIC0gMTtcbiAgICB9XG5cbiAgICBpZiAoZGVsaW1pdGVycykge1xuICAgICAgZGVsaW1pdGVycyA9IGRlbGltaXRlcnMuc3BsaXQoJyAnKTtcbiAgICAgIG90YWcgPSBkZWxpbWl0ZXJzWzBdO1xuICAgICAgY3RhZyA9IGRlbGltaXRlcnNbMV07XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoc3RhdGUgPT0gSU5fVEVYVCkge1xuICAgICAgICBpZiAodGFnQ2hhbmdlKG90YWcsIHRleHQsIGkpKSB7XG4gICAgICAgICAgLS1pO1xuICAgICAgICAgIGFkZEJ1ZigpO1xuICAgICAgICAgIHN0YXRlID0gSU5fVEFHX1RZUEU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRleHQuY2hhckF0KGkpID09ICdcXG4nKSB7XG4gICAgICAgICAgICBmaWx0ZXJMaW5lKHNlZW5UYWcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBidWYgKz0gdGV4dC5jaGFyQXQoaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlID09IElOX1RBR19UWVBFKSB7XG4gICAgICAgIGkgKz0gb3RhZy5sZW5ndGggLSAxO1xuICAgICAgICB0YWcgPSBIb2dhbi50YWdzW3RleHQuY2hhckF0KGkgKyAxKV07XG4gICAgICAgIHRhZ1R5cGUgPSB0YWcgPyB0ZXh0LmNoYXJBdChpICsgMSkgOiAnX3YnO1xuICAgICAgICBpZiAodGFnVHlwZSA9PSAnPScpIHtcbiAgICAgICAgICBpID0gY2hhbmdlRGVsaW1pdGVycyh0ZXh0LCBpKTtcbiAgICAgICAgICBzdGF0ZSA9IElOX1RFWFQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRhZykge1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdGF0ZSA9IElOX1RBRztcbiAgICAgICAgfVxuICAgICAgICBzZWVuVGFnID0gaTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0YWdDaGFuZ2UoY3RhZywgdGV4dCwgaSkpIHtcbiAgICAgICAgICB0b2tlbnMucHVzaCh7dGFnOiB0YWdUeXBlLCBuOiB0cmltKGJ1ZiksIG90YWc6IG90YWcsIGN0YWc6IGN0YWcsXG4gICAgICAgICAgICAgICAgICAgICAgIGk6ICh0YWdUeXBlID09ICcvJykgPyBzZWVuVGFnIC0gb3RhZy5sZW5ndGggOiBpICsgY3RhZy5sZW5ndGh9KTtcbiAgICAgICAgICBidWYgPSAnJztcbiAgICAgICAgICBpICs9IGN0YWcubGVuZ3RoIC0gMTtcbiAgICAgICAgICBzdGF0ZSA9IElOX1RFWFQ7XG4gICAgICAgICAgaWYgKHRhZ1R5cGUgPT0gJ3snKSB7XG4gICAgICAgICAgICBpZiAoY3RhZyA9PSAnfX0nKSB7XG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNsZWFuVHJpcGxlU3RhY2hlKHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidWYgKz0gdGV4dC5jaGFyQXQoaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaWx0ZXJMaW5lKHNlZW5UYWcsIHRydWUpO1xuXG4gICAgcmV0dXJuIHRva2VucztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFuVHJpcGxlU3RhY2hlKHRva2VuKSB7XG4gICAgaWYgKHRva2VuLm4uc3Vic3RyKHRva2VuLm4ubGVuZ3RoIC0gMSkgPT09ICd9Jykge1xuICAgICAgdG9rZW4ubiA9IHRva2VuLm4uc3Vic3RyaW5nKDAsIHRva2VuLm4ubGVuZ3RoIC0gMSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdHJpbShzKSB7XG4gICAgaWYgKHMudHJpbSkge1xuICAgICAgcmV0dXJuIHMudHJpbSgpO1xuICAgIH1cblxuICAgIHJldHVybiBzLnJlcGxhY2UoL15cXHMqfFxccyokL2csICcnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRhZ0NoYW5nZSh0YWcsIHRleHQsIGluZGV4KSB7XG4gICAgaWYgKHRleHQuY2hhckF0KGluZGV4KSAhPSB0YWcuY2hhckF0KDApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDEsIGwgPSB0YWcubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodGV4dC5jaGFyQXQoaW5kZXggKyBpKSAhPSB0YWcuY2hhckF0KGkpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIHRoZSB0YWdzIGFsbG93ZWQgaW5zaWRlIHN1cGVyIHRlbXBsYXRlc1xuICB2YXIgYWxsb3dlZEluU3VwZXIgPSB7J190JzogdHJ1ZSwgJ1xcbic6IHRydWUsICckJzogdHJ1ZSwgJy8nOiB0cnVlfTtcblxuICBmdW5jdGlvbiBidWlsZFRyZWUodG9rZW5zLCBraW5kLCBzdGFjaywgY3VzdG9tVGFncykge1xuICAgIHZhciBpbnN0cnVjdGlvbnMgPSBbXSxcbiAgICAgICAgb3BlbmVyID0gbnVsbCxcbiAgICAgICAgdGFpbCA9IG51bGwsXG4gICAgICAgIHRva2VuID0gbnVsbDtcblxuICAgIHRhaWwgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcblxuICAgIHdoaWxlICh0b2tlbnMubGVuZ3RoID4gMCkge1xuICAgICAgdG9rZW4gPSB0b2tlbnMuc2hpZnQoKTtcblxuICAgICAgaWYgKHRhaWwgJiYgdGFpbC50YWcgPT0gJzwnICYmICEodG9rZW4udGFnIGluIGFsbG93ZWRJblN1cGVyKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lsbGVnYWwgY29udGVudCBpbiA8IHN1cGVyIHRhZy4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKEhvZ2FuLnRhZ3NbdG9rZW4udGFnXSA8PSBIb2dhbi50YWdzWyckJ10gfHwgaXNPcGVuZXIodG9rZW4sIGN1c3RvbVRhZ3MpKSB7XG4gICAgICAgIHN0YWNrLnB1c2godG9rZW4pO1xuICAgICAgICB0b2tlbi5ub2RlcyA9IGJ1aWxkVHJlZSh0b2tlbnMsIHRva2VuLnRhZywgc3RhY2ssIGN1c3RvbVRhZ3MpO1xuICAgICAgfSBlbHNlIGlmICh0b2tlbi50YWcgPT0gJy8nKSB7XG4gICAgICAgIGlmIChzdGFjay5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nsb3NpbmcgdGFnIHdpdGhvdXQgb3BlbmVyOiAvJyArIHRva2VuLm4pO1xuICAgICAgICB9XG4gICAgICAgIG9wZW5lciA9IHN0YWNrLnBvcCgpO1xuICAgICAgICBpZiAodG9rZW4ubiAhPSBvcGVuZXIubiAmJiAhaXNDbG9zZXIodG9rZW4ubiwgb3BlbmVyLm4sIGN1c3RvbVRhZ3MpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOZXN0aW5nIGVycm9yOiAnICsgb3BlbmVyLm4gKyAnIHZzLiAnICsgdG9rZW4ubik7XG4gICAgICAgIH1cbiAgICAgICAgb3BlbmVyLmVuZCA9IHRva2VuLmk7XG4gICAgICAgIHJldHVybiBpbnN0cnVjdGlvbnM7XG4gICAgICB9IGVsc2UgaWYgKHRva2VuLnRhZyA9PSAnXFxuJykge1xuICAgICAgICB0b2tlbi5sYXN0ID0gKHRva2Vucy5sZW5ndGggPT0gMCkgfHwgKHRva2Vuc1swXS50YWcgPT0gJ1xcbicpO1xuICAgICAgfVxuXG4gICAgICBpbnN0cnVjdGlvbnMucHVzaCh0b2tlbik7XG4gICAgfVxuXG4gICAgaWYgKHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWlzc2luZyBjbG9zaW5nIHRhZzogJyArIHN0YWNrLnBvcCgpLm4pO1xuICAgIH1cblxuICAgIHJldHVybiBpbnN0cnVjdGlvbnM7XG4gIH1cblxuICBmdW5jdGlvbiBpc09wZW5lcih0b2tlbiwgdGFncykge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGFncy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICh0YWdzW2ldLm8gPT0gdG9rZW4ubikge1xuICAgICAgICB0b2tlbi50YWcgPSAnIyc7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQ2xvc2VyKGNsb3NlLCBvcGVuLCB0YWdzKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0YWdzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKHRhZ3NbaV0uYyA9PSBjbG9zZSAmJiB0YWdzW2ldLm8gPT0gb3Blbikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzdHJpbmdpZnlTdWJzdGl0dXRpb25zKG9iaikge1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGl0ZW1zLnB1c2goJ1wiJyArIGVzYyhrZXkpICsgJ1wiOiBmdW5jdGlvbihjLHAsdCxpKSB7JyArIG9ialtrZXldICsgJ30nKTtcbiAgICB9XG4gICAgcmV0dXJuIFwieyBcIiArIGl0ZW1zLmpvaW4oXCIsXCIpICsgXCIgfVwiO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RyaW5naWZ5UGFydGlhbHMoY29kZU9iaikge1xuICAgIHZhciBwYXJ0aWFscyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBjb2RlT2JqLnBhcnRpYWxzKSB7XG4gICAgICBwYXJ0aWFscy5wdXNoKCdcIicgKyBlc2Moa2V5KSArICdcIjp7bmFtZTpcIicgKyBlc2MoY29kZU9iai5wYXJ0aWFsc1trZXldLm5hbWUpICsgJ1wiLCAnICsgc3RyaW5naWZ5UGFydGlhbHMoY29kZU9iai5wYXJ0aWFsc1trZXldKSArIFwifVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIFwicGFydGlhbHM6IHtcIiArIHBhcnRpYWxzLmpvaW4oXCIsXCIpICsgXCJ9LCBzdWJzOiBcIiArIHN0cmluZ2lmeVN1YnN0aXR1dGlvbnMoY29kZU9iai5zdWJzKTtcbiAgfVxuXG4gIEhvZ2FuLnN0cmluZ2lmeSA9IGZ1bmN0aW9uKGNvZGVPYmosIHRleHQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gXCJ7Y29kZTogZnVuY3Rpb24gKGMscCxpKSB7IFwiICsgSG9nYW4ud3JhcE1haW4oY29kZU9iai5jb2RlKSArIFwiIH0sXCIgKyBzdHJpbmdpZnlQYXJ0aWFscyhjb2RlT2JqKSArICBcIn1cIjtcbiAgfVxuXG4gIHZhciBzZXJpYWxObyA9IDA7XG4gIEhvZ2FuLmdlbmVyYXRlID0gZnVuY3Rpb24odHJlZSwgdGV4dCwgb3B0aW9ucykge1xuICAgIHNlcmlhbE5vID0gMDtcbiAgICB2YXIgY29udGV4dCA9IHsgY29kZTogJycsIHN1YnM6IHt9LCBwYXJ0aWFsczoge30gfTtcbiAgICBIb2dhbi53YWxrKHRyZWUsIGNvbnRleHQpO1xuXG4gICAgaWYgKG9wdGlvbnMuYXNTdHJpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0cmluZ2lmeShjb250ZXh0LCB0ZXh0LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5tYWtlVGVtcGxhdGUoY29udGV4dCwgdGV4dCwgb3B0aW9ucyk7XG4gIH1cblxuICBIb2dhbi53cmFwTWFpbiA9IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICByZXR1cm4gJ3ZhciB0PXRoaXM7dC5iKGk9aXx8XCJcIik7JyArIGNvZGUgKyAncmV0dXJuIHQuZmwoKTsnO1xuICB9XG5cbiAgSG9nYW4udGVtcGxhdGUgPSBIb2dhbi5UZW1wbGF0ZTtcblxuICBIb2dhbi5tYWtlVGVtcGxhdGUgPSBmdW5jdGlvbihjb2RlT2JqLCB0ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIHRlbXBsYXRlID0gdGhpcy5tYWtlUGFydGlhbHMoY29kZU9iaik7XG4gICAgdGVtcGxhdGUuY29kZSA9IG5ldyBGdW5jdGlvbignYycsICdwJywgJ2knLCB0aGlzLndyYXBNYWluKGNvZGVPYmouY29kZSkpO1xuICAgIHJldHVybiBuZXcgdGhpcy50ZW1wbGF0ZSh0ZW1wbGF0ZSwgdGV4dCwgdGhpcywgb3B0aW9ucyk7XG4gIH1cblxuICBIb2dhbi5tYWtlUGFydGlhbHMgPSBmdW5jdGlvbihjb2RlT2JqKSB7XG4gICAgdmFyIGtleSwgdGVtcGxhdGUgPSB7c3Viczoge30sIHBhcnRpYWxzOiBjb2RlT2JqLnBhcnRpYWxzLCBuYW1lOiBjb2RlT2JqLm5hbWV9O1xuICAgIGZvciAoa2V5IGluIHRlbXBsYXRlLnBhcnRpYWxzKSB7XG4gICAgICB0ZW1wbGF0ZS5wYXJ0aWFsc1trZXldID0gdGhpcy5tYWtlUGFydGlhbHModGVtcGxhdGUucGFydGlhbHNba2V5XSk7XG4gICAgfVxuICAgIGZvciAoa2V5IGluIGNvZGVPYmouc3Vicykge1xuICAgICAgdGVtcGxhdGUuc3Vic1trZXldID0gbmV3IEZ1bmN0aW9uKCdjJywgJ3AnLCAndCcsICdpJywgY29kZU9iai5zdWJzW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH1cblxuICBmdW5jdGlvbiBlc2Mocykge1xuICAgIHJldHVybiBzLnJlcGxhY2UoclNsYXNoLCAnXFxcXFxcXFwnKVxuICAgICAgICAgICAgLnJlcGxhY2UoclF1b3QsICdcXFxcXFxcIicpXG4gICAgICAgICAgICAucmVwbGFjZShyTmV3bGluZSwgJ1xcXFxuJylcbiAgICAgICAgICAgIC5yZXBsYWNlKHJDciwgJ1xcXFxyJylcbiAgICAgICAgICAgIC5yZXBsYWNlKHJMaW5lU2VwLCAnXFxcXHUyMDI4JylcbiAgICAgICAgICAgIC5yZXBsYWNlKHJQYXJhZ3JhcGhTZXAsICdcXFxcdTIwMjknKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNob29zZU1ldGhvZChzKSB7XG4gICAgcmV0dXJuICh+cy5pbmRleE9mKCcuJykpID8gJ2QnIDogJ2YnO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUGFydGlhbChub2RlLCBjb250ZXh0KSB7XG4gICAgdmFyIHByZWZpeCA9IFwiPFwiICsgKGNvbnRleHQucHJlZml4IHx8IFwiXCIpO1xuICAgIHZhciBzeW0gPSBwcmVmaXggKyBub2RlLm4gKyBzZXJpYWxObysrO1xuICAgIGNvbnRleHQucGFydGlhbHNbc3ltXSA9IHtuYW1lOiBub2RlLm4sIHBhcnRpYWxzOiB7fX07XG4gICAgY29udGV4dC5jb2RlICs9ICd0LmIodC5ycChcIicgKyAgZXNjKHN5bSkgKyAnXCIsYyxwLFwiJyArIChub2RlLmluZGVudCB8fCAnJykgKyAnXCIpKTsnO1xuICAgIHJldHVybiBzeW07XG4gIH1cblxuICBIb2dhbi5jb2RlZ2VuID0ge1xuICAgICcjJzogZnVuY3Rpb24obm9kZSwgY29udGV4dCkge1xuICAgICAgY29udGV4dC5jb2RlICs9ICdpZih0LnModC4nICsgY2hvb3NlTWV0aG9kKG5vZGUubikgKyAnKFwiJyArIGVzYyhub2RlLm4pICsgJ1wiLGMscCwxKSwnICtcbiAgICAgICAgICAgICAgICAgICAgICAnYyxwLDAsJyArIG5vZGUuaSArICcsJyArIG5vZGUuZW5kICsgJyxcIicgKyBub2RlLm90YWcgKyBcIiBcIiArIG5vZGUuY3RhZyArICdcIikpeycgK1xuICAgICAgICAgICAgICAgICAgICAgICd0LnJzKGMscCwnICsgJ2Z1bmN0aW9uKGMscCx0KXsnO1xuICAgICAgSG9nYW4ud2Fsayhub2RlLm5vZGVzLCBjb250ZXh0KTtcbiAgICAgIGNvbnRleHQuY29kZSArPSAnfSk7Yy5wb3AoKTt9JztcbiAgICB9LFxuXG4gICAgJ14nOiBmdW5jdGlvbihub2RlLCBjb250ZXh0KSB7XG4gICAgICBjb250ZXh0LmNvZGUgKz0gJ2lmKCF0LnModC4nICsgY2hvb3NlTWV0aG9kKG5vZGUubikgKyAnKFwiJyArIGVzYyhub2RlLm4pICsgJ1wiLGMscCwxKSxjLHAsMSwwLDAsXCJcIikpeyc7XG4gICAgICBIb2dhbi53YWxrKG5vZGUubm9kZXMsIGNvbnRleHQpO1xuICAgICAgY29udGV4dC5jb2RlICs9ICd9Oyc7XG4gICAgfSxcblxuICAgICc+JzogY3JlYXRlUGFydGlhbCxcbiAgICAnPCc6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIHZhciBjdHggPSB7cGFydGlhbHM6IHt9LCBjb2RlOiAnJywgc3Viczoge30sIGluUGFydGlhbDogdHJ1ZX07XG4gICAgICBIb2dhbi53YWxrKG5vZGUubm9kZXMsIGN0eCk7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBjb250ZXh0LnBhcnRpYWxzW2NyZWF0ZVBhcnRpYWwobm9kZSwgY29udGV4dCldO1xuICAgICAgdGVtcGxhdGUuc3VicyA9IGN0eC5zdWJzO1xuICAgICAgdGVtcGxhdGUucGFydGlhbHMgPSBjdHgucGFydGlhbHM7XG4gICAgfSxcblxuICAgICckJzogZnVuY3Rpb24obm9kZSwgY29udGV4dCkge1xuICAgICAgdmFyIGN0eCA9IHtzdWJzOiB7fSwgY29kZTogJycsIHBhcnRpYWxzOiBjb250ZXh0LnBhcnRpYWxzLCBwcmVmaXg6IG5vZGUubn07XG4gICAgICBIb2dhbi53YWxrKG5vZGUubm9kZXMsIGN0eCk7XG4gICAgICBjb250ZXh0LnN1YnNbbm9kZS5uXSA9IGN0eC5jb2RlO1xuICAgICAgaWYgKCFjb250ZXh0LmluUGFydGlhbCkge1xuICAgICAgICBjb250ZXh0LmNvZGUgKz0gJ3Quc3ViKFwiJyArIGVzYyhub2RlLm4pICsgJ1wiLGMscCxpKTsnO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAnXFxuJzogZnVuY3Rpb24obm9kZSwgY29udGV4dCkge1xuICAgICAgY29udGV4dC5jb2RlICs9IHdyaXRlKCdcIlxcXFxuXCInICsgKG5vZGUubGFzdCA/ICcnIDogJyArIGknKSk7XG4gICAgfSxcblxuICAgICdfdic6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQuY29kZSArPSAndC5iKHQudih0LicgKyBjaG9vc2VNZXRob2Qobm9kZS5uKSArICcoXCInICsgZXNjKG5vZGUubikgKyAnXCIsYyxwLDApKSk7JztcbiAgICB9LFxuXG4gICAgJ190JzogZnVuY3Rpb24obm9kZSwgY29udGV4dCkge1xuICAgICAgY29udGV4dC5jb2RlICs9IHdyaXRlKCdcIicgKyBlc2Mobm9kZS50ZXh0KSArICdcIicpO1xuICAgIH0sXG5cbiAgICAneyc6IHRyaXBsZVN0YWNoZSxcblxuICAgICcmJzogdHJpcGxlU3RhY2hlXG4gIH1cblxuICBmdW5jdGlvbiB0cmlwbGVTdGFjaGUobm9kZSwgY29udGV4dCkge1xuICAgIGNvbnRleHQuY29kZSArPSAndC5iKHQudCh0LicgKyBjaG9vc2VNZXRob2Qobm9kZS5uKSArICcoXCInICsgZXNjKG5vZGUubikgKyAnXCIsYyxwLDApKSk7JztcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlKHMpIHtcbiAgICByZXR1cm4gJ3QuYignICsgcyArICcpOyc7XG4gIH1cblxuICBIb2dhbi53YWxrID0gZnVuY3Rpb24obm9kZWxpc3QsIGNvbnRleHQpIHtcbiAgICB2YXIgZnVuYztcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG5vZGVsaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZnVuYyA9IEhvZ2FuLmNvZGVnZW5bbm9kZWxpc3RbaV0udGFnXTtcbiAgICAgIGZ1bmMgJiYgZnVuYyhub2RlbGlzdFtpXSwgY29udGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG5cbiAgSG9nYW4ucGFyc2UgPSBmdW5jdGlvbih0b2tlbnMsIHRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICByZXR1cm4gYnVpbGRUcmVlKHRva2VucywgJycsIFtdLCBvcHRpb25zLnNlY3Rpb25UYWdzIHx8IFtdKTtcbiAgfVxuXG4gIEhvZ2FuLmNhY2hlID0ge307XG5cbiAgSG9nYW4uY2FjaGVLZXkgPSBmdW5jdGlvbih0ZXh0LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIFt0ZXh0LCAhIW9wdGlvbnMuYXNTdHJpbmcsICEhb3B0aW9ucy5kaXNhYmxlTGFtYmRhLCBvcHRpb25zLmRlbGltaXRlcnMsICEhb3B0aW9ucy5tb2RlbEdldF0uam9pbignfHwnKTtcbiAgfVxuXG4gIEhvZ2FuLmNvbXBpbGUgPSBmdW5jdGlvbih0ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIGtleSA9IEhvZ2FuLmNhY2hlS2V5KHRleHQsIG9wdGlvbnMpO1xuICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMuY2FjaGVba2V5XTtcblxuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgdmFyIHBhcnRpYWxzID0gdGVtcGxhdGUucGFydGlhbHM7XG4gICAgICBmb3IgKHZhciBuYW1lIGluIHBhcnRpYWxzKSB7XG4gICAgICAgIGRlbGV0ZSBwYXJ0aWFsc1tuYW1lXS5pbnN0YW5jZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICB0ZW1wbGF0ZSA9IHRoaXMuZ2VuZXJhdGUodGhpcy5wYXJzZSh0aGlzLnNjYW4odGV4dCwgb3B0aW9ucy5kZWxpbWl0ZXJzKSwgdGV4dCwgb3B0aW9ucyksIHRleHQsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLmNhY2hlW2tleV0gPSB0ZW1wbGF0ZTtcbiAgfVxufSkodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnID8gZXhwb3J0cyA6IEhvZ2FuKTtcbiIsIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTEgVHdpdHRlciwgSW5jLlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8gVGhpcyBmaWxlIGlzIGZvciB1c2Ugd2l0aCBOb2RlLmpzLiBTZWUgZGlzdC8gZm9yIGJyb3dzZXIgZmlsZXMuXG5cbnZhciBIb2dhbiA9IHJlcXVpcmUoJy4vY29tcGlsZXInKTtcbkhvZ2FuLlRlbXBsYXRlID0gcmVxdWlyZSgnLi90ZW1wbGF0ZScpLlRlbXBsYXRlO1xuSG9nYW4udGVtcGxhdGUgPSBIb2dhbi5UZW1wbGF0ZTtcbm1vZHVsZS5leHBvcnRzID0gSG9nYW47XG4iLCIvKlxuICogIENvcHlyaWdodCAyMDExIFR3aXR0ZXIsIEluYy5cbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbnZhciBIb2dhbiA9IHt9O1xuXG4oZnVuY3Rpb24gKEhvZ2FuKSB7XG4gIEhvZ2FuLlRlbXBsYXRlID0gZnVuY3Rpb24gKGNvZGVPYmosIHRleHQsIGNvbXBpbGVyLCBvcHRpb25zKSB7XG4gICAgY29kZU9iaiA9IGNvZGVPYmogfHwge307XG4gICAgdGhpcy5yID0gY29kZU9iai5jb2RlIHx8IHRoaXMucjtcbiAgICB0aGlzLmMgPSBjb21waWxlcjtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHRoaXMudGV4dCA9IHRleHQgfHwgJyc7XG4gICAgdGhpcy5wYXJ0aWFscyA9IGNvZGVPYmoucGFydGlhbHMgfHwge307XG4gICAgdGhpcy5zdWJzID0gY29kZU9iai5zdWJzIHx8IHt9O1xuICAgIHRoaXMuYnVmID0gJyc7XG4gIH1cblxuICBIb2dhbi5UZW1wbGF0ZS5wcm90b3R5cGUgPSB7XG4gICAgLy8gcmVuZGVyOiByZXBsYWNlZCBieSBnZW5lcmF0ZWQgY29kZS5cbiAgICByOiBmdW5jdGlvbiAoY29udGV4dCwgcGFydGlhbHMsIGluZGVudCkgeyByZXR1cm4gJyc7IH0sXG5cbiAgICAvLyB2YXJpYWJsZSBlc2NhcGluZ1xuICAgIHY6IGhvZ2FuRXNjYXBlLFxuXG4gICAgLy8gdHJpcGxlIHN0YWNoZVxuICAgIHQ6IGNvZXJjZVRvU3RyaW5nLFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoY29udGV4dCwgcGFydGlhbHMsIGluZGVudCkge1xuICAgICAgcmV0dXJuIHRoaXMucmkoW2NvbnRleHRdLCBwYXJ0aWFscyB8fCB7fSwgaW5kZW50KTtcbiAgICB9LFxuXG4gICAgLy8gcmVuZGVyIGludGVybmFsIC0tIGEgaG9vayBmb3Igb3ZlcnJpZGVzIHRoYXQgY2F0Y2hlcyBwYXJ0aWFscyB0b29cbiAgICByaTogZnVuY3Rpb24gKGNvbnRleHQsIHBhcnRpYWxzLCBpbmRlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnIoY29udGV4dCwgcGFydGlhbHMsIGluZGVudCk7XG4gICAgfSxcblxuICAgIC8vIGVuc3VyZVBhcnRpYWxcbiAgICBlcDogZnVuY3Rpb24oc3ltYm9sLCBwYXJ0aWFscykge1xuICAgICAgdmFyIHBhcnRpYWwgPSB0aGlzLnBhcnRpYWxzW3N5bWJvbF07XG5cbiAgICAgIC8vIGNoZWNrIHRvIHNlZSB0aGF0IGlmIHdlJ3ZlIGluc3RhbnRpYXRlZCB0aGlzIHBhcnRpYWwgYmVmb3JlXG4gICAgICB2YXIgdGVtcGxhdGUgPSBwYXJ0aWFsc1twYXJ0aWFsLm5hbWVdO1xuICAgICAgaWYgKHBhcnRpYWwuaW5zdGFuY2UgJiYgcGFydGlhbC5iYXNlID09IHRlbXBsYXRlKSB7XG4gICAgICAgIHJldHVybiBwYXJ0aWFsLmluc3RhbmNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRlbXBsYXRlID09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmICghdGhpcy5jKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gY29tcGlsZXIgYXZhaWxhYmxlLlwiKTtcbiAgICAgICAgfVxuICAgICAgICB0ZW1wbGF0ZSA9IHRoaXMuYy5jb21waWxlKHRlbXBsYXRlLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRlbXBsYXRlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICAvLyBXZSB1c2UgdGhpcyB0byBjaGVjayB3aGV0aGVyIHRoZSBwYXJ0aWFscyBkaWN0aW9uYXJ5IGhhcyBjaGFuZ2VkXG4gICAgICB0aGlzLnBhcnRpYWxzW3N5bWJvbF0uYmFzZSA9IHRlbXBsYXRlO1xuXG4gICAgICBpZiAocGFydGlhbC5zdWJzKSB7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBjb25zaWRlciBwYXJlbnQgdGVtcGxhdGUgbm93XG4gICAgICAgIGlmICghcGFydGlhbHMuc3RhY2tUZXh0KSBwYXJ0aWFscy5zdGFja1RleHQgPSB7fTtcbiAgICAgICAgZm9yIChrZXkgaW4gcGFydGlhbC5zdWJzKSB7XG4gICAgICAgICAgaWYgKCFwYXJ0aWFscy5zdGFja1RleHRba2V5XSkge1xuICAgICAgICAgICAgcGFydGlhbHMuc3RhY2tUZXh0W2tleV0gPSAodGhpcy5hY3RpdmVTdWIgIT09IHVuZGVmaW5lZCAmJiBwYXJ0aWFscy5zdGFja1RleHRbdGhpcy5hY3RpdmVTdWJdKSA/IHBhcnRpYWxzLnN0YWNrVGV4dFt0aGlzLmFjdGl2ZVN1Yl0gOiB0aGlzLnRleHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXBsYXRlID0gY3JlYXRlU3BlY2lhbGl6ZWRQYXJ0aWFsKHRlbXBsYXRlLCBwYXJ0aWFsLnN1YnMsIHBhcnRpYWwucGFydGlhbHMsXG4gICAgICAgICAgdGhpcy5zdGFja1N1YnMsIHRoaXMuc3RhY2tQYXJ0aWFscywgcGFydGlhbHMuc3RhY2tUZXh0KTtcbiAgICAgIH1cbiAgICAgIHRoaXMucGFydGlhbHNbc3ltYm9sXS5pbnN0YW5jZSA9IHRlbXBsYXRlO1xuXG4gICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfSxcblxuICAgIC8vIHRyaWVzIHRvIGZpbmQgYSBwYXJ0aWFsIGluIHRoZSBjdXJyZW50IHNjb3BlIGFuZCByZW5kZXIgaXRcbiAgICBycDogZnVuY3Rpb24oc3ltYm9sLCBjb250ZXh0LCBwYXJ0aWFscywgaW5kZW50KSB7XG4gICAgICB2YXIgcGFydGlhbCA9IHRoaXMuZXAoc3ltYm9sLCBwYXJ0aWFscyk7XG4gICAgICBpZiAoIXBhcnRpYWwpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGFydGlhbC5yaShjb250ZXh0LCBwYXJ0aWFscywgaW5kZW50KTtcbiAgICB9LFxuXG4gICAgLy8gcmVuZGVyIGEgc2VjdGlvblxuICAgIHJzOiBmdW5jdGlvbihjb250ZXh0LCBwYXJ0aWFscywgc2VjdGlvbikge1xuICAgICAgdmFyIHRhaWwgPSBjb250ZXh0W2NvbnRleHQubGVuZ3RoIC0gMV07XG5cbiAgICAgIGlmICghaXNBcnJheSh0YWlsKSkge1xuICAgICAgICBzZWN0aW9uKGNvbnRleHQsIHBhcnRpYWxzLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhaWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29udGV4dC5wdXNoKHRhaWxbaV0pO1xuICAgICAgICBzZWN0aW9uKGNvbnRleHQsIHBhcnRpYWxzLCB0aGlzKTtcbiAgICAgICAgY29udGV4dC5wb3AoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gbWF5YmUgc3RhcnQgYSBzZWN0aW9uXG4gICAgczogZnVuY3Rpb24odmFsLCBjdHgsIHBhcnRpYWxzLCBpbnZlcnRlZCwgc3RhcnQsIGVuZCwgdGFncykge1xuICAgICAgdmFyIHBhc3M7XG5cbiAgICAgIGlmIChpc0FycmF5KHZhbCkgJiYgdmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFsID0gdGhpcy5tcyh2YWwsIGN0eCwgcGFydGlhbHMsIGludmVydGVkLCBzdGFydCwgZW5kLCB0YWdzKTtcbiAgICAgIH1cblxuICAgICAgcGFzcyA9ICEhdmFsO1xuXG4gICAgICBpZiAoIWludmVydGVkICYmIHBhc3MgJiYgY3R4KSB7XG4gICAgICAgIGN0eC5wdXNoKCh0eXBlb2YgdmFsID09ICdvYmplY3QnKSA/IHZhbCA6IGN0eFtjdHgubGVuZ3RoIC0gMV0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGFzcztcbiAgICB9LFxuXG4gICAgLy8gZmluZCB2YWx1ZXMgd2l0aCBkb3R0ZWQgbmFtZXNcbiAgICBkOiBmdW5jdGlvbihrZXksIGN0eCwgcGFydGlhbHMsIHJldHVybkZvdW5kKSB7XG4gICAgICB2YXIgZm91bmQsXG4gICAgICAgICAgbmFtZXMgPSBrZXkuc3BsaXQoJy4nKSxcbiAgICAgICAgICB2YWwgPSB0aGlzLmYobmFtZXNbMF0sIGN0eCwgcGFydGlhbHMsIHJldHVybkZvdW5kKSxcbiAgICAgICAgICBkb01vZGVsR2V0ID0gdGhpcy5vcHRpb25zLm1vZGVsR2V0LFxuICAgICAgICAgIGN4ID0gbnVsbDtcblxuICAgICAgaWYgKGtleSA9PT0gJy4nICYmIGlzQXJyYXkoY3R4W2N0eC5sZW5ndGggLSAyXSkpIHtcbiAgICAgICAgdmFsID0gY3R4W2N0eC5sZW5ndGggLSAxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBmb3VuZCA9IGZpbmRJblNjb3BlKG5hbWVzW2ldLCB2YWwsIGRvTW9kZWxHZXQpO1xuICAgICAgICAgIGlmIChmb3VuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjeCA9IHZhbDtcbiAgICAgICAgICAgIHZhbCA9IGZvdW5kO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWwgPSAnJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHJldHVybkZvdW5kICYmICF2YWwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJldHVybkZvdW5kICYmIHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjdHgucHVzaChjeCk7XG4gICAgICAgIHZhbCA9IHRoaXMubXYodmFsLCBjdHgsIHBhcnRpYWxzKTtcbiAgICAgICAgY3R4LnBvcCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsO1xuICAgIH0sXG5cbiAgICAvLyBmaW5kIHZhbHVlcyB3aXRoIG5vcm1hbCBuYW1lc1xuICAgIGY6IGZ1bmN0aW9uKGtleSwgY3R4LCBwYXJ0aWFscywgcmV0dXJuRm91bmQpIHtcbiAgICAgIHZhciB2YWwgPSBmYWxzZSxcbiAgICAgICAgICB2ID0gbnVsbCxcbiAgICAgICAgICBmb3VuZCA9IGZhbHNlLFxuICAgICAgICAgIGRvTW9kZWxHZXQgPSB0aGlzLm9wdGlvbnMubW9kZWxHZXQ7XG5cbiAgICAgIGZvciAodmFyIGkgPSBjdHgubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgdiA9IGN0eFtpXTtcbiAgICAgICAgdmFsID0gZmluZEluU2NvcGUoa2V5LCB2LCBkb01vZGVsR2V0KTtcbiAgICAgICAgaWYgKHZhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgcmV0dXJuIChyZXR1cm5Gb3VuZCkgPyBmYWxzZSA6IFwiXCI7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmV0dXJuRm91bmQgJiYgdHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbCA9IHRoaXMubXYodmFsLCBjdHgsIHBhcnRpYWxzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9LFxuXG4gICAgLy8gaGlnaGVyIG9yZGVyIHRlbXBsYXRlc1xuICAgIGxzOiBmdW5jdGlvbihmdW5jLCBjeCwgcGFydGlhbHMsIHRleHQsIHRhZ3MpIHtcbiAgICAgIHZhciBvbGRUYWdzID0gdGhpcy5vcHRpb25zLmRlbGltaXRlcnM7XG5cbiAgICAgIHRoaXMub3B0aW9ucy5kZWxpbWl0ZXJzID0gdGFncztcbiAgICAgIHRoaXMuYih0aGlzLmN0KGNvZXJjZVRvU3RyaW5nKGZ1bmMuY2FsbChjeCwgdGV4dCkpLCBjeCwgcGFydGlhbHMpKTtcbiAgICAgIHRoaXMub3B0aW9ucy5kZWxpbWl0ZXJzID0gb2xkVGFncztcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyBjb21waWxlIHRleHRcbiAgICBjdDogZnVuY3Rpb24odGV4dCwgY3gsIHBhcnRpYWxzKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRpc2FibGVMYW1iZGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdMYW1iZGEgZmVhdHVyZXMgZGlzYWJsZWQuJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5jLmNvbXBpbGUodGV4dCwgdGhpcy5vcHRpb25zKS5yZW5kZXIoY3gsIHBhcnRpYWxzKTtcbiAgICB9LFxuXG4gICAgLy8gdGVtcGxhdGUgcmVzdWx0IGJ1ZmZlcmluZ1xuICAgIGI6IGZ1bmN0aW9uKHMpIHsgdGhpcy5idWYgKz0gczsgfSxcblxuICAgIGZsOiBmdW5jdGlvbigpIHsgdmFyIHIgPSB0aGlzLmJ1ZjsgdGhpcy5idWYgPSAnJzsgcmV0dXJuIHI7IH0sXG5cbiAgICAvLyBtZXRob2QgcmVwbGFjZSBzZWN0aW9uXG4gICAgbXM6IGZ1bmN0aW9uKGZ1bmMsIGN0eCwgcGFydGlhbHMsIGludmVydGVkLCBzdGFydCwgZW5kLCB0YWdzKSB7XG4gICAgICB2YXIgdGV4dFNvdXJjZSxcbiAgICAgICAgICBjeCA9IGN0eFtjdHgubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5jYWxsKGN4KTtcblxuICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpZiAoaW52ZXJ0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZXh0U291cmNlID0gKHRoaXMuYWN0aXZlU3ViICYmIHRoaXMuc3Vic1RleHQgJiYgdGhpcy5zdWJzVGV4dFt0aGlzLmFjdGl2ZVN1Yl0pID8gdGhpcy5zdWJzVGV4dFt0aGlzLmFjdGl2ZVN1Yl0gOiB0aGlzLnRleHQ7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubHMocmVzdWx0LCBjeCwgcGFydGlhbHMsIHRleHRTb3VyY2Uuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpLCB0YWdzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICAvLyBtZXRob2QgcmVwbGFjZSB2YXJpYWJsZVxuICAgIG12OiBmdW5jdGlvbihmdW5jLCBjdHgsIHBhcnRpYWxzKSB7XG4gICAgICB2YXIgY3ggPSBjdHhbY3R4Lmxlbmd0aCAtIDFdO1xuICAgICAgdmFyIHJlc3VsdCA9IGZ1bmMuY2FsbChjeCk7XG5cbiAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3QoY29lcmNlVG9TdHJpbmcocmVzdWx0LmNhbGwoY3gpKSwgY3gsIHBhcnRpYWxzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgc3ViOiBmdW5jdGlvbihuYW1lLCBjb250ZXh0LCBwYXJ0aWFscywgaW5kZW50KSB7XG4gICAgICB2YXIgZiA9IHRoaXMuc3Vic1tuYW1lXTtcbiAgICAgIGlmIChmKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlU3ViID0gbmFtZTtcbiAgICAgICAgZihjb250ZXh0LCBwYXJ0aWFscywgdGhpcywgaW5kZW50KTtcbiAgICAgICAgdGhpcy5hY3RpdmVTdWIgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfTtcblxuICAvL0ZpbmQgYSBrZXkgaW4gYW4gb2JqZWN0XG4gIGZ1bmN0aW9uIGZpbmRJblNjb3BlKGtleSwgc2NvcGUsIGRvTW9kZWxHZXQpIHtcbiAgICB2YXIgdmFsO1xuXG4gICAgaWYgKHNjb3BlICYmIHR5cGVvZiBzY29wZSA9PSAnb2JqZWN0Jykge1xuXG4gICAgICBpZiAoc2NvcGVba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhbCA9IHNjb3BlW2tleV07XG5cbiAgICAgIC8vIHRyeSBsb29rdXAgd2l0aCBnZXQgZm9yIGJhY2tib25lIG9yIHNpbWlsYXIgbW9kZWwgZGF0YVxuICAgICAgfSBlbHNlIGlmIChkb01vZGVsR2V0ICYmIHNjb3BlLmdldCAmJiB0eXBlb2Ygc2NvcGUuZ2V0ID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFsID0gc2NvcGUuZ2V0KGtleSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVNwZWNpYWxpemVkUGFydGlhbChpbnN0YW5jZSwgc3VicywgcGFydGlhbHMsIHN0YWNrU3Vicywgc3RhY2tQYXJ0aWFscywgc3RhY2tUZXh0KSB7XG4gICAgZnVuY3Rpb24gUGFydGlhbFRlbXBsYXRlKCkge307XG4gICAgUGFydGlhbFRlbXBsYXRlLnByb3RvdHlwZSA9IGluc3RhbmNlO1xuICAgIGZ1bmN0aW9uIFN1YnN0aXR1dGlvbnMoKSB7fTtcbiAgICBTdWJzdGl0dXRpb25zLnByb3RvdHlwZSA9IGluc3RhbmNlLnN1YnM7XG4gICAgdmFyIGtleTtcbiAgICB2YXIgcGFydGlhbCA9IG5ldyBQYXJ0aWFsVGVtcGxhdGUoKTtcbiAgICBwYXJ0aWFsLnN1YnMgPSBuZXcgU3Vic3RpdHV0aW9ucygpO1xuICAgIHBhcnRpYWwuc3Vic1RleHQgPSB7fTsgIC8vaGVoZS4gc3Vic3RleHQuXG4gICAgcGFydGlhbC5idWYgPSAnJztcblxuICAgIHN0YWNrU3VicyA9IHN0YWNrU3VicyB8fCB7fTtcbiAgICBwYXJ0aWFsLnN0YWNrU3VicyA9IHN0YWNrU3VicztcbiAgICBwYXJ0aWFsLnN1YnNUZXh0ID0gc3RhY2tUZXh0O1xuICAgIGZvciAoa2V5IGluIHN1YnMpIHtcbiAgICAgIGlmICghc3RhY2tTdWJzW2tleV0pIHN0YWNrU3Vic1trZXldID0gc3Vic1trZXldO1xuICAgIH1cbiAgICBmb3IgKGtleSBpbiBzdGFja1N1YnMpIHtcbiAgICAgIHBhcnRpYWwuc3Vic1trZXldID0gc3RhY2tTdWJzW2tleV07XG4gICAgfVxuXG4gICAgc3RhY2tQYXJ0aWFscyA9IHN0YWNrUGFydGlhbHMgfHwge307XG4gICAgcGFydGlhbC5zdGFja1BhcnRpYWxzID0gc3RhY2tQYXJ0aWFscztcbiAgICBmb3IgKGtleSBpbiBwYXJ0aWFscykge1xuICAgICAgaWYgKCFzdGFja1BhcnRpYWxzW2tleV0pIHN0YWNrUGFydGlhbHNba2V5XSA9IHBhcnRpYWxzW2tleV07XG4gICAgfVxuICAgIGZvciAoa2V5IGluIHN0YWNrUGFydGlhbHMpIHtcbiAgICAgIHBhcnRpYWwucGFydGlhbHNba2V5XSA9IHN0YWNrUGFydGlhbHNba2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFydGlhbDtcbiAgfVxuXG4gIHZhciByQW1wID0gLyYvZyxcbiAgICAgIHJMdCA9IC88L2csXG4gICAgICByR3QgPSAvPi9nLFxuICAgICAgckFwb3MgPSAvXFwnL2csXG4gICAgICByUXVvdCA9IC9cXFwiL2csXG4gICAgICBoQ2hhcnMgPSAvWyY8PlxcXCJcXCddLztcblxuICBmdW5jdGlvbiBjb2VyY2VUb1N0cmluZyh2YWwpIHtcbiAgICByZXR1cm4gU3RyaW5nKCh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpID8gJycgOiB2YWwpO1xuICB9XG5cbiAgZnVuY3Rpb24gaG9nYW5Fc2NhcGUoc3RyKSB7XG4gICAgc3RyID0gY29lcmNlVG9TdHJpbmcoc3RyKTtcbiAgICByZXR1cm4gaENoYXJzLnRlc3Qoc3RyKSA/XG4gICAgICBzdHJcbiAgICAgICAgLnJlcGxhY2UockFtcCwgJyZhbXA7JylcbiAgICAgICAgLnJlcGxhY2Uockx0LCAnJmx0OycpXG4gICAgICAgIC5yZXBsYWNlKHJHdCwgJyZndDsnKVxuICAgICAgICAucmVwbGFjZShyQXBvcywgJyYjMzk7JylcbiAgICAgICAgLnJlcGxhY2UoclF1b3QsICcmcXVvdDsnKSA6XG4gICAgICBzdHI7XG4gIH1cblxuICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24oYSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbn0pKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyA/IGV4cG9ydHMgOiBIb2dhbik7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvKlxyXG4qIEBBdXRob3I6IOmdklxyXG4qIEBEYXRlOiAgIDIwMjAtMDMtMTQgMTc6MDI6NTZcclxuKiBATGFzdCBNb2RpZmllZCBieTogICDpnZJcclxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDIwLTAzLTE0IDE3OjAzOjQ2XHJcbiovXHJcblxyXG5yZXF1aXJlKCcuL2luZGV4LmNzcycpOyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIi8qXHJcbiogQEF1dGhvcjog6Z2SXHJcbiogQERhdGU6ICAgMjAyMC0wMy0xNSAxNzo1Njo0NVxyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIOmdklxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMjAtMDMtMjggMDA6MjU6MDdcclxuKi9cclxucmVxdWlyZSgnLi9pbmRleC5jc3MnKTtcclxucmVxdWlyZSgncGFnZS9jb21tb24vbmF2LXNpbXBsZS9pbmRleC5qcycpO1xyXG52YXIgX21tID0gcmVxdWlyZSgndXRpbC9tbS5qcycpO1xyXG52YXIgX3VzZXIgPSByZXF1aXJlKCdzZXJ2aWNlL3VzZXItc2VydmljZS5qcycpO1xyXG4vLyDooajljZXph4znmoTplJnor6/mj5DnpLpcclxudmFyIGZvcm1FcnJvciA9IHtcclxuXHRzaG93OiBmdW5jdGlvbihlcnJNc2cpIHtcclxuXHRcdCQoJy5lcnJvci1pdGVtJykuc2hvdygpLmZpbmQoJy5lcnItbXNnJykudGV4dChlcnJNc2cpO1xyXG5cdH0sXHJcblx0aGlkZTogZnVuY3Rpb24oKSB7XHJcblx0XHQkKCcuZXJyb3ItaXRlbScpLmhpZGUoKS5maW5kKCdlcnItbXNnJykudGV4dCgnJyk7XHJcblx0fVxyXG59XHJcblxyXG4vLyBwYWdlIOmAu+i+kemDqOWIhlxyXG52YXIgcGFnZSA9IHtcclxuXHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuYmluZEV2ZW50KCk7XHJcblx0fSxcclxuXHRiaW5kRXZlbnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIF90aGlzID0gdGhpcztcclxuXHRcdC8vIOmqjOivgXVzZXJuYW1lXHJcblx0XHQkKCcjdXNlcm5hbWUnKS5ibHVyKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdXNlcm5hbWUgPSAkLnRyaW0oJCh0aGlzKS52YWwoKSk7XHJcblx0XHRcdC8vIOWmguaenOeUqOaIt+WQjeS4uuepuu+8jOaIkeS7rOS4jeWBmumqjOivgVxyXG5cdFx0XHRpZighdXNlcm5hbWUpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8g5byC5q2l6aqM6K+B55So5oi35ZCN5piv5ZCm5a2Y5ZyoXHJcblx0XHRcdF91c2VyLmNoZWNrVXNlcm5hbWUodXNlcm5hbWUsIGZ1bmN0aW9uKHJlcykge1xyXG5cdFx0XHRcdGZvcm1FcnJvci5oaWRlKCk7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVyck1zZykge1xyXG5cdFx0XHRcdGZvcm1FcnJvci5zaG93KGVyck1zZyk7XHJcblx0XHRcdH0pXHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyDnmbvlvZXmjInpkq7nmoTngrnlh7sgXHJcblx0XHQkKCcjc3VibWl0JykuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHRcdF90aGlzLnN1Ym1pdCgpO1xyXG5cdFx0fSk7XHJcblx0XHQvLyDlpoLmnpzmjInkuIvlm57ovabvvIzkuZ/ov5vooYzmj5DkuqRcclxuXHRcdCQoJy51c2VyLWNvbnRlbnQnKS5rZXl1cChmdW5jdGlvbihlKSB7XHJcblx0XHRcdC8vIGtleUNvZGUgPT0gMTMg6KGo56S65Zue6L2mXHJcblx0XHRcdGlmKGUua2V5Q29kZSA9PT0gMTMpIHtcclxuXHRcdFx0XHRfdGhpcy5zdWJtaXQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdC8vIOaPkOS6pOihqOWNlVxyXG5cdHN1Ym1pdDogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZm9ybURhdGEgPSB7XHJcblx0XHRcdHVzZXJuYW1lOiAkLnRyaW0oJCgnI3VzZXJuYW1lJykudmFsKCkpLFxyXG5cdFx0XHRwYXNzd29yZDogJC50cmltKCQoJyNwYXNzd29yZCcpLnZhbCgpKSxcclxuXHRcdFx0cGFzc3dvcmRDb25maXJtOiAkLnRyaW0oJCgnI3Bhc3N3b3JkLWNvbmZpcm0nKS52YWwoKSksXHJcblx0XHRcdHBob25lOiAkLnRyaW0oJCgnI3Bob25lJykudmFsKCkpLFxyXG5cdFx0XHRlbWFpbDogJC50cmltKCQoJyNlbWFpbCcpLnZhbCgpKSxcclxuXHRcdFx0cXVlc3Rpb246ICQudHJpbSgkKCcjcXVlc3Rpb24nKS52YWwoKSksXHJcblx0XHRcdGFuc3dlcjogJC50cmltKCQoJyNhbnN3ZXInKS52YWwoKSlcclxuXHRcdH07XHJcblx0XHQvLyDooajljZXpqozor4Hnu5PmnpxcclxuXHRcdHZhciB2YWxpZGF0ZVJlc3VsdCA9IHRoaXMuZm9ybVZhbGlkYXRlKGZvcm1EYXRhKTtcclxuXHRcdC8vIOmqjOivgeaIkOWKn1xyXG5cdFx0aWYodmFsaWRhdGVSZXN1bHQuc3RhdHVzKSB7XHJcblx0XHRcdF91c2VyLnJlZ2lzdGVyKGZvcm1EYXRhLCBmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL3Jlc3VsdC5odG1sP3R5cGU9cmVnaXN0ZXInO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJNc2cpIHtcclxuXHRcdFx0XHRmb3JtRXJyb3Iuc2hvdyhlcnJNc2cpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdC8vIOmqjOivgeWksei0pVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vIOmUmeivr+aPkOekulxyXG5cdFx0XHRmb3JtRXJyb3Iuc2hvdyh2YWxpZGF0ZVJlc3VsdC5tc2cpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Ly8g6KGo5Y2V5a2X5q6155qE6aqM6K+BXHJcblx0Zm9ybVZhbGlkYXRlOiBmdW5jdGlvbihmb3JtRGF0YSkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IHtcclxuXHRcdFx0c3RhdHVzOiBmYWxzZSxcclxuXHRcdFx0bXNnOiAnJ1xyXG5cdFx0fVxyXG5cdFx0Ly8g6aqM6K+B55So5oi35ZCN5piv5ZCm5Li656m6XHJcblx0XHRpZighX21tLnZhbGlkYXRlKGZvcm1EYXRhLnVzZXJuYW1lLCAncmVxdWlyZScpKSB7XHJcblx0XHRcdHJlc3VsdC5tc2cgPSAn55So5oi35ZCN5LiN6IO95Li656m6JztcclxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdH1cclxuXHRcdC8vIOmqjOivgeWvhueggeaYr+aYr+WQpuS4uuepulxyXG5cdFx0aWYoIV9tbS52YWxpZGF0ZShmb3JtRGF0YS5wYXNzd29yZCwgJ3JlcXVpcmUnKSkge1xyXG5cdFx0XHRyZXN1bHQubXNnID0gJ+WvhueggeS4jeiDveS4uuepuic7XHJcblx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHR9XHJcblx0XHQvLyDpqozor4Hlr4bnoIHplb/luqZcclxuXHRcdGlmKGZvcm1EYXRhLnBhc3N3b3JkLmxlbmd0aCA8IDYpIHtcclxuXHRcdFx0cmVzdWx0Lm1zZyA9ICflr4bnoIHplb/luqbkuI3og73lsJHkuo425L2NJztcclxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdH1cclxuXHRcdC8vIOmqjOivgeS4pOasoei+k+WFpeeahOWvhueggeaYr+WQpuS4gOiHtFxyXG5cdFx0aWYoZm9ybURhdGEucGFzc3dvcmQgIT09IGZvcm1EYXRhLnBhc3N3b3JkQ29uZmlybSkge1xyXG5cdFx0XHRyZXN1bHQubXNnID0gJ+S4pOasoei+k+WFpeeahOWvhueggeS4jeS4gOiHtCc7XHJcblx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHR9XHJcblx0XHQvLyDpqozor4HmiYvmnLrlj7dcclxuXHRcdGlmKCFfbW0udmFsaWRhdGUoZm9ybURhdGEucGhvbmUsICdwaG9uZScpKSB7XHJcblx0XHRcdHJlc3VsdC5tc2cgPSAn5omL5py65Y+35qC85byP5LiN5q2j56GuJztcclxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdH1cclxuXHRcdC8vIOmqjOivgemCrueusVxyXG5cdFx0aWYoIV9tbS52YWxpZGF0ZShmb3JtRGF0YS5lbWFpbCwgJ2VtYWlsJykpIHtcclxuXHRcdFx0cmVzdWx0Lm1zZyA9ICfpgq7nrrHmoLzlvI/kuI3mraPnoa4nO1xyXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0fVxyXG5cdFx0Ly8g6aqM6K+B5a+G56CB5o+Q56S66Zeu6aKY5piv5ZCm5Li656m6XHJcblx0XHRpZighX21tLnZhbGlkYXRlKGZvcm1EYXRhLnF1ZXN0aW9uLCAncmVxdWlyZScpKSB7XHJcblx0XHRcdHJlc3VsdC5tc2cgPSAn5a+G56CB5o+Q56S66Zeu6aKY5LiN6IO95Li656m6JztcclxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdH1cdFx0XHJcblx0XHQvLyDpqozor4Hlr4bnoIHmj5DnpLrpl67popjnrZTmoYjmmK/lkKbkuLrnqbpcclxuXHRcdGlmKCFfbW0udmFsaWRhdGUoZm9ybURhdGEuYW5zd2VyLCAncmVxdWlyZScpKSB7XHJcblx0XHRcdHJlc3VsdC5tc2cgPSAn5a+G56CB5o+Q56S66Zeu6aKY562U5qGI5LiN6IO95Li656m6JztcclxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyDpgJrov4fpqozor4HvvIzov5Tlm57mraPnoa7mj5DnpLpcclxuXHRcdHJlc3VsdC5zdGF0dXMgPSB0cnVlO1xyXG5cdFx0cmVzdWx0Lm1zZyA9ICfpqozor4HpgJrov4cnO1xyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcbn1cclxuJChmdW5jdGlvbigpIHtcclxuXHRwYWdlLmluaXQoKTtcclxufSkiLCIvKlxyXG4qIEBBdXRob3I6IOmdklxyXG4qIEBEYXRlOiAgIDIwMjAtMDMtMjcgMDk6NDM6MjRcclxuKiBATGFzdCBNb2RpZmllZCBieTogICDpnZJcclxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDIwLTA0LTE3IDE0OjM1OjA4XHJcbiovXHJcbnZhciBfbW0gPSByZXF1aXJlKCd1dGlsL21tLmpzJyk7XHJcblxyXG52YXIgX3VzZXIgPSB7XHJcblx0Ly8g55So5oi355m75b2VXHJcblx0bG9naW46IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9sb2dpbi5kbycpLFxyXG5cdFx0XHRkYXRhOiB1c2VySW5mbyxcclxuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDmo4Dmn6XnlKjmiLflkI1cclxuXHRjaGVja1VzZXJuYW1lOiBmdW5jdGlvbih1c2VybmFtZSwgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvY2hlY2tfdmFsaWQuZG8nKSxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdHR5cGU6ICd1c2VybmFtZScsXHJcblx0XHRcdFx0c3RyOiB1c2VybmFtZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRtZXRob2Q6ICdQT1NUJyxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdC8vIOeUqOaIt+azqOWGjFxyXG5cdHJlZ2lzdGVyOiBmdW5jdGlvbih1c2VySW5mbywgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvcmVnaXN0ZXIuZG8nKSxcclxuXHRcdFx0ZGF0YTogdXNlckluZm8sXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5qOA5p+l55m75b2V54q25oCBXHJcblx0Y2hlY2tMb2dpbjogZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9nZXRfdXNlcl9pbmZvLmRvJyksXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdC8vIOiOt+WPlueUqOaIt+WvhueggeaPkOekuumXrumimFxyXG5cdGdldFF1ZXN0aW9uOiBmdW5jdGlvbih1c2VybmFtZSwgcmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvZm9yZ2V0X2dldF9xdWVzdGlvbi5kbycpLFxyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0dXNlcm5hbWU6IHVzZXJuYW1lXHJcblx0XHRcdH0sXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5qOA5p+l5a+G56CB5o+Q56S66Zeu6aKY562U5qGIXHJcblx0Y2hlY2tBbnN3ZXI6IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9mb3JnZXRfY2hlY2tfYW5zd2VyLmRvJyksXHJcblx0XHRcdGRhdGE6IHVzZXJJbmZvLFxyXG5cdFx0XHRtZXRob2Q6ICdQT1NUJyxcclxuXHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcclxuXHRcdFx0ZXJyb3I6IHJlamVjdFxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdC8vIOmHjee9ruWvhueggVxyXG5cdHJlc2V0UGFzc3dvcmQ6IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9mb3JnZXRfcmVzZXRfcGFzc3dvcmQuZG8nKSxcclxuXHRcdFx0ZGF0YTogdXNlckluZm8sXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g6I635Y+W55So5oi35L+h5oGvXHJcblx0Z2V0VXNlckluZm86IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvZ2V0X2luZm9ybWF0aW9uLmRvJyksXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g5pu05paw5Liq5Lq65L+h5oGvXHJcblx0dXBkYXRlVXNlckluZm86IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci91cGRhdGVfaW5mb3JtYXRpb24uZG8nKSxcclxuXHRcdFx0ZGF0YTogdXNlckluZm8sXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g55m75b2V54q25oCB5LiL5pu05paw5a+G56CBXHJcblx0dXBkYXRlUGFzc3dvcmQ6IGZ1bmN0aW9uKHVzZXJJbmZvLCByZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdF9tbS5yZXF1ZXN0KHtcclxuXHRcdFx0dXJsOiBfbW0uZ2V0U2VydmVyVXJsKCcvdXNlci9yZXNldF9wYXNzd29yZC5kbycpLFxyXG5cdFx0XHRkYXRhOiB1c2VySW5mbyxcclxuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXHJcblx0XHRcdGVycm9yOiByZWplY3RcclxuXHRcdH0pXHJcblx0fSxcclxuXHQvLyDnmbvlh7pcclxuXHRsb2dvdXQ6IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcblx0XHRfbW0ucmVxdWVzdCh7XHJcblx0XHRcdHVybDogX21tLmdldFNlcnZlclVybCgnL3VzZXIvbG9nb3V0LmRvJyksXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxyXG5cdFx0XHRlcnJvcjogcmVqZWN0XHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IF91c2VyOyIsIi8qXHJcbiogQEF1dGhvcjog6Z2SXHJcbiogQERhdGU6ICAgMjAyMC0wMy0wOSAxNTowMTowMVxyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIOmdklxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMjAtMDQtMTAgMTY6MjA6NTdcclxuKi9cclxudmFyIGNvbmYgPSB7XHJcblx0c2VydmVySG9zdDogJy9hcGknXHJcbn1cclxuXHJcbnZhciBIb2dhbiA9IHJlcXVpcmUoJ2hvZ2FuLmpzJyk7XHJcblxyXG52YXIgX21tID0ge1xyXG5cdC8vIOe9kee7nOivt+axglxyXG5cdHJlcXVlc3Q6IGZ1bmN0aW9uKHBhcmFtKSB7XHJcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xyXG5cdFx0JC5hamF4KHtcclxuXHRcdFx0dHlwZTogcGFyYW0ubWV0aG9kIHx8ICdnZXQnLFxyXG5cdFx0XHR1cmw6IHBhcmFtLnVybCB8fCAnJyxcclxuXHRcdFx0ZGF0YVR5cGU6IHBhcmFtLnR5cGUgfHwgJ2pzb24nLFxyXG5cdFx0XHRkYXRhOiBwYXJhbS5kYXRhIHx8ICcnLFxyXG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0XHQvLyDor7fmsYLmiJDlip9cclxuXHRcdFx0XHRpZihyZXMuc3RhdHVzID09PSAwKSB7XHJcblx0XHRcdFx0XHR0eXBlb2YgcGFyYW0uc3VjY2VzcyA9PT0gJ2Z1bmN0aW9uJyAmJiBwYXJhbS5zdWNjZXNzKHJlcy5kYXRhLCByZXMubXNnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8g5rKh5pyJ55m75b2V54q25oCB77yM6ZyA6KaB5by65Yi255m75b2VXHJcblx0XHRcdFx0ZWxzZSBpZihyZXMuc3RhdHVzID09PSAxMCkge1xyXG5cdFx0XHRcdFx0X3RoaXMuZG9Mb2dpbigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyDor7fmsYLmlbDmja7plJnor69cclxuXHRcdFx0XHRlbHNlIGlmKHJlcy5zdGF0dXMgPT09IDEpIHtcclxuXHRcdFx0XHRcdHR5cGVvZiBwYXJhbS5lcnJvciA9PT0gJ2Z1bmN0aW9uJyAmJiBwYXJhbS5lcnJvcihyZXMubXNnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGVycm9yOiBmdW5jdGlvbihlcnIpIHtcclxuXHRcdFx0XHR0eXBlb2YgcGFyYW0uZXJyb3IgPT09ICdmdW5jdGlvbicgJiYgcGFyYW0uZXJyb3IoZXJyLnN0YXR1c1RleHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Ly8g6I635Y+W5pyN5Yqh5Zmo5Zyw5Z2AXHJcblx0Z2V0U2VydmVyVXJsOiBmdW5jdGlvbihwYXRoKSB7XHJcblx0XHRyZXR1cm4gY29uZi5zZXJ2ZXJIb3N0ICsgcGF0aDtcclxuXHR9LFxyXG5cdC8vIOiOt+WPlnVybOWPguaVsFxyXG5cdGdldFVybFBhcmFtOiBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHR2YXIgcmVnID0gbmV3IFJlZ0V4cCgnKF58JiknICsgbmFtZSArICc9KFteJl0qKSgmfCQpJyk7XHJcblx0XHR2YXIgcmVzdWx0ID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSkubWF0Y2gocmVnKTtcclxuXHRcdHJldHVybiByZXN1bHQgPyBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0WzJdKSA6IG51bGw7XHJcblx0XHQvLyAvKF58Jil0ZXN0PShbXiZdKikoJnwkKS9cclxuXHRcdC8vIHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHQvLyDmuLLmn5NodG1s5qih5p2/XHJcblx0cmVuZGVySHRtbDogZnVuY3Rpb24oaHRtbFRlbXBsYXRlLCBkYXRhKSB7XHJcblx0XHR2YXIgdGVtcGxhdGUgPSBIb2dhbi5jb21waWxlKGh0bWxUZW1wbGF0ZSksXHJcblx0XHRcdHJlc3VsdCA9IHRlbXBsYXRlLnJlbmRlcihkYXRhKTtcclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHQvLyDmiJDlip/mj5DnpLpcclxuXHRzdWNjZXNzVGlwczogZnVuY3Rpb24obXNnKSB7XHJcblx0XHRhbGVydChtc2cgfHwgJ+aTjeS9nOaIkOWKn++8gScpO1xyXG5cdH0sXHJcblx0Ly8g6ZSZ6K+v5o+Q56S6XHJcblx0ZXJyb3JUaXBzOiBmdW5jdGlvbihtc2cpIHtcclxuXHRcdGFsZXJ0KG1zZyB8fCAn6ZSZ6K+v5o+Q56S6Jyk7XHJcblx0fSxcclxuXHQvLyDlrZfmrrXnmoTpqozor4HjgIHmlK/mjIHpnZ7nqbrjgIHmiYvmnLrjgIHlh7npmbflpITnmoTliKTmlq1cclxuXHR2YWxpZGF0ZTogZnVuY3Rpb24odmFsdWUgLCB0eXBlKSB7XHJcblx0XHR2YXIgdmFsdWUgPSAkLnRyaW0odmFsdWUpO1xyXG5cdFx0Ly8g6Z2e56m66aqM6K+BXHJcblx0XHRpZigncmVxdWlyZScgPT09IHR5cGUpIHtcclxuXHRcdFx0cmV0dXJuICEhdmFsdWU7XHJcblx0XHR9XHJcblx0XHQvLyDmiYvmnLrlj7fpqozor4FcclxuXHRcdGlmKCdwaG9uZScgPT09IHR5cGUpIHtcclxuXHRcdFx0cmV0dXJuIC9eMVxcZHsxMH0kLy50ZXN0KHZhbHVlKTtcclxuXHRcdH1cclxuXHRcdC8vIOmCrueuseagvOW8j+mqjOivgVxyXG5cdFx0aWYoJ2VtYWlsJyA9PT0gdHlwZSkge1xyXG5cdFx0XHRyZXR1cm4gL14oW0EtWmEtejAtOV9cXC1cXC5dKStcXEAoW0EtWmEtejAtOV9cXC1cXC5dKStcXC4oW0EtWmEtel17Miw0fSkkLy50ZXN0KHZhbHVlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdC8vIOe7n+S4gOeZu+W9leWkhOeQhlxyXG5cdGRvTG9naW46IGZ1bmN0aW9uKCkge1xyXG5cdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi91c2VyLWxvZ2luLmh0bWw/cmVkaXJlY3Q9JyArIGVuY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24uaHJlZik7XHJcblx0fSxcclxuXHRkb0hvbWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9pbmRleC5odG1sJztcclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IF9tbTsiXSwic291cmNlUm9vdCI6IiJ9