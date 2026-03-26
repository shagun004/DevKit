import { useState, useEffect } from 'react'
import ToolPage from '../layout/ToolPage'

// Pure JS implementations - no external deps needed
function rotateRight(n, x) { return ((x >>> n) | (x << (32 - n))) >>> 0 }
function sha256(message) {
  const K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ]
  const H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]
  const bytes = new TextEncoder().encode(message)
  const bits = bytes.length * 8
  const padLen = bytes.length % 64 < 56 ? 56 - bytes.length % 64 : 120 - bytes.length % 64
  const padded = new Uint8Array(bytes.length + padLen + 8)
  padded.set(bytes); padded[bytes.length] = 0x80
  const view = new DataView(padded.buffer)
  view.setUint32(padded.length - 4, bits, false)
  for (let i = 0; i < padded.length; i += 64) {
    const w = new Array(64)
    for (let j = 0; j < 16; j++) w[j] = view.getUint32(i + j * 4, false)
    for (let j = 16; j < 64; j++) {
      const s0 = rotateRight(7,w[j-15]) ^ rotateRight(18,w[j-15]) ^ (w[j-15] >>> 3)
      const s1 = rotateRight(17,w[j-2]) ^ rotateRight(19,w[j-2]) ^ (w[j-2] >>> 10)
      w[j] = (w[j-16] + s0 + w[j-7] + s1) >>> 0
    }
    let [a,b,c,d,e,f,g,h] = H
    for (let j = 0; j < 64; j++) {
      const S1 = rotateRight(6,e) ^ rotateRight(11,e) ^ rotateRight(25,e)
      const ch = (e & f) ^ (~e & g)
      const temp1 = (h + S1 + ch + K[j] + w[j]) >>> 0
      const S0 = rotateRight(2,a) ^ rotateRight(13,a) ^ rotateRight(22,a)
      const maj = (a & b) ^ (a & c) ^ (b & c)
      const temp2 = (S0 + maj) >>> 0
      h=g; g=f; f=e; e=(d+temp1)>>>0; d=c; c=b; b=a; a=(temp1+temp2)>>>0
    }
    H[0]=(H[0]+a)>>>0; H[1]=(H[1]+b)>>>0; H[2]=(H[2]+c)>>>0; H[3]=(H[3]+d)>>>0
    H[4]=(H[4]+e)>>>0; H[5]=(H[5]+f)>>>0; H[6]=(H[6]+g)>>>0; H[7]=(H[7]+h)>>>0
  }
  return H.map(h => h.toString(16).padStart(8,'0')).join('')
}

function md5(input) {
  function safeAdd(x,y){const l=(x&0xffff)+(y&0xffff);return(((x>>16)+(y>>16)+(l>>16))<<16)|(l&0xffff)}
  function rol(n,c){return(n<<c)|(n>>>(32-c))}
  const T=Array.from({length:64},(_,i)=>Math.floor(Math.abs(Math.sin(i+1))*2**32)>>>0)
  const str = unescape(encodeURIComponent(input))
  const bytes = Array.from(str).map(c=>c.charCodeAt(0))
  const origLen = bytes.length * 8
  bytes.push(0x80)
  while (bytes.length % 64 !== 56) bytes.push(0)
  for (let i = 0; i < 8; i++) bytes.push((origLen >>> (i*8)) & 0xff)
  let [a,b,c,d] = [0x67452301,0xefcdab89,0x98badcfe,0x10325476]
  for (let i = 0; i < bytes.length; i += 64) {
    const M = Array.from({length:16},(_,j)=>bytes[i+j*4]|(bytes[i+j*4+1]<<8)|(bytes[i+j*4+2]<<16)|(bytes[i+j*4+3]<<24))
    let [A,B,C,D]=[a,b,c,d]
    const round=(fn,a,b,c,d,k,s,t)=>safeAdd(rol(safeAdd(safeAdd(a,fn(b,c,d)),safeAdd(M[k],T[t])),s),b)
    for(let j=0;j<16;j++){const tmp=D;D=C;C=B;B=round((b,c,d)=>(b&c)|(~b&d),A,B,C,D,j,([7,12,17,22])[j%4],j);A=tmp}
    for(let j=0;j<16;j++){const tmp=D;D=C;C=B;B=round((b,c,d)=>(d&b)|(~d&c),A,B,C,D,(5*j+1)%16,([5,9,14,20])[j%4],j+16);A=tmp}
    for(let j=0;j<16;j++){const tmp=D;D=C;C=B;B=round((b,c,d)=>b^c^d,A,B,C,D,(3*j+5)%16,([4,11,16,23])[j%4],j+32);A=tmp}
    for(let j=0;j<16;j++){const tmp=D;D=C;C=B;B=round((b,c,d)=>c^(b|~d),A,B,C,D,(7*j)%16,([6,10,15,21])[j%4],j+48);A=tmp}
    a=safeAdd(a,A);b=safeAdd(b,B);c=safeAdd(c,C);d=safeAdd(d,D)
  }
  return [a,b,c,d].map(n=>[0,1,2,3].map(b=>((n>>>(b*8))&0xff).toString(16).padStart(2,'0')).join('')).join('')
}

