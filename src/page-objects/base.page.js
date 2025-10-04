import * as allure from 'allure-js-commons';

export default class BasePage {
  constructor() {
    const proto = Object.getPrototypeOf(this);
    for (const name of Object.getOwnPropertyNames(proto)) {
      if (name === 'constructor') continue;
      const original = this[name];
      if (typeof original === 'function') {
        this[name] = async (...args) => {
          // Mask Username and Password
          const safeArgs = name.toLowerCase().includes('password')
            ? args.map(() => '***')
            : name.toLowerCase().includes('username')
              ? args.map((x) => x.substring(0, 3) + '***')
              : args;

          // Wrap original method to add Allure Step with parameters masking credentials
          return allure.step(
            `${this.constructor.name}.${name}(${safeArgs.join(', ')})`,
            async () => {
              return await original.apply(this, args);
            }
          );
        };
      }
    }
  }
}
