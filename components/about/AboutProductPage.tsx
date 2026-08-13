import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { globalClassNames as styles } from "@/lib/global-class-names";

export function AboutProductPage({ story }: { story: ReactNode }) {
  return (
    <div className={styles.page} data-style-scope="about-product-page">
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span>Educational product design - curriculum systems</span>
          <h1>
            I make complex learning content
            <br />
            <em>clear enough to use.</em>
          </h1>
          <p>
            Old MacDonald Had a School is both my company-s teacher-resource
            product and a working demonstration of how I combine curriculum
            thinking, research, content architecture, visual storytelling, and
            frontend design.
          </p>
          <div className={styles.actions}>
            <Link href="/#browse-by-subject">Explore the product</Link>
            <Link href="/branding">See the brand system</Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <Image
            src="/scenes/home-schoolhouse-classroom-hero-v1.png"
            alt="Old MacDonald and the farm-school class learning together"
            width={1200}
            height={800}
            priority
          />
          <div className={styles.pinnedNote}>
            <span>The work</span>
            <strong>Research becomes a system.</strong>
            <small>A system becomes something teachers can actually use.</small>
          </div>
        </div>
      </section>

      <section className={styles.promise}>
        <header>
          <span>What I bring to a team</span>
          <h2>I connect educational substance with product execution.</h2>
        </header>
        <div className={styles.promiseGrid}>
          <article>
            <strong>Curriculum thinking</strong>
            <p>
              I organize standards, learning goals, lesson structures, and
              source material without flattening the educational intent.
            </p>
          </article>
          <article>
            <strong>Content systems</strong>
            <p>
              I turn scattered research and editable source files into traceable
              content models that support real publishing workflows.
            </p>
          </article>
          <article>
            <strong>Product design</strong>
            <p>
              I design interfaces around the next useful decision, then build
              and verify the responsive experience in code.
            </p>
          </article>
        </div>
      </section>

      <section className={styles.workflow}>
        <header>
          <span>How I work</span>
          <h2>From ambiguity to a usable product</h2>
        </header>
        <ol>
          <li>
            <b>Understand the source</b>
            <strong>Research before decoration.</strong>
            <p>
              Map the curriculum, audience, evidence, constraints, and
              provenance that the product must preserve.
            </p>
          </li>
          <li>
            <b>Shape the system</b>
            <strong>Make the structure teachable.</strong>
            <p>
              Create content boundaries, reusable templates, and workflows that
              can grow without becoming opaque.
            </p>
          </li>
          <li>
            <b>Prove the experience</b>
            <strong>Build, compare, and refine.</strong>
            <p>
              Use real content and assets, responsive browser evidence,
              accessibility checks, and honest product language.
            </p>
          </li>
        </ol>
      </section>

      <section className={styles.showcase}>
        <header>
          <span>Selected work - presentation blocks</span>
          <h2>Show the thinking and the finished system</h2>
        </header>
        <div className={styles.showcaseGrid}>
          <article className={styles.showcaseWide}>
            <div>
              <Image
                src="/scenes/home-schoolhouse-classroom-hero-v1.png"
                alt="Old MacDonald Had a School classroom product artwork"
                width={900}
                height={600}
              />
            </div>
            <section>
              <span>Featured case study</span>
              <h3>Lead with one strong project story.</h3>
              <p>
                Replace this with the problem, your contribution, and the
                outcome you want an employer to remember.
              </p>
            </section>
          </article>
          <article>
            <div className={styles.assetGroup}>
              <Image
                src="/staff_and_students/miss-hayley-transparent-circle.png"
                alt="Miss Hayley character artwork"
                width={160}
                height={160}
              />
              <span className="brand-asset math-building-icon icon-large" role="img" aria-label="Mathematics subject icon" />
            </div>
            <section>
              <span>System evidence</span>
              <h3>Brand and content working together.</h3>
              <p>
                A compact block for design-system, asset-governance, or
                curriculum examples.
              </p>
            </section>
          </article>
          <article>
            <div className={styles.materialGroup}>
              <i />
              <i />
              <i />
            </div>
            <section>
              <span>Process evidence</span>
              <h3>Show the materials behind the interface.</h3>
              <p>
                A flexible block for research, prototypes, responsive
                comparisons, or implementation proof.
              </p>
            </section>
          </article>
        </div>
      </section>

      <section className={styles.gradePaths}>
        <header>
          <span>Old MacDonald Had a School</span>
          <h2>One product, several disciplines working together</h2>
        </header>
        <div>
          <Link href="/">
            <strong>Teacher experience</strong>
            <small>Planning-first information architecture</small>
          </Link>
          <Link href="/branding">
            <strong>Brand system</strong>
            <small>Canonical characters, roles, and visual governance</small>
          </Link>
          <Link href="/lessons">
            <strong>Content design</strong>
            <small>Reusable lesson structures and editorial clarity</small>
          </Link>
          <Link href="/search">
            <strong>Resource discovery</strong>
            <small>Helping teachers find a useful starting point</small>
          </Link>
        </div>
      </section>

      <section className={styles.story}>
        <header>
          <span>About the company and its creator</span>
          <h2>
            Research, curriculum thinking, and product design in one system
          </h2>
        </header>
        <div className={styles.storyBody}>{story}</div>
        <aside>
          <span>For collaborators and employers</span>
          <h3>
            I can carry educational work from messy source material to a
            coherent product.
          </h3>
          <p>
            I am interested in roles and collaborations where curriculum
            organization, resource research, content modelling, educational UX,
            and thoughtful visual design need to work together.
          </p>
          <Link href="/branding">Explore the brand and asset guide ?</Link>
        </aside>
      </section>
    </div>
  );
}
