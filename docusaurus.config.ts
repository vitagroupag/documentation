import {themes as prismThemes} from "prism-react-renderer";
import type {Config} from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
    title: "EHRbase Docs",
    tagline: "EHRbase Open-source and HIP EHRbase",
    favicon: "img/favicon.ico",

    // Set the production url of your site here
    url: "https://docs.ehrbase.org",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "vitagroup", // Usually your GitHub org/user name.
    projectName: "EHRbase", // Usually your repo name.

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
                },
                blog: {
                    path: "releases",
                    routeBasePath: "releases",
                    showReadingTime: true,
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
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
                        id: "hip-ehrbase-admin",
                        spec: "api/ehrbase-admin.json",
                        route: "/api/hip-ehrbase/admin",
                    },
                    {
                        id: "hip-ehrbase-enterprise",
                        spec: "api/hip-ehrbase-enterprise.yml",
                        route: "/api/hip-ehrbase/enterprise",
                    },
                    {
                        id: "hip-ehrbase-ehr",
                        spec: "api/ehrbase-openehr.json",
                        route: "/api/hip-ehrbase/openehr",
                    },
                    {
                        id: "hip-ehrbase-tags",
                        spec: "api/ehrbase-tags-experimental.json",
                        route: "/api/hip-ehrbase/tags",
                    }
                ],
                theme: {
                    // Change with your site colors
                    primaryColor: "#E62249"
                },
            },
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        image: "img/docusaurus-social-card.jpg",
        navbar: {
            title: "EHRbase",
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
                            label: "openEHR APIs",
                            to: "/api/hip-ehrbase/openehr",
                        },
                        {
                            label: "Admin API",
                            to: "/api/hip-ehrbase/admin",
                        },
                        {
                            label: "Item Tag API",
                            to: "/api/hip-ehrbase/tags",
                        },
                        {
                            label: "Enterprise APIs",
                            to: "/api/hip-ehrbase/enterprise",
                        },
                    ],
                },
                {
                    href: "https://sandkiste.ehrbase.org",
                    label: "Sandbox",
                    position: "left"
                },
                /* { to: "/releases", label: "Releases", position: "left" }, Excluded until ready*/
                {
                    href: "https://github.com/ehrbase/ehrbase",
                    label: "GitHub",
                    position: "right",
                    className: "header-github-link",
                },
            ],
        },
        colorMode: {
            defaultMode: "dark",
            disableSwitch: true,
            respectPrefersColorScheme: false,
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "Community",
                    items: [
                        {
                            label: "openEHR Discourse Forum",
                            href: "https://discourse.openehr.org/tag/ehrbase",
                        },
                    ],
                },
                {
                    title: "More",
                    items: [
                        {
                            label: "HIP Website",
                            href: "https://hip.vitagroup.ag",
                        },
                    ],
                },
                {
                    title: "Legal",
                    items: [
                        {
                            label: "Imprint",
                            href: "https://www.ehrbase.org/imprint/"
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} vitagroup.`,
        },
        // See available themes on prismThemes object
        prism: {
            darkTheme: prismThemes.dracula,
            additionalLanguages: ["bash", "json", "yaml", "java"],
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
