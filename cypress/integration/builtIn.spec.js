import expect from 'expect';
import { LOREM, DELETE_ALL } from '../constants/index.js';
import setAttr from '../helpers/setAttr.js';
import setProp from '../helpers/setProp.js';
import setStyleProp from '../helpers/setStyleProp.js';
import Logger from '../helpers/Logger.js';

let logger;

describe('Built-in Element', () => {
  beforeEach(() => {
    cy.visit('/');
    logger = new Logger();
  });

  it('Grows when text is typed', () => {
    cy.get('textarea')
      .then(logger.log('clientHeight'))
      .focus()
      .type(LOREM)
      .then(logger.log('clientHeight'))
      .then(() => {
        const [initialHeight, finalHeight] = logger.logs;
        expect(finalHeight).toBeGreaterThan(initialHeight);
      });
  });

  it('Shrinks when text is deleted', () => {
    cy.get('textarea')
      .focus()
      .then(logger.log('clientHeight'))
      .type(LOREM)
      .type(DELETE_ALL)
      .then(logger.log('clientHeight'))
      .then(() => {
        const [initialHeight, finalHeight] = logger.logs;
        expect(finalHeight).toBe(initialHeight);
      });
  });

  it('Grows when text is set programmatically', () => {
    cy.get('textarea')
      .then(logger.log('clientHeight'))
      .then(setProp('value', LOREM))
      .then(logger.log('clientHeight'))
      .then(() => {
        const [initialHeight, finalHeight] = logger.logs;
        expect(finalHeight).toBeGreaterThan(initialHeight);
      });
  });

  it('Shrinks when text is deleted programmatically', () => {
    cy.get('textarea')
      .then(logger.log('clientHeight'))
      .then(setProp('value', LOREM))
      .then(setProp('value', ''))
      .then(logger.log('clientHeight'))
      .then(() => {
        const [initialHeight, finalHeight] = logger.logs;
        expect(finalHeight).toBe(initialHeight);
      });
  });

  it('Respects a minimum height when the rows attribute is set', () => {
    cy.get('textarea')
      .then(setAttr('rows', 2))
      .then(logger.log('clientHeight'))
      .focus()
      .type(LOREM)
      .type(DELETE_ALL)
      .then(logger.log('clientHeight'))
      .then(() => {
        const [initialHeight, finalHeight] = logger.logs;
        expect(finalHeight).toBe(initialHeight);
      });
  });

  it('Respects a minimum height when its style property is set', () => {
    cy.get('textarea')
      .then(setStyleProp('height', '65px'))
      .then(logger.log('clientHeight'))
      .focus()
      .type(LOREM)
      .type(DELETE_ALL)
      .then(logger.log('clientHeight'))
      .then(() => {
        const [initialHeight, finalHeight] = logger.logs;
        expect(finalHeight).toBe(initialHeight);
      });
  });
});
