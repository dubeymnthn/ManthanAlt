import styles from "./SectionHeading.module.scss";

interface SectionHeadingProps {
  index: string;
  tag: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({
  index,
  tag,
  title,
  subtitle,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`${styles.headingWrapper} ${className}`}>
      <div className={styles.metaRow}>
        <span className={styles.index}>{index}</span>
        <span className={styles.slash} aria-hidden="true">/</span>
        <span className={styles.tag}>{tag}</span>
        <span className={styles.graphicSlash} aria-hidden="true">{"//"}</span>
        <span className={styles.line} aria-hidden="true" />
      </div>
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
