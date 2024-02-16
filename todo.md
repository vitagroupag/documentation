# Docusaurus

### Tasks

- [ ] Organzize folders for final structure
- [ ] Create a example page with lots of features for others to copy
- [ ] Check if "Blogs" is a solution to make release notes?
- [ ] Version support should be added!
- [ ] Set i18n Support for EN as start with automatic translation pipeline
- [ ] Setup Build pipeline for build, translate
- [ ] Switch the dockerfile from sphinx to docusaurus
- [ ] Think about how to make different versions (ehrbase, hip ehrbase & hip cdr) work together

### Deployment

Build is trigger on development and main. There

- [ ] Jenkins job needs to be changed
  - [ ] Image name and tag (like docker)
- [ ] NodeJS Configuration in jenkins? Node env path?
- [ ] Maybe set ENV to production
- [ ] set npm ci

## Help to translate MD files

This helps to generally bring text compatible to Markdown

```bash
brew install pandoc --cask
pandoc -s inputfile.rst -o outputfile.md
```
