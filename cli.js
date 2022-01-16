#!/usr/bin/env node

// POST https://wantwords.thunlp.org/GetEnDefis/
// body FormData w=+purples+color+...&m=1
//
// GET https://wantwords.thunlp.org/EnglishRD/?description=colors&mode=EE

const fetch = import('node-fetch')
const columnize = require('columnize-array')
const { FormData } = require("formdata-node")
const argv = process.argv.slice(2)

const explain = argv.includes('--explain') && argv.splice(argv.indexOf('--explain'), 1)
const [name] = argv

if (explain) {
  const body = new FormData()
  body.set('w', name)
  body.set('m', 1)
  fetch.then(mod => mod.default(`https://wantwords.thunlp.org/GetEnDefis/`, {
    method: 'POST',
    body
  })).then(res => res.json()).then(json => console.log(json[0].replaceAll('<b>', '\x1b[1m').replaceAll('</b>', '\x1b[0m').replaceAll('<br>', '\n')))
} else {
  fetch.then(mod => mod.default(`https://wantwords.thunlp.org/EnglishRD/?description=${encodeURIComponent(name)}&mode=EE`)
    .then(res => res.json())
    .then(json => {
      console.log(columnize(json.map(x => x.w), { sort: true, maxRowLen: process.stdout.columns }).strs.join('\n'))
    }))
}