function sha1(msg) {
  function rol(n,s){return((n<<s)|(n>>>(32-s)))>>>0}
  const str=unescape(encodeURIComponent(msg))
  const bytes=Array.from(str).map(c=>c.charCodeAt(0))
  const origLen=bytes.length*8; bytes.push(0x80)
  while(bytes.length%64!==56) bytes.push(0)
  for(let i=7;i>=0;i--) bytes.push((origLen/Math.pow(2,i*8))&0xff)
  let [H0,H1,H2,H3,H4]=[0x67452301,0xEFCDAB89,0x98BADCFE,0x10325476,0xC3D2E1F0]
  for(let i=0;i<bytes.length;i+=64){
    const W=[]
    for(let j=0;j<16;j++) W[j]=(bytes[i+j*4]<<24)|(bytes[i+j*4+1]<<16)|(bytes[i+j*4+2]<<8)|bytes[i+j*4+3]
    for(let j=16;j<80;j++) W[j]=rol(W[j-3]^W[j-8]^W[j-14]^W[j-16],1)
    let [a,b,c,d,e]=[H0,H1,H2,H3,H4]
    for(let j=0;j<80;j++){
      let f,k
      if(j<20){f=(b&c)|(~b&d);k=0x5A827999}
      else if(j<40){f=b^c^d;k=0x6ED9EBA1}
      else if(j<60){f=(b&c)|(b&d)|(c&d);k=0x8F1BBCDC}
      else{f=b^c^d;k=0xCA62C1D6}
      const tmp=(rol(a,5)+f+e+k+W[j])>>>0
      e=d;d=c;c=rol(b,30);b=a;a=tmp
    }
    H0=(H0+a)>>>0;H1=(H1+b)>>>0;H2=(H2+c)>>>0;H3=(H3+d)>>>0;H4=(H4+e)>>>0
  }
  return [H0,H1,H2,H3,H4].map(h=>h.toString(16).padStart(8,'0')).join('')
}

const ALGOS = [
  { id: 'md5',    label: 'MD5',    fn: md5,    bits: '128-bit' },
  { id: 'sha1',   label: 'SHA-1',  fn: sha1,   bits: '160-bit' },
  { id: 'sha256', label: 'SHA-256',fn: sha256, bits: '256-bit' },
]

export default function HashGenerator() {
  const [input, setInput]   = useState('')
  const [results, setResults] = useState({})
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    if (!input.trim()) { setResults({}); return }
    const r = {}
    ALGOS.forEach(a => { try { r[a.id] = a.fn(input) } catch { r[a.id] = 'error' } })
    setResults(r)
  }, [input])

  const copy = (id, val) => {
    navigator.clipboard.writeText(val)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <ToolPage icon="##" title="Hash Generator" description="Generate MD5, SHA-1, and SHA-256 hashes from any text input.">
      <div>
        <label className="block text-xs font-mono text-text-secondary mb-2">// input text</label>
        <textarea
          className="tool-input h-32"
          placeholder="Type or paste text to hash..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3">
        {ALGOS.map(a => (
          <div key={a.id} className="rounded-xl p-4"
               style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold" style={{ color: 'var(--tool-color, #8B5CF6)' }}>{a.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-md font-mono"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>{a.bits}</span>
              </div>
              {results[a.id] && (
                <button className="tool-btn text-xs py-1 px-3" onClick={() => copy(a.id, results[a.id])}>
                  {copied === a.id ? '✓ Copied' : 'Copy'}
                </button>
              )}
            </div>
            <div className="font-mono text-xs break-all leading-relaxed"
                 style={{ color: results[a.id] ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.15)' }}>
              {results[a.id] || 'hash will appear here...'}
            </div>
          </div>
        ))}
      </div>
    </ToolPage>
  )
}