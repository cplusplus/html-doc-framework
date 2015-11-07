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

Polymer({
    is: 'cxx-foreign-index',

    properties: {
        src: {
            type: String,
        },
        name: {
            type: String,
        },
        index: {
            type: Object,
            notify: true,
            readOnly: true,
        },
        references: {
            type: Object,
            value: function() { return new Set(); },
            readOnly: true,
        }
    },

    attachIndex: function(e) {
        this._setIndex(e.detail.response);
        if (typeof(this.index) != 'object') {
            this._setIndex(JSON.parse(this.index));
        }

        for (var property in this.index) {
            if (this.index.hasOwnProperty(property) &&
                typeof(this.index[property]) != 'string') {
                console.error(this.src,
                              'should map section names to their numbers, but',
                              property, 'mapped to', this.index[property]);
            }
        }

        var self = this;
        this.references.forEach(function(reference) {
            reference.index = self.index;
        });
    }
});
