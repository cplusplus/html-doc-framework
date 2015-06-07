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

(function() {
    // Record the document that this element is declared in, so we can
    // pull the <dt> template out of it.
    // The condition handles the HTML Imports polyfill:
    // http://webcomponents.org/polyfills/html-imports/#other-notes
    var importDocument = document._currentScript
        ? document._currentScript.ownerDocument
        : document.currentScript.ownerDocument;

    var CxxDefinitionSectionTerm = Polymer({
        is: 'cxx-definition-section-term',
        extends: 'dt',

        joinWithDots: function() {
            return Array.prototype.join.call(arguments, '.');
        },
        prependHash: function(value) {
            return '#' + value;
        },
        surroundWithBrackets: function(value) {
            return '[' + value + ']';
        },
    });
    Polymer({
        is: 'cxx-definition-section',
        extends: 'dl',

        ready: function() {
            var parent_section = Polymer.dom(this).parentNode;
            while (parent_section && parent_section.tagName != 'CXX-SECTION')
                parent_section = Polymer.dom(parent_section).parentNode;
            if (!parent_section) {
                console.error('cxx-definition-section', this,
                              'must be a descendent of a <cxx-section> element.');
                return;
            }

            var next_term_number = 1;
            for (var dt = Polymer.dom(this).firstElementChild; dt;
                 dt = Polymer.dom(dt).nextSibling) {
                if (dt.tagName != 'DT')
                    continue;

                var oldDt = dt;
                dt = new CxxDefinitionSectionTerm();
                dt.id = oldDt.id;
                dt.parent_section = parent_section;
                dt.term_number = next_term_number++;
                Polymer.dom(dt).innerHTML = Polymer.dom(oldDt).innerHTML;

                Polymer.dom(this).insertBefore(dt, oldDt);
                Polymer.dom(this).removeChild(oldDt);
            }
        }
    });
})();
