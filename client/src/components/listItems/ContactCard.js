import { useState } from "react";
import { Card, List, Button } from "antd";
import RemoveContact from "../buttons/RemoveContact";
import UpdateContact from "../forms/UpdateContact";
import { EditOutlined } from "@ant-design/icons";
import CarCard from "./CarCard";
import { Link } from "react-router-dom";

const ContactCard = ({ id, firstName, lastName, cars }) => {
  const [editMode, setEditMode] = useState(false);
  const styles = getStyles();

  const handleButtonClick = () => {
    setEditMode(!editMode);
  };

  return (
    <div>
      {editMode ? (
        <UpdateContact
          id={id}
          firstName={firstName}
          lastName={lastName}
          onButtonClick={handleButtonClick}
        />
      ) : (
        <Card
          style={styles.card}
          actions={[
            <EditOutlined key="edit" onClick={handleButtonClick} />,
            <RemoveContact id={id} />,
          ]}
        >
          <p>
            {firstName} {lastName}
          </p>
          <List
            dataSource={cars}
            renderItem={(car) => (
              <List.Item key={car.id}>
                <CarCard id={id} car={car} />
              </List.Item>
            )}
          />
          {cars.length > 0 && (
            <Button type="primary">
              <Link to={`/people/${id}`}>Details</Link>
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

const getStyles = () => ({
  card: {
    width: "1000px",
  },
});

export default ContactCard;
