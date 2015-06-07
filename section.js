/* Copyright 2014 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var CxxSectionBehavior, CxxSectionElement;
(function() {
    'use strict';

    CxxSectionBehavior = {
        properties: {
            id: {
                type: String,
            },
            number: {
                type: Number,
                value: null,
            },
            // String section number, like "17.2.3". 1-based.
            sec_num: {
                type: String,
                value: "?",
                observer: 'sec_numChanged',
            },
        },

        // Template helpers:
        prependHash: function(value) {
            return '#' + value;
        },
        surroundWithBrackets: function(value) {
            return '[' + value + ']';
        },

        // External interface:

        checkInvariants: function() {
            if (!this.id) {
                console.error(this, 'is missing an id.');
            }
        },

        update_sec_nums: function(sec_num) {
            this.sec_num = sec_num + '';
            var child_index = 1;
            // Assume there aren't any elements between cxx-section levels.
            for (var child = Polymer.dom(this).firstChild; child;
                 child = Polymer.dom(child).nextSibling) {
                if (child instanceof CxxSectionElement) {
                    if (child.number)
                        child_index = Number(child.number);
                    child.update_sec_nums(this.sec_num + '.' + child_index);
                    child_index++;
                }
            }
        },

        sec_numChanged: function() {
            if (this.title_element) {
                this.title_element.setAttribute(
                    'data-bookmark-label',
                    this.sec_num + ' ' + this.title_element.textContent);
            }
        },

        ready: function() {
            var title_element = Polymer.dom(this).querySelector('h1');
            if (title_element && Polymer.dom(title_element).parentElement == this)
                this.title_element = title_element;

            this.numberParagraphChildren();
        },

        numberParagraphChildren: function(rootElement, para_num_start) {
            var para_num = para_num_start || 1;
            for (var child = Polymer.dom(rootElement || this).firstElementChild;
                 child;
                 child = Polymer.dom(child).nextElementSibling) {
                if (child instanceof CxxSectionElement)
                    return para_num;
                else if (child instanceof HTMLParagraphElement && !child.classList.contains('cont'))
                    para_num = this.numberParagraph(para_num, child);
                else if (child instanceof CxxFunctionElement) {
                    para_num = this.numberParagraph(para_num, child);
                    para_num = this.numberParagraphChildren(child, para_num);
                } else if (child.isCxxFunctionAttribute)
                    para_num = this.numberParagraph(para_num, child);
            }
            return para_num;
        },

        numberParagraph: function(number, element) {
            // If the paragraph is explicitly numbered, use that number.
            if (element.hasAttribute("number"))
                number = Number(element.getAttribute("number"))

            var id = this.id + '.' + number;
            if (element.id) {
                console.warn('Paragraph already has id:', element);
                var anchor = document.createElement('a');
                anchor.id = id;
                Polymer.dom(element).insertBefore(anchor, Polymer.dom(element).firstChild);
            } else {
                element.id = id;
            }
            element.setAttribute('para_num', number);
            return number + 1
        }
    };

    CxxSectionElement = Polymer({
        is: 'cxx-section',
        behaviors: [CxxSectionBehavior],
    });
})();
