import { Octokit } from '@octokit/core';
import * as core from '@actions/core';
import fetch from 'node-fetch';
import { ReleaseInputs } from './types';

const connectOctokit = () => {
  const { GITHUB_TOKEN } = process.env;

  // https://github.com/octokit/core.js#readme
  return new Octokit({
    auth: GITHUB_TOKEN,
    request: { fetch },
  });
};

export const createTagAndRelease = async (inputs: ReleaseInputs) => {
  console.log('create tag and release with inputs', JSON.stringify(inputs));
  const octokit = connectOctokit();

  // https://docs.github.com/pt/rest/releases/releases?apiVersion=2022-11-28#create-a-release
  const response = await octokit.request(`POST /repos/${inputs.owner}/${inputs.repo}/releases`, {
    owner: inputs.owner,
    repo: inputs.repo,
    tag_name: inputs.tag_name,
    target_commitish: inputs.target_commitish,
    name: inputs.release_name,
    body: inputs.body,
    draft: inputs.draft,
    prerelease: inputs.prerelease,
    discussion_category_name: inputs.discussion_category_name,
    generate_release_notes: inputs.generate_release_notes,
    make_latest: inputs.make_latest,
  });

  console.log('tag and release create with success');

  const { data } = response;
  const outputs = {
    id: data.id,
    status: response.status,
    url: data.url,
    assets_url: data.assets_url,
    upload_url: data.upload_url,
    html_url: data.html_url,
    author: data.author.login,
    tag_name: data.tag_name,
    target_commitish: data.target_commitish,
    name: data.name,
    draft: data.draft,
    prerelease: data.prerelease,
    created_at: data.created_at,
    published_at: data.published_at,
    body: data.body,
    assets: data.assets,
    discussion_url: data.discussion_url,
  };

  console.log('outputs', JSON.stringify(outputs));

  // https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
  core.setOutput('id', outputs.id);
  core.setOutput('status', outputs.status);
  core.setOutput('url', outputs.url);
  core.setOutput('assets_url', outputs.assets_url);
  core.setOutput('upload_url', outputs.upload_url);
  core.setOutput('html_url', outputs.html_url);
  core.setOutput('author', outputs.author);
  core.setOutput('tag_name', outputs.tag_name);
  core.setOutput('target_commitish', outputs.target_commitish);
  core.setOutput('name', outputs.name);
  core.setOutput('draft', outputs.draft);
  core.setOutput('prerelease', outputs.prerelease);
  core.setOutput('created_at', outputs.created_at);
  core.setOutput('published_at', outputs.published_at);
  core.setOutput('body', outputs.body);
  core.setOutput('assets', outputs.assets);
  core.setOutput('discussion_url', outputs.discussion_url);
};
