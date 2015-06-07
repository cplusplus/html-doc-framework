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
    Polymer({
        is: 'cxx-internal-toc-level',
        extends: 'ol',

        prependHash: function(value) {
            return '#' + value;
        },
        nonEmpty: function(array) {
            return array.length > 0;
        },
    });

    Polymer({
        is: 'cxx-toc',

        properties: {
            // Hierarchy :: [{ elem: Element, title: H1, sections: Hierarchy }]
            sections: {
                type: Array,
                value: function() { return []; },
            },

            // Updated with the list of <cxx-clause> elements in the document each
            // time such an element is attached or detached.
            clauses: {
                type: Array,
                value: function() { return []; },
                observer: 'clausesChanged',
            },
        },


        collectSections: function(root) {
            var sections = [];
            for (var child = Polymer.dom(root).firstElementChild; child;
                 child = Polymer.dom(child).nextSibling) {
                if (!child.tagName)
                    continue;
                if (child.tagName.toUpperCase() != 'CXX-SECTION')
                    continue;
                sections.push(this.collectSections(child));
            }
            var h1 = Polymer.dom(root).querySelector('h1');
            return {elem: root,
                    title: h1 ? Polymer.dom(h1).textContent : root.title,
                    sections: sections};
        },

        updateClauses: function() {
            this.clauses = Polymer.dom(document).querySelectorAll('cxx-foreword,cxx-clause');
        },

        clausesChanged: function() {
            var clause_num = 1;
            this.sections = this.clauses.map(function(clause) {
                if (clause.set_clause_num) {
                    // Don't number things that can't accept numbers, indicated
                    // by not having a set_clause_num method.
                    clause_num = clause.set_clause_num(clause_num);
                }
                return this.collectSections(clause);
            }, this);
        },

        ready: function() {
            this.updateClauses();
        }
    })
})();
