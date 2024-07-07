import { useQuery } from '@apollo/client';
import { GET_PEOPLE } from '../../graphql/queries';
import { List } from 'antd';
import ContactCard from '../listItems/ContactCard';

const Contacts = () => {
  const styles = getStyles();

  const { loading, error, data } = useQuery(GET_PEOPLE);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <List grid={{ gutter: 20, column: 1 }} style={styles.list}>
      {data.people.map(({ id, firstName, lastName, cars }) => (
        <List.Item key={id}>
          <ContactCard id={id} firstName={firstName} lastName={lastName} cars={cars} />
        </List.Item>
      ))}
    </List>
  );
};

const getStyles = () => ({
  list: {
    display: 'flex',
    justifyContent: 'center',
    width: '500px'
  },
});

export default Contacts;
