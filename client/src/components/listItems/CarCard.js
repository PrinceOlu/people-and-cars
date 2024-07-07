import { useState } from 'react';
import { Card } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import UpdateCar from '../forms/UpdateCar';
import RemoveCar from '../buttons/RemoveCar';

const CarCard = ({ id, firstName, lastName, car }) => {
  const [editMode, setEditMode] = useState(false);
  const styles = getStyles();

  const handleButtonClick = () => {
    setEditMode(!editMode);
  };

  return (
    <div>
      {editMode ? (
        <UpdateCar
          id={car.id}
          year={car.year}
          make={car.make}
          model={car.model}
          price={car.price}
          personId={id}
          onButtonClick={handleButtonClick}
        />
      ) : (
        <Card
          style={styles.card}
          actions={[
            <EditOutlined key='edit' onClick={handleButtonClick} />,
            <RemoveCar id={car.id} />,
          ]}
        >
          <p>{car.year} {car.make} {car.model} -- ${car.price} </p>
        </Card>
      )}
    </div>
  );
};

const getStyles = () => ({
  card: {
    width: '900px',
  },
});

export default CarCard;
