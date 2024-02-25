import { Octokit } from '@octokit/core';
import * as core from '@actions/core';
import { context } from '@actions/github';
import fetch from 'node-fetch';

const authToken = process.env.GITHUB_TOKEN;

console.log('starting create release');

// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: authToken,
  request: {
    userAgent: 'gabrielogregorio/create-release-and-tag/v2.0.0',
    fetch,
  },
});

const getInputs = () => {
  const tag_name = core.getInput('tag_name', { required: true }).replace('refs/tags/', '');
  const release_name = core.getInput('release_name', { required: false }).replace('refs/tags/', '');
  const body = core.getInput('body', { required: false });

  return {
    tag_name,
    release_name,
    body,
  };
};

export const createRelease = async () => {
  try {
    const inputs = getInputs();

    console.log('inputs', JSON.stringify(inputs));

    const { owner, repo } = context.repo;
    console.log('repo config', JSON.stringify({ owner, repo }));

    // https://docs.github.com/pt/rest/releases/releases?apiVersion=2022-11-28#create-a-release
    const createReleaseResponse = await octokit.request(`POST /repos/${owner}/${repo}/releases`, {
      owner,
      repo,
      tag_name: inputs.tag_name,
      target_commitish: 'main',
      name: inputs.release_name,
      body: inputs.body,
      draft: false,
      prerelease: false,
      generate_release_notes: false,
      headers: {
        //   'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    console.log('tag create as success');

    console.log('get outputs');
    const {
      data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl },
    } = createReleaseResponse;

    const outputs = {
      releaseId,
      htmlUrl,
      uploadUrl,
    };

    console.log('outputs', JSON.stringify(outputs));

    // https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    core.setOutput('id', outputs.releaseId);
    core.setOutput('html_url', outputs.htmlUrl);
    core.setOutput('upload_url', outputs.uploadUrl);
  } catch (error) {
    // @ts-ignore
    if (error?.response?.data?.message === 'Resource not accessible by integration') {
      core.setFailed(
        'Error you need to give permissions for this action to create a release and a tag. Access Actions > General > Workflow permissions > (choice) Read and write permissions > [Save]',
      );
    } else {
      console.log('unknown error', error);
      // @ts-ignore
      core.setFailed(error.message);
    }
  }
};

createRelease();
