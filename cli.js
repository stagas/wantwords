#!/usr/bin/env node

// POST https://wantwords.net/GetEnDefis/
// body FormData w=+purples+color+...&m=1
//
// GET https://wantwords.net/EnglishRD/?q=colors&m=EnEn

const fetch = import('node-fetch')
const columnize = require('columnize-array')
const { FormData } = require("formdata-node")
const argv = process.argv.slice(2)

const api = 'https://wantwords.net/'
const explain = (argv.includes('-e') && argv.splice(argv.indexOf('-e'), 1)) || (argv.includes('--explain') && argv.splice(argv.indexOf('--explain'), 1))

if (!argv.length || argv.includes('-h') || argv.includes('--help')) {
  console.log(`
${process.argv[1]} [options] <word>

Options:
  -e, --explain  Read word dictionary definition
  -h, --help     Show this help
`)
  process.exit(0)
}

const [name] = argv

if (explain) {
  const body = new FormData()
  body.set('w', name)
  body.set('m', 1)
  fetch.then(mod => mod.default(`${api}GetEnDefis/`, {
    method: 'POST',
    body
  })).then(res => res.json()).then(json => {
    if (!json.length) {
      console.log('No definition found for:', name)
      return
    }
    console.log(json[0].E[0].def.map(([kind, desc, subtypes]) =>
      `\
\x1b[3m\x1b[4m${kind}\x1b[0m ${desc.replaceAll('<b>', '\x1b[1m').replaceAll('</b>', '\x1b[0m').replaceAll('<br>', '\n')}${subtypes.length ? ` \x1b[3m\x1b[2m(${subtypes.join(', ')})\x1b[0m` : ''}`
    ).join('\n'))
  })
} else {
  fetch.then(mod => mod.default(`${api}EnglishRD/?q=${encodeURIComponent(name)}&m=EnEn`)
    .then(res => res.json())
    .then(json => {
      console.log(columnize(json.map(x => x.w), { sort: true, maxRowLen: process.stdout.columns }).strs.join('\n'))
    }))
}
