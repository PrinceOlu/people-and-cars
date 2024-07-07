import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_CAR, GET_PEOPLE } from "../../graphql/queries";

const UpdateCar = ({
  id,
  year,
  make,
  model,
  price,
  personId,
  onButtonClick,
}) => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();

  const { loading, error } = useQuery(GET_PEOPLE);

  const [updateCar] = useMutation(UPDATE_CAR);

  const onFinish = (values) => {
    const { year, make, model, price } = values;

    updateCar({
      variables: {
        id,
        year,
        make,
        model,
        price,
        personId,
      },
      update: (cache, { data: { updateCar: updatedCar } }) => {
        const existingData = cache.readQuery({ query: GET_PEOPLE });
        const updatedPeople = existingData.people.map((person) => {
          if (person.id === updatedCar.personId) {
            const updatedCars = person.cars.map((car) => {
              if (car.id === updatedCar.id) {
                return {
                  ...car,
                  year: updatedCar.year,
                  make: updatedCar.make,
                  model: updatedCar.model,
                  price: updatedCar.price,
                };
              }
              return car;
            });
            return {
              ...person,
              cars: updatedCars,
            };
          }
          return person;
        });

        cache.writeQuery({
          query: GET_PEOPLE,
          data: {
            people: updatedPeople,
          },
        });
      },
    });
    onButtonClick();
  };

  useEffect(() => {
    forceUpdate();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  return (
    <Form
      name="update-car-form"
      layout="inline"
      onFinish={onFinish}
      initialValues={{
        year,
        make,
        model,
        price,
        personId,
      }}
    >
      <Form.Item
        name="year"
        rules={[{ required: true, message: "Please enter the year" }]}
      >
        <Input placeholder="Year" type="number" />
      </Form.Item>
      <Form.Item
        name="make"
        rules={[{ required: true, message: "Please enter the make" }]}
      >
        <Input placeholder="Make" />
      </Form.Item>
      <Form.Item
        name="model"
        rules={[{ required: true, message: "Please enter the model" }]}
      >
        <Input placeholder="Model" />
      </Form.Item>
      <Form.Item
        name="price"
        rules={[{ required: true, message: "Please enter the price" }]}
      >
        <Input placeholder="$ Price" type="number" />
      </Form.Item>
      <Form.Item shouldUpdate={true}>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            Update Car
          </Button>
        )}
      </Form.Item>
      <Button onClick={onButtonClick}>Cancel</Button>
    </Form>
  );
};

export default UpdateCar;
