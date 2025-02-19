/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => width * height,
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

/* eslint max-classes-per-file: ["error", 2] */
class CombineSelectors {
  constructor(selector1, combinator, selector2) {
    this.selector1 = selector1.stringify();
    this.selector2 = selector2.stringify();
    this.combinator = combinator;
    this.combined = '';
    this.combine();
  }

  combine() {
    this.combined = `${this.selector1} ${this.combinator} ${this.selector2}`;
    return this;
  }

  stringify() {
    return this.combined;
  }
}

class CreateSelector {
  constructor(element, value) {
    this.elementS = ''; // ...S - string
    this.idS = '';
    this.classS = '';
    this.attrS = '';
    this.pseudoClassS = '';
    this.pseudoElementS = '';

    this[element](value);
  }

  element(value) {
    if (this.elementS !== '') {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.idS !== ''
      || this.classS !== ''
      || this.attrS !== ''
      || this.pseudoClassS !== ''
      || this.pseudoElementS !== '') {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.elementS = `${value}`;
    return this;
  }

  id(value) {
    if (this.idS !== '') {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.classS !== ''
      || this.attrS !== ''
      || this.pseudoClassS !== ''
      || this.pseudoElementS !== '') {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.idS = `#${value}`;
    return this;
  }

  class(value) {
    if (this.attrS !== ''
      || this.pseudoClassS !== ''
      || this.pseudoElementS !== '') {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.classS = `${this.classS}.${value}`;
    return this;
  }

  attr(value) {
    if (this.pseudoClassS !== ''
      || this.pseudoElementS !== '') {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.attrS = `${this.attrS}[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (this.pseudoElementS !== '') {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.pseudoClassS = `${this.pseudoClassS}:${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.pseudoElementS !== '') {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.pseudoElementS = `::${value}`;
    return this;
  }

  stringify() {
    return `${this.elementS}${this.idS}${this.classS}${this.attrS}${this.pseudoClassS}${this.pseudoElementS}`;
  }
}

const cssSelectorBuilder = {

  element(value) {
    return new CreateSelector('element', value);
  },

  id(value) {
    return new CreateSelector('id', value);
  },

  class(value) {
    return new CreateSelector('class', value);
  },

  attr(value) {
    return new CreateSelector('attr', value);
  },

  pseudoClass(value) {
    return new CreateSelector('pseudoClass', value);
  },

  pseudoElement(value) {
    return new CreateSelector('pseudoElement', value);
  },

  combine(selector1, combinator, selector2) {
    return new CombineSelectors(selector1, combinator, selector2);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
