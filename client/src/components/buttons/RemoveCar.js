import { DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { GET_PEOPLE, REMOVE_CAR } from "../../graphql/queries";

const RemoveCar = ({ id }) => {
  const [removeCar] = useMutation(REMOVE_CAR, {
    update(cache, { data: { removeCar: deletedCar } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE });

      const updatedPeople = people.map((person) => ({
        ...person,
        cars: person.cars.filter((car) => car.id !== deletedCar.id),
      }));

      cache.writeQuery({
        query: GET_PEOPLE,
        data: {
          people: updatedPeople,
        },
      });
    },
  });

  const handleButtonClick = () => {
    let result = window.confirm("Delete Selected Car?");

    if (result) {
      removeCar({
        variables: {
          id,
        },
      });
    }
  };

  return (
    <DeleteOutlined
      key="delete"
      style={{ color: "red" }}
      onClick={handleButtonClick}
    />
  );
};

export default RemoveCar;
