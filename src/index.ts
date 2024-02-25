import * as core from '@actions/core';
import { createTagAndRelease } from './createTagAndRelease';
import { fetchInputs } from './fetchInputs';
import { ReleaseInputs } from './types';

export const main = async (inputsDefault?: ReleaseInputs) => {
  try {
    const inputs = inputsDefault || fetchInputs();
    console.log('starting create tag and release ');

    await createTagAndRelease(inputs);
  } catch (error: any) {
    const code = error?.response?.data.errors?.[0]?.code;
    const field = error?.response?.data.errors?.[0]?.field;

    if (code === 'already_exists') {
      core.setFailed(`"${field}" already exists`);
      return;
    }

    if (error?.response?.data?.message === 'Resource not accessible by integration') {
      core.setFailed(
        'you need to give permissions for this action to create a release and a tag. Access Actions > General > Workflow permissions > (choice) Read and write permissions > [Save]',
      );
      return;
    }

    console.log('unknown error', error);
    core.setFailed(error.message);
  }
};

main();
