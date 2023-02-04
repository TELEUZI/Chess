import { setUpServer, tearDownServerItems } from './server';

const signalsToCatch: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

setUpServer()
  .then((serverItems) => {
    let tornDown = false;
    signalsToCatch.forEach((signal) => {
      process.once(signal, () => {
        if (tornDown) return;
        tornDown = true;
        tearDownServerItems(serverItems).catch((error) => {
          console.error('Error on shutdown', error);
        });
      });
    });
  })
  .catch((error) => {
    console.error('Error on starting', error);
  });
