import {Writable, Readable, Duplex, Transform} from 'stream'

let VERBOSE = false

function write(chunk, encoding, callback){
  if (VERBOSE) console.log('chunk: ',chunk.toString().trim())
  callback() }

function read(size){
  this.push(this.char_code < 91
    ? String.fromCharCode(this.char_code++)
    : EOS(this.push.bind(this))
  ) }

function transform(chunk, encoding, cb){
  this.push(chunk.toString().toLowerCase())
  cb() }

const streams = {
  out: new Writable(mk_opts(write)),
  in_: new Readable(mk_opts(read, {char_code:65})),
  duplex: new Duplex(mk_opts(read, write)),
  xform: new Transform(mk_opts(transform)) }

let {in_, out, duplex, xform} = streams
let {stdin, stdout} = process

/*Playing around

  duplex.char_code = 65
  stdin.pipe(duplex).pipe(stdout)
  stdin.pipe(xform).pipe(stdout)

*/

function main() {

  let other = new Readable(mk_opts(read))
  in_.char_code = 65
  in_.pipe(stdout)
  in_.pipe(xform).pipe(stdout) }

{main()}

// helpers
var EOS = fn => (fn('\n'),null)
var stringify = obj => JSON.stringify(obj,null,2)

function process_arg(arg){
  let res = 'function' === typeof arg
    ? {[arg.name]: arg} : arg
  if (VERBOSE) console.log('process_args -> res: ', res)
  return res
}

function mk_opts(...args){
  let res = args.reduce(
    (accu, item) => Object.assign(accu, process_arg(item)),
    {})
  if (VERBOSE) console.log('mk_opts -> res: ', res)
  return res
}
