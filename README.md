# HIP Documentation

This website is built using [Docusaurus](https://docusaurus.io/). It will serve as the integrated documentation, shipped together with HIP CDR and HIP EHRbase for customers and integration partners.

**Docusaurus** Learn about the most important Docusaurus concepts here: [Docusaurus Docs](https://docusaurus.io/docs/category/guides)

**Markown Cheatsheet** Markdown is a method for writing formatted text using a simple plain text format, to see all the possible formats, check out this: [Cheatsheet](https://github.com/lifeparticle/Markdown-Cheatsheet)

**MDX** MDX lets you use JSX in your markdown content. You can import components, such as interactive charts or alerts, and embed them within your content. To see what it can do: [MDX](https://mdxjs.com/)

### Local Development

To add content first clone and install the project:

```
cd docs
npm install
```

To run the project with:

```
npm run start
```

_Important notice_ Before committing your changes, please run the `build` to make sure all links and changes are working

```
npm run build
```

### Docker for developement

```
docker build --target development -t docs:dev .
docker run -p 3000:3000 docs:dev
```

### Docker for production

```
docker build -t docusaurus:latest .
docker run --rm -p 3000:80 docusaurus:latest
```
