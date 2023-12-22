import styles from './Paper.module.scss';

type PaperProps = {
    children?: React.ReactNode;
}

const Paper = ({
    children,
  ...props
}: PaperProps) => {
  return (
    <div
      className={`${styles.wrapper}`}
      style={{
      }}
      {...props}
      >
          { children }
    </div>
  );
};

export default Paper;
