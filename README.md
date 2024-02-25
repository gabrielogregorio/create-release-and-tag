test
Actions.yml https://docs.github.com/pt/actions/creating-actions/metadata-syntax-for-github-actions


Actions > Runners > Workflow permissions > Read and write permissions > [save]


# GitHub Action - Create tag and release

Essa action foi feita para usar a documentação oficial do github para a criação de releases [https://docs.github.com/pt/rest/releases/releases?apiVersion=2022-11-28#create-a-release](https://docs.github.com/pt/rest/releases/releases?apiVersion=2022-11-28#create-a-release)

Esta ação do GitHub (escrita em JavaScript) envolve a [API de lançamento do GitHub](https://developer.github.com/v3/repos/releases/), especificamente a [Criar uma versão](https://developer.github. com/v3/repos/releases/#create-a-release), para permitir que você aproveite GitHub Actions para criar versões.


## Usage
### Pré requisitos

Crie um arquivo `.yml` no diretório `.github/workflows`.


```yml
name: create tag and release on merge pr
on:
  push:
    branches: [main]
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  create-release:
    if: (github.event_name == 'push' && github.ref == 'refs/heads/main') || (github.event_name == 'pull_request' && github.event.pull_request.merged == true)
    runs-on: ubuntu-latest
    steps:
      - name: create release and tag
        uses: gabrielogregorio/create-tag-and-release@v1.0.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v1.0.0
          release_name: Release V1.0.0
          body: |
            Release content
          draft: false
          prerelease: false
```

Ou você pode usar um exemplo mais sofisticado, que cria a release com o conteudo do README, cria as tags e versões de acordo com o seu package.json [usamos esse yml para criar as tags e releases desse projeto](./.github/workflows/create-tag-and-release.yml).

### Inputs
- `tag_name`: (REQUIRED) The name of the tag.
- `release_name`: The name of the release.
- `body`: body of release
- `body_path`: file that will contain the release body. If informed, body will be disregarded
- `draft`: true to create a draft (unpublished) release, false to create a published one. Default: false
- `prerelease`:true to identify the release as a prerelease. false to identify the release as a full release. Padrão: false
- `target_commitish`: Specifies the commitish value that determines where the Git tag is created from. Can be any branch or commit SHA. Unused if the Git tag already exists. Default: the repository's default branch.
- `owner`:The account owner of the repository. The name is not case sensitive. Default Current repository
- `repo`:The name of the repository without the .git extension. The name is not case sensitive. Default Current owner
- `discussion_category_name`: If specified, a discussion of the specified category is created and linked to the release. The value must be a category that already exists in the repository. For more information, see "Managing categories for discussions in your repository."
- `generate_release_notes`:Whether to automatically generate the name and body for this release. If name is specified, the specified name will be used; otherwise, a name will be automatically generated. If body is specified, the body will be pre-pended to the automatically generated notes. Padrão: false
- `make_latest`:Specifies whether this release should be set as the latest release for the repository. Drafts and prereleases cannot be set as latest. Defaults to true for newly published releases. legacy specifies that the latest release should be determined based on the release creation date and higher semantic version. Padrão: true


### Outputs

- id
- status
- url
- assets_url
- upload_url
- html_url
- author
- tag_name
- target_commitish
- name
- draft
- prerelease
- assets
- body
- discussion_url
- published_at
- created_at

### Example workflow with body_path and discussion_category_name or merge or push in MAIN branch

```yml
name: create tag and release on merge

on:
  push:
    branches: [main]
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  create-release:
    if: (github.event_name == 'push' && github.ref == 'refs/heads/main') || (github.event_name == 'pull_request' && github.event.pull_request.merged == true)
    runs-on: ubuntu-latest
    steps:
      - name: checkout
        uses: actions/checkout@v3
        with:
          ref: main

      - name: set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20.x

      - name: create release and tag
        uses: gabrielogregorio/create-tag-and-release@v1.1.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v5.1.2
          release_name: Release Name - v5.1.2
          body_path: './docs/example.md'
          make_latest: true
          generate_release_notes: true
          draft: false
          prerelease: false
          discussion_category_name: 'Announcements'
```

Example using version in package.json and pull request content
```yml

name: create tag and release on merge pr

on:
  push:
    branches: [main]
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  create-release:
    runs-on: ubuntu-latest
    steps:
      - name: checkout
        uses: actions/checkout@v3
        with:
          ref: main

      - name: set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20.x

      - name: set config tag and release
        id: update-pr-content
        run: |
          PR_TITLE="${{ github.event.pull_request.title }}"
          PR_BODY="${{ github.event.pull_request.body }}"
          PACKAGE_VERSION=$(node -p "require('./package.json').version")

          if [ "${{ github.event_name }}" = "pull_request" ]; then
            PR_TITLE="${{ github.event.pull_request.title }}"
            PR_BODY="${{ github.event.pull_request.body }}"
            BODY_RELEASE="${PR_TITLE}: ${PR_BODY}"
          else
            BODY_RELEASE="Release ${TAG_NAME}"
          fi

          TAG_NAME="v${PACKAGE_VERSION}"
          echo "TAG_NAME=$TAG_NAME" >> $GITHUB_ENV

          RELEASE_NAME="v${PACKAGE_VERSION}"
          echo "RELEASE_NAME=$RELEASE_NAME" >> $GITHUB_ENV

      - name: create tag and release
        uses: gabrielogregorio/create-tag-and-release@v1.2.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ env.TAG_NAME }}
          release_name: ${{ env.RELEASE_NAME }}
          body: |
            ${{ env.BODY_RELEASE }}
          make_latest: true
          generate_release_notes: true
          draft: false
          prerelease: false
          discussion_category_name: 'Announcements'
```


## Contributing
We would love you to contribute to `@actions/create-release`, pull requests are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

