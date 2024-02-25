"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRelease = void 0;
var _core = require("@octokit/core");
var _core2 = _interopRequireDefault(require("@actions/core"));
var _github = require("@actions/github");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const authToken = process.env.GITHUB_TOKEN;
console.log('starting create release');

// https://github.com/octokit/core.js#readme
const octokit = new _core.Octokit({
  auth: authToken
});
const getInputs = () => {
  const tag_name = _core2.default.getInput('tag_name', {
    required: true
  }).replace('refs/tags/', '');
  const release_name = _core2.default.getInput('release_name', {
    required: false
  }).replace('refs/tags/', '');
  const body = _core2.default.getInput('body', {
    required: false
  });
  return {
    tag_name,
    release_name,
    body
  };
};
const createRelease = async () => {
  try {
    const inputs = getInputs();
    console.log('inputs', JSON.stringify(inputs));
    const {
      owner,
      repo
    } = _github.context.repo;
    console.log('repo config', JSON.stringify({
      owner,
      repo
    }));

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
      }
    });
    console.log('tag create as success');
    console.log('get outputs');
    const {
      data: {
        id: releaseId,
        html_url: htmlUrl,
        upload_url: uploadUrl
      }
    } = createReleaseResponse;
    const outputs = {
      releaseId,
      htmlUrl,
      uploadUrl
    };
    console.log('outputs', JSON.stringify(outputs));

    // https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    _core2.default.setOutput('id', outputs.releaseId);
    _core2.default.setOutput('html_url', outputs.htmlUrl);
    _core2.default.setOutput('upload_url', outputs.uploadUrl);
  } catch (error) {
    // @ts-ignore
    _core2.default.setFailed(error.message);
  }
};
exports.createRelease = createRelease;
createRelease();