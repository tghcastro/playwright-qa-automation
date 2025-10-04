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

          // Check if Allure test is active
          if (allure.runtime?.currentTest) {
            // Wrap original method to add Allure Step with masked parameters
            return allure.step(
              `${this.constructor.name}.${name}(${safeArgs.join(', ')})`,
              async () => {
                return await original.apply(this, args);
              }
            );
          } else {
            // Outside test context → just call the method normally
            return await original.apply(this, args);
          }
        };
      }
    }
  }
}
