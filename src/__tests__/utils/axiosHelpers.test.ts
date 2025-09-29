import '@testing-library/jest-dom';
import { basicHeaders } from '../../js/utils/axiosHelpers';

import * as goldifySoloFixtures from '../../__fixtures__/GoldifySoloFixtures';
import * as axiosHeadersFixtures from '../../__fixtures__/axiosHelpersFixtures';

test('basicHeaders returns a properly formatted header', async () => {
  const headers = basicHeaders(goldifySoloFixtures.getTokensTestData());
  expect(headers).toEqual(axiosHeadersFixtures.basicHeaders());
}); 