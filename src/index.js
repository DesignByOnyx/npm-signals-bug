import { execSync } from 'node:child_process';

/** Create a long running process... */
const timer = setTimeout(() => {}, 999999999);
const killSignals = ['SIGINT', 'SIGTERM', 'SIGHUP'];

/** 
 * Listens for known kill signals and returns a method to unsubscribe all listeners. 
 * @param {NodeJS.SignalsListener} callback
 */
const listenForKillSignal = (callback) => {
  killSignals.forEach((signal) => process.on(signal, callback));

  return function off() {
    killSignals.forEach((signal) => process.off(signal, callback));
  };
};

const off = listenForKillSignal((sig) => {
  console.log('Kill signal received:', sig);
  clearTimeout(timer);
  off();
});

const nodeV = execSync('node -v').toString().replace(/[\n]+/, '');
const npmV = execSync('npm -v').toString().replace(/[\n]+/, '');
console.log('Node:', nodeV, '\nNPM:', npmV);

console.log('App started, listening for signals...')
