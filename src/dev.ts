// THIS CODE IS USED ONLY DEV, NO USE IN BUILD OR PRODUCTION
// NEED CONFIGURE .ENV FILE

import dotenv from 'dotenv';
import { createTagAndRelease } from './createTagAndRelease';

dotenv.config();

const owner = 'gabrielogregorio';
const repo = 'test';

createTagAndRelease({
  tag_name: 'test',
  name: 'release name',
  body: 'example body',
  draft: false,
  prerelease: false,
  target_commitish: 'main',
  owner,
  repo,
  discussion_category_name: 'Announcements',
  generate_release_notes: true,
  make_latest: 'true',
});
