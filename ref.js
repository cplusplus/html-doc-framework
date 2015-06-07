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
        is: 'cxx-ref',

        properties: {
            to: {
                type: String,
                value: "",
            },
            toElem: {
                type: Object,
                observer: 'toElemChanged',
            },
            in: {
                type: String,
            },
            inElem: {
                type: Object,
                observer: 'inElemChanged',
            },
            insynopsis: {
                type: Boolean,
                value: false,
            },
            targetNumber: {
                type: String,
                computed: 'computeTargetNumber(toElem.sec_num, toElem.table_num, toElem.figure_num)',
            },
            foreignSectionNumber: {
                type: String,
                computed: 'computeForeignSectionNumber(inElem.index, to)',
            },
            synopsisLabel: {
                type: String,
                computed: 'computeSynopsisLabel(toElem.title_element.textContent)',
            },
        },

        observers: [
            'indexChanged(inElem.index)'
        ],

        checkInvariants: function() {
            if (this.in) {
                if (!this.inElem) {
                    console.error(this, '.in (', this.in,
                                  ') must refer to a <cxx-foreign-index> element.');
                }
            } else {
                if (!this.to) {
                    console.error('<cxx-ref>', this,
                                  'must have an `in` or `to` attribute.');
                } else if (!this.toElem) {
                    console.error(this, '.to (', this.to,
                                  ') must refer to the ID of another element.');
                }
            }
        },

        inElemChanged: function() {
            if (this.inElem &&
                this.inElem.tagName.toUpperCase() != 'CXX-FOREIGN-INDEX') {
                console.error('<cxx-ref>.in (', this.in,
                              ') must be a <cxx-foreign-index>; was',
                              this.inElem);
            }
        },
        toElemChanged: function() {
            if (this.toElem) {
                this.async(function() {
                    // Async makes sure the toElem is upgraded.
                    if (!(this.toElem instanceof CxxSectionElement ||
                          this.toElem instanceof CxxTableElement ||
                          this.toElem instanceof CxxFigureElement)) {
                        console.error("Reference from", this,
                                      "refers to non-section, non-table, non-figure element",
                                      this.toElem);
                    }
                });
            }
        },

        computeTargetNumber: function(sec_num, table_num, figure_num) {
            return sec_num || table_num || figure_num;
        },

        computeForeignSectionNumber: function(foreignIndex, to) {
            return '\u00A7' + foreignIndex[to];
        },

        computeSynopsisLabel: function(targetTitle) {
            return ', ' + targetTitle;
        },

        prependHash: function(value) {
            return '#' + value;
        },

        indexChanged: function() {
            if (this.inElem && !(this.to in this.inElem.index)) {
                console.error(this.to, 'not found in', this.inElem);
            }
        }
    });
})()
