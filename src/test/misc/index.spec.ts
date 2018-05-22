import { showDeprecationWarning } from '~/services/utils';

describe('showDeprecationWarning', () => {
  it('Will not show deprecation warning twice for the same object', async () => {
    const object = {};
    const watcher = jest.fn();
    showDeprecationWarning('Test', object, watcher);
    showDeprecationWarning('Test', object, watcher);

    expect(watcher).toHaveBeenCalledTimes(1);
  });
});
