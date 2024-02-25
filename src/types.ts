export type ReleaseInputs = {
  tag_name: string;
  release_name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  target_commitish: string;
  owner: string;
  repo: string;
  discussion_category_name?: string;
  generate_release_notes: boolean;
  make_latest: string;
};
