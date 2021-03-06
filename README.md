# tvmaze-sync

A module to synchronize the TVMaze api with your local mongo database

## Install

```
$ npm install tvmaze-sync --save
```
## Usage
```js

import { sync } from 'tvmaze-sync'
// or
const sync = require('tvmaze-sync').sync

const constants = {
  mongo: {
    dbConnection: 'mongodb://localhost:27017',
    dbName: 'tvmaze_sync_test',
    collectionName: 'sync'
  },
  request: {
    maxNumberOfPages: 200, // default value 100
    initialPage: 0 // default value 0
  }
}

const syncClient = sync.createClient(constants)
syncClient.sync()

// output
Inserted page 0 with 240 documents
Next interval page  1
...
...
...
==============================================
Ended process
Page 115 not found
Recovered pages: 115
Documents inserted: 27644

```


## License MIT

Copyright (c) 2017 - Andrea Zucchini


Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:


The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.


THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
