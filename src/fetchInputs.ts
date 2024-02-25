import * as core from '@actions/core';
import { context } from '@actions/github';
import fs from 'fs';
import { ReleaseInputs } from './types';

export const fetchInputs = (): ReleaseInputs => {
  const tag_name = core.getInput('tag_name', { required: true });
  const name = core.getInput('name', { required: false });
  const body_raw = core.getInput('body', { required: false });
  const draft = core.getInput('draft', { required: false }) === 'true';
  const prerelease = core.getInput('prerelease', { required: false }) === 'true';
  const target_commitish = core.getInput('target_commitish', { required: false }) || context.sha;
  const body_path = core.getInput('body_path', { required: false });

  let body = body_raw;
  if (body_path?.trim()) {
    try {
      body = fs.readFileSync(body_path, { encoding: 'utf8' });
    } catch (error: any) {
      core.setFailed(error.message);
    }
  }

  const owner = core.getInput('owner', { required: false }) || context.repo.owner;
  const repo = core.getInput('repo', { required: false }) || context.repo.repo;
  const discussion_category_name = core.getInput('discussion_category_name', { required: false });
  const generate_release_notes = core.getInput('generate_release_notes', { required: false }) === 'true';
  const make_latest = (core.getInput('repo', { required: false }) === 'true').toString();

  return {
    tag_name,
    name,
    body,
    draft,
    prerelease,
    target_commitish,
    owner,
    repo,
    discussion_category_name,
    generate_release_notes,
    make_latest,
  };
};
