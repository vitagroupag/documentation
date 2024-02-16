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
    title: "Open Source",
    Svg: require("@site/static/img/open.svg").default,
    description: (
      <>
        Discover the power of open-source with HIP EHRbase. A flexible and extendable solution designed for robust, future-proof, and sustainable digital healthcare
        projects."
      </>
    ),
  },
  {
    title: "Highly Scalable",
    Svg: require("@site/static/img/server.svg").default,
    description: (
      <>
        Scale your e-health infrastructure effortlessly with HIP EHRbase. Experience unparalleled scalability from applications to extensive e-health systems, powered
        by next-generation databases
      </>
    ),
  },
  {
    title: "Deploy anywhere",
    Svg: require("@site/static/img/code.svg").default,
    description: (
      <>Deploy your digital healthcare solutions anywhere with HIP EHRbase.Compatible with servers, VMs or Kubernetes. HIP EHRbase is also certified for OpenShift</>
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
        <div className="text--center margin-bottom--lg">
          <Heading as="h2" className="features__title">
            Discover HIP EHRbase
          </Heading>
        </div>
        <div className="text--center margin-bottom--lg">
          <p className="features__subtitle">The reliable and powerful openEHR server</p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
