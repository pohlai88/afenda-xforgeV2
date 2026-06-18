import type { PublicHomeContent } from "@/lib/public-home-content";
import { LynxPixelReveal } from "./lynx-pixel-reveal.client";
import styles from "../public-homepage.module.css";

interface PublicHomeShellProps {
  content: PublicHomeContent;
  initialSkip?: boolean;
}

export const PublicHomeShell = ({
  content,
  initialSkip = false,
}: PublicHomeShellProps) => (
  <div className={styles.shell}>
    <main className={styles.main} id="public-home-main">
      <LynxPixelReveal content={content} initialSkip={initialSkip} />
    </main>
  </div>
);
