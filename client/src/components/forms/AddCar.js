import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Form, Input, Select } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_CAR, GET_PEOPLE } from '../../graphql/queries';
import Title from '../layout/Title';

const { Option } = Select;

const AddCar = () => {
  const [id] = useState(uuidv4());
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();
  const { loading, error, data } = useQuery(GET_PEOPLE);

  const [addCar] = useMutation(ADD_CAR, {
    update: (cache, { data: { addCar: newCar } }) => {
      const { people } = cache.readQuery({ query: GET_PEOPLE });

      const updatedPeople = people.map(person => {
        if (person.id === newCar.personId) {
          return {
            ...person,
            cars: [...person.cars, newCar]
          };
        }
        return person;
      });

      cache.writeQuery({
        query: GET_PEOPLE,
        data: { 
            people: updatedPeople 
        }
      });
    }
  });

  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = async values => {
    const { year, make, model, price, personId } = values;

    try {
      await addCar({
        variables: {
          id,
          year,
          make,
          model,
          price,
          personId
        }
      });

      form.resetFields();
    } catch (error) {
      console.error('Error adding car:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  const { people } = data || {};

  return (
    <>
    <Title text='Add Car' />
    <Form
      name='add-car-form'
      layout='inline'
      size='large'
      style={{ marginBottom: '40px' }}
      form={form}
      onFinish={onFinish}
    >
      <Form.Item
        name='year'
        rules={[{ required: true, message: 'Please enter the year' }]}
      >
        <Input placeholder='Year' type='number'/>
      </Form.Item>
      <Form.Item
        name='make'
        rules={[{ required: true, message: 'Please enter the make' }]}
      >
        <Input placeholder='Make' />
      </Form.Item>
      <Form.Item
        name='model'
        rules={[{ required: true, message: 'Please enter the model' }]}
      >
      <Input placeholder='Model' />
      </Form.Item>
      <Form.Item
        name='price'
        rules={[{ required: true, message: 'Please enter the price' }]}
      >
      <Input placeholder='$ Price' type='number'/>
      </Form.Item>
      <Form.Item
        name='personId'
        rules={[{ required: true, message: 'Please select a person' }]}
      >
        <Select placeholder='Select Person'>
          {people.map(person => (
            <Option key={person.id} value={person.id}>{person.firstName} {person.lastName}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item shouldUpdate={true}>
        {() => (
          <Button
            type='primary'
            htmlType='submit'
            disabled={
              !form.isFieldsTouched(true) ||
              form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            Add Car
          </Button>
        )}
      </Form.Item>
    </Form>
    </>
  );
};

export default AddCar;
