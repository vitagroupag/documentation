import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Vendor Neutral",
    Svg: require("@site/static/img/open.svg").default,
    description: (
      <>
        Through international open standards such as FHIR, openEHR. Plus: data stored in open source licensed system components.
      </>
    ),
  },
  {
    title: "Highly Scalable",
    Svg: require("@site/static/img/server.svg").default,
    description: (
      <>
        Scale your e-health infrastructure effortlessly with HIP. Experience unparalleled scalability from applications to extensive e-health systems, powered
        by next-generation databases.
      </>
    ),
  },
  {
    title: "Built to Build",
    Svg: require("@site/static/img/code.svg").default,
    description: (
      <>Comprehensive options for effective implementation of your project requirements thanks to the expandable data model and powerful developer tools.</>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center">
          <img width='70%' src="/img/Logo_EHRBASE_open_source.png" alt="HIP CDR Logo" className="logo" />
        </div>
      </div>
    </section>
  );
}