# How to contribute

## Contributing to the project

### Reporting issues

If you find a bug or have a feature request, please report them at this repository's issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. If you discover a security vulnerability, please send an e-mail to one of the project maintainers directly.

### Submitting changes

Please send a GitHub Pull Request to this repository with a clear list of what you've done (read more about [pull requests](https://docs.github.com/en/pull-requests)). When you send a pull request, we will love you forever if you include unit tests. We can always use more test coverage. Please follow our coding conventions and make sure all of your commits are atomic (one feature per commit).

Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

```bash
git commit -m "A brief summary of the commit"
```

If your commit fixes an open issue, you can reference it in the commit message like this:

```bash
git commit -m "A brief summary of the commit fixes #123"
```

### Coding conventions

Start reading our code and you'll get the hang of it. We optimize for readability:

- We indent using two spaces (soft tabs)
- We use [Prettier](https://prettier.io/) for code formatting
- We use [TypeScript](https://www.typescriptlang.org/) for type checking.
- We use [Jest](https://jestjs.io/) for unit testing.

### Semantic Versioning

This project follows [Semantic Versioning](https://semver.org/). We release patch versions for bugfixes, minor versions for new features, and major versions for any breaking changes. When you contribute, you should increase the appropriate version number in the `package.json` file, and the `CHANGELOG.md` file.

### License

By contributing to this project, you agree that your contributions will be licensed under its [MIT license](LICENSE.md). This is to protect the project and its users from harm, and to ensure that the project continues to be free for all to use.
