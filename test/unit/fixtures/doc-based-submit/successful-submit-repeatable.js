import assert from 'assert';
import nock from 'nock';

const thankYouMessage = 'thank you for submitting the form';

const scope = nock('https://forms.adobe.com')
  .matchHeader('Content-Type', 'application/json')
  .matchHeader('x-adobe-form-hostname', undefined)
  .post('/adobe/forms/af/submit//submit-success-repeatable.json', function test(body) {
    // using a function syntax here instead of array because the this parameter is
    // set during the call
    const contentType = this.headers['content-type'];
    assert.equal(contentType, 'application/json', 'content type not set to application/json');
    const { data } = body;
    assert.equal(Object.keys(data).length, 5, 'more data received than expected');
    assert.equal(data.f1, '10,20');
    assert.equal(data.f2, '102,202');
    assert.equal(data.f3, 'checkbox');
    assert.equal(data.f4, 'radio-on');
    // eslint-disable-next-line no-underscore-dangle
    assert.equal(data.__id__.toString().length > 0, true, 'id not present');
    return true;
  })
  .reply(200, {
    thankYouMessage,
  });

export const formPath = 'http://localhost:3000/submit-success-repeatable.json';

export const sample = {
  total: 3,
  offset: 0,
  limit: 11,
  ':type': 'sheet',
  data: [
    {
      Type: 'fieldset',
      Name: 'panel1',
      Repeatable: 'true',
    },
    {
      Type: 'text',
      Name: 'f2',
      Fieldset: 'panel1',
    },
    {
      Type: 'text',
      Name: 'f1',
      Fieldset: 'panel1',
    },
    {
      Type: 'checkbox',
      Name: 'f3',
      Value: 'checkbox',
    },
    {
      Type: 'radio',
      Name: 'f4',
      Value: 'radio-on',
    },
    {
      Type: 'radio',
      Name: 'f4',
      Value: 'radio-off',
    },
    {
      Type: 'submit',
      Name: 'submit',
      Label: 'Submit',
    },
  ],
};

export function op(block) {
  global.window = Object.create(window);

  const f3 = block.querySelector('input[name="f3"]');
  f3.click();
  const f4 = block.querySelector('input[type="radio"]');
  f4.click();

  // repeat panel
  const btn = block.querySelector('.repeat-wrapper > .repeat-actions > .item-add');
  btn.click();
  const f1Repeat = block.querySelectorAll('input[name="f1"]');
  f1Repeat[0].value = '10';
  f1Repeat[1].value = '20';
  const f2Repeat = block.querySelectorAll('input[name="f2"]');
  f2Repeat[0].value = '102';
  f2Repeat[1].value = '202';

  const form = block.querySelector('form');
  form.dispatchEvent(new Event('submit'));
}

export function expect() {
  assert.equal(scope.isDone(), true, 'submit call was not made');
  // const el = block.querySelector('.form-message.success-message');
  // assert.equal(el.textContent, thankYouMessage);
}

export const opDelay = 200;
