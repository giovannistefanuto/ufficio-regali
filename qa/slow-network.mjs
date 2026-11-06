import { writeFileSync } from 'node:fs';

const [websocketUrl, baseUrl] = process.argv.slice(2);
if (!websocketUrl || !baseUrl) throw new Error('Usage: node qa/slow-network.mjs <owned browser websocket> <local site URL>');
const socket = new WebSocket(websocketUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
let id = 0;
const pending = new Map();
const errors = [];
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.id) { const promise = pending.get(message.id); if (!promise) return; pending.delete(message.id); if (message.error) promise.reject(new Error(message.error.message)); else promise.resolve(message.result); }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
});
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const request = ++id; pending.set(request, { resolve, reject }); socket.send(JSON.stringify({ id: request, method, params, ...(sessionId ? { sessionId } : {}) })); });
const { targetInfos } = await send('Target.getTargets');
const target = targetInfos.find(target => target.type === 'page' && target.url.startsWith(baseUrl));
if (!target) { socket.close(); throw new Error('Open the local site in the owned browser first.'); }
const { sessionId } = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
await send('Network.enable', {}, sessionId);
await send('Network.setCacheDisabled', { cacheDisabled: true }, sessionId);
await send('Runtime.enable', {}, sessionId);
await send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: 50 * 1024, uploadThroughput: 20 * 1024, connectionType: 'cellular3g' }, sessionId);
await send('Emulation.setCPUThrottlingRate', { rate: 4 }, sessionId);
const start = Date.now();
await send('Page.navigate', { url: baseUrl }, sessionId);
let result;
try {
  for (let attempt = 0; attempt < 60; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const evaluation = await send('Runtime.evaluate', { expression: `JSON.stringify({ready:document.readyState==='complete'&&!!document.querySelector('.button-primary'),title:document.querySelector('h1')?.textContent.trim(),cta:document.querySelector('.button-primary')?.textContent.trim(),overflow:document.documentElement.scrollWidth>innerWidth,fonts:document.fonts.status})`, returnByValue: true }, sessionId);
    if (evaluation.result?.value) result = JSON.parse(evaluation.result.value);
    if (result?.ready) break;
  }
  result = { ...result, elapsedMs: Date.now() - start, javascriptErrors: errors, network: { latencyMs: 400, downloadKBps: 50, uploadKBps: 20, cache: 'disabled', cpuSlowdown: 4 } };
  writeFileSync('qa/slow-network-result.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result));
  if (!result.ready || result.overflow || errors.length) process.exitCode = 1;
} finally {
  await send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }, sessionId);
  await send('Network.setCacheDisabled', { cacheDisabled: false }, sessionId);
  await send('Emulation.setCPUThrottlingRate', { rate: 1 }, sessionId);
  socket.close();
}
