const Title = ({ text = "People and Cars" }) => {
  const styles = getStyles();
  return <h1 style={styles.title}>{text}</h1>;
};

const getStyles = () => ({
  title: {
    fontSize: 20,
    padding: "10px",
    marginBottom: "20px",
  },
});

export default Title;
