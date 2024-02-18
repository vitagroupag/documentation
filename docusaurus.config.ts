import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "HIP Documentation",
  tagline: "EHRbase, HIP EHRbase and HIP CDR Documentation",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://your-docusaurus-site.example.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "docusaurus", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          path: "releases",
          routeBasePath: "releases",
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
    [
      "redocusaurus",
      {
        specs: [
          {
            id: "hip-ehrbase-definition",
            spec: "api/definition-validation.openapi.yaml",
            route: "/api/hip-ehrbase/definition",
          },
          {
            id: "hip-ehrbase-admin",
            spec: "api/ehrbase_admin_api.yml",
            route: "/api/hip-ehrbase/admin",
          },
          {
            id: "hip-ehrbase-query",
            spec: "api/query-codegen.openapi.yaml",
            route: "/api/hip-ehrbase/query",
          },
          {
            id: "hip-ehrbase-enterprise",
            spec: "api/enterprise_api.yml",
            route: "/api/hip-ehrbase/enterprise",
          },
          {
            id: "cdr-bridge",
            spec: "api/mapping.json",
            route: "/api/cdr-bridge/mappings",
          },
          {
            id: "cdr-bridge-demographics",
            spec: "api/demographics.yml",
            route: "/api/cdr-bridge/demographics",
          },
        ],
        theme: {
          // Change with your site colors
          primaryColor: "#720035",
        },
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "HIP CDR",
      logo: {
        alt: "My Site Logo",
        src: "img/signet.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Docs",
        },
        {
          type: "dropdown",
          label: "EHRbase API",
          position: "left",
          items: [
            {
              label: "Query API",
              to: "/api/hip-ehrbase/query",
            },
            {
              label: "Definition API",
              to: "/api/hip-ehrbase/definition",
            },
            {
              label: "Admin API",
              to: "/api/hip-ehrbase/admin",
            },
            {
              label: "Enterprise APIs",
              to: "/api/hip-ehrbase/enterprise",
            }
          ],
        },
        {
          type: "dropdown",
          label: "CDR Bridge API",
          position: "left",
          items: [
            {
              label: "CDR Bridge",
              to: "/api/cdr-bridge/mappings",
            },
            {
              label: "Demographics",
              to: "/api/cdr-bridge/demographics",
            },
          ],
        },
        { to: "/releases", label: "Releases", position: "left" },
        {
          href: "https://github.com/ehrbase/ehrbase",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Tutorial",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/docusaurus",
            },
            {
              label: "Discord",
              href: "https://discordapp.com/invite/docusaurus",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/docusaurus",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/facebook/docusaurus",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} vitagroup.`,
    },
    // See available themes on prismThemes object
    prism: {
      theme: prismThemes.nightOwlLight,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json", "yaml"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
